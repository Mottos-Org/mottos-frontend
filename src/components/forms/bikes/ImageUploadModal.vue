<template>
    <div class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-container">
            <div class="modal-header">
                <h2>
                    <i class="bi bi-images"></i>
                    Gestionar Imágenes
                </h2>
                <button @click="$emit('close')" class="btn-close" aria-label="Cerrar">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>

            <div class="modal-body">
                <!-- Upload Section -->
                <div class="upload-section">
                    <div 
                        class="upload-zone"
                        :class="{ 'drag-over': isDragOver, 'uploading': uploading }"
                        @drop="handleDrop"
                        @dragover="handleDragOver"
                        @dragleave="handleDragLeave"
                        @click="triggerFileInput"
                    >
                        <input 
                            ref="fileInput"
                            type="file"
                            multiple
                            accept="image/*"
                            @change="handleFileSelect"
                            style="display: none;"
                        />
                        
                        <div v-if="!uploading" class="upload-content">
                            <i class="bi bi-cloud-upload upload-icon"></i>
                            <h4>Subir Imágenes</h4>
                            <p>Arrastra las imágenes aquí o haz clic para seleccionar</p>
                            <small>Formatos soportados: JPG, PNG, WebP (máx. 5MB cada una)</small>
                        </div>
                        
                        <div v-else class="uploading-content">
                            <div class="spinner-border text-primary" role="status"></div>
                            <p>Subiendo imágenes...</p>
                            <div class="progress">
                                <div 
                                    class="progress-bar" 
                                    :style="{ width: uploadProgress + '%' }"
                                ></div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Upload Errors -->
                    <div v-if="uploadErrors.length" class="upload-errors">
                        <h5><i class="bi bi-exclamation-triangle"></i> Errores de Subida</h5>
                        <ul>
                            <li v-for="error in uploadErrors" :key="error" class="error-item">
                                {{ error }}
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Existing Images -->
                <div v-if="existingImages.length" class="images-section">
                    <h4>
                        <i class="bi bi-collection"></i>
                        Imágenes Actuales ({{ existingImages.length }})
                    </h4>
                    
                    <div class="images-grid">
                        <div 
                            v-for="image in existingImages" 
                            :key="image.image_id"
                            class="image-item"
                            :class="{ featured: image.is_featured }"
                        >
                            <div class="image-wrapper">
                                <img :src="image.url" :alt="`Imagen ${image.display_order}`" />
                                
                                <div class="image-overlay">
                                    <div class="image-info">
                                        <span class="file-size">{{ image.human_file_size }}</span>
                                        <span v-if="image.is_featured" class="featured-label">
                                            <i class="bi bi-star-fill"></i>
                                            Principal
                                        </span>
                                    </div>
                                    
                                    <div class="image-actions">
                                        <button 
                                            v-if="!image.is_featured"
                                            @click="setFeatured(image)"
                                            class="action-btn feature-btn"
                                            title="Marcar como principal"
                                            :disabled="settingFeatured"
                                        >
                                            <i class="bi bi-star"></i>
                                        </button>
                                        
                                        <button 
                                            @click="confirmDelete(image)"
                                            class="action-btn delete-btn"
                                            title="Eliminar imagen"
                                            :disabled="deletingImage"
                                        >
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="image-meta">
                                <span class="order-badge">{{ image.display_order }}</span>
                                <span class="filename">{{ truncateFilename(image.original_name) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Empty State -->
                <div v-else class="empty-images">
                    <i class="bi bi-images"></i>
                    <h4>Sin imágenes</h4>
                    <p>Esta motocicleta no tiene imágenes aún. Sube algunas para mostrar sus mejores características.</p>
                </div>
            </div>

            <div class="modal-footer">
                <button @click="$emit('close')" class="btn btn-outline-secondary">
                    <i class="bi bi-x-circle"></i>
                    Cerrar
                </button>
                
                <button 
                    @click="triggerFileInput"
                    class="btn btn-primary"
                    :disabled="uploading"
                >
                    <i class="bi bi-plus-circle"></i>
                    Agregar Más Imágenes
                </button>
            </div>
        </div>

        <!-- Delete Confirmation -->
        <teleport to="body">
            <transition name="fade-modal">
                <div v-if="showDeleteModal" class="modal-overlay confirmation-overlay" @click.self="showDeleteModal = false">
                    <div class="modal-box">
                        <div class="modal-icon">
                            <div class="icon-circle">
                                <i class="bi bi-trash"></i>
                            </div>
                        </div>
                        <h4 class="modal-title">¿Eliminar imagen?</h4>
                        <p class="modal-subtitle">
                            Esta acción eliminará permanentemente esta imagen. No se puede deshacer.
                        </p>
                        <div class="modal-actions">
                            <button class="btn cancel-btn" @click="showDeleteModal = false">
                                Cancelar
                            </button>
                            <button class="btn delete-btn" @click="deleteImage" :disabled="deletingImage">
                                <div v-if="deletingImage" class="spinner-border spinner-border-sm me-2"></div>
                                <i v-if="!deletingImage" class="bi bi-trash me-1"></i>
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            </transition>
        </teleport>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useToast } from 'vue-toastification';
import api from '../../../services/api';

const props = defineProps({
    bikeId: {
        type: [String, Number],
        required: true
    },
    existingImages: {
        type: Array,
        default: () => []
    }
});

const emit = defineEmits(['close', 'images-updated']);

const toast = useToast();

const fileInput = ref(null);
const uploading = ref(false);
const uploadProgress = ref(0);
const uploadErrors = ref([]);
const isDragOver = ref(false);
const showDeleteModal = ref(false);
const imageToDelete = ref(null);
const deletingImage = ref(false);
const settingFeatured = ref(false);

const triggerFileInput = () => {
    if (!uploading.value) {
        fileInput.value?.click();
    }
};

const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
        uploadImages(files);
    }
};

