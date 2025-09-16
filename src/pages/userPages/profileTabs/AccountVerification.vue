<template>
    <div class="content" style="padding: 25px">
        <div class="mb-4" style="width: 100%; display: flex; flex-direction: column; align-items: baseline;">
            <h4>Verificación de cuenta</h4>
            <p class="text-muted" style="margin-top: -7.5px">Termina de verificar tu cuenta con los siguientes pasos...
            </p>
        </div>

        <div v-if="allComplete" class="alert alert-success d-flex align-items-center mb-4" role="alert">
            <i class="bi bi-check-circle me-2"></i>
            <div style="text-align: left;">
                ¡Excelente! Tu cuenta ha sido completamente verificada.
            </div>
        </div>

        <!-- Tabs -->
        <div class="verification-tabs" style="width: 100%;">
            <ul class="nav nav-tabs mb-4" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link d-flex align-items-center gap-2" :class="{ active: activeTab === 'email' }"
                        @click="activeTab = 'email'" type="button">
                        <i class="bi bi-envelope"></i>
                        Verificación por Email
                        <i v-if="isEmailComplete" class="bi bi-check-circle text-success"></i>
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link d-flex align-items-center gap-2"
                        :class="{ active: activeTab === 'document' }" @click="activeTab = 'document'" type="button">
                        <i class="bi bi-file-text"></i>
                        Documento de Identidad
                        <i v-if="isDocumentComplete" class="bi bi-check-circle text-success"></i>
                    </button>
                </li>
            </ul>

            <div class="tab-content">
                <div v-if="activeTab === 'email'" class="tab-pane fade show active">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <div>
                                <h5 class="card-title d-flex align-items-center gap-2 mb-1">
                                    <i class="bi bi-envelope text-primary"></i>
                                    Verificación de Email
                                </h5>
                                <p class="card-text text-muted mb-0">Confirma tu dirección de correo electrónico para
                                    continuar</p>
                            </div>
                            <span class="badge" :class="getStatusBadgeClass(emailStatus)">
                                {{ getStatusText(emailStatus) }}
                            </span>
                        </div>
                        <div class="card-body">
                            <div v-if="emailStatus === 'pending'" class="space-y-3">
                                <div class="mb-3">
                                    <label for="email" class="form-label">Correo electrónico</label>
                                    <input id="email" type="email" class="form-control" placeholder="tu@email.com"
                                        :value="auth.user?.user?.email || ''" readonly />
                                </div>
                                <button @click="sendEmailVerification" :disabled="sendingEmail"
                                    class="btn btn-primary w-100">
                                    <pulse-loader v-if="sendingEmail" :loading="sendingEmail" color="#ffffff"
                                        size="10px" />
                                    <span v-else>Enviar código de verificación</span>
                                </button>
                            </div>

                            <div v-else-if="emailStatus === 'sent'" class="alert alert-info d-flex align-items-start">
                                <i class="bi bi-info-circle me-2 mt-1"></i>
                                <div>
                                    Hemos enviado un código de verificación a <strong>{{ auth.user?.user?.email
                                        }}</strong>.
                                    Revisa tu bandeja de entrada y haz clic en el enlace para verificar tu cuenta.
                                </div>
                            </div>

                            <div v-else-if="emailStatus === 'verified'"
                                class="alert alert-success d-flex align-items-start">
                                <i class="bi bi-check-circle me-2 mt-1"></i>
                                <div>Tu email ha sido verificado exitosamente.</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="activeTab === 'document'" class="tab-pane fade show active">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <div>
                                <h5 class="card-title d-flex align-items-center gap-2 mb-1">
                                    <i class="bi bi-file-text text-primary"></i>
                                    Documento de Identidad
                                </h5>
                                <p class="card-text text-muted mb-0">Sube la parte frontal y trasera de tu documento de
                                    identidad</p>
                            </div>
                            <span class="badge" :class="getStatusBadgeClass(documentStatus)">
                                {{ getStatusText(documentStatus) }}
                            </span>
                        </div>
                        <div class="card-body">
                            <div v-if="documentStatus !== 'verified'">
                                <div class="row g-3 mb-4">
                                    <div class="col-md-6">
                                        <label class="form-label">Parte frontal del documento</label>
                                        <div class="upload-area"
                                            :class="{ 'upload-disabled': documentStatus === 'uploaded' }"
                                            @click="documentStatus === 'pending' ? $refs.frontUpload.click() : null"
                                            @dragover.prevent
                                            @drop.prevent="documentStatus === 'pending' ? handleDrop($event, 'front') : null">
                                            <input ref="frontUpload" type="file" accept="image/*,.pdf"
                                                @change="handleFileSelect($event, 'front')" class="d-none"
                                                :disabled="documentStatus === 'uploaded'" />
                                            <div class="upload-content">
                                                <i
                                                    :class="['bi', documentStatus === 'uploaded' ? 'bi-check-circle-fill text-success' : 'bi-camera', 'upload-icon']"></i>
                                                <p class="upload-text">
                                                    <span v-if="documentStatus === 'uploaded'">
                                                        Documento subido
                                                    </span>
                                                    <span v-else>
                                                        {{ frontDocument ? frontDocument.name : 'Haz clic para subir' }}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-md-6">
                                        <label class="form-label">Parte trasera del documento</label>
                                        <div class="upload-area"
                                            :class="{ 'upload-disabled': documentStatus === 'uploaded' }"
                                            @click="documentStatus === 'pending' ? $refs.backUpload.click() : null"
                                            @dragover.prevent
                                            @drop.prevent="documentStatus === 'pending' ? handleDrop($event, 'back') : null">
                                            <input ref="backUpload" type="file" accept="image/*,.pdf"
                                                @change="handleFileSelect($event, 'back')" class="d-none"
                                                :disabled="documentStatus === 'uploaded'" />
                                            <div class="upload-content">
                                                <i
                                                    :class="['bi', documentStatus === 'uploaded' ? 'bi-check-circle-fill text-success' : 'bi-camera', 'upload-icon']"></i>
                                                <p class="upload-text">
                                                    <span v-if="documentStatus === 'uploaded'">
                                                        Documento subido
                                                    </span>
                                                    <span v-else>
                                                        {{ backDocument ? backDocument.name : 'Haz clic para subir' }}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button v-if="frontDocument && backDocument && documentStatus === 'pending'"
                                    @click="uploadDocuments" :disabled="uploadingDocuments"
                                    class="btn btn-primary w-100 mb-3">
                                    <pulse-loader v-if="uploadingDocuments" :loading="uploadingDocuments"
                                        color="#ffffff" size="10px" />
                                    <span v-else>
                                        <i class="bi bi-upload me-2"></i>
                                        Confirmar documentos
                                    </span>
                                </button>

                                <div v-if="documentStatus === 'pending'"
                                    class="alert alert-info d-flex align-items-start">
                                    <i class="bi bi-info-circle me-2 mt-1"></i>
                                    <div style="text-align: left;">
                                        Asegúrate de que las imágenes sean claras y que toda la información sea legible.
                                        Los documentos aceptados incluyen cédula de identidad, pasaporte o licencia de
                                        conducir en formato JPG, JPEG, PNG o PDF.
                                    </div>
                                </div>

                                <div v-else-if="documentStatus === 'uploaded'"
                                    class="alert alert-warning d-flex align-items-start">
                                    <i class="bi bi-clock me-2 mt-1"></i>
                                    <div style="text-align: left;">
                                        <strong>Documentos recibidos</strong><br>
                                        Tus documentos han sido subidos exitosamente y están siendo revisados por
                                        nuestro equipo.
                                        Te notificaremos por correo electrónico una vez que la verificación esté
                                        completa.
                                    </div>
                                </div>
                            </div>

                            <div v-if="documentStatus === 'verified'"
                                class="alert alert-success d-flex align-items-start">
                                <i class="bi bi-check-circle me-2 mt-1"></i>
                                <div style="text-align: left;">
                                    Tu documento de identidad ha sido verificado exitosamente.
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
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../../../stores/authStore';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import api from '../../../services/api';

