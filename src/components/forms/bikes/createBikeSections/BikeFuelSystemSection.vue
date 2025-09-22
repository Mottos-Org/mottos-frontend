<template>
    <CollapsibleSection
        section-key="fuel"
        title="Sistema de Combustible"
        icon-class="bi bi-fuel-pump"
        :is-expanded="sectionsExpanded.fuel"
        @toggle-section="$emit('toggle-section', $event)"
    >
        <div class="row">
            <div class="col-md-4">
                <div class="form-group">
                    <label class="form-label">Capacidad del Tanque</label>
                    <input
                        v-model="formData.fuel_system.fuel_capacity"
                        type="text"
                        class="form-control"
                        placeholder="17.1L"
                    />
                </div>
            </div>

            <div class="col-md-4">
                <div class="form-group">
                    <label class="form-label">Control de Combustible</label>
                    <input
                        v-model="formData.fuel_system.fuel_control"
                        type="text"
                        class="form-control"
                        placeholder="Electronic Fuel Injection"
                    />
                </div>
            </div>

            <div class="col-md-4">
                <div class="form-group">
                    <label class="form-label">Sistema</label>
                    <input
                        v-model="formData.fuel_system.fuel_system"
                        type="text"
                        class="form-control"
                        placeholder="PGM-FI"
                    />
                </div>
            </div>
        </div>
    </CollapsibleSection>
</template>

<script setup>
import CollapsibleSection from './CollapsibleSection.vue';

defineProps({
    formData: Object,
    sectionsExpanded: Object
});

defineEmits(['toggle-section']);
</script>

<style scoped>
@import url('../../../../css/CreateBikeModal.css');
</style>