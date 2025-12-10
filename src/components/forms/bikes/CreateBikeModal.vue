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
                <!-- Auto-fill Data Prompt -->
                <div v-if="showAutoFillPrompt" class="alert alert-info alert-dismissible fade show" role="alert">
                    <i class="bi bi-lightning-charge"></i>
                    <strong>¿Cargar datos automáticamente?</strong>
                    <p class="mb-2">Encontramos información de tu motocicleta en nuestra base de datos. ¿Te gustaría que completemos automáticamente los datos?</p>
                    <div class="d-flex gap-2">
                        <button @click="autoFillForm" type="button" class="btn btn-sm btn-success" :disabled="loadingAutoFill">
                            <div v-if="loadingAutoFill" class="spinner-border spinner-border-sm me-2" role="status"></div>
                            <i v-else class="bi bi-check-circle"></i>
                            Sí, completar
                        </button>
                        <button @click="dismissAutoFillPrompt" type="button" class="btn btn-sm btn-outline-secondary">
                            No, hacerlo manualmente
                        </button>
                    </div>
                </div>

                <!-- Auto-fill Error Message -->
                <div v-if="autoFillError" class="alert alert-warning alert-dismissible fade show" role="alert">
                    <i class="bi bi-exclamation-triangle"></i>
                    <strong>No se encontraron datos</strong>
                    <p class="mb-2">{{ autoFillError }}</p>
                    <div class="d-flex gap-2">
                        <button @click="fetchAutoFillData" type="button" class="btn btn-sm btn-warning" :disabled="loadingAutoFill">
                            <div v-if="loadingAutoFill" class="spinner-border spinner-border-sm me-2" role="status"></div>
                            <i v-else class="bi bi-arrow-clockwise"></i>
                            Reintentar
                        </button>
                        <button @click="dismissAutoFillPrompt" type="button" class="btn btn-sm btn-outline-secondary">
                            Descartar
                        </button>
                    </div>
                </div>

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
                        @update:form-data="checkAutoFillEligibility"
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
import { ref, reactive, onMounted, watch, computed } from 'vue';
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
const loadingAutoFill = ref(false);
const marcasOptions = ref([]);
const modelosOptions = ref([]);
const bikeTypesOptions = ref([]);
const tireMakesOptions = ref([]);
const brakeMakersOptions = ref([]);
const suspensionMakersOptions = ref([]);
const selectedBrand = ref(null);
const selectedModel = ref(null);
const showAutoFillPrompt = ref(false);
const autoFillError = ref(null);
const autoFillData = ref(null);

// Check if auto-fill is eligible (brand, model, type, and year are selected)
const canAutoFill = computed(() => {
    return selectedBrand.value && 
           selectedModel.value && 
           formData.bike_type_id && 
           formData.year;
});

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
    showAutoFillPrompt.value = false;
    autoFillError.value = null;
};

const onModelSelected = (model) => {
    if (model) {
        formData.modelo_id = model.modelo_id;
    } else {
        formData.modelo_id = null;
    }
    showAutoFillPrompt.value = false;
    autoFillError.value = null;
};

const checkAutoFillEligibility = async () => {
    if (canAutoFill.value && !showAutoFillPrompt.value && !autoFillError.value) {
        await fetchAutoFillData();
    }
};

const fetchAutoFillData = async () => {
    try {
        loadingAutoFill.value = true;
        autoFillError.value = null;

        const params = new URLSearchParams({
            bike_make: selectedBrand.value.nombre_marca,
            bike_model: selectedModel.value.nombre_modelo,
            bike_year: formData.year,
            bike_trim: bikeTypesOptions.value.find(t => t.bike_type_id === formData.bike_type_id)?.nombre_tipo || ''
        });

        const response = await api.get(`/api/external/bike-data?${params.toString()}`);
        const result = response.data;

        if (result.success && result.data) {
            autoFillData.value = result.data;
            showAutoFillPrompt.value = true;
        } else if (result.error) {
            autoFillError.value = result.error;
            showAutoFillPrompt.value = true;
        }
    } catch (error) {
        autoFillError.value = error.response.data.error || 'Error al obtener los datos automáticos';
        showAutoFillPrompt.value = true;
    } finally {
        loadingAutoFill.value = false;
    }
};