const auth = useAuthStore();
const toast = useToast();

const activeTab = ref('email');
const sendingEmail = ref(false);
const uploadingDocuments = ref(false);
const frontDocument = ref(null);
const backDocument = ref(null);
const emailCooldown = ref(0);

let cooldownInterval = null;

const verificationStatus = computed(() => auth.verificationStatus?.verification_status || {});

const emailStatus = computed(() => {
    if (verificationStatus.value.email_verified) return 'verified';
    if (emailCooldown.value > 0) return 'sent';
    return 'pending';
});

const documentStatus = computed(() => {
    if (verificationStatus.value.documento_verified) return 'verified';
    if (verificationStatus.value.has_documento_images) return 'uploaded';
    return 'pending';
});

const isEmailComplete = computed(() => emailStatus.value === 'verified');
const isDocumentComplete = computed(() => documentStatus.value === 'verified');
const allComplete = computed(() => isEmailComplete.value && isDocumentComplete.value);

const getStatusBadgeClass = (status) => {
    switch (status) {
        case 'verified': return 'bg-success';
        case 'uploaded': return 'bg-warning';
        case 'sent': return 'bg-info';
        default: return 'bg-secondary';
    }
};

const getStatusText = (status) => {
    switch (status) {
        case 'verified': return 'Verificado';
        case 'uploaded': return 'Subido';
        case 'sent': return 'Enviado';
        default: return 'Pendiente';
    }
};

