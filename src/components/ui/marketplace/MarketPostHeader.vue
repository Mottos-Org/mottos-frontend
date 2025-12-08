<template>
    <div class="market-post-header">
        <div class="header-top">
            <div class="title-section">
                <div class="category-badge" :class="`category-${category}`">
                    {{ getCategoryLabel(category) }}
                </div>
                <h1 class="post-title">{{ title }}</h1>
            </div>
            
            <div class="action-buttons">
                <button 
                    v-if="canEdit"
                    @click="handleEdit" 
                    class="btn-edit"
                >
                    <i class="bi bi-pencil-square"></i>
                    Editar
                </button>

                <button 
                    v-if="!isOwnPost"
                    class="favorite-btn"
                    :class="{ 'is-favorited': isFavorited }"
                    @click="$emit('toggle-favorite')"
                >
                    <i class="bi" :class="isFavorited ? 'bi-heart-fill' : 'bi-heart'"></i>
                    <span>{{ favoriteCount }}</span>
                </button>
                
                <button class="share-btn" @click="sharePost">
                    <i class="bi bi-share-fill"></i>
                    <span>Compartir</span>
                </button>
            </div>
        </div>

        <div class="header-details">
            <div class="price-section">
                <div class="currency-label">{{ currency }}</div>
                <div class="price">{{ formatPrice(price) }}</div>
                <div v-if="isNegotiable" class="negotiable-badge">
                    <i class="bi bi-currency-exchange"></i>
                    Negociable
                </div>
            </div>
            
            <div class="meta-info">
                <div class="meta-item">
                    <i class="bi bi-eye-fill"></i>
                    <span>{{ viewsCount }} vistas</span>
                </div>
                <div class="meta-item">
                    <i class="bi bi-heart-fill"></i>
                    <span>{{ likesCount }} me gusta</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from 'vue-toastification';

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    viewsCount: {
        type: Number,
        default: 0
    },
    likesCount: {
        type: Number,
        default: 0
    },
    currency: {
        type: String,
        default: 'DOP'
    },
    price: {
        type: [String, Number],
        required: true
    },
    isNegotiable: {
        type: Boolean,
        default: false
    },
    postId: {
        type: Number,
        required: true
    },
    postOwnerId: {
        type: Number,
        required: true
    },
    isFavorited: {
        type: Boolean,
        default: false
    },
    favoriteCount: {
        type: Number,
        default: 0
    }
});

const emit = defineEmits(['toggle-favorite']);

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const isOwnPost = computed(() => {
    if (!authStore.isLoggedIn) return false;
    return props.postOwnerId === parseInt(authStore.userId);
});

const canEdit = computed(() => {
    if (!authStore.isLoggedIn) return false;
    if (!props.postId) return false;
    
    if (authStore.hasRole('Administrador')) return true;
    
    return isOwnPost.value;
});

const handleEdit = () => {
    router.push(`/mercado/publicacion/${props.postId}/editar`);
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

const sharePost = async () => {
    const shareData = {
        title: props.title,
        text: `${props.title} - ${props.currency} ${formatPrice(props.price)}`,
        url: window.location.href
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            await navigator.clipboard.writeText(window.location.href);
            toast.success('Enlace copiado al portapapeles');
        }
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error('Error sharing:', error);
        }
    }
};
</script>

<style scoped>
.market-post-header {
    background: white;
    padding: 24px;
    border-radius: 12px;
    margin-bottom: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.header-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    gap: 20px;
}

.title-section {
    flex: 1;
    text-align: left;
}

.category-badge {
    display: inline-block;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 12px;
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

.post-title {
    font-size: 28px;
    font-weight: 700;
    color: #333;
    margin: 0;
    line-height: 1.3;
}

.action-buttons {
    display: flex;
    gap: 12px;
    flex-shrink: 0;
}

.btn-edit {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 16px;
    border: 2px solid #6c757d;
    background: white;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 14px;
    font-weight: 600;
    color: #6c757d;
}

.btn-edit:hover {
    background: #6c757d;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
}

.btn-edit i {
    font-size: 16px;
}

.favorite-btn,
.share-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 16px;
    border: 2px solid #e0e0e0;
    background: white;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 14px;
    font-weight: 600;
    color: #666;
}

.favorite-btn:hover,
.share-btn:hover {
    border-color: #dc3545;
    color: #dc3545;
    transform: translateY(-2px);
}

.favorite-btn.is-favorited {
    background: #dc3545;
    border-color: #dc3545;
    color: white;
}

.favorite-btn i {
    font-size: 18px;
}

.share-btn i {
    font-size: 16px;
}

.header-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20px;
    border-top: 2px solid #f0f0f0;
}

.price-section {
    display: flex;
    align-items: center;
    gap: 12px;
}

.currency-label {
    font-size: 18px;
    color: #666;
    font-weight: 600;
}

.price {
    font-size: 36px;
    font-weight: 700;
    color: #dc3545;
    line-height: 1;
}

.negotiable-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: rgba(220, 53, 69, 0.1);
    color: #dc3545;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
}

.meta-info {
    display: flex;
    gap: 20px;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #666;
    font-size: 14px;
}

.meta-item i {
    color: #dc3545;
    font-size: 16px;
}

@media (max-width: 768px) {
    .header-top {
        flex-direction: column;
    }
    
    .action-buttons {
        width: 100%;
        flex-wrap: wrap;
    }
    
    .btn-edit,
    .favorite-btn,
    .share-btn {
        flex: 1;
        justify-content: center;
        min-width: calc(50% - 6px);
    }
    
    .header-details {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
    }
    
    .price-section {
        flex-wrap: wrap;
    }
    
    .price {
        font-size: 28px;
    }
}
</style>