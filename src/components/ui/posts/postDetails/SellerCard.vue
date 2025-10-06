<template>
    <div class="seller-card">
        <div v-if="loading" class="seller-loading">
            <div class="spinner-border spinner-border-sm text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <span class="ms-2">Cargando información del vendedor...</span>
        </div>

        <template v-else>
            <div class="seller-header">
                <div class="seller-avatar">
                    <img v-if="profileImageSrc" :src="profileImageSrc" :alt="`${seller.nombres} ${seller.apellidos}`"
                        @error="handleImageError" class="avatar-image" />
                    <span v-else class="avatar-initials">{{ initials }}</span>
                </div>
                <div class="seller-info">
                    <h4 class="seller-name">{{ seller.nombres }} {{ seller.apellidos }}</h4>
                    <div v-if="sellerVerificationStatus?.verification_status?.fully_verified"
                        class="seller-verification">
                        <i class="bi bi-check-circle"></i>
                        <span>Usuario verificado</span>
                    </div>
                    <div v-else class="seller-verification unverified">
                        <i class="bi bi-exclamation-triangle"></i>
                        <span v-if="!isOwner">Usuario no verificado</span>
                        <span v-else>Tu cuenta no está verificada, <router-link to="/auth/mi-cuenta">cambia tus preferencias</router-link> si quieres cambiar esto.</span>
                    </div>
                </div>
            </div>

            <div class="seller-details">
                <div v-if="shouldShowPhone" class="seller-detail">
                    <i class="bi bi-telephone"></i>
                    <div class="contact-info">
                        <span>{{ formatPhoneNumber(seller.telefono) }}</span>
                        <div v-if="shouldShowWhatsApp" class="whatsapp-indicator">
                            <i class="bi bi-whatsapp"></i>
                            <span>Disponible en WhatsApp</span>
                        </div>
                    </div>
                </div>

                <div v-if="shouldShowEmail" class="seller-detail">
                    <i class="bi bi-envelope"></i>
                    <span>{{ seller.email }}</span>
                </div>

                <div v-if="!shouldShowPhone && !shouldShowEmail" class="privacy-notice">
                    <i class="bi bi-shield-check"></i>
                    <span v-if="isOwner" style="text-align: left;">
                        Haz restringido la visualización de tu información de contacto.
                        <router-link to="/auth/mi-cuenta">Cambia tus preferencias</router-link> si quieres cambiar esto.
                    </span>
                    <span v-else style="text-align: left;">
                        El vendedor ha restringido la visualización de su información de contacto
                    </span>
                </div>
            </div>

            <div v-if="!isOwner" class="contact-buttons">
                <div v-if="hasExistingConversation" class="existing-conversation-notice">
                    <i class="bi bi-check-circle-fill"></i>
                    <div class="notice-text">
                        <span class="notice-title">Ya tienes una conversación activa</span>
                        <span class="notice-subtitle">Ve a tu bandeja de entrada para continuar el chat</span>
                    </div>
                </div>
                <button v-else class="message-button" @click="openMessageModal">
                    <i class="bi bi-chat-dots"></i>
                    Enviar mensaje via Mottos
                </button>
            </div>
        </template>

        <!-- Message Modal -->
        <Teleport to="body">
            <div v-if="showMessageModal" class="modal-overlay" @click="closeMessageModal">
                <div class="modal-content" @click.stop>
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="bi bi-chat-dots-fill me-2"></i>
                            Enviar mensaje
                        </h5>
                        <button class="close-button" @click="closeMessageModal">
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="recipient-info">
                            <div class="recipient-avatar">
                                <img v-if="profileImageSrc" :src="profileImageSrc" :alt="seller.nombres" />
                                <span v-else class="avatar-initials-small">{{ initials }}</span>
                            </div>
                            <div class="recipient-details">
                                <span class="recipient-name">{{ seller.nombres }} {{ seller.apellidos }}</span>
                                <span class="post-info">
                                    <i class="bi bi-box-seam"></i>
                                    {{ truncateText(postData?.descripcion, 40) }}
                                </span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Tu mensaje</label>
                            <textarea
                                v-model="messageText"
                                class="message-textarea"
                                placeholder="Hola, estoy interesado en tu publicación..."
                                rows="4"
                                maxlength="500"
                                :disabled="sendingMessage"
                            ></textarea>
                            <small class="char-count">{{ messageText.length }}/500</small>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-cancel" @click="closeMessageModal" :disabled="sendingMessage">
                            Cancelar
                        </button>
                        <button class="btn-send" @click="sendMessage" :disabled="!messageText.trim() || sendingMessage">
                            <span v-if="!sendingMessage">
                                <i class="bi bi-send-fill me-2"></i>
                                Enviar mensaje
                            </span>
                            <span v-else>
                                <span class="spinner-border spinner-border-sm me-2"></span>
                                Enviando...
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { formatPhoneNumber } from '../../../../utils/formatUtils';
import authUtils from '../../../../utils/authUtils';
import { useAuthStore } from '../../../../stores/authStore';
import api from '../../../../services/api';
import { useToast } from 'vue-toastification';

