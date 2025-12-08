<template>
    <div class="my-marketplace-card">
        <div class="card-hero">
            <img 
                v-if="item.featured_image_url" 
                :src="item.featured_image_url" 
                :alt="item.publicacion_titulo"
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
                <div v-if="item.negociable" class="negotiable-badge">
                    <i class="bi bi-currency-exchange"></i>
                    Negociable
                </div>
            </div>

            <div class="hero-content">
                <div class="price-info">
                    <div class="price-text">
                        {{ item.tipo_moneda?.nombre_tipo_moneda }} {{ formatPrice(item.precio) }}
                    </div>
                </div>
                
                <div class="product-info-overlay">
                    <h3 class="product-title">{{ item.publicacion_titulo }}</h3>
                    <div class="product-category">
                        <span class="category-badge" :class="`category-${item.category}`">
                            {{ getCategoryLabel(item.category) }}
                        </span>
                    </div>
                </div>
            </div>

            <div v-if="!item.featured_image_url" class="no-image-placeholder">
                <i class="bi bi-image"></i>
                <span>Sin imagen</span>
            </div>
        </div>

        <div class="card-content">
            <div class="publication-info">
                <div class="info-row">
                    <div class="info-item">
                        <i class="bi bi-eye"></i>
                        <span>{{ item.views_denorm || 0 }} vistas</span>
                    </div>
                    <div class="info-item">
                        <i class="bi bi-heart"></i>
                        <span>{{ item.like_qty_denorm || 0 }} likes</span>
                    </div>
                </div>
                
                <div class="info-row">
                    <div class="info-item">
                        <i class="bi bi-calendar"></i>
                        <span>{{ formatDate(item.created_at) }}</span>
                    </div>
                    <div class="info-item">
                        <i class="bi bi-tag"></i>
                        <span>{{ getCategoryLabel(item.category) }}</span>
                    </div>
                </div>
            </div>

            <p class="description">{{ item.publicacion_descripcion }}</p>

            <div class="card-actions">
                <button 
                    @click="$emit('edit', item)"
                    class="btn btn-outline-primary btn-sm"
                    title="Editar publicación"
                >
                    <i class="bi bi-pencil"></i>
                    Editar
                </button>
                
                <button 
                    @click="$emit('toggle-status', item)"
                    class="btn btn-sm"
                    :class="item.is_active ? 'btn-outline-warning' : 'btn-outline-success'"
                    :title="item.is_active ? 'Desactivar' : 'Activar'"
                >
                    <i :class="item.is_active ? 'bi bi-pause' : 'bi bi-play'"></i>
                    {{ item.is_active ? 'Desactivar' : 'Activar' }}
                </button>
                
                <button 
                    @click="$emit('delete', item)"
                    class="btn btn-outline-danger btn-sm"
                    title="Eliminar publicación"
                >
                    <i class="bi bi-trash"></i>
                    Eliminar
                </button>
                
                <router-link 
                    :to="`/mercado/publicaciones/${item.publicacion_marketplace_id}`"
                    class="btn btn-outline-info btn-sm"
                    title="Ver"
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
    item: {
        type: Object,
        required: true
    }
});

defineEmits(['edit', 'delete', 'toggle-status']);

const handleImageError = () => {
    imageError.value = true;
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

const getCategoryLabel = (category) => {
    const labels = {
        'parts': 'Repuestos',
        'accessories': 'Accesorios',
        'other': 'Otros'
    };
    return labels[category] || category;
};

const getStatusClass = () => {
    if (!props.item.approved) return 'status-pending';
    if (!props.item.is_active) return 'status-inactive';
    return 'status-active';
};

const getStatusIcon = () => {
    if (!props.item.approved) return 'bi bi-clock';
    if (!props.item.is_active) return 'bi bi-pause';
    return 'bi bi-check-circle';
};

const getStatusText = () => {
    if (!props.item.approved) return 'Pendiente';
    if (!props.item.is_active) return 'Inactiva';
    return 'Activa';
};
</script>

<style scoped>
.my-marketplace-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    height: 100%;
}

