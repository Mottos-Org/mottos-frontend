<template>
    <div class="create-marketplace-post" ref="pageContainer">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-10">
                    <div class="page-header" ref="pageHeader">
                        <h1>
                            <i :class="isEditing ? 'bi bi-pencil-square' : 'bi bi-plus-circle'"></i>
                            {{ isEditing ? 'Editar Producto' : 'Publicar en el Mercado' }}
                        </h1>
                        <p class="page-subtitle">
                            {{ isEditing ? 'Modifica los detalles de tu producto' : 'Completa los siguientes pasos para publicar tu producto' }}
                        </p>
                    </div>

                    <div class="progress-steps">
                        <div class="step" :class="{ active: currentStep === 1, completed: currentStep > 1 }">
                            <div class="step-number">1</div>
                            <div class="step-label">Detalles del Producto</div>
                        </div>
                        <div class="step-divider"></div>
                        <div class="step" :class="{ active: currentStep === 2, completed: currentStep > 2 }">
                            <div class="step-number">2</div>
                            <div class="step-label">Imágenes</div>
                        </div>
                        <div class="step-divider"></div>
                        <div class="step" :class="{ active: currentStep === 3, completed: currentStep > 3 }">
                            <div class="step-number">3</div>
                            <div class="step-label">Revisión</div>
                        </div>
                    </div>

                    <div v-if="isEditing && loadingPostData" class="loading-edit-data">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Cargando datos del producto...</span>
                        </div>
                        <p>Cargando datos del producto...</p>
                    </div>

                    <div v-else class="content-area">
                        <div v-if="currentStep === 1" class="step-content">
                            <MarketplaceDetails 
                                :form-data="marketplaceData"
                                :errors="errors"
                                :is-editing="isEditing"
                                @update-form="updateMarketplaceData"
                            />
                        </div>

                        <div v-if="currentStep === 2" class="step-content">
                            <ImageUpload 
                                :images="imageData.images"
                                :featured-index="imageData.featuredIndex"
                                :is-editing="isEditing"
                                :post-id="postId"
                                :is-marketplace="true"
                                @update-images="updateImageData"
                            />
                        </div>

                        <div v-if="currentStep === 3" class="step-content">
                            <MarketplaceReview 
                                :marketplace-data="marketplaceData"
                                :image-data="imageData"
                                :submitting="submitting"
                                :is-editing="isEditing"
                                @submit="handleSubmit"
                            />
                        </div>
                    </div>

                    <div class="navigation-buttons">
                        <button 
                            v-if="currentStep > 1" 
                            @click="previousStep" 
                            class="btn btn-outline-secondary"
                            :disabled="submitting"
                        >
                            <i class="bi bi-arrow-left"></i>
                            Anterior
                        </button>
                        
                        <button 
                            v-if="currentStep < 3" 
                            @click="nextStep" 
                            class="btn btn-primary"
                            :disabled="!canProceed"
                        >
                            Siguiente
                            <i class="bi bi-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../../../stores/authStore';
import api from '../../../services/api';

import MarketplaceDetails from '../../forms/marketplace/MarketplaceDetails.vue';
import ImageUpload from '../../forms/posts/ImageUpload.vue';
import MarketplaceReview from '../../forms/marketplace/MarketplaceReview.vue';

const props = defineProps({
    isEditing: {
        type: Boolean,
        default: false
    },
    postId: {
        type: [String, Number],
        default: null
    }
});

const router = useRouter();
const toast = useToast();
const auth = useAuthStore();

const pageContainer = ref(null);
const pageHeader = ref(null);
const currentStep = ref(1);
const loadingPostData = ref(false);
const submitting = ref(false);
const errors = ref({});

const marketplaceData = reactive({
    publicacion_titulo: '',
    publicacion_descripcion: '',
    precio: '',
    tipo_moneda_id: 1,
    negociable: false,
    category: '',
    fecha_vencimiento: '',
    ubicacion_id: null
});

const imageData = reactive({
    images: [],
    featuredIndex: null
});

document.title = props.isEditing ? 'Editar Producto - Mottos.com.do' : 'Publicar en el Mercado - Mottos.com.do';

const canProceed = computed(() => {
    switch (currentStep.value) {
        case 1:
            return (
                marketplaceData.publicacion_titulo &&
                marketplaceData.publicacion_descripcion &&
                marketplaceData.category &&
                marketplaceData.precio &&
                marketplaceData.fecha_vencimiento &&
                marketplaceData.ubicacion_id
            );
        case 2:
            return true;
        case 3:
            return true;
        default:
            return false;
    }
});

