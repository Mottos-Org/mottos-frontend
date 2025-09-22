<template>
    <CollapsibleSection
        section-key="tires"
        title="Neumáticos"
        icon-class="bi bi-circle"
        :is-expanded="sectionsExpanded.tires"
        @toggle-section="$emit('toggle-section', $event)"
    >
        <div class="row">
            <div class="col-md-6">
                <h6 class="subsection-title">
                    <i class="bi bi-arrow-up"></i>
                    Delantero
                </h6>
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="form-label">Marca</label>
                            <v-select
                                v-model="formData.tires[0].tire_make_id"
                                :options="tireMakesOptions"
                                :reduce="option => option.tire_make_id"
                                label="nombre"
                                placeholder="Marca del neumático..."
                                class="v-select-custom v-select-sm"
                            />
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="form-label">Medida</label>
                            <input
                                v-model="formData.tires[0].size"
                                type="text"
                                class="form-control"
                                placeholder="120/70-17"
                            />
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Descripción</label>
                    <textarea
                        v-model="formData.tires[0].tire_description"
                        class="form-control"
                        rows="2"
                        placeholder="Descripción del neumático delantero"
                    ></textarea>
                </div>
            </div>

            <div class="col-md-6">
                <h6 class="subsection-title">
                    <i class="bi bi-arrow-down"></i>
                    Trasero
                </h6>
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="form-label">Marca</label>
                            <v-select
                                v-model="formData.tires[1].tire_make_id"
                                :options="tireMakesOptions"
                                :reduce="option => option.tire_make_id"
                                label="nombre"
                                placeholder="Marca del neumático..."
                                class="v-select-custom v-select-sm"
                            />
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="form-label">Medida</label>
                            <input
                                v-model="formData.tires[1].size"
                                type="text"
                                class="form-control"
                                placeholder="180/55-17"
                            />
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Descripción</label>
                    <textarea
                        v-model="formData.tires[1].tire_description"
                        class="form-control"
                        rows="2"
                        placeholder="Descripción del neumático trasero"
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
    tireMakesOptions: Array,
    sectionsExpanded: Object
});

defineEmits(['toggle-section']);
</script>

<style scoped>
@import url('../../../../css/CreateBikeModal.css');
</style>