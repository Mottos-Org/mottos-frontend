<template>
    <div class="image-upload">
        <div class="section-header">
            <h3>
                <i class="bi bi-camera"></i>
                Imágenes de tu Moto
            </h3>
            <p>{{ isEditing ? 'Gestiona las imágenes de tu publicación' : 'Sube fotos de tu motocicleta para atraer más compradores' }}</p>
        </div>

        <div v-if="canAddMoreImages" class="upload-container">
            <div class="upload-zone" :class="{ 'drag-over': isDragOver }" @drop="handleDrop" @dragover.prevent="isDragOver = true" @dragleave.prevent="isDragOver = false">
                <div class="upload-content">
                    <i class="bi bi-cloud-upload upload-icon"></i>
                    <h4>{{ isEditing ? 'Agregar más fotos' : 'Arrastra tus fotos aquí' }}</h4>
                    <p>O haz clic para seleccionar archivos</p>
                    <button type="button" class="btn btn-primary" @click="triggerFileInput">
                        <i class="bi bi-plus-circle"></i>
                        {{ isEditing ? 'Agregar Imágenes' : 'Seleccionar Imágenes' }}
                    </button>
                    <input 
                        ref="fileInput" 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        @change="handleFileSelect" 
                        style="display: none;"
                    />
                </div>
            </div>

            <div class="upload-guidelines">
                <div class="guideline-item">
                    <i class="bi bi-check-circle text-success"></i>
                    <span>Máximo 8 imágenes</span>
                </div>
                <div class="guideline-item">
                    <i class="bi bi-check-circle text-success"></i>
                    <span>Formato: JPG, PNG, WEBP</span>
                </div>
                <div class="guideline-item">
                    <i class="bi bi-check-circle text-success"></i>
                    <span>Tamaño máximo: 5MB por imagen</span>
                </div>
            </div>
        </div>

        <div v-if="selectedImages.length > 0" class="images-preview">
            <div class="preview-header">
                <h4>
                    <i class="bi bi-images"></i>
                    {{ isEditing ? 'Imágenes de la Publicación' : 'Imágenes Seleccionadas' }} ({{ selectedImages.length }}/8)
                </h4>
                <button v-if="selectedImages.length > 0 && !isEditing" @click="clearAllImages" class="btn btn-outline-danger btn-sm">
                    <i class="bi bi-trash"></i>
                    Limpiar Todo
                </button>
            </div>

            <div class="images-grid">
                <div 
                    v-for="(image, index) in selectedImages" 
                    :key="image.id || index" 
                    class="image-item"
                    :class="{ 'featured': featuredImageIndex === index, 'existing': image.isExisting }"
                >
                    <div class="image-container">
                        <img :src="image.preview" :alt="`Imagen ${index + 1}`" />
                        
                        <div class="image-overlay">
                            <div class="image-actions">
                                <button 
                                    @click="setFeaturedImage(index)" 
                                    class="btn btn-sm btn-warning"
                                    :class="{ 'active': featuredImageIndex === index }"
                                    title="Imagen principal"
                                >
                                    <i class="bi bi-star-fill"></i>
                                </button>
                                <button 
                                    @click="removeImage(index)" 
                                    class="btn btn-sm btn-danger"
                                    title="Eliminar imagen"
                                >
                                    <i class="bi bi-trash-fill"></i>
                                </button>
                            </div>
                        </div>

                        <div v-if="featuredImageIndex === index" class="featured-badge">
                            <i class="bi bi-star-fill"></i>
                            <span>Principal</span>
                        </div>

                        <!-- ✅ NEW: Show existing image badge -->
                        <div v-if="image.isExisting" class="existing-badge">
                            <i class="bi bi-cloud-check-fill"></i>
                            <span>Guardada</span>
                        </div>
                    </div>

                    <!-- ✅ FIXED: Handle both new files and existing images -->
                    <div class="image-info">
                        <div class="image-name">{{ getImageName(image) }}</div>
                        <div class="image-size">{{ getImageSize(image) }}</div>
                    </div>
                </div>
            </div>

            <div v-if="featuredImageIndex === null && selectedImages.length > 0" class="featured-reminder">
                <div class="reminder-card">
                    <i class="bi bi-info-circle text-warning"></i>
                    <div>
                        <strong>Selecciona una imagen principal</strong>
                        <p>Haz clic en la estrella ⭐ de la imagen que quieres destacar</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import api from '../../../services/api';
import { useToast } from 'vue-toastification';