const loadPostData = async () => {
    if (!props.isEditing || !props.postId) return;
    
    try {
        loadingPostData.value = true;
        
        const postResponse = await api.get(`/api/marketplace/details/${props.postId}`);
        const post = postResponse.data.post;

        const ownerId = post?.user?.user_id ?? post?.user_id ?? null;
        const currentUserId = auth.userId ?? String(auth.user?.user_id ?? null);

        if (!ownerId) {
            toast.error('Producto inválido');
            router.replace('/mercado/publicaciones');
            return;
        }

        if (String(ownerId) !== String(currentUserId) && !auth.hasRole('Administrador')) {
            toast.error('No tienes permisos para editar este producto');
            router.replace('/mercado/publicaciones');
            return;
        }
        
        Object.assign(marketplaceData, {
            publicacion_titulo: post.publicacion_titulo,
            publicacion_descripcion: post.publicacion_descripcion,
            precio: post.precio,
            tipo_moneda_id: post.tipo_moneda_id,
            negociable: post.negociable,
            category: post.category,
            fecha_vencimiento: post.fecha_vencimiento.split('T')[0],
            ubicacion_id: post.ubicacion_id
        });
        
        const imagesResponse = await api.get(`/api/marketplace/${props.postId}/images`);
        
        if (imagesResponse.data.images?.length) {
            const existingImages = imagesResponse.data.images
                .sort((a, b) => a.display_order - b.display_order)
                .map(img => ({
                    image_id: img.image_id,
                    id: img.image_id,
                    filename: img.filename,
                    original_name: img.original_name || img.filename,
                    url: img.url,
                    file_size: img.file_size,
                    is_featured: img.is_featured,
                    display_order: img.display_order,
                    isExisting: true,
                    preview: img.url
                }));
            
            const featuredIndex = existingImages.findIndex(img => img.is_featured);
            
            Object.assign(imageData, {
                images: existingImages,
                featuredIndex: featuredIndex >= 0 ? featuredIndex : null
            });
        }
        
    } catch (error) {
        console.error('Error loading marketplace post data:', error);
        toast.error('Error al cargar los datos del producto');
        router.push('/mercado/publicaciones');
    } finally {
        loadingPostData.value = false;
    }
};

const scrollToTop = () => {
    if (pageHeader.value) {
        pageHeader.value.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    } else {
        window.scrollTo({ 
            top: 0, 
            behavior: 'smooth' 
        });
    }
};

const updateMarketplaceData = (newData) => {
    Object.assign(marketplaceData, newData);
};

const updateImageData = (newImageData) => {
    Object.assign(imageData, newImageData);
};

const nextStep = async () => {
    if (canProceed.value && currentStep.value < 3) {
        currentStep.value++;
        await nextTick();
        scrollToTop();
    }
};

const previousStep = async () => {
    if (currentStep.value > 1) {
        currentStep.value--;
        await nextTick();
        scrollToTop();
    }
};

