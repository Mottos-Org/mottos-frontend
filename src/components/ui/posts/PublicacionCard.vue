<template>
    <div class="publication-card" @click="goToDetails">
        <div class="card-hero">
            <img 
                v-if="publicacion.featured_image_url" 
                :src="publicacion.featured_image_url" 
                :alt="`${publicacion.marca_denorm} ${publicacion.modelo_denorm}`"
                class="hero-image"
                @error="handleImageError"
                @load="handleImageLoad"
            />
            
            <div class="image-overlay"></div>
            
            <div class="hero-content">
                <div class="price-badge">
                    <span v-if="publicacion.negociable" class="negotiable-tag">
                        <i class="bi bi-currency-exchange"></i>
                        Negociable
                    </span>
                    <div class="price-text">
                        {{ publicacion.tipo_moneda?.nombre_tipo_moneda }} {{ formatPrice(publicacion.precio) }}
                    </div>
                </div>
                
                <div class="bike-info-overlay">
                    <h3 class="bike-title">{{ publicacion.marca_denorm }} {{ publicacion.modelo_denorm }}</h3>
                    <div class="bike-details">
                        <span class="year">{{ publicacion.bike?.year || 'N/A' }}</span>
                        <span class="separator">•</span>
                        <span class="displacement">{{ publicacion.bike?.displacement || 'N/A' }}</span>
                    </div>
                </div>
            </div>

            <div v-if="!publicacion.featured_image_url" class="no-image-placeholder">
                <i class="bi bi-camera"></i>
                <span>Sin imagen</span>
            </div>
        </div>

        <div class="card-content">
            <div class="specs-row">
                <div class="spec-item">
                    <i class="bi bi-gear"></i>
                    <span>{{ publicacion.bike?.displacement || 'N/A' }}</span>
                </div>
                <div class="spec-item">
                    <i class="bi bi-lightning"></i>
                    <span>{{ publicacion.bike?.power || 'N/A' }}</span>
                </div>
                <div class="spec-item condition">
                    <i class="bi bi-check-circle"></i>
                    <span>{{ publicacion.condicion_motor?.nombre_condicion }}</span>
                </div>
            </div>

            <p class="description">{{ publicacion.descripcion }}</p>
            <div class="seller-info">
                <div class="seller-details">
                    <div class="seller-name">{{ publicacion.user?.nombres }} {{ publicacion.user?.apellidos }}</div>
                    <div class="listing-date">{{ formatDate(publicacion.created_at) }}</div>
                </div>
                <div class="location">
                    <i class="bi bi-geo-alt"></i>
                    <span>Santo Domingo</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const imageError = ref(false);

const props = defineProps({
    publicacion: {
        type: Object,
        required: true
    }
});

const handleImageError = () => {
    imageError.value = true;
    console.warn('Image failed to load:', props.publicacion.featured_image_url);
};

const handleImageLoad = () => {
    imageError.value = false;
};

const goToDetails = () => {
    router.push({
        name: 'PostDetails',
        params: { id: props.publicacion.publicacion_id }
    });
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
    
    if (diffDays === 1) return 'Hace 1 día';
    if (diffDays < 30) return `Hace ${diffDays} días`;
    
    return date.toLocaleDateString('es-DO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
};
</script>

<style scoped>
.publication-card {
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 24px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    max-width: 425px;
    min-width: 425px;
    text-align: left;
}

.publication-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    border-color: #d0d0d0;
}

.card-hero {
    height: 240px;
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, #000000 0%, #b70000 100%);
}

.hero-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    transition: transform 0.3s ease;
    z-index: 0;
    image-rendering: crisp-edges;
    image-rendering: -webkit-optimize-contrast;
}

.publication-card:hover .hero-image {
    transform: scale(1.08);
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
        rgba(0, 0, 0, 0.0) 25%,
        rgba(0, 0, 0, 0.0) 65%,
        rgba(0, 0, 0, 0.7) 100%
    );
    z-index: 1;
    pointer-events: none;
}

.hero-content {
    position: relative;
    height: 100%;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    z-index: 2;
}

.price-badge {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-self: flex-end;
    text-align: right;
}

.negotiable-tag {
    background: rgba(255, 255, 255, 0.15);
    color: white;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    display: flex;
    justify-content: flex-end;
    gap: 6px;
    margin-bottom: 8px;
    width: fit-content;
    backdrop-filter: blur(10px);
    align-self: flex-end;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.price-text {
    color: white;
    font-size: 32px;
    font-weight: 700;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.8);
    letter-spacing: -0.5px;
}

.bike-info-overlay {
    color: white;
}

.bike-title {
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 8px;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.8);
    line-height: 1.2;
}

.bike-details {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 15px;
    font-weight: 500;
    text-shadow: 0 1px 8px rgba(0, 0, 0, 0.8);
}

.separator {
    opacity: 0.7;
    font-weight: 300;
}

.no-image-placeholder {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: rgba(255, 255, 255, 0.6);
    z-index: 1;
}

.no-image-placeholder i {
    font-size: 2.5rem;
}

.no-image-placeholder span {
    font-size: 14px;
    font-weight: 500;
}

.card-content {
    padding: 20px;
}

.specs-row {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
    flex-wrap: wrap;
}

.spec-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 500;
    color: #555;
    background: #f5f6f7;
    padding: 8px 12px;
    border-radius: 20px;
    transition: all 0.2s ease;
}

.spec-item:hover {
    background: #eaebec;
}

.spec-item i {
    font-size: 14px;
    color: #dc3545;
}

.spec-item.condition {
    background: #e8f5e8;
    color: #2d5a2d;
}

.spec-item.condition i {
    color: #28a745;
}

.description {
    color: #444;
    font-size: 14px;
    line-height: 1.6;
    margin-bottom: 16px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.seller-info {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;
}

.seller-details {
    flex: 1;
}

.seller-name {
    font-weight: 600;
    font-size: 14px;
    color: #333;
    margin-bottom: 2px;
}

.listing-date {
    font-size: 12px;
    color: #888;
}

.location {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: #666;
    font-weight: 500;
}

.location i {
    font-size: 14px;
    color: #dc3545;
}

.publication-card:hover .image-overlay {
    background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.05) 0%,
        rgba(0, 0, 0, 0.0) 25%,
        rgba(0, 0, 0, 0.0) 65%,
        rgba(0, 0, 0, 0.6) 100%
    );
}

.publication-card:hover .price-text {
    transform: scale(1.02);
}

.publication-card:hover .bike-title {
    text-shadow: 0 3px 16px rgba(0, 0, 0, 0.9);
}

@media (max-width: 768px) {
    .publication-card {
        max-width: 100%;
        min-width: 100%;
    }
    
    .publication-card:hover {
        transform: translateY(-4px);
    }
    
    .publication-card:hover .hero-image {
        transform: scale(1.04);
    }
    
    .card-hero {
        height: 200px;
    }
    
    .hero-content {
        padding: 16px;
    }
    
    .price-text {
        font-size: 26px;
    }
    
    .bike-title {
        font-size: 19px;
    }
    
    .bike-details {
        font-size: 14px;
    }
    
    .specs-row {
        gap: 8px;
    }
    
    .spec-item {
        font-size: 12px;
        padding: 6px 10px;
    }
}

@media (max-width: 480px) {
    .card-hero {
        height: 180px;
    }
}
</style>