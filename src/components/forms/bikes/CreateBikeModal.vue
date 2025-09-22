<template>
    <div class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-container">
            <div class="modal-header">
                <h2>
                    <i class="bi bi-motorcycle"></i>
                    Registrar Nueva Motocicleta
                </h2>
                <button @click="$emit('close')" class="btn-close" aria-label="Cerrar">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>

            <div class="modal-body">
                <form @submit.prevent="handleSubmit" class="bike-form">
                    <BikeBasicInfoSection
                        :form-data="formData"
                        :errors="errors"
                        :brands-options="marcasOptions"
                        :models-options="modelosOptions"
                        :bike-types-options="bikeTypesOptions"
                        :loading-brands="loadingMarcas"
                        :loading-models="loadingModelos"
                        v-model:selected-brand="selectedBrand"
                        v-model:selected-model="selectedModel"
                        @brand-search="onBrandSearch"
                        @brand-selected="onBrandSelected"
                        @model-selected="onModelSelected"
                    />

                    <BikeEngineSection
                        :form-data="formData"
                    />

                    <BikeFuelSystemSection
                        :form-data="formData"
                        :sections-expanded="sectionsExpanded"
                        @toggle-section="toggleSection"
                    />

                    <BikeTiresSection
                        :form-data="formData"
                        :tire-makes-options="tireMakesOptions"
                        :sections-expanded="sectionsExpanded"
                        @toggle-section="toggleSection"
                    />

                    <BikeBrakesSection
                        :form-data="formData"
                        :brake-makers-options="brakeMakersOptions"
                        :sections-expanded="sectionsExpanded"
                        @toggle-section="toggleSection"
                    />

                    <BikeSuspensionSection
                        :form-data="formData"
                        :suspension-makers-options="suspensionMakersOptions"
                        :sections-expanded="sectionsExpanded"
                        @toggle-section="toggleSection"
                    />
                </form>
            </div>

            <div class="modal-footer">
                <button @click="$emit('close')" type="button" class="btn btn-outline-secondary">
                    <i class="bi bi-x-circle"></i>
                    Cancelar
                </button>
                <button @click="handleSubmit" type="button" class="btn btn-primary" :disabled="submitting">
                    <div v-if="submitting" class="spinner-border spinner-border-sm me-2" role="status"></div>
                    <i v-else class="bi bi-check-circle"></i>
                    {{ submitting ? 'Registrando...' : 'Registrar Moto' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import api from '../../../services/api';
import { searchMarcas, getModelosByMarca } from '../../../utils/dropdownOptions';
import { useBikeFormData } from '../../../composables/useBikeFormData';
import { useBikePayloadCleaner } from '../../../composables/useBikePayloadCleaner';
import BikeBasicInfoSection from './createBikeSections/BikeBasicInfoSection.vue';
import BikeEngineSection from './createBikeSections/BikeEngineSection.vue';
import BikeFuelSystemSection from './createBikeSections/BikeFuelSystemSection.vue';
import BikeTiresSection from './createBikeSections/BikeTiresSection.vue';
import BikeBrakesSection from './createBikeSections/BikeBrakesSection.vue';
import BikeSuspensionSection from './createBikeSections/BikeSuspensionSection.vue';

const toast = useToast();
const emit = defineEmits(['close', 'bike-created']);
const { formData, errors, sectionsExpanded, toggleSection } = useBikeFormData();
const { cleanPayload } = useBikePayloadCleaner();
const submitting = ref(false);
const loadingMarcas = ref(false);
const loadingModelos = ref(false);
const marcasOptions = ref([]);
const modelosOptions = ref([]);
const bikeTypesOptions = ref([]);
const tireMakesOptions = ref([]);
const brakeMakersOptions = ref([]);
const suspensionMakersOptions = ref([]);
const selectedBrand = ref(null);
const selectedModel = ref(null);

const loadBikeTypes = async () => {
    try {
        const response = await api.get('/api/bike-makers/types/');
        bikeTypesOptions.value = response.data || [];
    } catch (error) {
        console.error('Error loading bike types:', error);
        toast.error('Error al cargar los tipos de moto');
    }
};

const loadTireMakers = async () => {
    try {
        const response = await api.get('/api/bike-makers/tire-makers/');
        tireMakesOptions.value = response.data.data || [];
    } catch (error) {
        console.error('Error loading tire makers:', error);
    }
};

const loadBrakeMakers = async () => {
    try {
        const response = await api.get('/api/bike-makers/brake-makers/');
        brakeMakersOptions.value = response.data.data || [];
    } catch (error) {
        console.error('Error loading brake makers:', error);
    }
};

const loadSuspensionMakers = async () => {
    try {
        const response = await api.get('/api/bike-makers/suspension-makers/');
        suspensionMakersOptions.value = response.data.data || [];
    } catch (error) {
        console.error('Error loading suspension makers:', error);
    }
};

const loadBrands = async (search = '') => {
    try {
        loadingMarcas.value = true;
        const response = await searchMarcas(search, 1, 50);
        marcasOptions.value = response.data;
    } catch (error) {
        console.error('Error loading brands:', error);
        marcasOptions.value = [];
    } finally {
        loadingMarcas.value = false;
    }
};

const loadModels = async (marcaId) => {
    try {
        loadingModelos.value = true;
        modelosOptions.value = await getModelosByMarca(marcaId);
    } catch (error) {
        console.error('Error loading models:', error);
        modelosOptions.value = [];
    } finally {
        loadingModelos.value = false;
    }
};

const onBrandSearch = (search) => {
    loadBrands(search);
};

const onBrandSelected = (brand) => {
    if (brand) {
        formData.marca_id = brand.marca_id;
        selectedModel.value = null;
        formData.modelo_id = null;
        loadModels(brand.marca_id);
    } else {
        formData.marca_id = null;
        formData.modelo_id = null;
        selectedModel.value = null;
        modelosOptions.value = [];
    }
};

const onModelSelected = (model) => {
    if (model) {
        formData.modelo_id = model.modelo_id;
    } else {
        formData.modelo_id = null;
    }
};

const handleSubmit = async () => {
    try {
        submitting.value = true;
        errors.value = {};

        const cleanedPayload = cleanPayload(formData);
        console.log('Submitting payload:', cleanedPayload);
        
        const response = await api.post('/api/bikes/', cleanedPayload);
        
        toast.success('¡Motocicleta registrada exitosamente!');
        
        const bikeData = response.data.bike;
        emit('bike-created', bikeData);
        emit('close');
        
    } catch (error) {
        console.error('Error creating bike:', error);
        
        if (error.response?.data?.errors) {
            errors.value = error.response.data.errors;
            toast.error('Hay errores en el formulario');
        } else {
            toast.error('Error al registrar la motocicleta');
        }
    } finally {
        submitting.value = false;
    }
};

onMounted(() => {
    loadBikeTypes();
    loadTireMakers();
    loadBrakeMakers();
    loadSuspensionMakers();
    loadBrands();
});
</script>

<style scoped>
@import url('../../../css/CreateBikeModal.css');
</style>