.my-marketplace-card:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    transform: translateY(-4px);
}

.card-hero {
    position: relative;
    height: 240px;
    overflow: hidden;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.hero-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.my-marketplace-card:hover .hero-image {
    transform: scale(1.05);
}

.image-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60%;
    background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
    pointer-events: none;
}

.status-badges {
    position: absolute;
    top: 12px;
    right: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: flex-end;
}

.status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
    backdrop-filter: blur(8px);
}

.status-active {
    background: rgba(40, 167, 69, 0.9);
    color: white;
}

.status-pending {
    background: rgba(255, 193, 7, 0.9);
    color: #333;
}

.status-inactive {
    background: rgba(108, 117, 125, 0.9);
    color: white;
}

.negotiable-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: rgba(220, 53, 69, 0.9);
    color: white;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
    backdrop-filter: blur(8px);
}

.hero-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 1.25rem;
    color: white;
    z-index: 1;
}

.price-info {
    margin-bottom: 0.5rem;
}

.price-text {
    font-size: 1.75rem;
    font-weight: 800;
    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    letter-spacing: -0.5px;
}

.product-info-overlay h3 {
    font-size: 1.1rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    line-height: 1.3;
}

.product-category {
    display: flex;
    gap: 0.5rem;
}

.category-badge {
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.category-parts {
    background: rgba(0, 123, 255, 0.9);
    color: white;
}

.category-accessories {
    background: rgba(111, 66, 193, 0.9);
    color: white;
}

.category-other {
    background: rgba(108, 117, 125, 0.9);
    color: white;
}

.no-image-placeholder {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: rgba(255, 255, 255, 0.8);
}

.no-image-placeholder i {
    font-size: 3rem;
    display: block;
    margin-bottom: 0.5rem;
}

.card-content {
    padding: 1.25rem;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.publication-info {
    margin-bottom: 1rem;
}

.info-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.75rem;
}

.info-row:last-child {
    margin-bottom: 0;
}

.info-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.85rem;
    color: #6c757d;
}

.info-item i {
    font-size: 0.9rem;
}

.description {
    font-size: 0.9rem;
    color: #495057;
    line-height: 1.5;
    margin-bottom: 1rem;
    flex: 1;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.card-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-top: auto;
}

.btn {
    flex: 1;
    min-width: 80px;
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    text-decoration: none;
    transition: all 0.2s ease;
    cursor: pointer;
}

.btn-sm {
    font-size: 0.8rem;
    padding: 0.4rem 0.6rem;
}

.btn-outline-primary {
    color: #007bff;
    border: 2px solid #007bff;
    background: white;
}

.btn-outline-primary:hover {
    background: #007bff;
    color: white;
}

.btn-outline-warning {
    color: #ffc107;
    border: 2px solid #ffc107;
    background: white;
}

.btn-outline-warning:hover {
    background: #ffc107;
    color: #333;
}

.btn-outline-success {
    color: #28a745;
    border: 2px solid #28a745;
    background: white;
}

.btn-outline-success:hover {
    background: #28a745;
    color: white;
}

.btn-outline-danger {
    color: #dc3545;
    border: 2px solid #dc3545;
    background: white;
}

.btn-outline-danger:hover {
    background: #dc3545;
    color: white;
}

.btn-outline-info {
    color: #17a2b8;
    border: 2px solid #17a2b8;
    background: white;
}

.btn-outline-info:hover {
    background: #17a2b8;
    color: white;
}

@media (max-width: 768px) {
    .card-hero {
        height: 200px;
    }
    
    .price-text {
        font-size: 1.5rem;
    }
    
    .product-info-overlay h3 {
        font-size: 1rem;
    }
    
    .card-actions {
        flex-direction: column;
    }
    
    .btn {
        width: 100%;
    }
}
</style>