<template>
    <div class="unsubscribe-page">
        <div class="container">
            <div class="unsubscribe-card">
                <div class="unsubscribe-header">
                    <div class="logo-section">
                        <h1>Mottos Newsletter</h1>
                    </div>
                </div>

                <div class="unsubscribe-content">
                    <div v-if="loading" class="loading-state">
                        <div class="spinner-border text-danger" role="status">
                            <span class="visually-hidden">Procesando...</span>
                        </div>
                        <p>Procesando tu solicitud...</p>
                    </div>

                    <div v-else-if="!unsubscribed" class="confirm-section">
                        <div class="icon-section">
                            <i class="bi bi-envelope-x text-warning"></i>
                        </div>
                        
                        <h2>¿Deseas cancelar tu suscripción?</h2>
                        
                        <p class="email-display">
                            <strong>{{ email }}</strong>
                        </p>
                        
                        <p class="description">
                            Lamentamos verte partir. Si cancelas tu suscripción, 
                            ya no recibirás nuestras actualizaciones sobre:
                        </p>

                        <ul class="benefits-list">
                            <li>
                                <i class="bi bi-check-circle text-success"></i>
                                Últimas noticias del mundo motociclístico
                            </li>
                            <li>
                                <i class="bi bi-check-circle text-success"></i>
                                Eventos y actividades de clubes
                            </li>
                            <li>
                                <i class="bi bi-check-circle text-success"></i>
                                Reviews de motos y accesorios
                            </li>
                            <li>
                                <i class="bi bi-check-circle text-success"></i>
                                Ofertas exclusivas de concesionarios
                            </li>
                        </ul>

                        <div class="action-buttons">
                            <button 
                                @click="handleOptOut" 
                                class="btn btn-danger"
                                :disabled="processing"
                            >
                                <i class="bi bi-envelope-x"></i>
                                {{ processing ? 'Procesando...' : 'Cancelar Suscripción' }}
                            </button>
                            
                            <router-link to="/" class="btn btn-outline-secondary">
                                <i class="bi bi-arrow-left"></i>
                                Mantener Suscripción
                            </router-link>
                        </div>
                    </div>

                    <div v-else class="success-section">
                        <div class="icon-section">
                            <i class="bi bi-check-circle text-success"></i>
                        </div>
                        
                        <h2>¡Suscripción Cancelada!</h2>
                        
                        <p class="success-message">
                            Tu dirección <strong>{{ email }}</strong> ha sido eliminada 
                            exitosamente de nuestra lista de correos.
                        </p>

                        <div class="success-details">
                            <div class="detail-item">
                                <i class="bi bi-info-circle text-info"></i>
                                <span>No recibirás más correos de nuestra parte</span>
                            </div>
                            <div class="detail-item">
                                <i class="bi bi-shield-check text-success"></i>
                                <span>Tus datos han sido procesados de forma segura</span>
                            </div>
                            <div class="detail-item">
                                <i class="bi bi-arrow-clockwise text-warning"></i>
                                <span>Puedes volver a suscribirte cuando gustes</span>
                            </div>
                        </div>

                        <div class="success-actions">
                            <router-link to="/" class="btn btn-primary">
                                <i class="bi bi-house"></i>
                                Ir al Inicio
                            </router-link>
                            
                            <router-link to="/noticias" class="btn btn-outline-primary">
                                <i class="bi bi-newspaper"></i>
                                Ver Noticias
                            </router-link>
                        </div>

                        <div class="resubscribe-section">
                            <p class="resubscribe-text">
                                ¿Cambiaste de opinión?
                            </p>
                            <button @click="showResubscribe = true" class="btn btn-link">
                                <i class="bi bi-envelope-plus"></i>
                                Volver a suscribirme
                            </button>
                        </div>

                        <div v-if="showResubscribe" class="resubscribe-form">
                            <div class="form-group">
                                <label for="resubscribe-email">Correo electrónico:</label>
                                <input 
                                    type="email" 
                                    id="resubscribe-email"
                                    v-model="resubscribeEmail" 
                                    class="form-control"
                                    placeholder="tu@email.com"
                                >
                            </div>
                            <div class="form-actions">
                                <button 
                                    @click="handleSubscribe" 
                                    class="btn btn-success"
                                    :disabled="!resubscribeEmail || resubscribing"
                                >
                                    <i class="bi bi-envelope-plus"></i>
                                    {{ resubscribing ? 'Suscribiendo...' : 'Suscribirme' }}
                                </button>
                                <button @click="showResubscribe = false" class="btn btn-secondary">
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>

                    <div v-if="error" class="error-section">
                        <div class="icon-section">
                            <i class="bi bi-exclamation-triangle text-danger"></i>
                        </div>
                        
                        <h2>Error al Procesar</h2>
                        <p class="error-message">{{ error }}</p>
                        
                        <div class="error-actions">
                            <button @click="retryUnsubscribe" class="btn btn-outline-danger">
                                <i class="bi bi-arrow-clockwise"></i>
                                Reintentar
                            </button>
                            <router-link to="/" class="btn btn-secondary">
                                <i class="bi bi-house"></i>
                                Ir al Inicio
                            </router-link>
                        </div>
                    </div>
                </div>

                <div class="footer-section">
                    <p>
                        <i class="bi bi-shield-lock text-muted"></i>
                        Tu privacidad es importante para nosotros. 
                        <router-link to="/privacy">Política de Privacidad</router-link>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import { 
    optOutFromNewsletter, 
    subscribeToNewsletter,  // ✅ ADD THIS IMPORT
    NEWSLETTER_ERRORS, 
    NEWSLETTER_SUCCESS 
} from '../../utils/newsletterUtils';

