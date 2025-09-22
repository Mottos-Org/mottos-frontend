<template>
    <CollapsibleSection
        section-key="brakes"
        title="Frenos"
        icon-class="bi bi-stop-circle"
        :is-expanded="sectionsExpanded.brakes"
        @toggle-section="$emit('toggle-section', $event)"
    >
        <div class="row">
            <div class="col-md-6">
                <h6 class="subsection-title">
                    <i class="bi bi-arrow-up"></i>
                    Delantero
                </h6>
                <div class="form-group">
                    <label class="form-label">Marca</label>
                    <v-select
                        v-model="formData.brakes[0].brake_maker_id"
                        :options="brakeMakersOptions"
                        :reduce="option => option.brake_maker_id"
                        label="nombre"
                        placeholder="Marca del freno..."
                        class="v-select-custom v-select-sm"
                    />
                </div>
                <div class="form-group">
                    <label class="form-label">Descripción</label>
                    <textarea
                        v-model="formData.brakes[0].brake_description"
                        class="form-control"
                        rows="2"
                        placeholder="Descripción del freno delantero"
                    ></textarea>
                </div>
            </div>

            <div class="col-md-6">
                <h6 class="subsection-title">
                    <i class="bi bi-arrow-down"></i>
                    Trasero
                </h6>
                <div class="form-group">
                    <label class="form-label">Marca</label>
                    <v-select
                        v-model="formData.brakes[1].brake_maker_id"
                        :options="brakeMakersOptions"
                        :reduce="option => option.brake_maker_id"
                        label="nombre"
                        placeholder="Marca del freno..."
                        class="v-select-custom v-select-sm"
                    />
                </div>
                <div class="form-group">
                    <label class="form-label">Descripción</label>
                    <textarea
                        v-model="formData.brakes[1].brake_description"
                        class="form-control"
                        rows="2"
                        placeholder="Descripción del freno trasero"
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
    brakeMakersOptions: Array,
    sectionsExpanded: Object
});

defineEmits(['toggle-section']);
</script>

<style scoped>
@import url('../../../../css/CreateBikeModal.css');
</style>