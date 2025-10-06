<template>
    <div class="create-publicacion-page" ref="pageContainer">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-10">
                    <div class="page-header" ref="pageHeader">
                        <h1>
                            <i :class="isEditing ? 'bi bi-pencil-square' : 'bi bi-plus-circle'"></i>
                            {{ isEditing ? 'Editar Publicación' : 'Publicar tu Moto' }}
                        </h1>
                        <p class="page-subtitle">
                            {{ isEditing ? 'Modifica los detalles de tu publicación' : 'Completa los siguientes pasos para publicar tu motocicleta' }}
                        </p>
                    </div>

                    <div class="progress-steps">
                        <div class="step" :class="{ active: currentStep === 1, completed: currentStep > 1 }">
                            <div class="step-number">1</div>
                            <div class="step-label">{{ isEditing ? 'Moto' : 'Seleccionar Moto' }}</div>
                        </div>
                        <div class="step-divider"></div>
                        <div class="step" :class="{ active: currentStep === 2, completed: currentStep > 2 }">
                            <div class="step-number">2</div>
                            <div class="step-label">Detalles de Venta</div>
                        </div>
                        <div class="step-divider"></div>
                        <div class="step" :class="{ active: currentStep === 3, completed: currentStep > 3 }">
                            <div class="step-number">3</div>
                            <div class="step-label">Imágenes</div>
                        </div>
                        <div class="step-divider"></div>
                        <div class="step" :class="{ active: currentStep === 4, completed: currentStep > 4 }">
                            <div class="step-number">4</div>
                            <div class="step-label">Revisión</div>
                        </div>
                    </div>

                    <div v-if="isEditing && loadingPostData" class="loading-edit-data">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Cargando datos de la publicación...</span>
                        </div>
                        <p>Cargando datos de la publicación...</p>
                    </div>

                    <div v-else class="content-area">
                        <div v-if="currentStep === 1" class="step-content">
                            <BikeSelection 
                                :user-bikes="userBikes"
                                :loading="loadingBikes"
                                :selected-bike="selectedBike"
                                :is-editing="isEditing"
                                @bike-selected="handleBikeSelected"
                                @create-new-bike="showCreateBikeModal = true"
                            />
                        </div>

                        <div v-if="currentStep === 2" class="step-content">
                            <PublicacionDetails 
                                :form-data="publicacionData"
                                :errors="errors"
                                :loading="loadingOptions"
                                :is-editing="isEditing"
                                @update-form="updatePublicacionData"
                            />
                        </div>

                        <div v-if="currentStep === 3" class="step-content">
                            <ImageUpload 
                                :images="imageData.images"
                                :featured-index="imageData.featuredIndex"
                                :is-editing="isEditing"
                                :post-id="postId"
                                @update-images="updateImageData"
                            />
                        </div>

                        <div v-if="currentStep === 4" class="step-content">
                            <PublicacionReview 
                                :selected-bike="selectedBike"
                                :publicacion-data="publicacionData"
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
                            v-if="currentStep < 4" 
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

        <CreateBikeModal 
            v-if="showCreateBikeModal"
            @close="showCreateBikeModal = false"
            @bike-created="handleBikeCreated"
        />
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../../../stores/authStore';
import api from '../../../services/api';

import BikeSelection from '../../forms/posts/BikeSelection.vue';
import PublicacionDetails from '../../forms/posts/PublicacionDetails.vue';
import ImageUpload from '../../forms/posts/ImageUpload.vue';
import PublicacionReview from '../../forms/posts/PublicacionReview.vue';
import CreateBikeModal from '../../forms/bikes/CreateBikeModal.vue';

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
const route = useRoute();
const toast = useToast();
const auth = useAuthStore();

const pageContainer = ref(null);
const pageHeader = ref(null);
const currentStep = ref(1);
const showCreateBikeModal = ref(false);
const loadingBikes = ref(true);
const loadingOptions = ref(false);
const loadingPostData = ref(false);
const submitting = ref(false);
const userBikes = ref([]);
const selectedBike = ref(null);
const errors = ref({});

const publicacionData = reactive({
    descripcion: '',
    condicion_id: null,
    fecha_vencimiento: '',
    ubicacion_id: null,
    recorrido: '',
    unidad_metrica_id: 1,
    negociable: false,
    precio: '',
    tipo_moneda_id: 1
});

const imageData = reactive({
    images: [],
    featuredIndex: null
});

document.title = props.isEditing ? 'Editar Publicación - Mottos.com.do' : 'Publicar tu Moto - Mottos.com.do';