const props = defineProps({
    seller: Object,
    location: String,
    publishedDate: String,
    postData: Object
});

const router = useRouter();
const authStore = useAuthStore();
const sellerUser = ref(null);
const sellerVerificationStatus = ref(null);
const profileImageSrc = ref(null);
const imageLoadError = ref(false);
const loading = ref(true);
const showMessageModal = ref(false);
const messageText = ref('');
const sendingMessage = ref(false);
const hasExistingConversation = ref(false);
const toast = useToast();

const API_BASE_URL = import.meta.env.VITE_API_URL;

const initials = computed(() => {
    const first = props.seller?.nombres?.charAt(0).toUpperCase() || '';
    const last = props.seller?.apellidos?.charAt(0).toUpperCase() || '';
    return first + last;
});

const isOwner = computed(() => {
    const currentUserId = String(authStore.userId);
    const postOwnerId = String(props.seller.user_id);
    return currentUserId === postOwnerId;
});

const shouldShowPhone = computed(() => {
    return sellerUser.value?.settings?.mostrar_telefono === 1 && props.seller?.telefono;
});

const shouldShowWhatsApp = computed(() => {
    return shouldShowPhone.value && sellerUser.value?.settings?.mostrar_ws === 1;
});

const shouldShowEmail = computed(() => {
    return sellerUser.value?.settings?.mostrar_correo === 1 && props.seller?.email;
});

const handleImageError = () => {
    imageLoadError.value = true;
    profileImageSrc.value = null;
};

const setProfileImage = () => {
    if (sellerUser.value?.profile?.foto_perfil_url && !imageLoadError.value) {
        profileImageSrc.value = sellerUser.value.profile.foto_perfil_url;
    } else {
        profileImageSrc.value = '/default_profile_pic.png';
    }
};

const checkExistingConversation = async () => {
    if (!authStore.isAuthenticated || !props.postData?.publicacion_id) return;

    try {
        const response = await api.get(`${API_BASE_URL}/api/posts/messages/chats`);
        const conversations = response.data;
        
        // Check if there's already a conversation for this post with this seller TODO
        const exists = conversations.some(
            chat => chat.post_id === props.postData.publicacion_id && 
                    chat.user_id === props.seller.user_id
        );
        
        hasExistingConversation.value = exists;
    } catch (error) {
        console.error('Error checking existing conversation:', error);
    }
};

const openMessageModal = () => {
    if (!authStore.isLoggedIn) {
        toast.error('Debes iniciar sesión para enviar mensajes');
        router.push('/login');
        return;
    }
    showMessageModal.value = true;
    messageText.value = '';
};

const closeMessageModal = () => {
    showMessageModal.value = false;
    messageText.value = '';
};

const truncateText = (text, length = 40) => {
    if (!text) return '';
    return text.length > length ? text.substring(0, length - 3) + '...' : text;
};

const sendMessage = async () => {
    if (!messageText.value.trim()) return;

    sendingMessage.value = true;

    try {
        await api.post(`${API_BASE_URL}/api/posts/${props.postData.publicacion_id}/messages`, {
            to_user_id: props.seller.user_id,
            message: messageText.value.trim(),
        });

        toast.success('¡Mensaje enviado exitosamente! Revisa tu bandeja de entrada.');
        closeMessageModal();
        hasExistingConversation.value = true;

    } catch (error) {
        console.error('Error sending message:', error);
        toast.error('Error al enviar el mensaje. Intenta de nuevo.');
    } finally {
        sendingMessage.value = false;
    }
};