const handleImageChanges = async (marketplaceId) => {
    try {
        const imagesToUpload = imageData.images.filter(img => !img.isExisting && img.file);
        const imagesToDelete = imageData.imagesToDelete || [];
        
        if (imagesToDelete.length > 0) {
            for (const imageId of imagesToDelete) {
                await api.delete(`/api/marketplace/${marketplaceId}/images/${imageId}`);
            }
        }
        
        if (imagesToUpload.length > 0) {
            const formData = new FormData();
            imagesToUpload.forEach(img => {
                formData.append('images[]', img.file);
            });
            formData.append('set_featured', '0');
            
            const uploadResponse = await api.post(`/api/marketplace/${marketplaceId}/images`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            if (imageData.featuredIndex !== null && uploadResponse.data.images) {
                const uploadedImages = uploadResponse.data.images;
                const newImageStartIndex = imageData.images.filter(img => img.isExisting).length;
                const featuredUploadedIndex = imageData.featuredIndex - newImageStartIndex;
                
                if (featuredUploadedIndex >= 0 && uploadedImages[featuredUploadedIndex]) {
                    await api.put(`/api/marketplace/${marketplaceId}/featured-image`, {
                        image_id: uploadedImages[featuredUploadedIndex].image_id
                    });
                }
            }
        } else if (imageData.featuredIndex !== null) {
            const featuredImage = imageData.images[imageData.featuredIndex];
            if (featuredImage?.image_id) {
                await api.put(`/api/marketplace/${marketplaceId}/featured-image`, {
                    image_id: featuredImage.image_id
                });
            }
        }
    } catch (error) {
        console.error('Error handling images:', error);
        throw error;
    }
};

const handleSubmit = async () => {
    try {
        submitting.value = true;
        errors.value = {};

        const payload = {
            publicacion_titulo: marketplaceData.publicacion_titulo,
            publicacion_descripcion: marketplaceData.publicacion_descripcion,
            precio: parseFloat(marketplaceData.precio),
            tipo_moneda_id: marketplaceData.tipo_moneda_id,
            negociable: marketplaceData.negociable,
            category: marketplaceData.category,
            fecha_vencimiento: marketplaceData.fecha_vencimiento,
            ubicacion_id: marketplaceData.ubicacion_id
        };

        let marketplaceId;
        
        if (props.isEditing) {
            await api.put(`/api/marketplace/${props.postId}`, payload);
            marketplaceId = props.postId;
            
            await handleImageChanges(marketplaceId);
            
            toast.success('¡Producto actualizado exitosamente!');
        } else {
            const response = await api.post('/api/marketplace/', payload);
            marketplaceId = response.data.post.publicacion_marketplace_id || response.data.post.id;
            
            if (imageData.images.length > 0) {
                await handleImageChanges(marketplaceId);
            }
            
            toast.success('¡Producto publicado exitosamente!');
        }
        
        router.push(`/mercado/publicaciones/${marketplaceId}`);
        
    } catch (error) {
        console.error(`Error ${props.isEditing ? 'updating' : 'creating'} marketplace post:`, error);
        
        if (error.response?.data?.message) {
            toast.error(error.response.data.message);
        } else if (error.response?.data?.errors) {
            errors.value = error.response.data.errors;
            toast.error('Por favor corrige los errores en el formulario');
        } else {
            toast.error(`Error al ${props.isEditing ? 'actualizar' : 'crear'} el producto`);
        }
    } finally {
        submitting.value = false;
    }
};

onMounted(async () => {
    if (props.isEditing) {
        await loadPostData();
    }
});
</script>

<style scoped>
.create-marketplace-post {
    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    min-height: 100vh;
    padding: 3rem 0;
}

.page-header {
    text-align: center;
    margin-bottom: 3rem;
    color: white;
}

.page-header h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
}

.page-header h1 i {
    color: #dc3545;
}

.page-subtitle {
    font-size: 1.125rem;
    opacity: 0.9;
    color: #6c757d;
}

.progress-steps {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 3rem;
    flex-wrap: wrap;
    gap: 1rem;
}

.step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

.step-number {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #e9ecef;
    color: #6c757d;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    transition: all 0.3s ease;
}

.step.active .step-number {
    background: #dc3545;
    color: white;
    transform: scale(1.1);
}

.step.completed .step-number {
    background: #28a745;
    color: white;
}

.step-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #6c757d;
    text-align: center;
}

.step.active .step-label,
.step.completed .step-label {
    color: #1a1a1a;
}

.step-divider {
    width: 60px;
    height: 2px;
    background: #e9ecef;
}


.content-area {
    margin-bottom: 2rem;
}

.step-content {
    animation: fadeIn 0.3s ease;
}

.navigation-buttons .btn {
    background-color: #dc3545;
    border-color: #dc3545;
    color: white;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.navigation-buttons {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 16px;
}

.btn {
    padding: 0.75rem 1.5rem;
    border-radius: 10px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
}

.btn-primary {
    background: #dc3545;
    border-color: #dc3545;
    margin-left: auto;
}

.btn-primary:hover {
    background: #c82333;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
}

.loading-edit-data {
    text-align: center;
    padding: 4rem 2rem;
    background: white;
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.loading-edit-data p {
    margin-top: 1rem;
    color: #6c757d;
}

@media (max-width: 768px) {
    .page-header h1 {
        font-size: 1.75rem;
    }
    
    .progress-steps {
        flex-direction: column;
        gap: 1rem;
    }
    
    .step-divider {
        width: 2px;
        height: 30px;
        margin: 0;
    }
    
    .step-label {
        display: none;
    }
}
</style>