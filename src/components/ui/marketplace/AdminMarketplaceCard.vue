<template>
    <div class="admin-marketplace-card" @click="goToDetails">
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
            
            <div class="overlay-badges">
                <span v-if="item.negociable" class="negotiable-badge">Negociable</span>
                <span v-if="!item.approved" class="pending-badge">
                    <i class="bi bi-clock-history"></i>
                    Pendiente
                </span>
                <span v-else class="approved-badge">
                    <i class="bi bi-check-circle"></i>
                    Aprobado
                </span>
            </div>
        </div>

        <div class="card-body">
            <div class="price">
                {{ item.tipo_moneda?.nombre_tipo_moneda || 'RD$' }} {{ formatPrice(item.precio) }}
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
                            {{ item.views_denorm || 0 }}
                        </span>
                        <span class="stat">
                            <i class="bi bi-heart"></i>
                            {{ item.like_qty_denorm || 0 }}
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
    router.push(`/auth/admin/marketplace/approve/${props.item.publicacion_marketplace_id}`);
};

const getCategoryLabel = (category) => {
    const labels = {
        'parts': 'Piezas',
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
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    
    return date.toLocaleDateString('es-DO', {
        month: 'short',
        day: 'numeric'
    });
};

const getInitials = (user) => {
    if (!user) return '?';
    const first = user.nombres?.charAt(0) || '';
    const last = user.apellidos?.charAt(0) || '';
    return (first + last).toUpperCase() || '?';
};
</script>

<style scoped>
.admin-marketplace-card {
    min-width: 320px;
    max-width: 320px;
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    cursor: pointer;
    display: flex;
    flex-direction: column;
}

.admin-marketplace-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-image {
    position: relative;
    width: 100%;
    height: 200px;
    background: #f8f9fa;
    overflow: hidden;
}

.card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.no-image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    color: #adb5bd;
}

.no-image-placeholder i {
    font-size: 3rem;
    margin-bottom: 0.5rem;
}

.no-image-placeholder span {
    font-size: 0.9rem;
    font-weight: 500;
}

.category-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    z-index: 2;
    backdrop-filter: blur(8px);
}

.category-parts {
    background: rgba(59, 130, 246, 0.9);
    color: white;
}

.category-accessories {
    background: rgba(16, 185, 129, 0.9);
    color: white;
}

.category-other {
    background: rgba(107, 114, 128, 0.9);
    color: white;
}

.overlay-badges {
    position: absolute;
    top: 12px;
    right: 12px;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-end;
    z-index: 2;
}

.negotiable-badge,
.pending-badge,
.approved-badge {
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 600;
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.negotiable-badge {
    background: rgba(245, 158, 11, 0.9);
    color: white;
}

.pending-badge {
    background: rgba(239, 68, 68, 0.9);
    color: white;
}

.approved-badge {
    background: rgba(34, 197, 94, 0.9);
    color: white;
}

.card-body {
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    flex: 1;
}

.price {
    font-size: 1.5rem;
    font-weight: 700;
    color: #dc3545;
    margin-bottom: 0.75rem;
}

.title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #212529;
    margin-bottom: 0.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-height: 1.4;
}

.description {
    font-size: 0.9rem;
    color: #6c757d;
    margin-bottom: 1rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-height: 1.5;
    flex: 1;
}

.card-footer {
    border-top: 1px solid #e9ecef;
    padding-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: 0.85rem;
    flex-shrink: 0;
}

.user-name {
    font-size: 0.9rem;
    font-weight: 500;
    color: #495057;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.meta-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.date {
    font-size: 0.85rem;
    color: #adb5bd;
}

.stats {
    display: flex;
    gap: 1rem;
}

.stat {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.85rem;
    color: #6c757d;
}

.stat i {
    font-size: 0.9rem;
}

@media (max-width: 768px) {
    .admin-marketplace-card {
        min-width: 280px;
        max-width: 280px;
    }
}
</style>