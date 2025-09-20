<template>
    <div class="form-section">
        <h3>
            <i class="bi bi-images"></i>
            Imágenes
        </h3>
        
        <div class="image-group">
            <h4>Imagen Destacada</h4>
            <div class="image-upload-area">
                <input
                    type="file"
                    ref="featuredImageInput"
                    @change="handleFeaturedImageChange"
                    accept="image/*"
                    class="d-none"
                >
                
                <div v-if="currentFeaturedImage && !newFeaturedImagePreview" class="current-image-preview">
                    <img :src="currentFeaturedImage" alt="Imagen destacada actual" class="preview-img">
                    <div class="image-actions">
                        <button type="button" @click="$refs.featuredImageInput.click()" class="btn btn-sm btn-outline-primary">
                            <i class="bi bi-pencil"></i>
                            Cambiar
                        </button>
                    </div>
                    <div class="image-status">
                        <span class="badge bg-success">Imagen actual</span>
                    </div>
                </div>
                
                <div v-else-if="newFeaturedImagePreview" class="image-preview">
                    <img :src="newFeaturedImagePreview" alt="Nueva imagen destacada" class="preview-img">
                    <div class="image-actions">
                        <button type="button" @click="$refs.featuredImageInput.click()" class="btn btn-sm btn-outline-primary">
                            <i class="bi bi-pencil"></i>
                            Cambiar
                        </button>
                        <button type="button" @click="removeFeaturedImage" class="btn btn-sm btn-outline-danger">
                            <i class="bi bi-arrow-counterclockwise"></i>
                            Restaurar
                        </button>
                    </div>
                    <div class="image-status">
                        <span class="badge bg-warning">Nueva imagen</span>
                    </div>
                </div>
                
                <div v-else class="upload-placeholder" @click="$refs.featuredImageInput.click()">
                    <i class="bi bi-cloud-upload"></i>
                    <p>Haz clic para subir imagen destacada</p>
                    <small>JPG, PNG, WebP - Máximo 5MB</small>
                </div>
            </div>
            <div v-if="errors.featured_image" class="text-danger small mt-1">
                {{ errors.featured_image }}
            </div>
        </div>

        <div class="image-group">
            <h4>Galería de Imágenes</h4>
            
            <div v-if="currentGalleryImages.length > 0" class="current-gallery">
                <h5>Imágenes actuales</h5>
                <div class="gallery-previews">
                    <div v-for="(image, index) in currentGalleryImages" :key="'current-' + index" class="gallery-item">
                        <img :src="image" :alt="`Galería actual ${index + 1}`" class="gallery-img">
                        <div class="image-status">
                            <span class="badge bg-success">Actual</span>
                        </div>
                        <button 
                            type="button" 
                            @click="removeCurrentGalleryImage(image)" 
                            class="btn btn-sm btn-danger remove-btn"
                            :class="{ 'marked-for-removal': removedGalleryImages.includes(image) }"
                        >
                            <i class="bi bi-trash"></i>
                        </button>
                        <div v-if="removedGalleryImages.includes(image)" class="removal-overlay">
                            <span>Se eliminará</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="new-gallery">
                <div class="gallery-upload-area">
                    <input
                        type="file"
                        ref="galleryImagesInput"
                        @change="handleGalleryImagesChange"
                        accept="image/*"
                        multiple
                        class="d-none"
                    >
                    <div class="upload-placeholder" @click="$refs.galleryImagesInput.click()">
                        <i class="bi bi-plus-circle"></i>
                        <p>Agregar nuevas imágenes a la galería</p>
                        <small>Puedes seleccionar múltiples imágenes</small>
                    </div>
                </div>
                
                <div v-if="newGalleryPreviews.length > 0" class="new-gallery-section">
                    <h5>Nuevas imágenes</h5>
                    <div class="gallery-previews">
                        <div v-for="(preview, index) in newGalleryPreviews" :key="'new-' + index" class="gallery-item">
                            <img :src="preview.url" :alt="`Nueva galería ${index + 1}`" class="gallery-img">
                            <div class="image-status">
                                <span class="badge bg-warning">Nueva</span>
                            </div>
                            <button type="button" @click="removeNewGalleryImage(index)" class="btn btn-sm btn-danger remove-btn">
                                <i class="bi bi-x"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useToast } from 'vue-toastification';

