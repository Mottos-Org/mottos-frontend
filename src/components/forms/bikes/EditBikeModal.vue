<template>
    <div class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-container">
            <div class="modal-header">
                <h2>
                    <i class="bi bi-pencil-square"></i>
                    Editar {{ bike.marca.nombre_marca }} {{ bike.modelo.nombre_modelo }}
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
                        :is-editing="true"
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
                    {{ submitting ? 'Actualizando...' : 'Actualizar Moto' }}
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

const props = defineProps({
    bike: {
        type: Object,
        required: true
    }
});

const toast = useToast();
const emit = defineEmits(['close', 'bike-updated']);
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

// Populate form with existing bike data
const populateFormData = () => {
    // Basic info
    formData.marca_id = props.bike.marca_id;
    formData.modelo_id = props.bike.modelo_id;
    formData.bike_type_id = props.bike.bike_type_id;
    formData.year = props.bike.year;
    formData.displacement = props.bike.displacement;
    formData.en_venta = props.bike.en_venta;
    
    // Engine info
    formData.engine = props.bike.engine;
    formData.power = props.bike.power;
    formData.torque = props.bike.torque;
    formData.top_speed = props.bike.top_speed;
    formData.cooling = props.bike.cooling;
    formData.frame = props.bike.frame;
    formData.total_weight = props.bike.total_weight;
    formData.dry_weight = props.bike.dry_weight;
    formData.total_height = props.bike.total_height;
    formData.total_length = props.bike.total_length;
    formData.total_width = props.bike.total_width;
    formData.starter = props.bike.starter;
    formData.gearbox = props.bike.gearbox;
    formData.seat_height = props.bike.seat_height;
    formData.clutch = props.bike.clutch;
    formData.bore_stroke = props.bike.bore_stroke;
    formData.compression = props.bike.compression;
    formData.ground_clearance = props.bike.ground_clearance;
    formData.valves_per_cylinder = props.bike.valves_per_cylinder;
    formData.transmission = props.bike.transmission;
    formData.lubrication = props.bike.lubrication;
    
    // Fuel system
    if (props.bike.fuel_system) {
        formData.fuel_system = {
            fuel_capacity: props.bike.fuel_system.fuel_capacity,
            fuel_control: props.bike.fuel_system.fuel_control,
            fuel_system: props.bike.fuel_system.fuel_system
        };
    }
    
    // Tires
    if (props.bike.tires?.length) {
        formData.tires = props.bike.tires.map(tire => ({
            tire_make_id: tire.tire_make_id,
            front: tire.front,
            size: tire.size,
            tire_description: tire.tire_description,
            wheel_travel: tire.wheel_travel
        }));
    }
    
    // Brakes
    if (props.bike.brakes?.length) {
        formData.brakes = props.bike.brakes.map(brake => ({
            brake_maker_id: brake.brake_maker_id,
            front: brake.front,
            brake_description: brake.brake_description
        }));
    }
    
    // Suspensions
    if (props.bike.suspensions?.length) {
        formData.suspensions = props.bike.suspensions.map(suspension => ({
            suspension_maker_id: suspension.suspension_maker_id,
            front: suspension.front,
            suspension_description: suspension.suspension_description
        }));
    }
    
    // Set selected brand and model
    selectedBrand.value = props.bike.marca;
    selectedModel.value = props.bike.modelo;
};

// Same API loading functions as CreateBikeModal
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
        console.log('Updating bike with payload:', cleanedPayload);
        
        const response = await api.put(`/api/bikes/${props.bike.bike_id}`, cleanedPayload);
        
        toast.success('¡Motocicleta actualizada exitosamente!');
        
        const bikeData = response.data.bike;
        emit('bike-updated', bikeData);
        emit('close');
        
    } catch (error) {
        console.error('Error updating bike:', error);
        
        if (error.response?.data?.errors) {
            errors.value = error.response.data.errors;
            toast.error('Hay errores en el formulario');
        } else {
            toast.error('Error al actualizar la motocicleta');
        }
    } finally {
        submitting.value = false;
    }
};

onMounted(() => {
    populateFormData();
    loadBikeTypes();
    loadTireMakers();
    loadBrakeMakers();
    loadSuspensionMakers();
    loadBrands();
    if (props.bike.marca_id) {
        loadModels(props.bike.marca_id);
    }
});
</script>

<style scoped>
@import url('../../../css/CreateBikeModal.css');
</style>