const props = defineProps({
    images: {
        type: Array,
        default: () => []
    },
    featuredIndex: {
        type: Number,
        default: null
    },
    isEditing: {
        type: Boolean,
        default: false
    },
    postId: {
        type: [String, Number],
        default: null
    }
});

const emit = defineEmits(['update-images']);

const toast = useToast();
const fileInput = ref(null);
const isDragOver = ref(false);
const selectedImages = ref([]);
const featuredImageIndex = ref(props.featuredIndex);

const maxImages = 8;
const maxFileSize = 5 * 1024 * 1024; // 5MB

const canAddMoreImages = computed(() => selectedImages.value.length < maxImages);

onMounted(() => {
    if (props.images && props.images.length > 0) {
        selectedImages.value = props.images.map(img => ({
            id: img.image_id || img.id,
            file: null, // No file for existing images
            preview: img.url,
            isExisting: true,
            filename: img.filename || img.original_name,
            original_name: img.original_name,
            file_size: img.file_size
        }));
        
        featuredImageIndex.value = props.featuredIndex;
        console.log('Initialized with existing images:', selectedImages.value);
    }
});

watch(() => props.images, (newImages) => {
    if (newImages && newImages.length > 0 && selectedImages.value.length === 0) {
        selectedImages.value = newImages.map(img => ({
            id: img.image_id || img.id,
            file: null,
            preview: img.url,
            isExisting: true,
            filename: img.filename || img.original_name,
            original_name: img.original_name,
            file_size: img.file_size
        }));
        
        featuredImageIndex.value = props.featuredIndex;
        console.log('Updated with new props images:', selectedImages.value);
    }
}, { immediate: true });

const getImageName = (image) => {
    if (image.file && image.file.name) {
        return image.file.name;
    }
    if (image.original_name) {
        return image.original_name;
    }
    if (image.filename) {
        return image.filename;
    }
    return `Imagen ${selectedImages.value.indexOf(image) + 1}`;
};

const getImageSize = (image) => {
    if (image.file && image.file.size) {
        return formatFileSize(image.file.size);
    }
    if (image.file_size) {
        return image.file_size; // Already formatted from server
    }
    return 'Tamaño desconocido';
};

const triggerFileInput = () => {
    fileInput.value?.click();
};

const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    processFiles(files);
    event.target.value = ''; // Reset input
};

const handleDrop = (event) => {
    event.preventDefault();
    isDragOver.value = false;
    
    const files = Array.from(event.dataTransfer.files);
    processFiles(files);
};

const processFiles = (files) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
        toast.error('Por favor selecciona solo archivos de imagen');
        return;
    }

    const remainingSlots = maxImages - selectedImages.value.length;
    const filesToProcess = imageFiles.slice(0, remainingSlots);

    filesToProcess.forEach(file => {
        if (file.size > maxFileSize) {
            toast.error(`La imagen ${file.name} es muy grande (máximo 5MB)`);
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const imageData = {
                id: Date.now() + Math.random(), // Temporary ID for new images
                file: file,
                preview: e.target.result,
                isExisting: false // Mark as new image
            };
            
            selectedImages.value.push(imageData);
            
            // Set as featured if it's the first image and no featured image exists
            if (selectedImages.value.length === 1 && featuredImageIndex.value === null) {
                setFeaturedImage(0);
            }
            
            emitUpdate();
        };
        reader.readAsDataURL(file);
    });

    if (filesToProcess.length < imageFiles.length) {
        toast.warning(`Solo se pudieron agregar ${filesToProcess.length} imágenes (máximo ${maxImages})`);
    }
};

const removeImage = async (index) => {
    const image = selectedImages.value[index];
    
    // If editing and image is existing, delete from server
    if (props.isEditing && image.isExisting && image.id) {
        try {
            await api.delete(`/api/publicaciones/${props.postId}/images/${image.id}`);
            toast.success('Imagen eliminada del servidor');
        } catch (error) {
            console.error('Error deleting image:', error);
            toast.error('Error al eliminar la imagen del servidor');
            return; // Don't remove from local array if server delete failed
        }
    }
    
    // Remove from local array
    selectedImages.value.splice(index, 1);
    
    // Adjust featured index
    if (featuredImageIndex.value === index) {
        featuredImageIndex.value = selectedImages.value.length > 0 ? 0 : null;
    } else if (featuredImageIndex.value > index) {
        featuredImageIndex.value--;
    }
    
    emitUpdate();
};