const props = defineProps({
    featuredImage: {
        type: File,
        default: null
    },
    galleryImages: {
        type: Array,
        default: () => []
    },
    currentFeaturedImage: {
        type: String,
        default: null
    },
    currentGalleryImages: {
        type: Array,
        default: () => []
    },
    removedGalleryImages: {
        type: Array,
        default: () => []
    },
    errors: {
        type: Object,
        default: () => ({})
    }
});

const emit = defineEmits(['update:featuredImage', 'update:galleryImages', 'remove:galleryImage']);

const toast = useToast();
const newFeaturedImagePreview = ref(null);
const newGalleryPreviews = ref([]);

const currentGalleryImages = computed(() => {
    return props.currentGalleryImages.filter(image => !props.removedGalleryImages.includes(image));
});

const handleFeaturedImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        if (file.size > 5 * 1024 * 1024) {
            toast.error('La imagen no puede ser mayor a 5MB');
            return;
        }
        
        emit('update:featuredImage', file);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            newFeaturedImagePreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};

const removeFeaturedImage = () => {
    emit('update:featuredImage', null);
    newFeaturedImagePreview.value = null;
};

const handleGalleryImagesChange = (event) => {
    const files = Array.from(event.target.files);
    const newGalleryImages = [...props.galleryImages];
    
    files.forEach(file => {
        if (file.size > 5 * 1024 * 1024) {
            toast.error(`La imagen ${file.name} es muy grande (máximo 5MB)`);
            return;
        }
        
        newGalleryImages.push(file);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            newGalleryPreviews.value.push({
                file: file,
                url: e.target.result
            });
        };
        reader.readAsDataURL(file);
    });
    
    emit('update:galleryImages', newGalleryImages);
};

const removeCurrentGalleryImage = (imageUrl) => {
    emit('remove:galleryImage', imageUrl);
};

const removeNewGalleryImage = (index) => {
    newGalleryPreviews.value.splice(index, 1);
    const newGalleryImages = [...props.galleryImages];
    newGalleryImages.splice(index, 1);
    emit('update:galleryImages', newGalleryImages);
};
</script>

<style scoped>
.form-section {
    padding: 2rem;
    border-bottom: 1px solid #eee;
}

.current-image-preview, .image-preview {
    position: relative;
    padding: 1rem;
}

.image-status {
    position: absolute;
    top: 1rem;
    left: 1rem;
}

.gallery-item {
    position: relative;
}

.gallery-item.marked-for-removal {
    opacity: 0.5;
}

.removal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(220, 53, 69, 0.8);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    border-radius: 8px;
}

.new-gallery-section {
    margin-top: 2rem;
}

.new-gallery-section h5 {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 1rem;
}

.form-section {
    padding: 2rem;
    border-bottom: 1px solid #eee;
}

.form-section h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.form-section h3 i {
    color: #dc3545;
}

.image-group {
    margin-bottom: 2rem;
}

.image-group h4 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 1rem;
}

.image-upload-area, .gallery-upload-area {
    border: 2px dashed #dee2e6;
    border-radius: 12px;
    transition: all 0.3s ease;
}

.image-upload-area:hover, .gallery-upload-area:hover {
    border-color: #dc3545;
    background: rgba(220, 53, 69, 0.02);
}

.upload-placeholder {
    padding: 3rem;
    text-align: center;
    cursor: pointer;
    color: #6c757d;
}

.upload-placeholder i {
    font-size: 3rem;
    color: #dc3545;
    margin-bottom: 1rem;
}

.upload-placeholder p {
    font-size: 1.1rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: #1a1a1a;
}

.image-preview {
    position: relative;
    padding: 1rem;
}

.preview-img {
    width: 100%;
    max-width: 400px;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.image-actions {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    display: flex;
    gap: 0.5rem;
}

.btn {
    padding: 0.375rem 0.75rem;
    border-radius: 6px;
    font-weight: 500;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
}

.gallery-previews {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
    padding: 1rem;
}

.gallery-item {
    position: relative;
    aspect-ratio: 1;
}

.gallery-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.remove-btn {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
}

@media (max-width: 768px) {
    .form-section {
        padding: 1.5rem;
    }
    
    .gallery-previews {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 0.75rem;
    }
    
    .upload-placeholder {
        padding: 2rem;
    }
    
    .upload-placeholder i {
        font-size: 2rem;
    }
}
</style>