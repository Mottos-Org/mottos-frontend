<template>
    <div class="marketplace-card" @click="goToDetails">
        <div class="card-image">
            <span class="category-badge" :class="`category-${item.category}`">
                {{ getCategoryLabel(item.category) }}
            </span>
            
            <img 
                v-if="item.featured_image_url" 
                :src="item.featured_image_url" 
                :alt="item.publicacion_titulo"
                @error="handleImageError"
            />
            <div v-else class="no-image-placeholder">
                <i class="bi bi-image"></i>
                <span>Sin imagen</span>
            </div>
            
            <span v-if="item.negociable" class="negotiable-badge">Negociable</span>
        </div>

        <div class="card-body">
            <div class="price">
                {{ item.tipo_moneda?.nombre_tipo_moneda }} {{ formatPrice(item.precio) }}
            </div>
            
            <h3 class="title">{{ item.publicacion_titulo }}</h3>
            
            <p class="description">{{ item.publicacion_descripcion }}</p>
            
            <div class="card-footer">
                <div class="user-info">
                    <div class="user-avatar">
                        {{ getInitials(item.user) }}
                    </div>
                    <span class="user-name">{{ item.user?.nombres }} {{ item.user?.apellidos }}</span>
                </div>
                
                <div class="meta-info">
                    <span class="date">{{ formatDate(item.created_at) }}</span>
                    <div class="stats">
                        <span class="stat">
                            <i class="bi bi-eye"></i>
                            {{ item.views_denorm }}
                        </span>
                        <span class="stat">
                            <i class="bi bi-heart"></i>
                            {{ item.like_qty_denorm }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
    item: {
        type: Object,
        required: true
    }
});

const handleImageError = (e) => {
    e.target.style.display = 'none';
};

const goToDetails = () => {
    router.push({
        name: 'MarketPostDetails',
        params: { id: props.item.publicacion_marketplace_id }
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
    if (diffDays < 7) return `Hace ${diffDays} días`;
    
    return date.toLocaleDateString('es-DO', {
        day: '2-digit',
        month: 'short'
    });
};

const getInitials = (user) => {
    if (!user) return 'U';
    const firstInitial = user.nombres?.charAt(0) || '';
    const lastInitial = user.apellidos?.charAt(0) || '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
};
</script>

<style scoped>
.marketplace-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #e0e0e0;
    transition: all 0.3s ease;
    cursor: pointer;
    max-width: 380px;
    min-width: 280px;
    width: 100%;
    display: flex;
    flex-direction: column;
}

.marketplace-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-image {
    position: relative;
    height: 240px;
    background: #f5f5f5;
    overflow: hidden;
}

.category-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: capitalize;
    z-index: 10;
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

.card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.marketplace-card:hover .card-image img {
    transform: scale(1.05);
}

.no-image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #999;
    background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
}

.no-image-placeholder i {
    font-size: 48px;
    margin-bottom: 8px;
}

.negotiable-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background: #dc3545;
    color: white;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    z-index: 10;
}

.card-body {
    padding: 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.price {
    color: #dc3545;
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 8px;
}

.title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.description {
    font-size: 13px;
    color: #666;
    line-height: 1.5;
    margin-bottom: 12px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    flex: 1;
}

.card-footer {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-top: 12px;
    border-top: 1px solid #f0f0f0;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 8px;
}

.user-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #dc3545;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 600;
}

.user-name {
    font-size: 13px;
    font-weight: 500;
    color: #333;
}

.meta-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.date {
    font-size: 12px;
    color: #999;
}

.stats {
    display: flex;
    gap: 12px;
}

.stat {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: #666;
}

.stat i {
    font-size: 14px;
}

@media (max-width: 768px) {
    .marketplace-card {
        max-width: 100%;
        min-width: 100%;
    }
}
</style>