<template>
    <div class="bike-owner-card">
        <div v-if="loading" class="owner-loading">
            <div class="spinner-border spinner-border-sm text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <span class="ms-2">Cargando información del propietario...</span>
        </div>

        <template v-else>
            <div class="owner-header">
                <div class="owner-avatar">
                    <img 
                        v-if="profileImageSrc" 
                        :src="profileImageSrc" 
                        :alt="`${owner.nombres} ${owner.apellidos}`"
                        @error="handleImageError"
                        class="avatar-image"
                    />
                    <span v-else class="avatar-initials">{{ initials }}</span>
                </div>
                <div class="owner-info">
                    <h4 class="owner-name">{{ owner.nombres }} {{ owner.apellidos }}</h4>
                    <div class="owner-label">
                        <i class="bi bi-person-gear"></i>
                        <span>Propietario de esta motocicleta</span>
                    </div>
                    <div v-if="ownerVerificationStatus?.verification_status?.fully_verified" class="owner-verification">
                        <i class="bi bi-check-circle-fill"></i>
                        <span>Usuario verificado</span>
                    </div>
                    <div v-else class="owner-verification unverified">
                        <i class="bi bi-exclamation-triangle-fill"></i>
                        <span>Usuario no verificado</span>
                    </div>
                </div>
            </div>

            <div class="owner-details">
                <div class="owner-detail">
                    <i class="bi bi-calendar-plus"></i>
                    <span>Miembro desde {{ formatJoinDate(ownerUser?.created_at) }}</span>
                </div>

                <div class="owner-detail">
                    <i class="bi bi-bicycle"></i>
                    <span>{{ bikeCount }} motocicleta(s) registrada(s)</span>
                </div>

                <div v-if="bike.created_at" class="owner-detail">
                    <i class="bi bi-plus-circle"></i>
                    <span>Registró esta moto el {{ formatDate(bike.created_at) }}</span>
                </div>

                <div v-if="shouldShowContactInfo" class="owner-detail">
                    <i class="bi bi-info-circle"></i>
                    <span>Información de contacto disponible</span>
                </div>

                <div v-if="!shouldShowContactInfo" class="privacy-notice">
                    <i class="bi bi-shield-lock"></i>
                    <span>El propietario mantiene su información de contacto privada</span>
                </div>
            </div>

            <!-- Contact section - only show if owner allows it -->
            <div v-if="shouldShowContactInfo" class="contact-section">
                <div v-if="shouldShowPhone" class="contact-detail">
                    <i class="bi bi-telephone"></i>
                    <div class="contact-info">
                        <span>{{ formatPhoneNumber(owner.telefono) }}</span>
                        <div v-if="shouldShowWhatsApp" class="whatsapp-indicator">
                            <i class="bi bi-whatsapp"></i>
                            <span>Disponible en WhatsApp</span>
                        </div>
                    </div>
                </div>

                <div v-if="shouldShowEmail" class="contact-detail">
                    <i class="bi bi-envelope"></i>
                    <span>{{ ownerUser.user.email }}</span>
                </div>

                <div class="contact-buttons">
                    <!-- <button v-if="shouldShowWhatsApp" class="whatsapp-button" @click="openWhatsApp">
                        <i class="bi bi-whatsapp"></i>
                        Contactar por WhatsApp
                    </button> -->
                    <button class="message-button">
                        <i class="bi bi-chat-dots"></i>
                        Enviar mensaje via Mottos
                    </button>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { formatPhoneNumber } from '../../utils/formatUtils';
import authUtils from '../../utils/authUtils';
import { formatDate, formatJoinDate } from '../../utils/formatUtils';
import api from '../../services/api';

const props = defineProps({
    owner: {
        type: Object,
        required: true
    },
    bike: {
        type: Object,
        required: true
    }
});

const ownerUser = ref(null);
const ownerVerificationStatus = ref(null);
const profileImageSrc = ref(null);
const imageLoadError = ref(false);
const loading = ref(true);
const bikeCount = ref(0);

const initials = computed(() => {
    const first = props.owner?.nombres?.charAt(0).toUpperCase() || '';
    const last = props.owner?.apellidos?.charAt(0).toUpperCase() || '';
    return first + last;
});

const shouldShowPhone = computed(() => {
    return ownerUser.value?.settings?.mostrar_telefono === 1 && ownerUser.value?.user.telefono;
});

const shouldShowWhatsApp = computed(() => {
    return shouldShowPhone.value && ownerUser.value?.settings?.mostrar_ws === 1;
});

