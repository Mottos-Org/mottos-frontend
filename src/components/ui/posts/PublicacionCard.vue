<template>
    <div class="publication-card">
        <div class="card-hero">
            <div class="hero-content">
                <div class="price-badge">
                    <span v-if="publicacion.negociable" class="negotiable-tag">
                        <i class="bi bi-currency-exchange"></i>
                        Negociable
                    </span>
                    <div class="price-text">
                        {{ publicacion.tipo_moneda?.nombre_tipo_moneda }} {{ formatPrice(publicacion.precio) }}
                    </div>
                </div>````
                
                <div class="bike-info-overlay">
                    <h3 class="bike-title">{{ publicacion.marca_denorm }} {{ publicacion.modelo_denorm }}</h3>
                    <div class="bike-details">
                        <span class="year">{{ publicacion.bike?.year || 'N/A' }}</span>
                        <span class="separator">•</span>
                        <span class="displacement">{{ publicacion.bike?.displacement || 'N/A' }}</span>
                    </div>
                </div>
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

const props = defineProps({
    publicacion: {
        type: Object,
        required: true
    }
});

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
    text-align: left;
}

.publication-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    border-color: #d0d0d0;
}

.card-hero {
    height: 200px;
    background: linear-gradient(135deg, #000000 0%, #b70000 100%);
    position: relative;
    overflow: hidden;
}

.card-hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M20 20h60v60H20z' fill='none' stroke='rgba(255,255,255,0.1)' stroke-width='0.5'/%3E%3C/svg%3E");
    opacity: 0.3;
}

.hero-content {
    position: relative;
    height: 100%;
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.price-badge {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-self: flex-end;
    text-align: right;
}

.negotiable-tag {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 14.5px;
    font-weight: 500;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-bottom: 4px;
    width: fit-content;
    backdrop-filter: blur(10px);
    align-self: flex-end;
}

.price-text {
    color: white;
    font-size: 32px;
    font-weight: 700;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.bike-info-overlay {
    color: white;
}

.bike-title {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 8px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.bike-details {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    opacity: 0.9;
}

.separator {
    opacity: 0.6;
}

.card-content {
    padding: 20px;
}

.specs-row {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
    flex-wrap: wrap;
}

.spec-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #666;
    background: #f8f9fa;
    padding: 6px 12px;
    border-radius: 20px;
}

.spec-item i {
    font-size: 14px;
    color: #888;
}

.spec-item.condition {
    background: #e8f5e8;
    color: #2d5a2d;
}

.spec-item.condition i {
    color: #4caf50;
}

.description {
    color: #444;
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 16px;
    display: -webkit-box;
    /* -webkit-line-clamp: 2; */
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
}

.location i {
    font-size: 14px;
}

.slide-fade-enter-active {
    transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateY(-10px);
    opacity: 0;
}

@media (max-width: 768px) {
    .publication-card:hover {
        transform: translateY(-4px);
    }
    
    .price-text {
        font-size: 20px;
    }
    
    .bike-title {
        font-size: 18px;
    }
    
    .specs-row {
        gap: 8px;
    }
    
    .details-grid {
        grid-template-columns: 1fr;
    }
}
</style>