const startCooldown = () => {
    emailCooldown.value = 30;
    cooldownInterval = setInterval(() => {
        emailCooldown.value--;
        if (emailCooldown.value <= 0) {
            clearInterval(cooldownInterval);
            cooldownInterval = null;
        }
    }, 1000);
};

const sendEmailVerification = async () => {
    if (emailCooldown.value > 0) return;

    sendingEmail.value = true;
    try {
        const response = await api.post('/api/email/send-verification', {
            user_id: auth.userId
        });

        if (response.data.already_verified) {
            toast.info(response.data.message);
            await auth.fetchVerificationStatus();
        } else {
            toast.success(response.data.message);
            startCooldown();
        }
    } catch (error) {
        console.error('Error sending verification email:', error);
        toast.error('Error al enviar el correo de verificación');
    } finally {
        sendingEmail.value = false;
    }
};

const handleFileSelect = (event, type) => {
    const file = event.target.files[0];
    if (file && isValidFileType(file)) {
        if (type === 'front') {
            frontDocument.value = file;
        } else {
            backDocument.value = file;
        }
    } else if (file) {
        toast.error('Por favor selecciona un archivo válido (JPG, JPEG, PNG, PDF)');
    }
};

const handleDrop = (event, type) => {
    const file = event.dataTransfer.files[0];
    if (file && isValidFileType(file)) {
        if (type === 'front') {
            frontDocument.value = file;
        } else {
            backDocument.value = file;
        }
    } else if (file) {
        toast.error('Por favor selecciona un archivo válido (JPG, JPEG, PNG, PDF)');
    }
};

const isValidFileType = (file) => {
    const validTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'application/pdf'
    ];
    return validTypes.includes(file.type);
};

const uploadDocuments = async () => {
    if (!frontDocument.value || !backDocument.value) {
        toast.error('Por favor selecciona ambas imágenes del documento');
        return;
    }

    uploadingDocuments.value = true;
    try {
        const formData = new FormData();
        formData.append('user_id', auth.userId);
        formData.append('documento_identidad_img_front', frontDocument.value);
        formData.append('documento_identidad_img_back', backDocument.value);

        const response = await api.post('/api/documento/upload/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        toast.success('Documentos subidos exitosamente');
        await auth.fetchVerificationStatus();

        // Clear the selected files
        frontDocument.value = null;
        backDocument.value = null;
    } catch (error) {
        console.error('Error uploading documents:', error);
        toast.error('Error al subir los documentos');
    } finally {
        uploadingDocuments.value = false;
    }
};

// Check for tab focus to refetch verification status
const handleVisibilityChange = async () => {
    if (!document.hidden) {
        await auth.fetchVerificationStatus();
    }
};

onMounted(async () => {
    await auth.fetchVerificationStatus();
    document.addEventListener('visibilitychange', handleVisibilityChange);
});

onUnmounted(() => {
    if (cooldownInterval) {
        clearInterval(cooldownInterval);
    }
    document.removeEventListener('visibilitychange', handleVisibilityChange);
});
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

.verification-tabs .nav-tabs {
    border-bottom: 2px solid #dee2e6;
}

.verification-tabs .nav-link {
    border: none;
    color: #6c757d;
    font-weight: 500;
    padding: 1rem 1.5rem;
    border-bottom: 3px solid transparent;
}

.verification-tabs .nav-link:hover {
    border-color: transparent;
    background-color: #f8f9fa;
}

.verification-tabs .nav-link.active {
    color: #d63636;
    background-color: transparent;
    border-bottom-color: #d63636;
}

.upload-area {
    border: 2px dashed #dee2e6;
    border-radius: 8px;
    padding: 2rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: #f8f9fa;
}

.upload-area:hover:not(.upload-disabled) {
    border-color: #d63636;
    background-color: #fff;
}

.upload-disabled {
    cursor: not-allowed !important;
    opacity: 0.7;
    background-color: #e9ecef !important;
    border-color: #28a745 !important;
    border-style: solid !important;
}

.upload-disabled:hover {
    border-color: #28a745 !important;
    background-color: #e9ecef !important;
}

.upload-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

.upload-icon {
    font-size: 2rem;
    color: #6c757d;
}

.upload-disabled .upload-icon {
    font-size: 2.5rem;
    color: #28a745 !important;
}

.upload-text {
    margin: 0;
    font-size: 0.9rem;
    color: #6c757d;
}

.upload-disabled .upload-text {
    color: #28a745 !important;
    font-weight: 500;
}

.space-y-3>*+* {
    margin-top: 1rem;
}

.space-y-4>*+* {
    margin-top: 1.5rem;
}

.btn-primary {
    background-color: #d63636;
    border-color: #d63636;
}

.btn-primary:hover {
    background-color: #b52d2d;
    border-color: #b52d2d;
}

.text-primary {
    color: #d63636 !important;
}
</style>