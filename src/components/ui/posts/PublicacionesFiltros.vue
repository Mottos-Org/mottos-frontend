<template>
    <div class="filters-container">
        <div class="filters-row">
            <div class="filter-item">
                <v-select
                    v-model="selectedBrand"
                    :options="brandOptions"
                    :loading="loadingBrands"
                    placeholder="Seleccionar marca..."
                    class="filter-select"
                    @search="onBrandSearch"
                    @option:selected="onBrandSelected"
                    label="nombre_marca"
                    :reduce="brand => brand"
                >
                    <template #no-options>
                        Escriba para buscar marcas...
                    </template>
                </v-select>
            </div>
            
            <div class="filter-item">
                <v-select
                    v-model="selectedModel"
                    :options="modelOptions"
                    :loading="loadingModels"
                    placeholder="Seleccionar modelo..."
                    class="filter-select"
                    :disabled="!selectedBrand"
                    label="nombre_modelo"
                    :reduce="model => model"
                    @option:selected="onModelSelected"
                >
                    <template #no-options>
                        {{ !selectedBrand ? 'Seleccione una marca primero' : 'No hay modelos disponibles' }}
                    </template>
                </v-select>
            </div>
            
            <div class="filter-item">
                <select 
                    v-model="localFilters.condicion_id" 
                    class="filter-select-native"
                    @change="immediateUpdate"
                >
                    <option value="">Todas las condiciones</option>
                    <option value="1">Excelente</option>
                    <option value="2">Buena</option>
                    <option value="3">Regular</option>
                    <option value="4">Necesita reparación</option>
                </select>
            </div>
            
            <div class="filter-item">
                <select 
                    v-model="localFilters.negociable" 
                    class="filter-select-native"
                    @change="immediateUpdate"
                >
                    <option value="">Todas</option>
                    <option value="1">Solo negociables</option>
                    <option value="0">Solo precio fijo</option>
                </select>
            </div>

            <div class="filter-buttons-group">
                <button 
                    @click="showMoreFilters = !showMoreFilters" 
                    class="more-filters-btn"
                    :class="{ active: showMoreFilters }"
                >
                    <i class="bi bi-funnel me-1"></i>
                    Más filtros
                    <i class="bi bi-chevron-down ms-1" :class="{ 'rotate-180': showMoreFilters }"></i>
                </button>

                <button @click="clearFilters" class="clear-btn-icon" title="Limpiar filtros">
                    <i class="bi bi-x-circle"></i>
                </button>
            </div>
        </div>

        <div v-if="showMoreFilters" class="more-filters-panel">
            <div class="more-filters-row">
                <div class="filter-item">
                    <label class="filter-label">Precio Mínimo</label>
                    <input 
                        v-model="localFilters.precio_min" 
                        type="number" 
                        class="filter-input" 
                        placeholder="0"
                        @input="debouncedUpdate"
                    />
                </div>
                
                <div class="filter-item">
                    <label class="filter-label">Precio Máximo</label>
                    <input 
                        v-model="localFilters.precio_max" 
                        type="number" 
                        class="filter-input" 
                        placeholder="999999"
                        @input="debouncedUpdate"
                    />
                </div>
                
                <div class="filter-item">
                    <label class="filter-label">Año Mínimo</label>
                    <input 
                        v-model="localFilters.year_min" 
                        type="number" 
                        class="filter-input" 
                        placeholder="2000"
                        min="1900"
                        max="2030"
                        @input="debouncedUpdate"
                    />
                </div>
                
                <div class="filter-item">
                    <label class="filter-label">Año Máximo</label>
                    <input 
                        v-model="localFilters.year_max" 
                        type="number" 
                        class="filter-input" 
                        placeholder="2025"
                        min="1900"
                        max="2030"
                        @input="debouncedUpdate"
                    />
                </div>
                
                <div class="filter-item">
                    <label class="filter-label">Por página</label>
                    <select 
                        v-model="localFilters.per_page" 
                        class="filter-select-native"
                        @change="immediateUpdate"
                    >
                        <option value="15">15</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, onUnmounted } from 'vue';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import { searchMarcas, getModelosByMarca } from '../../../utils/dropdownOptions';

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['update:modelValue', 'apply-filters', 'clear-filters']);
const localFilters = reactive({ ...props.modelValue });
const selectedBrand = ref(null);
const selectedModel = ref(null);
const brandOptions = ref([]);
const modelOptions = ref([]);
const loadingBrands = ref(false);
const loadingModels = ref(false);
const showMoreFilters = ref(false);

const loadBrands = async (search = '') => {
    try {
        loadingBrands.value = true;
        const response = await searchMarcas(search, 1, 50);
        brandOptions.value = response.data;
    } catch (error) {
        console.error('Error loading brands:', error);
        brandOptions.value = [];
    } finally {
        loadingBrands.value = false;
    }
};

const loadModels = async (marcaId) => {
    try {
        loadingModels.value = true;
        modelOptions.value = await getModelosByMarca(marcaId);
    } catch (error) {
        console.error('Error loading models:', error);
        modelOptions.value = [];
    } finally {
        loadingModels.value = false;
    }
};

const onBrandSearch = (search) => {
    loadBrands(search);
};

