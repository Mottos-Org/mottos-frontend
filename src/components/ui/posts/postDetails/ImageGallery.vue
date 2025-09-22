<template>
    <div class="image-gallery">
        <div v-if="loading" class="gallery-loading">
            <div class="loading-content">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando imágenes...</span>
                </div>
                <p>Cargando imágenes...</p>
            </div>
        </div>

        <div v-else-if="!images.length" class="no-images-state">
            <div class="no-images-content">
                <i class="bi bi-camera"></i>
                <h4>Sin imágenes disponibles</h4>
                <p>Esta publicación no tiene imágenes cargadas</p>
                <div v-if="isNegotiable" class="negotiable-badge">
                    Negociable
                </div>
            </div>
        </div>

        <template v-else>
            <div class="main-image" @click="openModal">
                <img :src="currentImage" :alt="title" />
                <div v-if="isNegotiable" class="negotiable-badge">
                    Negociable
                </div>
                <div class="enlarge-hint">
                    <i class="bi bi-arrows-fullscreen"></i>
                    <span>Click para ampliar</span>
                </div>
            </div>
            
            <div v-if="images.length > 1" class="image-thumbnails">
                <div 
                    v-for="(image, index) in images" 
                    :key="index"
                    class="thumbnail"
                    :class="{ active: currentImageIndex === index }"
                    @click="$emit('imageSelected', index)"
                >
                    <img :src="image" :alt="`Imagen ${index + 1}`" />
                </div>
            </div>
            
            <div v-else class="single-image-indicator">
                <span class="image-counter">
                    <i class="bi bi-image"></i>
                    1 imagen
                </span>
            </div>
        </template>
    </div>

    <teleport to="body">
        <transition name="modal-fade">
            <div v-if="showModal && images.length" class="image-modal-overlay" @click="closeModal">
                <div class="image-modal-container" @click.stop>
                    <button class="modal-close-btn" @click="closeModal">
                        <i class="bi bi-x-lg"></i>
                    </button>

                    <button 
                        v-if="images.length > 1" 
                        class="modal-nav-btn prev-btn" 
                        @click="previousImage"
                        :disabled="currentModalIndex === 0"
                    >
                        <i class="bi bi-chevron-left"></i>
                    </button>
                    
                    <button 
                        v-if="images.length > 1" 
                        class="modal-nav-btn next-btn" 
                        @click="nextImage"
                        :disabled="currentModalIndex === images.length - 1"
                    >
                        <i class="bi bi-chevron-right"></i>
                    </button>

                    <div class="modal-image-wrapper">
                        <transition name="image-slide" mode="out-in">
                            <img 
                                :key="currentModalIndex"
                                :src="images[currentModalIndex]" 
                                :alt="`${title} - Imagen ${currentModalIndex + 1}`"
                                class="modal-image"
                            />
                        </transition>
                        
                        <div v-if="images.length > 1" class="image-counter">
                            {{ currentModalIndex + 1 }} / {{ images.length }}
                        </div>
                    </div>

                    <div v-if="images.length > 1" class="modal-thumbnails">
                        <div 
                            v-for="(image, index) in images" 
                            :key="index"
                            class="modal-thumbnail"
                            :class="{ active: currentModalIndex === index }"
                            @click="currentModalIndex = index"
                        >
                            <img :src="image" :alt="`Thumbnail ${index + 1}`" />
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </teleport>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
    images: {
        type: Array,
        required: true
    },
    currentImageIndex: {
        type: Number,
        default: 0
    },
    title: {
        type: String,
        default: ''
    },
    isNegotiable: {
        type: Boolean,
        default: false
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['imageSelected']);
const showModal = ref(false);
const currentModalIndex = ref(0);

const currentImage = computed(() => {
    if (!props.images.length) return '';
    return props.images[props.currentImageIndex] || props.images[0];
});

const openModal = () => {
    if (!props.images.length) return;
    
    currentModalIndex.value = props.currentImageIndex;
    showModal.value = true;
    document.body.style.overflow = 'hidden';
};

const closeModal = () => {
    showModal.value = false;
    document.body.style.overflow = '';
    emit('imageSelected', currentModalIndex.value);
};

const nextImage = () => {
    if (currentModalIndex.value < props.images.length - 1) {
        currentModalIndex.value++;
    }
};

const previousImage = () => {
    if (currentModalIndex.value > 0) {
        currentModalIndex.value--;
    }
};

