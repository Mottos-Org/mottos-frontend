<template>
    <div class="my-publication-card">
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
            
            <div class="status-badges">
                <div class="status-badge" :class="getStatusClass()">
                    <i :class="getStatusIcon()"></i>
                    {{ getStatusText() }}
                </div>
                <div v-if="publicacion.negociable" class="negotiable-badge">
                    <i class="bi bi-currency-exchange"></i>
                    Negociable
                </div>
            </div>

            <div class="hero-content">
                <div class="price-info">
                    <div class="price-text">
                        {{ publicacion.tipo_moneda?.nombre_tipo_moneda }} {{ formatPrice(publicacion.precio) }}
                    </div>
                </div>
                
                <div class="bike-info-overlay">
                    <h3 class="bike-title">{{ publicacion.marca_denorm }} {{ publicacion.modelo_denorm }}</h3>
                    <div class="bike-details">
                        <span class="year">{{ publicacion.year_denorm || 'N/A' }}</span>
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
            <div class="publication-info">
                <div class="info-row">
                    <div class="info-item">
                        <i class="bi bi-eye"></i>
                        <span>{{ publicacion.views_denorm || 0 }} vistas</span>
                    </div>
                    <div class="info-item">
                        <i class="bi bi-calendar"></i>
                        <span>{{ formatDate(publicacion.created_at) }}</span>
                    </div>
                </div>
                
                <div class="info-row">
                    <div class="info-item condition">
                        <i class="bi bi-check-circle"></i>
                        <span>{{ publicacion.condicion_motor?.nombre_condicion }}</span>
                    </div>
                    <div class="info-item expiry" :class="{ expired: isExpired() }">
                        <i :class="isExpired() ? 'bi bi-x-circle' : 'bi bi-clock'"></i>
                        <span>{{ getExpiryText() }}</span>
                    </div>
                </div>
            </div>

            <p class="description">{{ publicacion.descripcion }}</p>

            <div class="card-actions">
                <button 
                    @click="$emit('edit', publicacion)"
                    class="btn btn-outline-primary btn-sm"
                    title="Editar publicación"
                >
                    <i class="bi bi-pencil"></i>
                    Editar
                </button>
                
                <button 
                    @click="$emit('toggle-status', publicacion)"
                    class="btn btn-sm"
                    :class="publicacion.is_active ? 'btn-outline-warning' : 'btn-outline-success'"
                    :title="publicacion.is_active ? 'Desactivar' : 'Activar'"
                >
                    <i :class="publicacion.is_active ? 'bi bi-pause' : 'bi bi-play'"></i>
                    {{ publicacion.is_active ? 'Desactivar' : 'Activar' }}
                </button>
                
                <button 
                    @click="$emit('delete', publicacion)"
                    class="btn btn-outline-danger btn-sm"
                    title="Eliminar publicación"
                >
                    <i class="bi bi-trash"></i>
                    Eliminar
                </button>
                
                <router-link 
                    :to="`/motos/publicacion/${publicacion.publicacion_id}`"
                    class="btn btn-outline-info btn-sm"
                    title="Ver detalles"
                    target="_blank"
                >
                    <i class="bi bi-eye"></i>
                    Ver
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const imageError = ref(false);

const props = defineProps({
    publicacion: {
        type: Object,
        required: true
    }
});

defineEmits(['edit', 'delete', 'toggle-status']);

const handleImageError = () => {
    imageError.value = true;
    console.warn('Image failed to load:', props.publicacion.featured_image_url);
};

