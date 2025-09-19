<template>
    <div class="content" style="padding: 25px">
        <h4>Preferencias</h4>
        <p class="text-muted" style="margin-top: -7.5px">Configura tus preferencias aquí.</p>

        <form @submit.prevent="savePreferences" class="w-100">
            <div class="section" style="margin-top: 15px;">
                <h6>Visibilidad de información</h6>
                <div class="setting-row" v-for="(label, key) in visibilityFields" :key="key">
                    <label>{{ label }}</label>
                    <ToggleSwitch v-model="preferences[key]" />
                </div>
            </div>
            <hr class="my-4" style="border: 1px solid grey;" />
            <div class="section">
                <h6>Notificaciones</h6>
                <div class="setting-row" v-for="(label, key) in notificationFields" :key="key">
                    <label>{{ label }}</label>
                    <ToggleSwitch v-model="preferences[key]" />
                </div>
            </div>
            <hr class="my-4" style="border: 1px solid grey;" />
            <div class="section">
                <h6>Preferencias regionales</h6>

                <div class="select-row">
                    <label>Unidad métrica preferida</label>
                    <v-select v-model="preferences.unidad_metrica_preferida_id" :options="metricUnits" label="name"
                        :reduce="unit => unit.id" placeholder="Seleccionar unidad métrica" class="w-100 mt-2" />
                </div>

                <!-- <div class="select-row">
                    <label>Moneda preferida</label>
                    <v-select v-model="preferences.tipo_moneda_preferida_id" :options="currencies" label="name"
                        :reduce="currency => currency.id" placeholder="Seleccionar moneda" class="w-100 mt-2" />
                </div> -->
            </div>

            <div class="btn-wrapper">
                <button type="submit" class="save-btn" :disabled="loading">
                    <div class="button-content">
                        <template v-if="loading">
                            <pulse-loader :loading="loading" color="#ffffff" size="15px" />
                        </template>
                        <template v-else>
                            <i class="bi bi-save me-2"></i>Guardar cambios
                        </template>
                    </div>
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import vSelect from 'vue-select'
import { ref, onMounted } from 'vue'
import 'vue-select/dist/vue-select.css'
import api from '../../../services/api'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '../../../stores/authStore'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import ToggleSwitch from '../../../components/ui/forms/ToggleSwitch.vue'
import { updateUserSettings } from '../../../controllers/userController'

const toast = useToast()
const loading = ref(false)
const auth = useAuthStore()
const preferences = ref({
    settings_id: null,
    user_id: null,
    mostrar_telefono: 0,
    mostrar_correo: 0,
    mostrar_ws: 0,
    recibir_boletin_correo: 0,
    recibir_notificaciones: 0,
    unidad_metrica_preferida_id: null,
    // tipo_moneda_preferida_id: null
})

const currencies = ref([])
const metricUnits = ref([])

// Labels para los campos de visibilidad y notificaciones
const visibilityFields = {
    mostrar_telefono: "Mostrar mi número de teléfono",
    mostrar_correo: "Mostrar mi correo electrónico",
    mostrar_ws: "Permitir que contacten mi WhatsApp",
}
const notificationFields = {
    recibir_boletin_correo: "Recibir boletín por correo",
    recibir_notificaciones: "Recibir notificaciones",
}

onMounted(async () => {
    const user = auth.user
    if (user && user.settings) {
        preferences.value = { ...user.settings }
    }

    try {
        const res = await api.get('/api/dropdown-options?options=tipo_moneda,unidades_metricas')
        const data = res.data

        currencies.value = data.tipo_moneda
        metricUnits.value = data.unidades_metricas
    } catch (error) {
        console.error('Error fetching dropdown options:', error)
    }
})

const savePreferences = async () => {
    const payload = {
        settings_id: preferences.value.settings_id,
        user_id: preferences.value.user_id,
        mostrar_telefono: preferences.value.mostrar_telefono ? 1 : 0,
        mostrar_correo: preferences.value.mostrar_correo ? 1 : 0,
        mostrar_ws: preferences.value.mostrar_ws ? 1 : 0,
        recibir_boletin_correo: preferences.value.recibir_boletin_correo ? 1 : 0,
        recibir_notificaciones: preferences.value.recibir_notificaciones ? 1 : 0,
        unidad_metrica_preferida_id: preferences.value.unidad_metrica_preferida_id,
        // tipo_moneda_preferida_id: preferences.value.tipo_moneda_preferida_id,
    };

    loading.value = true;

    try {
        const response = await updateUserSettings(payload.user_id, payload);
        const updatedSettings = response.settings;
        
        // Actualiza el estado de las preferencias
        preferences.value = {
            ...updatedSettings,
        };
        
        // Actualiza el estado del usuario en el store
        auth.user.settings = {
            ...updatedSettings,
        };
        
        loading.value = false;
        toast.success('Preferencias actualizadas correctamente.');
    } catch (error) {
        loading.value = false;
        toast.error('Ha ocurrido un error al actualizar las preferencias, por favor intenta nuevamente.');
    }
};

</script>

<style scoped>
.content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.content h4 {
    font-weight: 850;
}

.section {
    margin-top: 2rem;
    width: 100%;
}

.section h6 {
    font-weight: 850;
    font-size: 1.2rem;
    margin-bottom: 1rem;
    text-align: left;
}

.setting-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.select-row {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
}

label {
    font-weight: 350;
    margin-bottom: 0.25rem;
    text-align: left;
}

.btn-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 2rem;
    transition: all 0.3s ease;
}

.save-btn {
    background-color: #B70000;
    color: white;
    padding: 0.65rem 1.25rem;
    font-size: 0.95rem;
    font-weight: 600;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    width: fit-content;
}

.button-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    width: fit-content;
    transition: all 0.3s ease;
}

.save-btn:hover {
    background-color: #8e1216;
    transform: scale(1.05);
}

.text-muted {
    color: #6c757d;
    font-size: 0.95rem;
}
</style>