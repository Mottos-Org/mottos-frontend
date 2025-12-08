<template>
    <div class="marketplace-review">
        <div class="section-header">
            <h3>
                <i class="bi bi-check2-circle"></i>
                Revisa tu Producto
            </h3>
            <p>Verifica que toda la información esté correcta antes de publicar</p>
        </div>

        <div class="review-container">
            <div class="row">
                <div class="col-lg-8">
                    <div v-if="imageData.images.length > 0" class="review-section">
                        <h4>
                            <i class="bi bi-images"></i>
                            Imágenes ({{ imageData.images.length }})
                        </h4>
                        <div class="images-review-grid">
                            <div 
                                v-for="(image, index) in imageData.images" 
                                :key="index"
                                class="image-review-item"
                                :class="{ 'featured': imageData.featuredIndex === index }"
                            >
                                <img :src="image.preview || image.url" :alt="`Imagen ${index + 1}`" />
                                <div v-if="imageData.featuredIndex === index" class="featured-badge">
                                    <i class="bi bi-star-fill"></i>
                                    Principal
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="review-section">
                        <h4>
                            <i class="bi bi-card-text"></i>
                            Detalles del Producto
                        </h4>
                        <div class="details-grid">
                            <div class="detail-card full-width">
                                <div class="detail-header">
                                    <i class="bi bi-card-heading"></i>
                                    <h6>Título</h6>
                                </div>
                                <p class="detail-content title">{{ marketplaceData.publicacion_titulo }}</p>
                            </div>

                            <div class="detail-card full-width">
                                <div class="detail-header">
                                    <i class="bi bi-file-text"></i>
                                    <h6>Descripción</h6>
                                </div>
                                <p class="detail-content">{{ marketplaceData.publicacion_descripcion }}</p>
                            </div>

                            <div class="detail-card">
                                <div class="detail-header">
                                    <i class="bi bi-tag-fill"></i>
                                    <h6>Categoría</h6>
                                </div>
                                <div class="detail-content">
                                    <span class="category-badge" :class="`category-${marketplaceData.category}`">
                                        {{ getCategoryName(marketplaceData.category) }}
                                    </span>
                                </div>
                            </div>

                            <div class="detail-card">
                                <div class="detail-header">
                                    <i class="bi bi-geo-alt"></i>
                                    <h6>Ubicación</h6>
                                </div>
                                <div class="detail-content">
                                    <div class="location-info">
                                        <i class="bi bi-pin-map"></i>
                                        <span>Ubicación guardada</span>
                                    </div>
                                </div>
                            </div>

                            <div class="detail-card full-width">
                                <div class="detail-header">
                                    <i class="bi bi-calendar"></i>
                                    <h6>Vigencia</h6>
                                </div>
                                <div class="detail-content">
                                    <div class="date-info">
                                        <span class="label">Activa hasta:</span>
                                        <span class="value date">{{ formatDate(marketplaceData.fecha_vencimiento) }}</span>
                                    </div>
                                    <div class="duration-info">
                                        <i class="bi bi-clock"></i>
                                        <span>{{ getDurationText(marketplaceData.fecha_vencimiento) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="price-summary">
                        <div class="price-header">
                            <h4>
                                <i class="bi bi-currency-dollar"></i>
                                Precio de Venta
                            </h4>
                        </div>
                        <div class="price-display">
                            <div class="currency">{{ getCurrencyName(marketplaceData.tipo_moneda_id) }}</div>
                            <div class="price">{{ formatPrice(marketplaceData.precio) }}</div>
                            <div v-if="marketplaceData.negociable" class="negotiable-badge">
                                <i class="bi bi-arrow-left-right"></i>
                                Precio negociable
                            </div>
                        </div>
                    </div>

                    <div class="action-section">
                        <button 
                            @click="handleSubmit" 
                            class="btn btn-publish"
                            :disabled="submitting"
                        >
                            <div v-if="submitting" class="spinner-border spinner-border-sm me-2"></div>
                            <i v-else class="bi bi-check-circle"></i>
                            {{ submitting ? 'Publicando...' : (isEditing ? 'Actualizar Producto' : 'Publicar Producto') }}
                        </button>

                        <div class="terms-notice">
                            <i class="bi bi-info-circle"></i>
                            <p>
                                Al publicar, aceptas nuestros 
                                <router-link to="/terminos-condiciones">términos y condiciones</router-link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    marketplaceData: {
        type: Object,
        required: true
    },
    imageData: {
        type: Object,
        required: true
    },
    submitting: {
        type: Boolean,
        default: false
    },
    isEditing: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['submit']);

const handleSubmit = () => {
    emit('submit');
};

const getCategoryName = (category) => {
    const names = {
        'parts': '🔧 Repuestos',
        'accessories': '🎽 Accesorios',
        'other': '📦 Otros'
    };
    return names[category] || category;
};

const getCurrencyName = (id) => {
    return id === 1 ? 'RD$' : 'US$';
};

const formatPrice = (price) => {
    return new Intl.NumberFormat('es-DO', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(parseFloat(price));
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-DO', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
};

const getDurationText = (dateString) => {
    const expiryDate = new Date(dateString);
    const today = new Date();
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Fecha pasada';
    if (diffDays === 0) return 'Expira hoy';
    if (diffDays === 1) return '1 día';
    if (diffDays < 30) return `${diffDays} días`;
    
    const months = Math.floor(diffDays / 30);
    return months === 1 ? '1 mes' : `${months} meses`;
};
</script>

<style scoped>
.marketplace-review {
    padding: 2rem;
    background: white;
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.section-header {
    text-align: center;
    margin-bottom: 2rem;
}

.section-header h3 {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1a1a1a;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
}

.section-header i {
    color: #28a745;
    font-size: 2rem;
}

.section-header p {
    color: #6c757d;
    margin-top: 0.5rem;
}

.review-section {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
}

.review-section h4 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1a1a1a;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.images-review-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 1rem;
}

.image-review-item {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    aspect-ratio: 1;
    border: 2px solid transparent;
    transition: all 0.2s ease;
}

.image-review-item.featured {
    border-color: #ffc107;
    box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
}

.image-review-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.featured-badge {
    position: absolute;
    top: 4px;
    right: 4px;
    background: #ffc107;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.7rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 4px;
}

.details-grid {
    text-align: left;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
}

.detail-card {
    background: white;
    border-radius: 10px;
    padding: 1.25rem;
    border: 1px solid #e9ecef;
}

.detail-card.full-width {
    grid-column: 1 / -1;
}

.detail-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
}

.detail-header i {
    color: #dc3545;
    font-size: 1.125rem;
}

.detail-header h6 {
    font-size: 0.95rem;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0;
}

.detail-content {
    color: #495057;
    line-height: 1.6;
    margin: 0;
}

.detail-content.title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1a1a1a;
}

