<template>
    <button class="favorite-btn" :aria-pressed="isFavorited" :disabled="loading" @click="toggleFavorite"
        :title="isFavorited ? 'Quitar de favoritos' : 'Guardar en favoritos'">
        <i :class="isFavorited ? 'bi bi-heart-fill' : 'bi bi-heart'" class="heart"></i>
        <span class="count">{{ favoriteCount }}</span>
        <span v-if="loading" class="spinner"></span>
    </button>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../../../stores/authStore';
import api from '../../../services/api';

const props = defineProps({
    postId: {
        type: [String, Number],
        required: true
    },
    postOwnerId: {
        type: [String, Number],
        required: true
    }
});

const emit = defineEmits(['update']);

const toast = useToast();
const auth = useAuthStore();

const isFavorited = ref(false);
const favoriteCount = ref(0);
const loading = ref(false);

const fetchStatus = async () => {
    if (!auth.isLoggedIn) return;
    try {
        const res = await api.get(`/api/publicaciones/favorites/${props.postId}`);
        isFavorited.value = !!res.data.is_favorited;
        favoriteCount.value = Number(res.data.favorite_count) || 0;
    } catch (e) {
        isFavorited.value = false;
        favoriteCount.value = 0;
    }
};

const toggleFavorite = async () => {
    if (!auth.isLoggedIn) {
        toast.info('Inicia sesión para guardar favoritos');
        return;
    }

    const currentUserId = String(auth.userId);
    const postOwnerId = String(props.postOwnerId);
    const isOwner = currentUserId === postOwnerId;
    if (isOwner) {
        toast.warning('No puedes guardar tu propia publicación en favoritos');
        return;
    }

    if (loading.value) return;
    loading.value = true;
    try {
        const res = await api.post(`/api/publicaciones/${props.postId}/toggle-favorite/`);
        isFavorited.value = !!res.data.is_favorited;
        favoriteCount.value = Number(res.data.favorite_count) || 0;
        emit('update', { isFavorited: isFavorited.value, favoriteCount: favoriteCount.value });
    } catch (e) {
        toast.error('Error al actualizar favoritos');
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchStatus();
});
</script>

<style scoped>
.favorite-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    color: #dc2626;
    padding: 0.25rem 0.5rem;
    border-radius: 999px;
    transition: all 0.2s;
    position: relative;
}

.favorite-btn:hover {
    transform: scale(1.1);
}

.favorite-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.heart {
    font-size: 1.5em;
    transition: color 0.2s;
}

.favorite-btn:not(:disabled):hover .heart {
    color: #b91c1c;
}

.count {
    font-size: 1em;
    color: #333;
    font-weight: 600;
}

.spinner {
    width: 16px;
    height: 16px;
    border: 2px solid #e5e7eb;
    border-top: 2px solid #dc2626;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-left: 6px;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>