const handleKeydown = (event) => {
    if (!showModal.value) return;
    
    switch (event.key) {
        case 'Escape':
            closeModal();
            break;
        case 'ArrowLeft':
            previousImage();
            break;
        case 'ArrowRight':
            nextImage();
            break;
    }
};

onMounted(() => {
    document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown);
    document.body.style.overflow = '';
});
</script>

<style scoped>
.image-gallery {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.gallery-loading {
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8f9fa;
}

.loading-content {
    text-align: center;
    color: #6c757d;
}

.loading-content p {
    margin-top: 1rem;
    font-size: 14px;
}

.no-images-state {
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    position: relative;
}

.no-images-content {
    text-align: center;
    color: #6c757d;
    padding: 2rem;
}

.no-images-content i {
    font-size: 4rem;
    color: #adb5bd;
    margin-bottom: 1rem;
}

.no-images-content h4 {
    color: #495057;
    margin-bottom: 0.5rem;
    font-weight: 600;
}

.no-images-content p {
    font-size: 14px;
    margin: 0;
}

.single-image-indicator {
    padding: 12px 16px;
    background: #f8f9fa;
    text-align: center;
}

.single-image-indicator .image-counter {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #6c757d;
    font-size: 14px;
    font-weight: 500;
}

.single-image-indicator .image-counter i {
    color: #dc3545;
}

.main-image {
    position: relative;
    height: 400px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s ease;
}

.main-image:hover {
    transform: scale(1.02);
}

.main-image:hover .enlarge-hint {
    opacity: 1;
}

.main-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.negotiable-badge {
    position: absolute;
    top: 16px;
    right: 16px;
    background: #dc3545;
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    z-index: 2;
}

.enlarge-hint {
    position: absolute;
    bottom: 16px;
    left: 16px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.image-thumbnails {
    display: flex;
    gap: 8px;
    padding: 16px;
    background: #f8f9fa;
    overflow-x: auto;
}

.thumbnail {
    width: 80px;
    height: 60px;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    border: 2px solid transparent;
    transition: border-color 0.2s;
    flex-shrink: 0;
}

.thumbnail.active {
    border-color: #dc3545;
}

.thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.image-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    cursor: pointer;
}

.image-modal-container {
    position: relative;
    width: 95%;
    height: 95%;
    max-width: 1200px;
    max-height: 900px;
    display: flex;
    flex-direction: column;
    cursor: default;
}

.modal-close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 45px;
    height: 45px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    transition: all 0.3s ease;
    z-index: 10;
}

.modal-close-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
}

.modal-nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 50px;
    height: 50px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    transition: all 0.3s ease;
    z-index: 10;
}

.modal-nav-btn:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-50%) scale(1.1);
}

.modal-nav-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.prev-btn {
    left: 20px;
}

.next-btn {
    right: 20px;
}

.modal-image-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    border-radius: 12px;
    margin: 80px 20px 20px 20px;
}

.modal-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.image-counter {
    position: absolute;
    top: 20px;
    left: 20px;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
}

.modal-thumbnails {
    display: flex;
    justify-content: center;
    gap: 8px;
    padding: 20px;
    overflow-x: auto;
}

.modal-thumbnail {
    width: 60px;
    height: 45px;
    border-radius: 6px;
    overflow: hidden;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.2s ease;
    flex-shrink: 0;
}

.modal-thumbnail.active {
    border-color: #dc3545;
}

.modal-thumbnail:hover {
    border-color: rgba(220, 53, 69, 0.6);
    transform: scale(1.05);
}

.modal-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.modal-fade-enter-active, .modal-fade-leave-active {
    transition: opacity 0.3s ease;
}

.modal-fade-enter-from, .modal-fade-leave-to {
    opacity: 0;
}

.image-slide-enter-active, .image-slide-leave-active {
    transition: all 0.3s ease;
}

.image-slide-enter-from {
    opacity: 0;
    transform: translateX(30px);
}

.image-slide-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}

@media (max-width: 768px) {
    .no-images-content {
        padding: 1.5rem;
    }
    
    .no-images-content i {
        font-size: 3rem;
    }
    
    .no-images-content h4 {
        font-size: 1.1rem;
    }
    
    .image-thumbnails {
        padding: 12px;
        gap: 6px;
    }
    
    .thumbnail {
        width: 70px;
        height: 50px;
    }
}
</style>