<template>
    <div class="form-section">
        <h4>
            <i class="bi bi-gear-fill"></i>
            Especificaciones del Motor
        </h4>

        <div class="row">
            <div class="col-md-4">
                <div class="form-group">
                    <label class="form-label">Tipo de Motor</label>
                    <input
                        v-model="formData.engine"
                        type="text"
                        class="form-control"
                        placeholder="4-stroke, liquid-cooled"
                    />
                </div>
            </div>

            <div class="col-md-4">
                <div class="form-group">
                    <label class="form-label">Potencia</label>
                    <input
                        v-model="formData.power"
                        type="text"
                        class="form-control"
                        placeholder="118 hp @ 10,500 rpm"
                    />
                </div>
            </div>

            <div class="col-md-4">
                <div class="form-group">
                    <label class="form-label">Torque</label>
                    <input
                        v-model="formData.torque"
                        type="text"
                        class="form-control"
                        placeholder="64 Nm @ 8,500 rpm"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    formData: Object
});
</script>

<style scoped>
@import url('../../../../css/CreateBikeModal.css');
</style>