<template>
    <div class="market-post-details-page">
        <div v-if="loading" class="loading-container">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
        </div>

        <div v-else-if="post" class="container-fluid">
            <div class="row">
                <div class="col-lg-8 col-md-12">
                    <ImageGallery
                        :images="postImages"
                        :current-image-index="currentImageIndex"
                        :title="post.publicacion_titulo"
                        :is-negotiable="post.negociable"
                        :loading="imagesLoading"
                        @image-selected="currentImageIndex = $event"
                    />

                    <div v-if="!post.approved" class="alert alert-warning">
                        <i class="bi bi-exclamation-triangle-fill me-2"></i>
                        Esta publicación está pendiente de aprobación por un administrador.
                    </div>

                    <MarketPostHeader
                        :title="post.publicacion_titulo"
                        :category="post.category"
                        :views-count="post.views_count"
                        :likes-count="post.likes_count"
                        :currency="post.tipo_moneda?.nombre_tipo_moneda"
                        :price="post.precio"
                        :is-negotiable="post.negociable"
                        :post-id="post.publicacion_marketplace_id"
                        :post-owner-id="post.user.user_id"
                        :is-favorited="isFavorited"
                        :favorite-count="favoriteCount"
                        @toggle-favorite="toggleFavorite"
                    />

                    <div class="description-section">
                        <h3><i class="bi bi-card-text me-2"></i>Descripción</h3>
                        <p class="description-text">{{ post.publicacion_descripcion }}</p>
                    </div>

                    <div class="category-section">
                        <h3><i class="bi bi-tag-fill me-2"></i>Información del Producto</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <span class="info-label">Categoría</span>
                                <span class="info-value">
                                    <span class="category-badge" :class="`category-${post.category}`">
                                        {{ getCategoryLabel(post.category) }}
                                    </span>
                                </span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Precio</span>
                                <span class="info-value price-value">
                                    {{ post.tipo_moneda?.nombre_tipo_moneda }} {{ formatPrice(post.precio) }}
                                    <span v-if="post.negociable" class="negotiable-tag">Negociable</span>
                                </span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Estado</span>
                                <span class="info-value">
                                    <span :class="post.is_active ? 'status-active' : 'status-inactive'">
                                        {{ post.is_active ? 'Activa' : 'Inactiva' }}
                                    </span>
                                </span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Publicada</span>
                                <span class="info-value">{{ formatDate(post.fecha_publicacion) }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Vence</span>
                                <span class="info-value">{{ formatExpiryDate(post.fecha_vencimiento) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4 col-md-12">
                    <SellerCard
                        :seller="post.user"
                        :location="getLocationSummary()"
                        :published-date="formatDate(post.created_at)"
                        :post-data="post"
                        :is-marketplace="true"
                    />

                    <LocationMap
                        v-if="post.ubicacion"
                        :location-data="post.ubicacion"
                        :location-items="locationItems"
                    />

                    <div class="stats-card">
                        <div class="stats-header">
                            <i class="bi bi-bar-chart-fill"></i>
                            <h5>Estadísticas</h5>
                        </div>
                        <div class="stats-list">
                            <div class="stat-item">
                                <i class="bi bi-eye-fill"></i>
                                <span>{{ post.views_count }} visualizaciones</span>
                            </div>
                            <div class="stat-item">
                                <i class="bi bi-heart-fill"></i>
                                <span>{{ favoriteCount }} me gusta</span>
                            </div>
                            <div class="stat-item">
                                <i class="bi bi-clock-fill"></i>
                                <span>Publicada {{ formatDate(post.fecha_publicacion) }}</span>
                            </div>
                            <div class="stat-item" :class="post.is_active ? 'text-success' : 'text-muted'">
                                <i class="bi bi-activity"></i>
                                <span>{{ post.is_active ? 'Activa' : 'Inactiva' }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="safety-tips-card">
                        <div class="safety-header">
                            <i class="bi bi-shield-check"></i>
                            <h5>Consejos de Seguridad</h5>
                        </div>
                        <ul class="safety-list">
                            <li>• Inspecciona el producto en persona</li>
                            <li>• Verifica la autenticidad del artículo</li>
                            <li>• Solicita factura o comprobante si aplica</li>
                            <li>• Negocia en lugares públicos</li>
                            <li>• Ve con alguien de confianza</li>
                            <li>• Verifica compatibilidad con tu moto</li>
                            <li>• No realices pagos por adelantado sin garantías</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="error-container">
            <div class="error-message">
                <i class="bi bi-exclamation-triangle"></i>
                <h4>Publicación no encontrada</h4>
                <p>La publicación que buscas no existe o ha sido eliminada.</p>
                <router-link to="/mercado/publicaciones" class="btn btn-primary">
                    Volver al marketplace
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/authStore';
import api from '@/services/api';
import ImageGallery from '@/components/ui/posts/postDetails/ImageGallery.vue';
import MarketPostHeader from '@/components/ui/marketplace/MarketPostHeader.vue';
import SellerCard from '@/components/ui/posts/postDetails/SellerCard.vue';
import LocationMap from '@/components/ui/posts/postDetails/LocationMap.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const post = ref(null);
const loading = ref(true);
const currentImageIndex = ref(0);
const postImages = ref([]);
const imagesLoading = ref(false);
const isFavorited = ref(false);
const favoriteCount = ref(0);

const isOwnPost = computed(() => {
    if (!post.value || !authStore.isLoggedIn) return false;
    return post.value.user.user_id === parseInt(authStore.userId);
});

const locationItems = computed(() => {
    if (!post.value?.ubicacion) return [];
    
    const items = [];
    const loc = post.value.ubicacion;
    
    if (loc.calle) {
        items.push({
            icon: 'bi bi-signpost-2',
            label: 'Calle',
            value: loc.calle
        });
    }
    
    if (loc.sector?.nombre_sector) {
        items.push({
            icon: 'bi bi-building',
            label: 'Sector',
            value: loc.sector.nombre_sector
        });
    }
    
    if (loc.distrito?.nombre_distrito) {
        items.push({
            icon: 'bi bi-map',
            label: 'Distrito',
            value: loc.distrito.nombre_distrito
        });
    }
    
    if (loc.municipio?.nombre_municipio) {
        items.push({
            icon: 'bi bi-pin-map',
            label: 'Municipio',
            value: loc.municipio.nombre_municipio
        });
    }
    
    if (loc.provincia?.nombre_provincia) {
        items.push({
            icon: 'bi bi-geo',
            label: 'Provincia',
            value: loc.provincia.nombre_provincia
        });
    }
    
    if (loc.pais?.nombre_pais) {
        items.push({
            icon: 'bi bi-flag',
            label: 'País',
            value: loc.pais.nombre_pais
        });
    }
    
    return items;
});

const getLocationSummary = () => {
    if (!post.value?.ubicacion) return 'Ubicación no especificada';
    
    const loc = post.value.ubicacion;
    const parts = [];
    
    if (loc.municipio?.nombre_municipio) parts.push(loc.municipio.nombre_municipio);
    if (loc.provincia?.nombre_provincia) parts.push(loc.provincia.nombre_provincia);
    
    return parts.length > 0 ? parts.join(', ') : 'República Dominicana';
};

const fetchPostDetails = async () => {
    try {
        loading.value = true;
        const response = await api.get(`/api/marketplace/details/${route.params.id}`);
        post.value = response.data.post;
        
        await Promise.all([
            fetchPostImages(),
            fetchFavoriteStatus()
        ]);
    } catch (error) {
        console.error('Error fetching post details:', error);
        if (error.response?.status === 404) {
            toast.error('Publicación no encontrada');
        } else {
            toast.error('Error al cargar la publicación');
        }
        post.value = null;
    } finally {
        loading.value = false;
    }
};

const fetchPostImages = async () => {
    try {
        imagesLoading.value = true;
        const response = await api.get(`/api/marketplace/${route.params.id}/images`);
        
        if (response.data.images && response.data.images.length > 0) {
            const sortedImages = response.data.images
                .sort((a, b) => a.display_order - b.display_order)
                .map(image => image.url);
            
            postImages.value = sortedImages;
        } else {
            postImages.value = [];
        }
    } catch (error) {
        console.error('Error fetching post images:', error);
        postImages.value = [];
    } finally {
        imagesLoading.value = false;
    }
};

const fetchFavoriteStatus = async () => {
    if (!authStore.isLoggedIn) {
        isFavorited.value = false;
        favoriteCount.value = post.value?.likes_count || 0;
        return;
    }

    try {
        const response = await api.get(`/api/marketplace/likes/${route.params.id}`);
        isFavorited.value = response.data.is_liked;
        favoriteCount.value = response.data.like_count;
    } catch (error) {
        console.error('Error fetching favorite status:', error);
        isFavorited.value = false;
        favoriteCount.value = post.value?.likes_count || 0;
    }
};

const toggleFavorite = async () => {
    if (!authStore.isLoggedIn) {
        toast.warning('Debes iniciar sesión para dar me gusta');
        router.push({ name: 'Login' });
        return;
    }

    if (isOwnPost.value) {
        toast.info('No puedes dar me gusta a tu propia publicación');
        return;
    }

    try {
        const response = await api.put(`/api/marketplace/${route.params.id}/toggle-like`);
        isFavorited.value = response.data.is_liked;
        favoriteCount.value = response.data.like_count;
        
        if (response.data.is_liked) {
            toast.success('Agregado a favoritos');
        } else {
            toast.info('Removido de favoritos');
        }
    } catch (error) {
        console.error('Error toggling favorite:', error);
        if (error.response?.status === 401) {
            toast.warning('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
            router.push({ name: 'Login' });
        } else {
            toast.error('Error al actualizar favoritos');
        }
    }
};

const getCategoryLabel = (category) => {
    const labels = {
        'parts': 'Repuestos',
        'accessories': 'Accesorios',
        'other': 'Otros'
    };
    return labels[category] || category;
};

const formatPrice = (price) => {
    return new Intl.NumberFormat('es-DO', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(parseFloat(price));
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'hace 1 día';
    if (diffDays < 30) return `hace ${diffDays} días`;
    
    return date.toLocaleDateString('es-DO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
};

const formatExpiryDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expirada';
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Mañana';
    if (diffDays < 30) return `en ${diffDays} días`;
    
    return date.toLocaleDateString('es-DO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
};

onMounted(() => {
    fetchPostDetails();
});
</script>

<style scoped>
.market-post-details-page {
    background-color: #f8f9fa;
    min-height: 100vh;
    padding: 2% 10%;
}

.loading-container, .error-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 50vh;
}

.error-message {
    text-align: center;
    padding: 2rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.error-message i {
    font-size: 3rem;
    color: #dc3545;
    margin-bottom: 1rem;
}

.description-section,
.category-section {
    background: white;
    padding: 24px;
    border-radius: 12px;
    margin-bottom: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.description-section h3,
.category-section h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 2px solid #f0f0f0;
    display: flex;
    align-items: center;
}

.description-text {
    color: #555;
    line-height: 1.6;
    font-size: 16px;
    text-align: left;
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    text-align: left;
}

.info-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.info-label {
    font-size: 13px;
    color: #666;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.info-value {
    font-size: 16px;
    color: #333;
    font-weight: 600;
}

.price-value {
    font-size: 20px;
    color: #dc3545;
    display: flex;
    align-items: center;
    gap: 8px;
}

.negotiable-tag {
    font-size: 12px;
    background: rgba(220, 53, 69, 0.1);
    color: #dc3545;
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: 600;
}

.category-badge {
    display: inline-block;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
}

.category-parts {
    background: #dc3545;
    color: white;
}

.category-accessories {
    background: #28a745;
    color: white;
}

.category-other {
    background: #6c757d;
    color: white;
}

.status-active {
    color: #28a745;
    font-weight: 600;
}

.status-inactive {
    color: #6c757d;
    font-weight: 600;
}

.stats-card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    margin-bottom: 20px;
}

.stats-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 2px solid #f0f0f0;
}

.stats-header i {
    color: #dc3545;
    font-size: 1.5rem;
}

.stats-header h5 {
    margin: 0;
    color: #333;
    font-weight: 700;
}

.stats-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #666;
    font-size: 14px;
}

.stat-item i {
    color: #dc3545;
    font-size: 16px;
    width: 20px;
}

.stat-item.text-success i {
    color: #28a745;
}

.stat-item.text-muted i {
    color: #6c757d;
}

.safety-tips-card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    text-align: left;
}

.safety-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 2px solid #f0f0f0;
}

.safety-header i {
    color: #28a745;
    font-size: 1.5rem;
}

.safety-header h5 {
    margin: 0;
    color: #333;
    font-weight: 700;
}

.safety-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.safety-list li {
    padding: 8px 0;
    color: #666;
    font-size: 14px;
    border-bottom: 1px solid #f0f0f0;
}

.safety-list li:last-child {
    border-bottom: none;
}

@media (max-width: 768px) {
    .market-post-details-page {
        padding: 10px 0;
    }
    
    .container-fluid {
        padding: 0 10px;
    }
    
    .info-grid {
        grid-template-columns: 1fr;
    }
}
</style>