.category-badge {
    padding: 6px 12px;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: 600;
    display: inline-block;
}

.category-parts {
    background: rgba(0, 123, 255, 0.1);
    color: #007bff;
}

.category-accessories {
    background: rgba(111, 66, 193, 0.1);
    color: #6f42c1;
}

.category-other {
    background: rgba(108, 117, 125, 0.1);
    color: #6c757d;
}

.location-info,
.date-info,
.duration-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.date-info {
    margin-bottom: 0.5rem;
}

.label {
    font-weight: 600;
    color: #6c757d;
}

.value {
    color: #1a1a1a;
}

.value.date {
    font-weight: 600;
}

.duration-info {
    color: #6c757d;
    font-size: 0.875rem;
}

.price-summary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    padding: 2rem;
    color: white;
    margin-bottom: 1.5rem;
    position: sticky;
    top: 20px;
}

.price-header h4 {
    font-size: 1.125rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
}

.price-display {
    text-align: center;
}

.currency {
    font-size: 1.5rem;
    font-weight: 600;
    opacity: 0.9;
    margin-bottom: 0.5rem;
}

.price {
    font-size: 3rem;
    font-weight: 800;
    line-height: 1;
    margin-bottom: 1rem;
}

.negotiable-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 600;
}

.action-section {
    background: white;
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.btn-publish {
    width: 100%;
    padding: 1rem;
    background: #dc3545;
    border: none;
    border-radius: 12px;
    color: white;
    font-size: 1.125rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    cursor: pointer;
    margin-bottom: 1rem;
}

.btn-publish:not(:disabled):hover {
    background: #c82333;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
}

.btn-publish:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.terms-notice {
    text-align: center;
    font-size: 0.8rem;
    color: #6c757d;
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    text-align: left;
}

.terms-notice i {
    margin-top: 2px;
    flex-shrink: 0;
}

.terms-notice p {
    margin: 0;
    line-height: 1.4;
}

.terms-notice a {
    color: #dc3545;
    text-decoration: none;
}

.terms-notice a:hover {
    text-decoration: underline;
}

@media (max-width: 992px) {
    .price-summary {
        position: relative;
        top: 0;
    }
}
</style>