const canProceed = computed(() => {
    switch (currentStep.value) {
        case 1:
            return selectedBike.value !== null;
        case 2:
            return (
                publicacionData.descripcion &&
                publicacionData.condicion_id &&
                publicacionData.fecha_vencimiento &&
                publicacionData.ubicacion_id &&
                publicacionData.recorrido &&
                publicacionData.precio
            );
        case 3:
            return true; 
        case 4:
            return true;
        default:
            return false;
    }
});

const loadPostData = async () => {
    if (!props.isEditing || !props.postId) return;
    
    try {
        loadingPostData.value = true;
        
        const postResponse = await api.get(`/api/publicaciones/details/${props.postId}`);
        const post = postResponse.data.post;

        if (post.user.user_id !== auth.userId && !auth.hasRole('Administrador')) {
            toast.error('No tienes permisos para editar esta publicación');
            router.push('/motos/publicaciones');
            return;
        }
        
        Object.assign(publicacionData, {
            descripcion: post.descripcion,
            condicion_id: post.condicion_id,
            fecha_vencimiento: post.fecha_vencimiento.split('T')[0],
            ubicacion_id: post.ubicacion_id,
            recorrido: post.recorrido,
            unidad_metrica_id: post.unidad_metrica_id,
            negociable: post.negociable,
            precio: post.precio,
            tipo_moneda_id: post.tipo_moneda_id
        });
        
        selectedBike.value = post.bike;
        
        const imagesResponse = await api.get(`/api/publicaciones/${props.postId}/images`);
        console.log('Images API response:', imagesResponse.data);
        
        if (imagesResponse.data.images?.length) {
            // Sort images by display_order and map to correct format
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
                    display_order: img.display_order
                }));
            
            const featuredIndex = existingImages.findIndex(img => img.is_featured);
            
            console.log('Processed existing images:', existingImages);
            console.log('Featured index:', featuredIndex);
            
            Object.assign(imageData, {
                images: existingImages,
                featuredIndex: featuredIndex >= 0 ? featuredIndex : null
            });
        }
        
    } catch (error) {
        console.error('Error loading post data:', error);
        toast.error('Error al cargar los datos de la publicación');
        router.push('/motos/publicaciones');
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

const loadUserBikes = async () => {
    try {
        loadingBikes.value = true;
        const response = await api.get('/api/bikes/?per_page=50');
        userBikes.value = response.data.data;
    } catch (error) {
        console.error('Error loading user bikes:', error);
        toast.error('Error al cargar tus motos');
    } finally {
        loadingBikes.value = false;
    }
};

const handleBikeSelected = (bike) => {
    selectedBike.value = bike;
    console.log('Bike selected:', bike);
};

const handleBikeCreated = async (newBike) => {
    console.log('Received new bike data:', newBike);
    
    showCreateBikeModal.value = false;
    toast.success('Moto creada exitosamente');
    
    await loadUserBikes();
    
    if (newBike && newBike.bike_id) {
        const createdBike = userBikes.value.find(bike => bike.bike_id === newBike.bike_id);
        if (createdBike) {
            selectedBike.value = createdBike;
            console.log('Auto-selected newly created bike:', createdBike);
        } else {
            if (userBikes.value.length > 0) {
                selectedBike.value = userBikes.value[userBikes.value.length - 1];
                console.log('Selected last bike as fallback:', selectedBike.value);
            }
        }
    }
};

const updatePublicacionData = (newData) => {
    Object.assign(publicacionData, newData);
};

const updateImageData = (newImageData) => {
    Object.assign(imageData, newImageData);
    console.log('Images updated:', imageData);
};

const nextStep = async () => {
    if (canProceed.value && currentStep.value < 4) {
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

const handleSubmit = async () => {
    try {
        submitting.value = true;
        errors.value = {};

        const payload = {
            bike_id: selectedBike.value.bike_id,
            descripcion: publicacionData.descripcion,
            condicion_id: publicacionData.condicion_id,
            fecha_vencimiento: new Date(publicacionData.fecha_vencimiento).toISOString(),
            ubicacion_id: publicacionData.ubicacion_id,
            recorrido: publicacionData.recorrido,
            unidad_metrica_id: publicacionData.unidad_metrica_id,
            negociable: publicacionData.negociable,
            precio: parseFloat(publicacionData.precio),
            tipo_moneda_id: publicacionData.tipo_moneda_id
        };

        let publicacionId;
        
        if (props.isEditing) {
            console.log('Updating publicacion with payload:', payload);
            await api.put(`/api/publicaciones/${props.postId}`, payload);
            publicacionId = props.postId;
            toast.success('¡Publicación actualizada exitosamente!');
        } else {
            console.log('Creating publicacion with payload:', payload);
            const publicacionResponse = await api.post('/api/publicaciones/', payload);
            publicacionId = publicacionResponse.data.publicacion.publicacion_id;
            toast.success('¡Publicación creada exitosamente!');
        }

        await handleImageChanges(publicacionId);
        
        router.push(`/motos/publicacion/${publicacionId}`);
        
    } catch (error) {
        console.error(`Error ${props.isEditing ? 'updating' : 'creating'} publicacion:`, error);
        
        if (error.response?.data?.message) {
            toast.error(error.response.data.message);
        } else if (error.response?.data?.errors) {
            errors.value = error.response.data.errors;
            toast.error('Hay errores en el formulario');
        } else {
            toast.error(`Error al ${props.isEditing ? 'actualizar' : 'crear'} la publicación`);
        }
        
        await nextTick();
        scrollToTop();
    } finally {
        submitting.value = false;
    }
};

const handleImageChanges = async (publicacionId) => {
    if (!imageData.images.length) return;
    
    const newImages = imageData.images.filter(img => !img.isExisting && img.file);
    
    if (newImages.length > 0) {
        const formData = new FormData();
        
        newImages.forEach((imageItem, index) => {
            formData.append('images[]', imageItem.file);
        });
        
        try {
            await api.post(`/api/publicaciones/${publicacionId}/images`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        } catch (imageError) {
            console.error('Error uploading new images:', imageError);
            toast.warning('Error subiendo algunas imágenes');
        }
    }
    
    if (imageData.featuredIndex !== null) {
        const featuredImage = imageData.images[imageData.featuredIndex];
        if (featuredImage?.id) {
            try {
                await api.put(`/api/publicaciones/${publicacionId}/featured-image/`, {
                    image_id: featuredImage.id
                });
            } catch (featuredError) {
                console.error('Error setting featured image:', featuredError);
            }
        }
    }
};

const autoSelectBikeFromQuery = () => {
    const bikeIdFromQuery = route.query.bikeId;
    
    if (bikeIdFromQuery && userBikes.value.length > 0) {
        const found = userBikes.value.find(bike => String(bike.bike_id) === String(bikeIdFromQuery));
        if (found) {
            selectedBike.value = found;
        }
    }
};

onMounted(async () => {
    if (!auth.isLoggedIn) {
        router.push('/auth/login');
        return;
    }
    
    await loadUserBikes();
    autoSelectBikeFromQuery();
    
    if (props.isEditing) {
        await loadPostData();
    }
});

</script>

<style scoped>
.create-publicacion-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    padding: 2rem 0;
    scroll-behavior: smooth;
}

.page-header {
    text-align: center;
    margin-bottom: 3rem;
    scroll-margin-top: 2rem;
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
    font-size: 1.1rem;
    color: #6c757d;
    margin: 0;
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
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    margin-bottom: 2rem;
    overflow: hidden;
}

.step-content {
    padding: 2rem;
}

.navigation-buttons {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
}

.navigation-buttons .btn {
    background-color: #dc3545;
    border-color: #dc3545;
    color: white;
}

.btn {
    padding: 0.75rem 2rem;
    border-radius: 8px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    border: 2px solid transparent;
}

.btn-primary {
    background: #dc3545;
    color: white;
    border-color: #dc3545;
}

.btn-primary:hover:not(:disabled) {
    background: #c82333;
    border-color: #c82333;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(220, 53, 69, 0.3);
}

.btn-outline-secondary {
    background: transparent;
    color: #6c757d;
    border-color: #6c757d;
}

.btn-outline-secondary:hover:not(:disabled) {
    background: #6c757d;
    color: white;
    transform: translateY(-2px);
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.loading-edit-data {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3rem;
    color: #6c757d;
}

.loading-edit-data .spinner-border {
    width: 3rem;
    height: 3rem;
    margin-bottom: 1rem;
}

* {
    scroll-behavior: smooth;
}

@media (max-width: 768px) {
    .page-header h1 {
        font-size: 2rem;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .progress-steps {
        margin-bottom: 2rem;
    }
    
    .step-divider {
        width: 30px;
    }
    
    .step-content {
        padding: 1.5rem;
    }
    
    .navigation-buttons {
        flex-direction: column;
    }
    
    .btn {
        justify-content: center;
        width: 100%;
    }
    
    .page-header {
        scroll-margin-top: 1rem;
    }
}
</style>