const handleDrop = (event) => {
    event.preventDefault();
    isDragOver.value = false;
    
    const files = Array.from(event.dataTransfer.files).filter(file => 
        file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
        uploadImages(files);
    }
};

const handleDragOver = (event) => {
    event.preventDefault();
    isDragOver.value = true;
};

const handleDragLeave = () => {
    isDragOver.value = false;
};

const validateFiles = (files) => {
    const errors = [];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    
    files.forEach((file, index) => {
        if (!allowedTypes.includes(file.type)) {
            errors.push(`Archivo ${file.name}: Formato no soportado. Use JPG, PNG o WebP.`);
        }
        
        if (file.size > maxSize) {
            errors.push(`Archivo ${file.name}: Tamaño muy grande. Máximo 5MB.`);
        }
    });
    
    return errors;
};

const uploadImages = async (files) => {
    uploadErrors.value = [];
    
    const validationErrors = validateFiles(files);
    if (validationErrors.length > 0) {
        uploadErrors.value = validationErrors;
        return;
    }
    
    try {
        uploading.value = true;
        uploadProgress.value = 0;
        
        const formData = new FormData();
        files.forEach(file => {
            formData.append('images[]', file);
        });
        
        const response = await api.post(`/api/bikes/${props.bikeId}/images/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
                uploadProgress.value = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                );
            }
        });
        
        toast.success(`${response.data.uploaded_images.length} imagen(es) subida(s) exitosamente`);
        
        // Clear file input
        if (fileInput.value) {
            fileInput.value.value = '';
        }
        
        emit('images-updated', response.data.uploaded_images);
        
    } catch (error) {
        console.error('Error uploading images:', error);
        
        if (error.response?.data?.errors) {
            uploadErrors.value = Object.values(error.response.data.errors).flat();
        } else {
            uploadErrors.value = ['Error al subir las imágenes. Intenta de nuevo.'];
        }
        
        toast.error('Error al subir las imágenes');
    } finally {
        uploading.value = false;
        uploadProgress.value = 0;
    }
};

const confirmDelete = (image) => {
    imageToDelete.value = image;
    showDeleteModal.value = true;
};

const deleteImage = async () => {
    if (!imageToDelete.value) return;
    
    try {
        deletingImage.value = true;
        
        await api.delete(`/api/bikes/${props.bikeId}/images/${imageToDelete.value.image_id}/`);
        
        toast.success('Imagen eliminada exitosamente');
        
        showDeleteModal.value = false;
        imageToDelete.value = null;
        
        emit('images-updated', []);
        
    } catch (error) {
        console.error('Error deleting image:', error);
        toast.error('Error al eliminar la imagen');
    } finally {
        deletingImage.value = false;
    }
};

const setFeatured = async (image) => {
    try {
        settingFeatured.value = true;
        
        await api.put(`/api/bikes/${props.bikeId}/featured-image/`, {
            image_id: image.image_id
        });
        
        toast.success('Imagen principal actualizada');
        
        emit('images-updated', []);
        
    } catch (error) {
        console.error('Error setting featured image:', error);
        toast.error('Error al actualizar imagen principal');
    } finally {
        settingFeatured.value = false;
    }
};

const truncateFilename = (filename, maxLength = 20) => {
    if (filename.length <= maxLength) return filename;
    
    const extension = filename.split('.').pop();
    const name = filename.substring(0, filename.lastIndexOf('.'));
    const truncatedName = name.substring(0, maxLength - extension.length - 4);
    
    return `${truncatedName}...${extension}`;
};
</script>

<style scoped>
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
    padding: 1rem;
}

.modal-container {
    background: white;
    border-radius: 16px;
    width: 100%;
    max-width: 900px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem;
    border-bottom: 1px solid #e9ecef;
}

.modal-header h2 {
    color: #1a1a1a;
    font-weight: 700;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.modal-header h2 i {
    color: #dc3545;
}

.btn-close {
    background: none;
    border: none;
    color: #6c757d;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.2s ease;
}

.btn-close:hover {
    background: #f8f9fa;
    color: #dc3545;
}

.modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem 2rem;
}

.upload-section {
    margin-bottom: 2rem;
}

.upload-zone {
    border: 2px dashed #d1ecf1;
    border-radius: 12px;
    padding: 3rem 2rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    background: #f8fdff;
}

.upload-zone:hover:not(.uploading) {
    border-color: #17a2b8;
    background: #e1f7ff;
}

.upload-zone.drag-over {
    border-color: #dc3545;
    background: #fff5f5;
}

.upload-zone.uploading {
    cursor: not-allowed;
    opacity: 0.7;
}

.upload-content {
    color: #6c757d;
}

.upload-icon {
    font-size: 3rem;
    color: #17a2b8;
    margin-bottom: 1rem;
}

.upload-content h4 {
    color: #1a1a1a;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.upload-content p {
    margin-bottom: 0.5rem;
}

.upload-content small {
    color: #6c757d;
}

.uploading-content {
    color: #6c757d;
}

.uploading-content .spinner-border {
    margin-bottom: 1rem;
}

.progress {
    height: 8px;
    border-radius: 4px;
    background: #e9ecef;
    margin-top: 1rem;
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    background: linear-gradient(45deg, #17a2b8, #138496);
    transition: width 0.3s ease;
}

.upload-errors {
    margin-top: 1rem;
    padding: 1rem;
    background: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 8px;
}

.upload-errors h5 {
    color: #721c24;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.upload-errors ul {
    margin: 0;
    padding-left: 1.5rem;
}

.error-item {
    color: #721c24;
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
}

.images-section {
    margin-bottom: 2rem;
}

.images-section h4 {
    color: #1a1a1a;
    font-weight: 600;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.images-section h4 i {
    color: #dc3545;
}

.images-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
}

.image-item {
    background: white;
    border: 2px solid #e9ecef;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
}

.image-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.image-item.featured {
    border-color: #ffc107;
    box-shadow: 0 0 0 2px rgba(255, 193, 7, 0.2);
}

.image-wrapper {
    position: relative;
    aspect-ratio: 4/3;
    overflow: hidden;
}

.image-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.image-item:hover .image-wrapper img {
    transform: scale(1.05);
}

.image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.1) 0%,
        rgba(0, 0, 0, 0) 30%,
        rgba(0, 0, 0, 0) 70%,
        rgba(0, 0, 0, 0.7) 100%
    );
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 1rem;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.image-item:hover .image-overlay {
    opacity: 1;
}

.image-info {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0.5rem;
}

.file-size {
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 500;
}

.featured-label {
    background: rgba(255, 193, 7, 0.9);
    color: #1a1a1a;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.image-actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
}

.action-btn {
    background: rgba(255, 255, 255, 0.9);
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.9rem;
}

.action-btn:hover {
    background: white;
    transform: scale(1.1);
}

.feature-btn {
    color: #ffc107;
}

.feature-btn:hover {
    color: #e69500;
}

.delete-btn {
    color: #dc3545;
}

.delete-btn:hover {
    color: #c82333;
}

.action-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
}

.image-meta {
    padding: 0.75rem;
    background: #f8f9fa;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
}

.order-badge {
    background: #dc3545;
    color: white;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 600;
    flex-shrink: 0;
}

.filename {
    font-size: 0.8rem;
    color: #6c757d;
    font-weight: 500;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

.empty-images {
    text-align: center;
    padding: 3rem 2rem;
    color: #6c757d;
}

.empty-images i {
    font-size: 4rem;
    color: #e9ecef;
    margin-bottom: 1rem;
}

.empty-images h4 {
    color: #495057;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.modal-footer {
    padding: 1.5rem 2rem;
    border-top: 1px solid #e9ecef;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
}

.btn {
    padding: 0.75rem 1.25rem;
    border-radius: 8px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;
    border: 1px solid;
}

.btn-outline-secondary {
    background: white;
    color: #6c757d;
    border-color: #6c757d;
}

.btn-outline-secondary:hover {
    background: #6c757d;
    color: white;
}

.btn-primary {
    background: #dc3545;
    color: white;
    border-color: #dc3545;
}

.btn-primary:hover:not(:disabled) {
    background: #c82333;
    border-color: #bd2130;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Confirmation Modal Styles */
.confirmation-overlay {
    z-index: 10000;
}

.modal-box {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    width: 100%;
    max-width: 420px;
    text-align: center;
    box-shadow: 0 4px 40px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
}

.modal-icon {
    margin-bottom: 1rem;
}

.icon-circle {
    background-color: #fef2f2;
    color: #dc2626;
    border-radius: 9999px;
    width: 3.5rem;
    height: 3.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    margin: 0 auto;
}

.modal-title {
    font-weight: 700;
    font-size: 1.25rem;
    color: #111;
    margin-bottom: 0.25rem;
}

.modal-subtitle {
    font-size: 0.95rem;
    color: #6b7280;
    margin-bottom: 1.5rem;
    line-height: 1.5;
}

.modal-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
}

.cancel-btn {
    background: white;
    border: 1px solid #d1d5db;
    color: #111;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-weight: 600;
    transition: all 0.2s ease;
    cursor: pointer;
    display: flex;
    align-items: center;
}

.cancel-btn:hover {
    background-color: #f3f4f6;
}

.delete-btn {
    background-color: #dc2626;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    border: none;
    font-weight: 600;
    transition: all 0.2s ease;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 100px;
}

.delete-btn:hover:not(:disabled) {
    background-color: #b91c1c;
}

.delete-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.spinner-border-sm {
    width: 0.75rem;
    height: 0.75rem;
    border-width: 0.1em;
}

/* Transition Effects */
.fade-modal-enter-active,
.fade-modal-leave-active {
    transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-modal-enter-from,
.fade-modal-leave-to {
    opacity: 0;
    transform: scale(0.95);
}

.fade-modal-enter-to,
.fade-modal-leave-from {
    opacity: 1;
    transform: scale(1);
}

/* Responsive Design */
@media (max-width: 768px) {
    .modal-container {
        max-width: 95vw;
        max-height: 95vh;
    }
    
    .modal-header,
    .modal-body,
    .modal-footer {
        padding: 1rem;
    }
    
    .upload-zone {
        padding: 2rem 1rem;
    }
    
    .images-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
    }
    
    .modal-footer {
        flex-direction: column;
    }
    
    .btn {
        width: 100%;
        justify-content: center;
    }
}

@media (max-width: 480px) {
    .images-grid {
        grid-template-columns: 1fr 1fr;
    }
    
    .upload-zone {
        padding: 1.5rem 1rem;
    }
    
    .upload-icon {
        font-size: 2rem;
    }
}
</style>