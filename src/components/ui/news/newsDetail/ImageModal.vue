<template>
    <teleport to="body">
        <transition name="modal-fade">
            <div v-if="show" class="image-modal-overlay" @click="$emit('close')">
                <div class="image-modal-container" @click.stop>
                    <button class="modal-close-btn" @click="$emit('close')">
                        <i class="bi bi-x-lg"></i>
                    </button>

                    <button 
                        v-if="images.length > 1" 
                        class="modal-nav-btn prev-btn" 
                        @click="previousImage"
                        :disabled="currentIndex === 0"
                    >
                        <i class="bi bi-chevron-left"></i>
                    </button>
                    
                    <button 
                        v-if="images.length > 1" 
                        class="modal-nav-btn next-btn" 
                        @click="nextImage"
                        :disabled="currentIndex === images.length - 1"
                    >
                        <i class="bi bi-chevron-right"></i>
                    </button>

                    <div class="modal-image-wrapper">
                        <transition name="image-slide" mode="out-in">
                            <img 
                                :key="currentIndex"
                                :src="images[currentIndex]?.src" 
                                :alt="images[currentIndex]?.alt"
                                class="modal-image"
                            />
                        </transition>
                        
                        <div v-if="images.length > 1" class="image-counter">
                            {{ currentIndex + 1 }} / {{ images.length }}
                        </div>
                    </div>

                    <div v-if="images.length > 1" class="modal-thumbnails">
                        <div 
                            v-for="(image, index) in images" 
                            :key="index"
                            class="modal-thumbnail"
                            :class="{ active: currentIndex === index }"
                            @click="$emit('update:currentIndex', index)"
                        >
                            <img :src="image.src" :alt="`Thumbnail ${index + 1}`" />
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </teleport>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    images: {
        type: Array,
        default: () => []
    },
    currentIndex: {
        type: Number,
        default: 0
    }
});

const emit = defineEmits(['close', 'update:currentIndex']);

const nextImage = () => {
    if (props.currentIndex < props.images.length - 1) {
        emit('update:currentIndex', props.currentIndex + 1);
    }
};

const previousImage = () => {
    if (props.currentIndex > 0) {
        emit('update:currentIndex', props.currentIndex - 1);
    }
};

const handleKeydown = (event) => {
    if (!props.show) return;
    
    switch (event.key) {
        case 'Escape':
            emit('close');
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
});
</script>

<style scoped>
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
    backdrop-filter: blur(10px);
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
    .image-modal-container {
        width: 100%;
        height: 100%;
    }
    
    .modal-image-wrapper {
        margin: 60px 10px 10px 10px;
    }
    
    .modal-nav-btn {
        width: 45px;
        height: 45px;
        font-size: 18px;
    }
    
    .prev-btn {
        left: 10px;
    }
    
    .next-btn {
        right: 10px;
    }
    
    .modal-close-btn {
        top: 15px;
        right: 15px;
        width: 40px;
        height: 40px;
    }
    
    .modal-thumbnails {
        padding: 15px 10px;
    }
    
    .modal-thumbnail {
        width: 50px;
        height: 38px;
    }
}

@media (hover: none) and (pointer: coarse) {
    .enlarge-hint {
        display: none;
    }
}
</style>