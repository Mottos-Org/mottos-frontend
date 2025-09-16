<template>
    <div class="verify-email-page">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-6 col-lg-5">
                    <div class="card shadow">
                        <div class="card-body text-center p-5">
                            <div v-if="loading" class="loading-state">
                                <pulse-loader :loading="loading" color="#d63636" size="20px" />
                                <h4 class="mt-3">Verificando email...</h4>
                                <p class="text-muted">Por favor espera mientras verificamos tu dirección de correo.</p>
                            </div>
                            
                            <div v-else-if="verificationSuccess" class="success-state">
                                <div class="icon-circle bg-success mb-3">
                                    <i class="bi bi-check-circle text-white"></i>
                                </div>
                                <h4 class="text-success mb-2">¡Email verificado exitosamente!</h4>
                                <p class="text-muted mb-4">
                                    Tu dirección de correo electrónico ha sido verificada correctamente.
                                </p>
                                <div class="alert alert-info">
                                    <i class="bi bi-info-circle me-2"></i>
                                    Puedes cerrar esta página y regresar a tu cuenta.
                                </div>
                                <button @click="closeWindow" class="btn btn-outline-secondary">
                                    Cerrar página
                                </button>
                            </div>
                            
                            <div v-else class="error-state">
                                <div class="icon-circle bg-danger mb-3">
                                    <i class="bi bi-x-circle text-white"></i>
                                </div>
                                <h4 class="text-danger mb-2">Error de verificación</h4>
                                <p class="text-muted mb-4">
                                    {{ errorMessage || 'Este enlace ya ha expirado. Solicita uno nuevo para poder .' }}
                                </p>
                                <div class="d-grid gap-2">
                                    <button @click="retryVerification" class="btn btn-primary">
                                        Intentar nuevamente
                                    </button>
                                    <button @click="goToLogin" class="btn btn-outline-secondary">
                                        Ir a iniciar sesión
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import api from '../../services/api';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const loading = ref(true);
const verificationSuccess = ref(false);
const errorMessage = ref('');

const verifyEmail = async () => {
    const token = route.query.token;
    
    if (!token) {
        errorMessage.value = 'Token de verificación no válido.';
        loading.value = false;
        return;
    }

    try {
        const response = await api.post('/api/email/verify', {
            token: token
        });
        
        verificationSuccess.value = true;
        toast.success(response.data.message);
    } catch (error) {
        console.error('Error verifying email:', error);
        errorMessage.value = error.response?.data?.error || 'Error al verificar el email.';
    } finally {
        loading.value = false;
    }
};

const retryVerification = () => {
    loading.value = true;
    verificationSuccess.value = false;
    errorMessage.value = '';
    verifyEmail();
};

const closeWindow = () => {
    window.close();
};

const goToLogin = () => {
    router.push('/auth/login');
};

onMounted(() => {
    verifyEmail();
});
</script>

<style scoped>
.verify-email-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    display: flex;
    align-items: center;
    padding: 2rem 0;
}

.card {
    border: none;
    border-radius: 1rem;
}

.icon-circle {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    font-size: 1.5rem;
}

.btn-primary {
    background-color: #d63636;
    border-color: #d63636;
}

.btn-primary:hover {
    background-color: #b52d2d;
    border-color: #b52d2d;
}

.loading-state,
.success-state,
.error-state {
    padding: 1rem 0;
}
</style>