onMounted(async () => {
    try {
        loading.value = true;
        sellerUser.value = await authUtils.fetchUserDetails(props.seller.user_id);
        sellerVerificationStatus.value = await authUtils.fetchUserVerificationStatus(props.seller.user_id);
        setProfileImage();
        
        if (authStore.isAuthenticated && !isOwner.value) {
            await checkExistingConversation();
        }
    } catch (error) {
        console.error('Error fetching seller information:', error);
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
.seller-card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.seller-header {
    display: flex;
    gap: 16px;
    margin-bottom: 20px;
}

.seller-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #dc3545;
    color: white;
    font-size: 1.5rem;
    font-weight: 700;
}

.avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.avatar-initials {
    font-size: 1.5rem;
    font-weight: 700;
}

.seller-info {
    text-align: left;
    flex: 1;
}

.seller-name {
    font-size: 1.1rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 4px;
}

.seller-details {
    margin-bottom: 20px;
}

.seller-detail {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 12px;
    color: #666;
    font-size: 14px;
    text-align: left;
}

.seller-detail i {
    color: #dc3545;
    min-width: 16px;
    margin-top: 2px;
}

.contact-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.whatsapp-indicator {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #25D366;
    font-size: 12px;
    font-style: italic;
}

.whatsapp-indicator i {
    color: #25D366;
    font-size: 12px;
}

.privacy-notice {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #6c757d;
    font-size: 12px;
    font-style: italic;
    background: #f8f9fa;
    padding: 8px 12px;
    border-radius: 6px;
    margin-top: 8px;
}

.privacy-notice i {
    color: #6c757d;
}

.seller-verification {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #28a745;
    font-size: 14px;
    margin-top: 10px;
}

.seller-verification.unverified {
    color: #ffc107;
}

.seller-verification span {
    font-weight: bold;
}

.contact-buttons {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.existing-conversation-notice {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
    border: 1px solid #c3e6cb;
    border-radius: 10px;
    color: #155724;
}

.existing-conversation-notice i {
    font-size: 24px;
    color: #28a745;
    flex-shrink: 0;
}

.notice-text {
    display: flex;
    flex-direction: column;
    gap: 4px;
    text-align: left;
}

.notice-title {
    font-weight: 600;
    font-size: 14px;
    color: #155724;
}

.notice-subtitle {
    font-size: 13px;
    color: #1e7e34;
}

.message-button {
    padding: 12px 16px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s;
    cursor: pointer;
    font-size: 14px;
    background: #d63636;
    color: white;
}

.message-button:hover {
    background: #b82828;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(214, 54, 54, 0.3);
}

.seller-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    color: #666;
    font-size: 14px;
}

/* Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 20px;
    backdrop-filter: blur(4px);
    animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.modal-content {
    background: white;
    border-radius: 16px;
    width: 100%;
    max-width: 550px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: slideUp 0.3s ease;
}

@keyframes slideUp {
    from {
        transform: translateY(50px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.modal-header {
    padding: 20px 24px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-title {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: #111827;
    display: flex;
    align-items: center;
}

.modal-title i {
    color: #d63636;
}

.close-button {
    width: 32px;
    height: 32px;
    border: none;
    background: #f3f4f6;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    color: #6b7280;
}

.close-button:hover {
    background: #e5e7eb;
    color: #111827;
    transform: rotate(90deg);
}

.modal-body {
    padding: 24px;
}

.recipient-info {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: #f9fafb;
    border-radius: 10px;
    margin-bottom: 20px;
}

.recipient-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    overflow: hidden;
    background: #d63636;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.recipient-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.avatar-initials-small {
    color: white;
    font-weight: 700;
    font-size: 18px;
}

.recipient-details {
    display: flex;
    flex-direction: column;
    gap: 4px;
    text-align: left;
    flex: 1;
    min-width: 0;
}

.recipient-name {
    font-weight: 600;
    font-size: 15px;
    color: #111827;
}

.post-info {
    font-size: 13px;
    color: #6b7280;
    display: flex;
    align-items: center;
    gap: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.post-info i {
    font-size: 12px;
    flex-shrink: 0;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group label {
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    text-align: left;
}

.message-textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
    font-family: inherit;
    resize: vertical;
    transition: border-color 0.2s;
    color: #111827;
    background-color: white;
}

.message-textarea:focus {
    outline: none;
    border-color: #d63636;
    box-shadow: 0 0 0 3px rgba(214, 54, 54, 0.1);
}

.message-textarea:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
}

.char-count {
    text-align: right;
    font-size: 12px;
    color: #9ca3af;
}

.modal-footer {
    padding: 16px 24px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    gap: 12px;
    justify-content: flex-end;
}

.btn-cancel,
.btn-send {
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-cancel {
    background: #f3f4f6;
    color: #6b7280;
}

.btn-cancel:hover:not(:disabled) {
    background: #e5e7eb;
    color: #374151;
}

.btn-send {
    background: #d63636;
    color: white;
}

.btn-send:hover:not(:disabled) {
    background: #b82828;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(214, 54, 54, 0.3);
}

.btn-send:disabled,
.btn-cancel:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
}

.spinner-border {
    width: 1rem;
    height: 1rem;
    border-width: 2px;
}

@media (max-width: 768px) {
    .modal-content {
        max-width: 100%;
        margin: 0 16px;
    }

    .modal-header,
    .modal-body,
    .modal-footer {
        padding: 16px;
    }

    .modal-footer {
        flex-direction: column;
    }

    .btn-cancel,
    .btn-send {
        width: 100%;
    }
}
</style>