const handleImageLoad = () => {
    imageError.value = false;
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

const isExpired = () => {
    return new Date(props.publicacion.fecha_vencimiento) < new Date();
};

const getExpiryText = () => {
    const expireDate = new Date(props.publicacion.fecha_vencimiento);
    const today = new Date();
    const diffTime = expireDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expirada';
    if (diffDays === 0) return 'Expira hoy';
    if (diffDays === 1) return 'Expira mañana';
    return `${diffDays} días restantes`;
};

const getStatusClass = () => {
    if (!props.publicacion.approved) return 'status-pending';
    if (!props.publicacion.is_active) return 'status-inactive';
    if (isExpired()) return 'status-expired';
    return 'status-active';
};

const getStatusIcon = () => {
    if (!props.publicacion.approved) return 'bi bi-clock';
    if (!props.publicacion.is_active) return 'bi bi-pause';
    if (isExpired()) return 'bi bi-x-circle';
    return 'bi bi-check-circle';
};

const getStatusText = () => {
    if (!props.publicacion.approved) return 'Pendiente';
    if (!props.publicacion.is_active) return 'Inactiva';
    if (isExpired()) return 'Expirada';
    return 'Activa';
};
</script>

<style scoped>
.my-publication-card {
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 24px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    max-width: 100%;
    text-align: left;
}

.my-publication-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
    border-color: #d0d0d0;
}

.card-hero {
    height: 200px;
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, #000000 0%, #333333 100%);
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
}

.my-publication-card:hover .hero-image {
    transform: scale(1.05);
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

.status-badges {
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 3;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.status-badge {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.status-active { background: rgba(40, 167, 69, 0.9); color: white; }
.status-pending { background: rgba(255, 193, 7, 0.9); color: white; }
.status-inactive { background: rgba(108, 117, 125, 0.9); color: white; }
.status-expired { background: rgba(220, 53, 69, 0.9); color: white; }

.negotiable-badge {
    background: rgba(23, 162, 184, 0.9);
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 4px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.hero-content {
    position: relative;
    height: 100%;
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    z-index: 2;
}

.price-info {
    display: flex;
    justify-content: flex-end;
}

.price-text {
    color: white;
    font-size: 1.5rem;
    font-weight: 700;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.8);
    letter-spacing: -0.5px;
}

.bike-info-overlay {
    color: white;
}

.bike-title {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 6px;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.8);
    line-height: 1.2;
}

.bike-details {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
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
    font-size: 2rem;
}

.card-content {
    padding: 16px;
}

.publication-info {
    margin-bottom: 12px;
}

.info-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
}

.info-row:last-child {
    margin-bottom: 0;
}

.info-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.8rem;
    font-weight: 500;
    color: #666;
}

.info-item i {
    font-size: 0.9rem;
    color: #dc3545;
}

.info-item.condition i {
    color: #28a745;
}

.info-item.expired {
    color: #dc3545;
}

.info-item.expired i {
    color: #dc3545;
}

.description {
    color: #333;
    font-size: 0.9rem;
    line-height: 1.4;
    margin-bottom: 16px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.card-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.btn-sm {
    padding: 6px 12px;
    font-size: 0.8rem;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 4px;
    text-decoration: none;
    border-width: 1px;
    transition: all 0.2s ease;
}

.btn-outline-primary {
    color: #007bff;
    border-color: #007bff;
}

.btn-outline-primary:hover {
    background: #007bff;
    color: white;
}

.btn-outline-success {
    color: #28a745;
    border-color: #28a745;
}

.btn-outline-success:hover {
    background: #28a745;
    color: white;
}

.btn-outline-warning {
    color: #ffc107;
    border-color: #ffc107;
}

.btn-outline-warning:hover {
    background: #ffc107;
    color: #212529;
}

.btn-outline-danger {
    color: #dc3545;
    border-color: #dc3545;
}

.btn-outline-danger:hover {
    background: #dc3545;
    color: white;
}

.btn-outline-info {
    color: #17a2b8;
    border-color: #17a2b8;
}

.btn-outline-info:hover {
    background: #17a2b8;
    color: white;
}

@media (max-width: 768px) {
    .card-hero {
        height: 160px;
    }
    
    .hero-content {
        padding: 12px;
        text-align: left;
    }
    
    .price-text {
        font-size: 1.2rem;
    }
    
    .bike-title {
        font-size: 1.1rem;
    }
    
    .card-actions {
        gap: 6px;
    }
    
    .btn-sm {
        padding: 4px 8px;
        font-size: 0.75rem;
    }

    .my-publication-card {
        min-width: 100%;
    }
}
</style>