const setFeaturedImage = (index) => {
    featuredImageIndex.value = index;
    console.log(`Featured image set to index: ${index} (1-based: ${index + 1})`);
    emitUpdate();
};

const clearAllImages = () => {
    if (confirm('¿Estás seguro de que quieres eliminar todas las imágenes?')) {
        selectedImages.value = [];
        featuredImageIndex.value = null;
        emitUpdate();
    }
};

const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const emitUpdate = () => {
    const updateData = {
        images: selectedImages.value,
        featuredIndex: featuredImageIndex.value
    };
    
    console.log('Emitting image update:', updateData);
    emit('update-images', updateData);
};
</script>

<style scoped>
.image-upload {
    padding: 0;
}

.section-header {
    text-align: center;
    margin-bottom: 2.5rem;
}

.section-header h3 {
    color: #1a1a1a;
    font-weight: 700;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-size: 1.5rem;
}

.section-header h3 i {
    color: #dc3545;
}

.section-header p {
    color: #6c757d;
    margin: 0;
    font-size: 1rem;
}

.upload-container {
    margin-bottom: 2rem;
}

.upload-zone {
    border: 2px dashed #dee2e6;
    border-radius: 12px;
    padding: 3rem 2rem;
    text-align: center;
    background: #f8f9fa;
    transition: all 0.3s ease;
    cursor: pointer;
}

.upload-zone:hover,
.upload-zone.drag-over {
    border-color: #dc3545;
    background: rgba(220, 53, 69, 0.05);
}

.upload-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.upload-icon {
    font-size: 3rem;
    color: #6c757d;
}

.upload-zone:hover .upload-icon,
.upload-zone.drag-over .upload-icon {
    color: #dc3545;
}

.upload-content h4 {
    color: #1a1a1a;
    margin: 0;
}

.upload-content p {
    color: #6c757d;
    margin: 0;
}

.upload-guidelines {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 1.5rem;
    flex-wrap: wrap;
}

.guideline-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: #495057;
}

.images-preview {
    background: white;
    border: 1px solid #e9ecef;
    border-radius: 12px;
    padding: 1.5rem;
}

.preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
}

.preview-header h4 {
    color: #1a1a1a;
    font-weight: 600;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.preview-header h4 i {
    color: #dc3545;
}

.images-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
}

.image-item {
    position: relative;
    border: 2px solid #e9ecef;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
}

.image-item:hover {
    border-color: #dc3545;
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(220, 53, 69, 0.15);
}

.image-item.featured {
    border-color: #ffc107;
    box-shadow: 0 4px 20px rgba(255, 193, 7, 0.3);
}

/* ✅ NEW: Styles for existing images */
.image-item.existing {
    border-color: #17a2b8;
}

.existing-badge {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: #17a2b8;
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.75rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    box-shadow: 0 2px 8px rgba(23, 162, 184, 0.4);
}

.image-container {
    position: relative;
    aspect-ratio: 4/3;
    overflow: hidden;
}

.image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.image-item:hover .image-overlay {
    opacity: 1;
}

.image-actions {
    display: flex;
    gap: 0.5rem;
}

.image-actions .btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
}

.featured-badge {
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    background: #ffc107;
    color: #212529;
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.75rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    box-shadow: 0 2px 8px rgba(255, 193, 7, 0.4);
}

.image-info {
    padding: 1rem;
    background: #f8f9fa;
}

.image-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 0.25rem;
    word-break: break-all;
}

.image-size {
    font-size: 0.75rem;
    color: #6c757d;
}

.featured-reminder {
    margin-top: 1.5rem;
}

.reminder-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: rgba(255, 193, 7, 0.1);
    border: 1px solid rgba(255, 193, 7, 0.3);
    border-radius: 8px;
    padding: 1rem;
}

.reminder-card i {
    font-size: 1.5rem;
    flex-shrink: 0;
}

.reminder-card strong {
    color: #856404;
}

.reminder-card p {
    margin: 0.25rem 0 0 0;
    color: #6c757d;
    font-size: 0.9rem;
}

.btn-primary {
    background: #dc3545;
    border-color: #dc3545;
}

.btn-primary:hover {
    background: #c82333;
    border-color: #c82333;
}

@media (max-width: 768px) {
    .upload-zone {
        padding: 2rem 1rem;
    }
    
    .upload-guidelines {
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
    }
    
    .images-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
    }
    
    .preview-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
    }
    
    .preview-header h4 {
        font-size: 1rem;
    }
}
</style>