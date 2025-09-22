<template>
    <div class="form-section">
        <h4>
            <i class="bi bi-info-circle"></i>
            Información Básica
        </h4>

        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <label class="form-label">
                        Marca
                        <span class="required">*</span>
                    </label>
                    <v-select
                        v-model="selectedBrand"
                        :options="brandsOptions"
                        :loading="loadingBrands"
                        placeholder="Seleccionar marca..."
                        class="v-select-custom"
                        :class="{ 'is-invalid': errors.marca_id }"
                        @search="$emit('brand-search', $event)"
                        @option:selected="$emit('brand-selected', $event)"
                        label="nombre_marca"
                        :reduce="brand => brand"
                    >
                        <template #no-options>
                            Escriba para buscar marcas...
                        </template>
                    </v-select>
                    <div v-if="errors.marca_id" class="invalid-feedback">
                        {{ errors.marca_id }}
                    </div>
                </div>
            </div>

            <div class="col-md-6">
                <div class="form-group">
                    <label class="form-label">
                        Modelo
                        <span class="required">*</span>
                    </label>
                    <v-select
                        v-model="selectedModel"
                        :options="modelsOptions"
                        :loading="loadingModels"
                        placeholder="Seleccionar modelo..."
                        class="v-select-custom"
                        :class="{ 'is-invalid': errors.modelo_id }"
                        :disabled="!selectedBrand"
                        label="nombre_modelo"
                        :reduce="model => model"
                        @option:selected="$emit('model-selected', $event)"
                    >
                        <template #no-options>
                            {{ !selectedBrand ? 'Seleccione una marca primero' : 'No hay modelos disponibles' }}
                        </template>
                    </v-select>
                    <div v-if="errors.modelo_id" class="invalid-feedback">
                        {{ errors.modelo_id }}
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-4">
                <div class="form-group">
                    <label class="form-label">
                        Tipo de Moto
                        <span class="required">*</span>
                    </label>
                    <v-select
                        v-model="formData.bike_type_id"
                        :options="bikeTypesOptions"
                        :reduce="option => option.bike_type_id"
                        label="nombre_tipo"
                        placeholder="Seleccionar tipo..."
                        class="v-select-custom"
                        :class="{ 'is-invalid': errors.bike_type_id }"
                    />
                    <div v-if="errors.bike_type_id" class="invalid-feedback">
                        {{ errors.bike_type_id }}
                    </div>
                </div>
            </div>

            <div class="col-md-4">
                <div class="form-group">
                    <label class="form-label">
                        Año
                        <span class="required">*</span>
                    </label>
                    <input
                        v-model="formData.year"
                        type="number"
                        class="form-control"
                        :class="{ 'is-invalid': errors.year }"
                        placeholder="2023"
                        :min="1980"
                        :max="new Date().getFullYear() + 1"
                    />
                    <div v-if="errors.year" class="invalid-feedback">
                        {{ errors.year }}
                    </div>
                </div>
            </div>

            <div class="col-md-4">
                <div class="form-group">
                    <label class="form-label">
                        Cilindraje
                        <span class="required">*</span>
                    </label>
                    <input
                        v-model="formData.displacement"
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': errors.displacement }"
                        placeholder="600cc"
                    />
                    <div v-if="errors.displacement" class="invalid-feedback">
                        {{ errors.displacement }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import vSelect from 'vue-select';

const selectedBrand = defineModel('selectedBrand');
const selectedModel = defineModel('selectedModel');

defineProps({
    formData: Object,
    errors: Object,
    brandsOptions: {
        type: Array,
        default: () => []
    },
    modelsOptions: {
        type: Array,
        default: () => []
    },
    bikeTypesOptions: {
        type: Array,
        default: () => []
    },
    loadingBrands: Boolean,
    loadingModels: Boolean
});

defineEmits(['brand-search', 'brand-selected', 'model-selected']);
</script>

<style scoped>
@import url('../../../../css/CreateBikeModal.css');
</style>