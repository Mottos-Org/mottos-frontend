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
                    <img 
                        v-if="profileImageSrc" 
                        :src="profileImageSrc" 
                        :alt="`${seller.nombres} ${seller.apellidos}`"
                        @error="handleImageError"
                        class="avatar-image"
                    />
                    <span v-else class="avatar-initials">{{ initials }}</span>
                </div>
                <div class="seller-info">
                    <h4 class="seller-name">{{ seller.nombres }} {{ seller.apellidos }}</h4>
                    <div v-if="sellerVerificationStatus?.verification_status?.fully_verified" class="seller-verification">
                        <i class="bi bi-check-circle"></i>
                        <span>Usuario verificado</span>
                    </div>
                    <div v-else class="seller-verification unverified">
                        <i class="bi bi-exclamation-triangle"></i>
                        <span>Usuario no verificado</span>
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
                    <span>El vendedor ha restringido la visualización de su información de contacto</span>
                </div>
            </div>

            <div class="contact-buttons">
                <button class="message-button">
                    <i class="bi bi-chat-dots"></i>
                    Enviar mensaje via Mottos
                </button>
            </div>
        </template>
    </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { formatPhoneNumber } from '../../../../utils/formatUtils';
import authUtils from '../../../../utils/authUtils';

const props = defineProps({
    seller: Object,
    location: String,
    publishedDate: String
});

const sellerUser = ref(null);
const sellerVerificationStatus = ref(null);
const profileImageSrc = ref(null);
const imageLoadError = ref(false);
const loading = ref(true);

const initials = computed(() => {
    const first = props.seller?.nombres?.charAt(0).toUpperCase() || '';
    const last = props.seller?.apellidos?.charAt(0).toUpperCase() || '';
    return first + last;
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

onMounted(async () => {
    try {
        loading.value = true;
        sellerUser.value = await authUtils.fetchUserDetails(props.seller.user_id);
        sellerVerificationStatus.value = await authUtils.fetchUserVerificationStatus(props.seller.user_id);

        setProfileImage();
        
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

.whatsapp-button,
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
}

.whatsapp-button {
    background: #25D366;
    color: white;
}

.whatsapp-button:hover {
    background: #1ebc5a;
}

.message-button {
    background: #b70000;
    color: white;
}

.message-button:hover {
    background: #c82333;
}

.seller-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    color: #666;
    font-size: 14px;
}

.spinner-border {
    width: 1.25rem;
    height: 1.25rem;
}

@media (max-width: 768px) {
    .contact-buttons {
        flex-direction: column;
    }
    
    .seller-detail {
        font-size: 13px;
    }
}
</style>