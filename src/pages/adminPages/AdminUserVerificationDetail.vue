<template>
    <div class="detail-container">
        <!-- Header -->
        <div class="detail-header">
            <button @click="$emit('close')" class="btn-close">
                <i class="bi bi-x-lg"></i>
            </button>
            <h3>
                <i class="bi bi-card-text me-2"></i>
                Revisar Documento
            </h3>
        </div>

        <!-- User Info -->
        <div class="user-section">
            <div class="avatar-large">
                <img 
                    v-if="verification.user_info.profile_pic" 
                    :src="verification.user_info.profile_pic" 
                    :alt="verification.user_info.full_name"
                />
                <img 
                    v-else 
                    src="/default_profile_pic.png" 
                    :alt="verification.user_info.full_name"
                />
            </div>
            <h4>{{ verification.user_info.full_name }}</h4>
            <p class="text-muted">{{ verification.user_info.email }}</p>
        </div>

        <!-- Verification Info -->
        <div class="info-section">
            <div class="info-item">
                <label>Tipo de Documento</label>
                <p>{{ verification.user_info.tipo_documento_identidad || 'No especificado' }}</p>
            </div>
            <div class="info-item">
                <label>Cargado el</label>
                <p>{{ verification.verification_info.uploaded_at_formatted }}</p>
            </div>
            <div class="info-item">
                <label>Estado Email</label>
                <div class="email-status">
                    <span
                        v-if="verification.verification_info.email_verified"
                        class="badge bg-success"
                    >
                        <i class="bi bi-check-circle me-1"></i>
                        Verificado
                    </span>
                    <span v-else class="badge bg-warning">
                        <i class="bi bi-exclamation-circle me-1"></i>
                        No Verificado
                    </span>
                </div>
            </div>
            <div v-if="verification.verification_info.email_verified_at" class="info-item">
                <label>Verificado el</label>
                <p>{{ formatDate(verification.verification_info.email_verified_at) }}</p>
            </div>
        </div>

        <!-- Document Images -->
        <div class="images-section">
            <h5 class="mb-3">
                <i class="bi bi-image me-2"></i>
                Imágenes del Documento
            </h5>

            <div class="images-grid">
                <!-- Front Image -->
                <div class="image-container">
                    <label class="image-label">Parte Frontal</label>
                    <div class="image-wrapper">
                        <img
                            v-if="verification.document_images.front_image_url"
                            :src="verification.document_images.front_image_url"
                            alt="Documento Frontal"
                            class="document-image"
                        />
                        <div v-else class="image-placeholder">
                            <i class="bi bi-image"></i>
                        </div>
                    </div>
                    <p class="image-filename">
                        {{ verification.document_images.front_image_filename }}
                    </p>
                </div>

                <!-- Back Image -->
                <div class="image-container">
                    <label class="image-label">Parte Trasera</label>
                    <div class="image-wrapper">
                        <img
                            v-if="verification.document_images.back_image_url"
                            :src="verification.document_images.back_image_url"
                            alt="Documento Trasera"
                            class="document-image"
                        />
                        <div v-else class="image-placeholder">
                            <i class="bi bi-image"></i>
                        </div>
                    </div>
                    <p class="image-filename">
                        {{ verification.document_images.back_image_filename }}
                    </p>
                </div>
            </div>
        </div>

        <!-- Rejection Reason (shown only when rejecting) -->
        <div v-if="showRejectionForm" class="rejection-form">
            <label for="rejectionReason" class="form-label">
                Razón del Rechazo
                <span class="text-danger">*</span>
            </label>
            <textarea
                id="rejectionReason"
                v-model="rejectionReason"
                class="form-control"
                rows="3"
                placeholder="Describe el motivo del rechazo..."
                maxlength="500"
            ></textarea>
            <small class="text-muted">{{ rejectionReason.length }} / 500 caracteres</small>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
            <button
                v-if="!showRejectionForm"
                @click="showRejectionForm = true"
                class="btn btn-outline-danger w-100"
                :disabled="processing"
            >
                <i class="bi bi-x-circle me-2"></i>
                Rechazar
            </button>
            <button
                v-if="!showRejectionForm"
                @click="handleApprove"
                class="btn btn-primary w-100"
                :disabled="processing"
            >
                <div v-if="processing" class="spinner-border spinner-border-sm me-2" role="status"></div>
                <i v-else class="bi bi-check-circle me-2"></i>
                {{ processing ? 'Procesando...' : 'Aprobar' }}
            </button>

            <button
                v-else
                @click="showRejectionForm = false"
                class="btn btn-outline-secondary w-100"
                :disabled="processing"
            >
                <i class="bi bi-arrow-left me-2"></i>
                Cancelar
            </button>
            <button
                v-if="showRejectionForm"
                @click="handleReject"
                class="btn btn-danger w-100"
                :disabled="!rejectionReason.trim() || processing"
            >
                <div v-if="processing" class="spinner-border spinner-border-sm me-2" role="status"></div>
                <i v-else class="bi bi-x-circle me-2"></i>
                {{ processing ? 'Rechazando...' : 'Confirmar Rechazo' }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    verification: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['close', 'approve', 'reject']);

