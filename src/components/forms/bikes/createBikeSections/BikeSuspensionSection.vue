<template>
    <CollapsibleSection
        section-key="suspension"
        title="Suspensión"
        icon-class="bi bi-arrows-vertical"
        :is-expanded="sectionsExpanded.suspension"
        @toggle-section="$emit('toggle-section', $event)"
    >
        <div class="row">
            <div class="col-md-6">
                <h6 class="subsection-title">
                    <i class="bi bi-arrow-up"></i>
                    Delantera
                </h6>
                <div class="form-group">
                    <label class="form-label">Marca</label>
                    <v-select
                        v-model="formData.suspensions[0].suspension_maker_id"
                        :options="suspensionMakersOptions"
                        :reduce="option => option.suspension_maker_id"
                        label="nombre"
                        placeholder="Marca de suspensión..."
                        class="v-select-custom v-select-sm"
                    />
                </div>
                <div class="form-group">
                    <label class="form-label">Descripción</label>
                    <textarea
                        v-model="formData.suspensions[0].suspension_description"
                        class="form-control"
                        rows="2"
                        placeholder="Descripción de suspensión delantera"
                    ></textarea>
                </div>
            </div>

            <div class="col-md-6">
                <h6 class="subsection-title">
                    <i class="bi bi-arrow-down"></i>
                    Trasera
                </h6>
                <div class="form-group">
                    <label class="form-label">Marca</label>
                    <v-select
                        v-model="formData.suspensions[1].suspension_maker_id"
                        :options="suspensionMakersOptions"
                        :reduce="option => option.suspension_maker_id"
                        label="nombre"
                        placeholder="Marca de suspensión..."
                        class="v-select-custom v-select-sm"
                    />
                </div>
                <div class="form-group">
                    <label class="form-label">Descripción</label>
                    <textarea
                        v-model="formData.suspensions[1].suspension_description"
                        class="form-control"
                        rows="2"
                        placeholder="Descripción de suspensión trasera"
                    ></textarea>
                </div>
            </div>
        </div>
    </CollapsibleSection>
</template>

<script setup>
import vSelect from 'vue-select';
import CollapsibleSection from './CollapsibleSection.vue';

defineProps({
    formData: Object,
    suspensionMakersOptions: Array,
    sectionsExpanded: Object
});

defineEmits(['toggle-section']);
</script>

<style scoped>
@import url('../../../../css/CreateBikeModal.css');
</style>