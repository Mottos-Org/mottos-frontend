<template>
    <div class="post-header">
        <div class="title-section">
            <h1 class="post-title">{{ title }}</h1>
            <div class="post-badge">
                <i class="bi bi-eye-fill"></i>
                <span>{{ viewsCount }} {{ viewsCount === 1 ? 'vista' : 'vistas' }}</span>
            </div>

            <div v-if="canEdit" class="action-buttons">
                <button @click="handleEdit" class="btn btn-edit">
                    <i class="bi bi-pencil-square"></i>
                    Editar Publicación
                </button>
            </div>
        </div>
        
        <div class="details-grid">
            <div class="detail-item year-item">
                <div class="detail-icon">
                    <i class="bi bi-calendar3"></i>
                </div>
                <div class="detail-content">
                    <span class="detail-label">Año</span>
                    <span class="detail-value">{{ year || 'N/A' }}</span>
                </div>
            </div>
            
            <div class="detail-item location-item">
                <div class="detail-icon">
                    <i class="bi bi-geo-alt-fill"></i>
                </div>
                <div class="detail-content">
                    <span class="detail-label">Ubicación</span>
                    <span class="detail-value">{{ location }}</span>
                </div>
            </div>
        </div>
        
        <div class="price-container">
            <div class="price-section">
                <span class="currency">{{ currency }}</span>
                <span class="price">{{ formattedPrice }}</span>
            </div>
            <div class="price-note">
                <i class="bi bi-info-circle"></i>
                <span>Precio publicado</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../../../stores/authStore';

const props = defineProps({
    title: String,
    year: [String, Number],
    location: String,
    viewsCount: Number,
    currency: String,
    price: [String, Number],
    postId: {
        type: [String, Number],
        required: false
    },
    postOwnerId: {
        type: [String, Number],
        required: false
    }
});

const formattedPrice = computed(() => {
    if (!props.price) return '0';
    return new Intl.NumberFormat('es-DO', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(parseFloat(props.price));
});

const router = useRouter();
const auth = useAuthStore();

const canEdit = computed(() => {
    
    if (!auth.isLoggedIn) {
        return false;
    }
    
    if (!props.postId) {
        return false;
    }
    
    // Admin can edit any post
    if (auth.hasRole('Administrador')) {
        return true;
    }
    
    // Owner can edit their own post
    const currentUserId = String(auth.userId);
    const postOwnerId = String(props.postOwnerId);
    const isOwner = currentUserId === postOwnerId;
    if (isOwner) {
        return true;
    }
    
    return false;
});

const handleEdit = () => {
    console.log('🔗 Navigating to edit page:', `/motos/publicacion/${props.postId}/editar`);
    router.push(`/motos/publicacion/${props.postId}/editar`);
};
</script>

<style scoped>
.post-header {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    padding: 28px;
    border-radius: 16px;
    margin-bottom: 24px;
    box-shadow: 
        0 4px 20px rgba(0, 0, 0, 0.08),
        0 1px 3px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(220, 53, 69, 0.08);
    position: relative;
    overflow: hidden;
    text-align: left;
}

.post-header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #dc3545 0%, #fd7e14 100%);
}

.title-section {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
    gap: 16px;
}

.post-title {
    font-size: 2.2rem;
    font-weight: 800;
    color: #1a1a1a;
    line-height: 1.2;
    letter-spacing: -0.02em;
    flex: 1;
}

.post-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(220, 53, 69, 0.1);
    color: #dc3545;
    padding: 8px 12px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
    border: 1px solid rgba(220, 53, 69, 0.2);
}

.post-badge i {
    font-size: 12px;
}

.details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 28px;
}

.detail-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 12px;
    border: 1px solid rgba(220, 53, 69, 0.08);
    transition: all 0.3s ease;
}

.detail-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.1);
    border-color: rgba(220, 53, 69, 0.15);
}

.detail-icon {
    width: 42px;
    height: 42px;
    background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 4px 8px rgba(220, 53, 69, 0.2);
}

.detail-icon i {
    color: white;
    font-size: 18px;
}

.detail-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.detail-label {
    font-size: 12px;
    color: #6c757d;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.detail-value {
    font-size: 15px;
    color: #1a1a1a;
    font-weight: 600;
}

.price-container {
    background: rgba(220, 53, 69, 0.03);
    border: 1px solid rgba(220, 53, 69, 0.1);
    border-radius: 16px;
    padding: 20px;
    position: relative;
}

.price-section {
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 8px;
}

.currency {
    font-size: 1.4rem;
    color: #6c757d;
    font-weight: 700;
    text-transform: uppercase;
}

.price {
    font-size: 3rem;
    font-weight: 900;
    color: #dc3545;
    line-height: 1;
    letter-spacing: -0.02em;
}

.price-note {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #6c757d;
    font-size: 13px;
    font-weight: 500;
}

.price-note i {
    font-size: 12px;
}

@media (max-width: 768px) {
    .post-header {
        padding: 20px;
        margin-bottom: 20px;
    }
    
    .title-section {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
    }
    
    .post-title {
        font-size: 1.8rem;
    }
    
    .post-badge {
        align-self: flex-start;
    }
    
    .details-grid {
        grid-template-columns: 1fr;
        gap: 12px;
        margin-bottom: 20px;
    }
    
    .detail-item {
        padding: 12px;
    }
    
    .detail-icon {
        width: 36px;
        height: 36px;
    }
    
    .detail-icon i {
        font-size: 16px;
    }
    
    .price {
        font-size: 2.4rem;
    }
    
    .currency {
        font-size: 1.2rem;
    }
    
    .price-container {
        padding: 16px;
    }
}

@media (max-width: 480px) {
    .post-title {
        font-size: 1.5rem;
    }
    
    .price {
        font-size: 2rem;
    }
    
    .details-grid {
        gap: 8px;
    }
}

.action-buttons {
    display: flex;
    gap: 0.75rem;
    flex-shrink: 0;
}

.btn-edit {
    background: linear-gradient(135deg, #6c757d, #495057);
    color: white;
    border: none;
    padding: 0.75rem 1.25rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    text-decoration: none;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(108, 117, 125, 0.3);
}

.btn-edit:hover {
    background: linear-gradient(135deg, #5a6268, #343a40);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(108, 117, 125, 0.4);
    color: white;
}

.btn-edit:active {
    transform: translateY(0);
}

.btn-edit i {
    font-size: 1rem;
}

.price-section {
    border-top: 2px solid #f0f0f0;
    padding-top: 20px;
}

.price-container {
    display: flex;
    align-items: baseline;
    gap: 8px;
}

.currency {
    color: #6c757d;
    font-size: 1.2rem;
    font-weight: 600;
}

.price {
    color: #dc3545;
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 1;
}

@media (max-width: 768px) {
    .post-header {
        padding: 20px;
    }
    
    .header-content {
        flex-direction: column;
        align-items: stretch;
    }
    
    .action-buttons {
        margin-top: 1rem;
        justify-content: stretch;
    }
    
    .btn-edit {
        justify-content: center;
        width: 100%;
    }
    
    .post-title {
        font-size: 1.5rem;
    }
    
    .post-meta {
        gap: 12px;
    }
    
    .price {
        font-size: 2rem;
    }
}

@media (max-width: 480px) {
    .post-meta {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }
}
</style>