const showRejectionForm = ref(false);
const rejectionReason = ref('');
const processing = ref(false);

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-DO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const handleApprove = async () => {
    processing.value = true;
    try {
        emit('approve', props.verification.verification_id);
    } finally {
        processing.value = false;
    }
};

const handleReject = async () => {
    processing.value = true;
    try {
        emit('reject', { verificationId: props.verification.verification_id, reason: rejectionReason.value });
    } finally {
        processing.value = false;
    }
};
</script>

<style scoped>
.detail-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 1.5rem;
}

.detail-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e9ecef;
    position: relative;
}

.btn-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #6c757d;
    cursor: pointer;
    padding: 0;
    transition: all 0.3s ease;
}

.btn-close:hover {
    color: #212529;
}

.detail-header h3 {
    margin: 0;
    flex: 1;
    font-size: 1.25rem;
    color: #212529;
}

/* User Section */
.user-section {
    text-align: center;
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 8px;
}

.avatar-large {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin: 0 auto 1rem;
    overflow: hidden;
    background: #e9ecef;
    display: flex;
    align-items: center;
    justify-content: center;
}

.avatar-large img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.user-section h4 {
    margin: 0 0 0.25rem 0;
    color: #212529;
    font-weight: 600;
}

.user-section .text-muted {
    margin: 0;
    font-size: 0.9rem;
}

/* Info Section */
.info-section {
    margin-bottom: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.info-item {
    border-bottom: 1px solid #e9ecef;
    padding-bottom: 1rem;
}

.info-item:last-child {
    border-bottom: none;
}

.info-item label {
    display: block;
    font-size: 0.8rem;
    font-weight: 600;
    color: #6c757d;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
}

.info-item p {
    margin: 0;
    color: #212529;
    font-size: 0.95rem;
}

.email-status {
    display: inline-block;
}

/* Images Section */
.images-section {
    margin-bottom: 2rem;
}

.images-section h5 {
    color: #212529;
    font-weight: 600;
}

.images-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
}

.image-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.image-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #495057;
}

.image-wrapper {
    border: 2px solid #e9ecef;
    border-radius: 8px;
    overflow: hidden;
    background: #f8f9fa;
}

.document-image {
    width: 100%;
    height: auto;
    display: block;
    max-height: 300px;
    object-fit: cover;
}

.image-placeholder {
    width: 100%;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    color: #dee2e6;
    background: #f8f9fa;
}

.image-filename {
    font-size: 0.75rem;
    color: #6c757d;
    margin: 0;
    word-break: break-all;
}

/* Rejection Form */
.rejection-form {
    margin-bottom: 2rem;
    padding: 1rem;
    background: #fff5f5;
    border-left: 3px solid #B70000;
    border-radius: 4px;
}

.rejection-form .form-label {
    color: #212529;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.rejection-form .form-control {
    border-color: #B70000;
    resize: vertical;
}

.rejection-form .form-control:focus {
    border-color: #B70000;
    box-shadow: 0 0 0 0.2rem rgba(183, 0, 0, 0.25);
}

.rejection-form .text-muted {
    display: block;
    margin-top: 0.5rem;
    font-size: 0.8rem;
}

/* Action Buttons */
.action-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: auto;
    padding-top: 1.5rem;
    border-top: 1px solid #e9ecef;
}

.btn {
    border-radius: 6px;
    font-weight: 500;
    padding: 0.65rem 1rem;
}

.btn-primary {
    background-color: #B70000;
    border-color: #B70000;
    color: white;
}

.btn-primary:hover:not(:disabled) {
    background-color: #8B0000;
    border-color: #8B0000;
}

.btn-danger {
    background-color: #dc3545;
    border-color: #dc3545;
    color: white;
}

.btn-danger:hover:not(:disabled) {
    background-color: #c82333;
    border-color: #bd2130;
}

.btn:disabled {
    opacity: 0.65;
    cursor: not-allowed;
}

@media (max-width: 576px) {
    .images-grid {
        grid-template-columns: 1fr;
    }

    .detail-container {
        padding: 1rem;
    }
}
</style>