const shouldShowEmail = computed(() => {
    return ownerUser.value?.settings?.mostrar_correo === 1 && ownerUser.value?.user.email;
});

const shouldShowContactInfo = computed(() => {
    return shouldShowPhone.value || shouldShowEmail.value;
});

const handleImageError = () => {
    imageLoadError.value = true;
    profileImageSrc.value = null;
};

const setProfileImage = () => {
    if (ownerUser.value?.profile?.foto_perfil_url && !imageLoadError.value) {
        profileImageSrc.value = ownerUser.value.profile.foto_perfil_url;
    } else {
        profileImageSrc.value = null;
    }
};

const fetchBikeCount = async () => {
    try {
        const response = await api.get(`/api/users/${props.owner.user_id}/bikes/count`);
        bikeCount.value = response.data.count || 1;
    } catch (error) {
        console.error('Error fetching bike count:', error);
        bikeCount.value = 1; // Default to at least this bike
    }
};

onMounted(async () => {
    try {
        loading.value = true;
        
        const [userDetails, verificationStatus] = await Promise.all([
            authUtils.fetchUserDetails(props.owner.user_id),
            authUtils.fetchUserVerificationStatus(props.owner.user_id)
        ]);
        
        ownerUser.value = userDetails;
        ownerVerificationStatus.value = verificationStatus;
        
        setProfileImage();
        fetchBikeCount();
        
    } catch (error) {
        console.error('Error fetching owner information:', error);
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
.bike-owner-card {
    background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
    border: 1px solid #e9ecef;
    border-radius: 16px;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    position: relative;
    overflow: hidden;
}

.bike-owner-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #dc3545 0%, #fd7e14 50%, #dc3545 100%);
}

.owner-header {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.owner-avatar {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%);
    color: white;
    font-size: 1.8rem;
    font-weight: 700;
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
    flex-shrink: 0;
}

.avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.owner-info {
    flex: 1;
    text-align: left;
}

.owner-name {
    font-size: 1.4rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 0.5rem;
}

.owner-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #6c757d;
    font-size: 0.9rem;
    margin-bottom: 0.75rem;
    font-weight: 500;
}

.owner-label i {
    color: #dc3545;
}

.owner-verification {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    font-weight: 600;
}

.owner-verification {
    color: #28a745;
}

.owner-verification.unverified {
    color: #ffc107;
}

.owner-details {
    margin-bottom: 1.5rem;
}

.owner-detail {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
    color: #495057;
    font-size: 0.9rem;
}

.owner-detail i {
    color: #dc3545;
    font-size: 1rem;
    min-width: 18px;
}

.privacy-notice {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: #6c757d;
    font-size: 0.85rem;
    background: #f8f9fa;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    margin-top: 0.75rem;
    border-left: 3px solid #dee2e6;
}

.privacy-notice i {
    color: #6c757d;
    font-size: 0.9rem;
}

.contact-section {
    border-top: 1px solid #e9ecef;
    padding-top: 1.5rem;
}

.contact-detail {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    margin-bottom: 1rem;
    color: #495057;
    font-size: 0.9rem;
}

.contact-detail i {
    color: #dc3545;
    min-width: 18px;
    margin-top: 0.1rem;
}

.contact-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.whatsapp-indicator {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: #25D366;
    font-size: 0.8rem;
    font-style: italic;
}

.whatsapp-indicator i {
    color: #25D366;
    font-size: 0.8rem;
}

.contact-buttons {
    display: flex;
    gap: 0.75rem;
    margin-top: 1rem;
}

.whatsapp-button,
.message-button {
    flex: 1;
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.2s ease;
    cursor: pointer;
}

.whatsapp-button {
    background: #25D366;
    color: white;
}

.whatsapp-button:hover {
    background: #1ebc5a;
    transform: translateY(-1px);
}

.message-button {
    background: #dc3545;
    color: white;
}

.message-button:hover {
    background: #c82333;
    transform: translateY(-1px);
}

.owner-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    color: #6c757d;
    font-size: 0.9rem;
}

@media (max-width: 768px) {
    .bike-owner-card {
        padding: 1.5rem;
    }
    
    .owner-header {
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 1rem;
    }
    
    .owner-info {
        text-align: center;
    }
    
    .contact-buttons {
        flex-direction: column;
    }
    
    .owner-detail,
    .contact-detail {
        font-size: 0.85rem;
    }
}

@media (max-width: 480px) {
    .bike-owner-card {
        padding: 1rem;
    }
    
    .owner-avatar {
        width: 60px;
        height: 60px;
        font-size: 1.5rem;
    }
    
    .owner-name {
        font-size: 1.2rem;
    }
}
</style>