const route = useRoute();
const toast = useToast();

const email = ref('');
const loading = ref(true);
const processing = ref(false);
const unsubscribed = ref(false);
const error = ref('');
const showResubscribe = ref(false);
const resubscribeEmail = ref('');
const resubscribing = ref(false);

onMounted(() => {
    const emailParam = route.query.email;
    
    if (!emailParam) {
        error.value = 'No se proporcionó una dirección de correo válida.';
        loading.value = false;
        return;
    }
    
    try {
        email.value = decodeURIComponent(emailParam);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            throw new Error('Formato de correo inválido');
        }
    } catch (err) {
        error.value = 'La dirección de correo proporcionada no es válida.';
    }
    
    loading.value = false;
});

const handleSubscribe = async () => {
    if (!resubscribeEmail.value) {
        toast.error(NEWSLETTER_ERRORS.INVALID_EMAIL);
        return;
    }

    try {
        resubscribing.value = true;
        const response = await subscribeToNewsletter(resubscribeEmail.value);

        if (response.already_subscribed) {
            toast.info(NEWSLETTER_SUCCESS.ALREADY_SUBSCRIBED);
        } else {
            toast.success(NEWSLETTER_SUCCESS.SUBSCRIBED);
        }
        
        showResubscribe.value = false;
        resubscribeEmail.value = '';
        
    } catch (error) {
        if (error.response?.data?.message) {
            toast.error(error.response.data.message);
        } else {
            toast.error(NEWSLETTER_ERRORS.SUBSCRIPTION_ERROR);
        }
    } finally {
        resubscribing.value = false;
    }
};

const handleOptOut = async () => {
    if (!email.value) {
        toast.error(NEWSLETTER_ERRORS.INVALID_EMAIL);
        return;
    }

    try {
        processing.value = true;
        await optOutFromNewsletter(email.value);

        toast.success(NEWSLETTER_SUCCESS.UNSUBSCRIBED);
        unsubscribed.value = true;
        
    } catch (error) {
        console.error('OptOut error:', error);
        if (error.response?.data?.message) {
            toast.error(error.response.data.message);
        } else {
            toast.error(NEWSLETTER_ERRORS.UNSUBSCRIBE_ERROR);
        }
    } finally {
        processing.value = false;
    }
};

const retryUnsubscribe = () => {
    error.value = '';
    handleOptOut();
};
</script>

<style scoped>
.unsubscribe-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    padding: 2rem 0;
    display: flex;
    align-items: center;
}

.container {
    max-width: 600px;
    margin: 0 auto;
    padding: 0 1rem;
}