const onBrandSelected = (brand) => {
    if (brand) {
        localFilters.marca = brand.nombre_marca;
        selectedModel.value = null;
        localFilters.modelo = '';
        loadModels(brand.marca_id);
    } else {
        localFilters.marca = '';
        localFilters.modelo = '';
        selectedModel.value = null;
        modelOptions.value = [];
    }
    immediateUpdate();
};

const onModelSelected = (model) => {
    if (model) {
        localFilters.modelo = model.nombre_modelo;
    } else {
        localFilters.modelo = '';
    }
    immediateUpdate();
};

let debounceTimer = null;
const debouncedUpdate = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        emit('update:modelValue', { ...localFilters });
        emit('apply-filters');
    }, 500);
};

const immediateUpdate = () => {
    emit('update:modelValue', { ...localFilters });
    emit('apply-filters');
};

const clearFilters = () => {
    Object.keys(localFilters).forEach(key => {
        if (key === 'per_page') {
            localFilters[key] = '15';
        } else if (key === 'page') {
            localFilters[key] = 1;
        } else {
            localFilters[key] = '';
        }
    });
    
    selectedBrand.value = null;
    selectedModel.value = null;
    modelOptions.value = [];
    showMoreFilters.value = false;
    
    emit('update:modelValue', { ...localFilters });
    emit('clear-filters');
};

onMounted(() => {
    loadBrands();
});

onUnmounted(() => {
    if (debounceTimer) {
        clearTimeout(debounceTimer);
    }
});
</script>

<style scoped>
.filters-container {
    background: white;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 24px;
}

.filters-row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: center;
}

.more-filters-row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: flex-end;
}

.filter-item {
    min-width: 180px;
    flex: 1;
}

.more-filters-row .filter-item {
    min-width: 120px;
    max-width: 150px;
    flex: 0 1 auto;
}

.filter-buttons-group {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-shrink: 0;
}

.filter-label {
    font-size: 14px;
    font-weight: 500;
    color: #495057;
    margin-bottom: 4px;
}

.filter-select-native,
.filter-input {
    height: 40px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 14px;
    background: white;
    color: #495057;
    width: 100%;
}

.filter-select-native {
    cursor: pointer;
}

.filter-input[type="number"] {
    -moz-appearance: textfield; /* Firefox */
}

.filter-input[type="number"]::-webkit-outer-spin-button,
.filter-input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none; /* Chrome, Safari, Edge */
    margin: 0;
}

.more-filters-btn {
    height: 40px;
    background: #dc3545;
    color: white;
    border: 1px solid #dc3545;
    border-radius: 4px;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: all 0.2s ease;
    white-space: nowrap;
}

.more-filters-btn:hover {
    background: #c82333;
    border-color: #c82333;
}

.more-filters-btn.active {
    background: #a71e2a;
    border-color: #a71e2a;
}

.clear-btn-icon {
    width: 40px;
    height: 40px;
    background: transparent;
    color: #6c757d;
    border: 1px solid #6c757d;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.clear-btn-icon:hover {
    background: #6c757d;
    color: white;
    transform: scale(1.05);
}

.more-filters-panel {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #e9ecef;
    animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.bi-chevron-down {
    transition: transform 0.3s ease;
    font-size: 12px;
}

.rotate-180 {
    transform: rotate(180deg);
}

:deep(.filter-select) {
    width: 100%;
}

:deep(.filter-select .vs__dropdown-toggle) {
    border: 1px solid #ced4da !important;
    border-radius: 4px !important;
    height: 40px !important;
    min-height: 40px !important;
    background: white !important;
    padding: 0 !important;
    margin: 0 !important;
}

:deep(.filter-select .vs__selected-options) {
    padding: 0 12px !important;
    margin: 0 !important;
    min-height: 38px !important;
    display: flex !important;
    align-items: center !important;
}

:deep(.filter-select .vs__selected) {
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    background: transparent !important;
    color: #495057 !important;
    font-size: 14px !important;
}

:deep(.filter-select .vs__search) {
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    font-size: 14px !important;
    color: #495057 !important;
}

:deep(.filter-select .vs__search::placeholder) {
    color: #6c757d !important;
}

:deep(.filter-select .vs__actions) {
    padding: 0 8px !important;
}

:deep(.filter-select .vs__open-indicator) {
    fill: #6c757d !important;
}

:deep(.filter-select .vs__clear) {
    fill: #6c757d !important;
}

:deep(.filter-select .vs__dropdown-option--highlight) {
    background: #dc3545 !important;
    color: white !important;
}

:deep(.filter-select .vs__dropdown-option) {
    padding: 8px 12px !important;
    font-size: 14px !important;
    /* color: #495057 !important; */
}

:deep(.filter-select .vs__dropdown-menu) {
    border-color: #ced4da !important;
    border-radius: 4px !important;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
    margin: 0 !important;
}

:deep(.filter-select .vs__no-options) {
    padding: 8px 12px !important;
    font-size: 14px !important;
    color: #6c757d !important;
}

@media (max-width: 768px) {
    .filters-row,
    .more-filters-row {
        flex-direction: column;
    }
    
    .filter-item {
        width: 100%;
        min-width: auto;
        max-width: none;
    }
    
    .more-filters-row .filter-item {
        width: 100%;
        min-width: auto;
        max-width: none;
    }

    .filter-buttons-group {
        width: 100%;
        justify-content: space-between;
    }

    .more-filters-btn {
        flex: 1;
    }
}
</style>