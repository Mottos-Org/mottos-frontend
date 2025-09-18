<template>
    <div class="newsletter-section">
        <h4>NEWSLETTER</h4>
        
        <div v-if="isSubscribed" class="subscribed-state">
            <div class="success-message">
                <i class="bi bi-check-circle-fill text-success me-2"></i>
                <span>¡Ya estás suscrito a nuestro newsletter!</span>
            </div>
            <p class="subscription-info" style="color: #d1d5db;">
                Recibirás las mejores ofertas, eventos y noticias del mundo del motociclismo.
            </p>
            <div class="subscription-date" v-if="subscriptionStatus?.subscribed_at">
                <small class="subscription-info" style="color: #d1d5db;">
                    Suscrito desde: {{ formatSubscriptionDate(subscriptionStatus.subscribed_at) }}
                </small>
            </div>
            <div class="unsubscribe-link">
                <a href="#" @click.prevent="showOptOutModal = true" class="text-danger">
                    <small><i class="bi bi-x-circle me-1"></i>Cancelar suscripción</small>
                </a>
            </div>
        </div>

        <div v-else class="subscribe-state">
            <p>
                ¡Únete a nuestro Newsletter y mantente al día con las mejores ofertas,
                eventos y noticias del mundo del motociclismo!
            </p>
            
            <form @submit.prevent="handleSubscribe" class="newsletter-signup">
                <input 
                    type="email" 
                    v-model="email"
                    placeholder="Correo electrónico..." 
                    class="newsletter-input"
                    :disabled="loading"
                    required
                />
                <button 
                    type="submit"
                    class="newsletter-button"
                    :disabled="loading || !email"
                >
                    <i v-if="loading" class="bi bi-arrow-clockwise spin"></i>
                    <i v-else class="fa fa-chevron-right"></i>
                </button>
            </form>
            
            <small class="newsletter-small">¡No te preocupes! No hacemos spam</small>
        </div>
    </div>

    <teleport to="body">
        <transition name="fade-modal">
            <div v-if="showOptOutModal" class="modal-overlay" @click.self="showOptOutModal = false">
                <div class="modal-box">
                    <div class="modal-icon">
                        <div class="icon-circle warning">
                            <i class="bi bi-exclamation-triangle"></i>
                        </div>
                    </div>
                    <h4 class="modal-title">¿Cancelar suscripción?</h4>
                    <p class="modal-subtitle">
                        ¿Estás seguro de que deseas cancelar tu suscripción al newsletter? 
                        Ya no recibirás ofertas y noticias exclusivas.
                    </p>
                    <div class="modal-actions">
                        <button 
                            class="btn cancel-btn" 
                            @click="showOptOutModal = false"
                            :disabled="loading"
                        >
                            Mantener suscripción
                        </button>
                        <button 
                            class="btn unsubscribe-btn" 
                            @click="handleOptOut"
                            :disabled="loading"
                        >
                            <i v-if="loading" class="bi bi-arrow-clockwise spin me-1"></i>
                            Cancelar suscripción
                        </button>
                    </div>
                </div>
            </div>
        </transition>
    </teleport>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../../stores/authStore';
import { 
    getUserDetails,
    checkNewsletterStatus, 
    subscribeToNewsletter, 
    optOutFromNewsletter, 
    formatSubscriptionDate,
    NEWSLETTER_ERRORS,
    NEWSLETTER_SUCCESS
} from '../../utils/newsletterUtils';

const toast = useToast();
const auth = useAuthStore();
const email = ref('');
const userEmail = ref('');
const loading = ref(false);
const subscriptionStatus = ref(null);
const showOptOutModal = ref(false);

const isSubscribed = computed(() => {
    return subscriptionStatus.value?.subscribed === true;
});

const fetchUserEmail = async () => {
    if (!auth.isLoggedIn || !auth.userId) return null;

    try {
        const userDetails = await getUserDetails(auth.userId);
        console.log('userDetails:', userDetails);
        return userDetails.email;
    } catch (error) {
        console.error('Error fetching user email:', error);
        toast.error(NEWSLETTER_ERRORS.FETCH_USER_ERROR);
        return null;
    }
};

const checkSubscriptionStatus = async () => {
    if (!userEmail.value) return;

    try {
        loading.value = true;
        subscriptionStatus.value = await checkNewsletterStatus(userEmail.value);
    } catch (error) {
        console.error('Error checking subscription status:', error);
    } finally {
        loading.value = false;
    }
};

const handleSubscribe = async () => {
    if (!email.value) {
        toast.error(NEWSLETTER_ERRORS.INVALID_EMAIL);
        return;
    }

    try {
        loading.value = true;
        const response = await subscribeToNewsletter(email.value);

        if (response.already_subscribed) {
            toast.info(NEWSLETTER_SUCCESS.ALREADY_SUBSCRIBED);
        } else {
            toast.success(NEWSLETTER_SUCCESS.SUBSCRIBED);
            subscriptionStatus.value = {
                email: email.value,
                subscribed: true,
                subscribed_at: response.subscribed_at
            };
        }
    } catch (error) {
        if (error.response?.data?.message) {
            toast.error(error.response.data.message);
        } else {
            toast.error(NEWSLETTER_ERRORS.SUBSCRIPTION_ERROR);
        }
    } finally {
        loading.value = false;
    }
};