.unsubscribe-card {
    background: white;
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.unsubscribe-header {
    background: linear-gradient(135deg, #dc3545 0%, #8b0000 100%);
    color: white;
    padding: 2rem;
    text-align: center;
}

.logo-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.logo {
    width: 60px;
    height: 60px;
    border-radius: 12px;
}

.unsubscribe-header h1 {
    margin: 0;
    font-size: 1.75rem;
    font-weight: 700;
}

.unsubscribe-content {
    padding: 3rem 2rem;
}

.loading-state, .confirm-section, .success-section, .error-section {
    text-align: center;
}

.icon-section {
    margin-bottom: 2rem;
}

.icon-section i {
    font-size: 4rem;
}

.loading-state .spinner-border {
    width: 3rem;
    height: 3rem;
    margin-bottom: 1rem;
}

.confirm-section h2, .success-section h2, .error-section h2 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: #333;
}

.email-display {
    font-size: 1.1rem;
    color: #dc3545;
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: rgba(220, 53, 69, 0.1);
    border-radius: 8px;
}

.description {
    font-size: 1rem;
    color: #666;
    line-height: 1.6;
    margin-bottom: 2rem;
}

.benefits-list {
    text-align: left;
    max-width: 400px;
    margin: 0 auto 2rem;
    list-style: none;
    padding: 0;
}

.benefits-list li {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 0;
    font-size: 0.95rem;
    color: #555;
}

.action-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 3rem;
}

.btn {
    padding: 0.75rem 2rem;
    border-radius: 8px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    border: 2px solid transparent;
    transition: all 0.3s ease;
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-danger {
    background: #dc3545;
    color: white;
}

.btn-danger:hover {
    background: #c82333;
}

.btn-outline-secondary {
    background: transparent;
    color: #6c757d;
    border-color: #6c757d;
}

.btn-outline-secondary:hover {
    background: #6c757d;
    color: white;
}

.success-section .success-message {
    font-size: 1.1rem;
    color: #666;
    margin-bottom: 2rem;
}

.success-details {
    text-align: left;
    max-width: 400px;
    margin: 0 auto 2rem;
}

.detail-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 0;
    font-size: 0.95rem;
    color: #555;
}

.success-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 2rem;
}

.btn-primary {
    background: #dc3545;
    color: white;
}

.btn-primary:hover {
    background: #c82333;
}

.btn-outline-primary {
    background: transparent;
    color: #dc3545;
    border-color: #dc3545;
}

.btn-outline-primary:hover {
    background: #dc3545;
    color: white;
}

.resubscribe-section {
    border-top: 1px solid #eee;
    padding-top: 2rem;
}

.resubscribe-text {
    font-size: 0.95rem;
    color: #666;
    margin-bottom: 0.5rem;
}

.btn-link {
    background: none;
    border: none;
    color: #dc3545;
    text-decoration: underline;
    cursor: pointer;
    padding: 0.25rem 0;
}

.btn-link:hover {
    color: #c82333;
    transform: none;
    box-shadow: none;
}

.resubscribe-form {
    margin-top: 1rem;
    padding: 1.5rem;
    background: rgba(220, 53, 69, 0.05);
    border-radius: 8px;
    text-align: left;
}

.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #333;
}

.form-control {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.2s;
}

.form-control:focus {
    border-color: #dc3545;
    box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.1);
}

.form-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
}

.btn-success {
    background: #28a745;
    color: white;
}

.btn-success:hover {
    background: #218838;
}

.btn-secondary {
    background: #6c757d;
    color: white;
}

.btn-secondary:hover {
    background: #5a6268;
}

.error-section .error-message {
    font-size: 1rem;
    color: #dc3545;
    margin-bottom: 2rem;
    padding: 1rem;
    background: rgba(220, 53, 69, 0.1);
    border-radius: 8px;
}

.error-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

.btn-outline-danger {
    background: transparent;
    color: #dc3545;
    border-color: #dc3545;
}

.btn-outline-danger:hover {
    background: #dc3545;
    color: white;
}

.footer-section {
    padding: 2rem;
    text-align: center;
    background: #f8f9fa;
    color: #666;
    font-size: 0.9rem;
}

.footer-section a {
    color: #dc3545;
    text-decoration: none;
}

.footer-section a:hover {
    text-decoration: underline;
}

@media (max-width: 768px) {
    .unsubscribe-content {
        padding: 2rem 1rem;
    }
    
    .action-buttons,
    .success-actions,
    .error-actions {
        flex-direction: column;
    }
    
    .btn {
        width: 100%;
        justify-content: center;
    }
    
    .form-actions {
        flex-direction: column;
    }
}

@media (max-width: 480px) {
    .unsubscribe-page {
        padding: 1rem 0;
    }
    
    .confirm-section h2,
    .success-section h2,
    .error-section h2 {
        font-size: 1.5rem;
    }
    
    .unsubscribe-header h1 {
        font-size: 1.5rem;
    }
}
</style>