const autoFillForm = () => {
    if (!autoFillData.value) return;

    try {
        const specs = autoFillData.value.specifications || [];
        
        // Helper to find specification value
        const getSpecValue = (specName) => {
            const spec = specs.find(s => s.name === specName);
            if (!spec || !spec.values) return null;
            
            const values = Object.values(spec.values);
            if (values.length === 0) return null;
            
            // If it's an array, return the first item's value
            if (Array.isArray(values)) return values[0]?.value;
            // Otherwise return the first value's value property
            return values[0]?.value;
        };

        // Find Stock brand ID
        const stockBrand = {
            tires: tireMakesOptions.value.find(t => t.nombre?.toLowerCase() === 'stock'),
            brakes: brakeMakersOptions.value.find(b => b.nombre?.toLowerCase() === 'stock'),
            suspension: suspensionMakersOptions.value.find(s => s.nombre?.toLowerCase() === 'stock')
        };

        console.log('Auto-fill stock brand IDs:', stockBrand);

        // Auto-fill displacement
        const displacement = getSpecValue('Displacement');
        if (displacement) {
            formData.displacement = displacement.replace(/\D+/g, ''); // Extract just the number
        }

        // Auto-fill engine specs
        formData.engine = getSpecValue('Type') || '';
        
        const horsepower = getSpecValue('Horsepower');
        if (horsepower) {
            formData.power = horsepower;
        }

        const torque = getSpecValue('Torque');
        if (torque) {
            formData.torque = torque;
        }

        // Auto-fill fuel system
        const fuelCapacity = getSpecValue('Fuel Capacity');
        if (fuelCapacity) {
            formData.fuel_system.fuel_capacity = fuelCapacity.replace(/\D+/g, '');
        }

        const fuelType = getSpecValue('Fuel System');
        if (fuelType) {
            formData.fuel_system.fuel_system = fuelType;
        }

        // Auto-fill tires with Stock brand
        const frontTire = getSpecValue('Front');
        if (frontTire && formData.tires[0]) {
            formData.tires[0].size = frontTire;
            if (stockBrand.tires) {
                formData.tires[0].tire_make_id = stockBrand.tires.tire_make_id;
            }
        }

        const rearTire = getSpecValue('Rear');
        if (rearTire && formData.tires[1]) {
            formData.tires[1].size = rearTire;
            if (stockBrand.tires) {
                formData.tires[1].tire_make_id = stockBrand.tires.tire_make_id;
            }
        }

        // Auto-fill brakes with Stock brand
        const frontBrake = getSpecValue('Front Brake');
        if (frontBrake && formData.brakes[0]) {
            formData.brakes[0].brake_description = frontBrake;
            if (stockBrand.brakes) {
                formData.brakes[0].brake_maker_id = stockBrand.brakes.brake_maker_id;
            }
        }

        const rearBrake = getSpecValue('Rear Brake');
        if (rearBrake && formData.brakes[1]) {
            formData.brakes[1].brake_description = rearBrake;
            if (stockBrand.brakes) {
                formData.brakes[1].brake_maker_id = stockBrand.brakes.brake_maker_id;
            }
        }

        // Auto-fill suspensions with Stock brand
        const frontSuspension = getSpecValue('Front Suspension');
        if (frontSuspension && formData.suspensions[0]) {
            formData.suspensions[0].suspension_description = frontSuspension;
            if (stockBrand.suspension) {
                formData.suspensions[0].suspension_maker_id = stockBrand.suspension.suspension_maker_id;
            }
        }

        const rearSuspension = getSpecValue('Rear Suspension');
        if (rearSuspension && formData.suspensions[1]) {
            formData.suspensions[1].suspension_description = rearSuspension;
            if (stockBrand.suspension) {
                formData.suspensions[1].suspension_maker_id = stockBrand.suspension.suspension_maker_id;
            }
        }

        dismissAutoFillPrompt();
        toast.success('¡Datos cargados automáticamente!');
    } catch (error) {
        console.error('Error auto-filling form:', error);
        toast.error('Error al completar los datos automáticamente');
    }
};

const dismissAutoFillPrompt = () => {
    showAutoFillPrompt.value = false;
    autoFillError.value = null;
    autoFillData.value = null;
};

// Watch for form changes to check auto-fill eligibility
watch(
    () => [selectedBrand.value, selectedModel.value, formData.bike_type_id, formData.year],
    () => {
        checkAutoFillEligibility();
    },
    { deep: true }
);

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

.alert {
    margin-bottom: 1.5rem;
}

.alert i {
    margin-right: 0.5rem;
}

.alert p {
    margin-top: 0.5rem;
    font-size: 0.95rem;
}

.alert-info {
    border-left: 4px solid #0dcaf0;
    background-color: #f0f7ff;
}

.alert-warning {
    border-left: 4px solid #ffc107;
    background-color: #fff8e1;
}

.btn-sm {
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
}
</style>