const handleOptOut = async () => {
    try {
        loading.value = true;
        await optOutFromNewsletter(subscriptionStatus.value.email);

        toast.success(NEWSLETTER_SUCCESS.UNSUBSCRIBED);
        
        subscriptionStatus.value = {
            ...subscriptionStatus.value,
            subscribed: false,
            subscribed_at: null
        };
        
        showOptOutModal.value = false;
    } catch (error) {
        if (error.response?.data?.message) {
            toast.error(error.response.data.message);
        } else {
            toast.error(NEWSLETTER_ERRORS.UNSUBSCRIBE_ERROR);
        }
    } finally {
        loading.value = false;
    }
};

// Lifecycle
onMounted(async () => {
    if (auth.isLoggedIn && auth.userId) {
        userEmail.value = await fetchUserEmail();
        if (userEmail.value) {
            email.value = userEmail.value;
            await checkSubscriptionStatus();
        }
    }
});
</script>

<style scoped>
.newsletter-section {
    color: #fff;
}

.newsletter-section h4 {
    margin-bottom: 1rem;
    font-size: 1rem;
    font-weight: 800;
    line-height: 1.2;
    font-style: italic;
    font-family: Montserrat, sans-serif;
}

.newsletter-section p {
    font-size: 0.9rem;
    color: #99a3b6;
    margin-bottom: 1rem;
}

.subscribed-state {
    padding: 1rem;
    background-color: rgba(34, 197, 94, 0.1);
    border: 1px solid rgba(34, 197, 94, 0.3);
    border-radius: 8px;
    margin-bottom: 1rem;
}

.success-message {
    display: flex;
    align-items: center;
    margin-bottom: 0.75rem;
    color: #22c55e;
    font-weight: 600;
}

.subscription-info {
    color: #d1d5db;
    margin-bottom: 0.5rem;
}

.subscription-date {
    margin-bottom: 0.75rem;
}

.unsubscribe-link a {
    color: #ef4444 !important;
    text-decoration: none;
    transition: color 0.2s;
}

.unsubscribe-link a:hover {
    color: #dc2626 !important;
    text-decoration: underline;
}

.newsletter-signup {
    display: flex;
    width: 100%;
    max-width: 600px;
    border: 1px solid #2c2f36;
    background-color: #23272f;
    border-radius: 4px;
    overflow: hidden;
}

.newsletter-input {
    flex: 1;
    background-color: #23272f;
    color: white;
    border: none;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    outline: none;
    width: 100%;
}

.newsletter-input::placeholder {
    color: #6b7280;
}

.newsletter-input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.newsletter-button {
    background-color: #8b0000;
    color: white;
    padding: 0 1.5rem;
    font-size: 1.25rem;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
    box-sizing: border-box;
    width: 50px;
    min-width: 50px;
}

.newsletter-button:hover:not(:disabled) {
    background-color: #b70000;
    cursor: pointer;
}

.newsletter-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.newsletter-small {
    font-size: 0.85rem;
    font-style: italic;
    color: #737f96;
    margin-top: 0.5rem;
    display: block;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.modal-box {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    width: 100%;
    max-width: 420px;
    text-align: center;
    box-shadow: 0 4px 40px rgba(0, 0, 0, 0.15);
    margin: 1rem;
}

.modal-icon {
    margin-bottom: 1rem;
}

.icon-circle {
    border-radius: 50%;
    width: 3.5rem;
    height: 3.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    margin: 0 auto;
}

.icon-circle.warning {
    background-color: #fef3c7;
    color: #d97706;
}

.modal-title {
    font-weight: 700;
    font-size: 1.25rem;
    color: #111;
    margin-bottom: 0.5rem;
}

.modal-subtitle {
    font-size: 0.95rem;
    color: #6b7280;
    margin-bottom: 1.5rem;
    line-height: 1.5;
}

.modal-actions {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 5px;
    flex-wrap: wrap;
}

.cancel-btn {
    background: white;
    border: 1px solid #d1d5db;
    color: #111;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-weight: 600;
    transition: all 0.2s ease;
}

.cancel-btn:hover:not(:disabled) {
    background-color: #f3f4f6;
}

.unsubscribe-btn {
    background-color: #ef4444;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    border: none;
    font-weight: 600;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
}

.unsubscribe-btn:hover:not(:disabled) {
    background-color: #dc2626;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.fade-modal-enter-active,
.fade-modal-leave-active {
    transition: opacity 0.25s ease;
}

.fade-modal-enter-from,
.fade-modal-leave-to {
    opacity: 0;
}

@media (max-width: 768px) {
    .modal-actions {
        flex-direction: column;
    }
    
    .cancel-btn,
    .unsubscribe-btn {
        width: 100%;
        justify-content: center;
    }
}
</style>