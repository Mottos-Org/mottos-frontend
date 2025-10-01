<template>
    <div class="dashboard-home">
        <div class="dashboard-header">
            <h1 class="dashboard-title">Mi Dashboard</h1>
            <p class="dashboard-subtitle">Gestiona tus publicaciones y estadísticas</p>
        </div>

        <div class="dashboard-stats row g-4 mb-5">
            <div class="col-md-4" v-for="card in statCards" :key="card.title">
                <div class="stat-card">
                    <div :class="['stat-icon', card.bg]">
                        <i :class="card.icon"></i>
                    </div>
                    <div class="stat-info">
                        <div class="stat-value">{{ card.value }}</div>
                        <div class="stat-label">{{ card.label }}</div>
                        <div class="stat-desc">{{ card.desc }}</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="recent-posts-header d-flex justify-content-between align-items-center mb-3">
            <div>
                <h2 class="recent-title">Publicaciones Recientes</h2>
                <p class="recent-subtitle">Tus últimas motos publicadas</p>
            </div>
            <button class="btn btn-light btn-sm" @click="goToAllPosts">
                Ver todas <i class="bi bi-arrow-right ms-1"></i>
            </button>
        </div>

        <div class="recent-posts-list mb-5">
            <div class="row g-4">
                <div v-for="publicacion in lastPosts" :key="publicacion.publicacion_id" class="col-md-4 d-flex">
                    <PublicacionCard :publicacion="mapPublicacion(publicacion)" />
                </div>
                <div v-if="lastPosts.length === 0" class="col-12 text-center text-muted py-5">
                    No tienes publicaciones recientes.
                </div>
            </div>
        </div>

        <div class="more-bikes-cta my-5 p-4 text-center">
            <h5 class="fw-bold mb-2">¿Tienes más motos para vender?</h5>
            <p class="text-muted mb-3">Publica tus motos y llega a miles de compradores potenciales</p>
            <button class="btn btn-dark" @click="goToCreatePost">
                Publicar Nueva Moto
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import { useToast } from 'vue-toastification';
import PublicacionCard from '@/components/ui/posts/PublicacionCard.vue';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const auth = useAuthStore();
const toast = useToast();

const totalBikes = ref(0);
const totalPosts = ref(0);
const totalViews = ref(0);
const lastPosts = ref([]);

const statCards = [
    {
        title: 'Total de Motos',
        value: totalBikes,
        label: 'Motos en tu garaje',
        desc: '',
        icon: 'bi bi-bicycle',
        bg: 'stat-bg-red',
    },
    {
        title: 'Publicaciones',
        value: totalPosts,
        label: 'Anuncios activos',
        desc: '',
        icon: 'bi bi-file-earmark-text',
        bg: 'stat-bg-blue',
    },
    {
        title: 'Vistas (30 días)',
        value: totalViews,
        label: 'Visualizaciones totales',
        desc: '',
        icon: 'bi bi-eye',
        bg: 'stat-bg-green',
    },
];

const fetchDashboard = async () => {
    try {
        const userId = auth.userId || auth.user?.user_id;
        const { data } = await api.get(`/api/users/dashboard/${userId}`);
        totalBikes.value = data.total_bikes;
        totalPosts.value = data.total_posts;
        totalViews.value = data.total_views_30d;
        lastPosts.value = data.last_posts || [];
    } catch (e) {
        toast.error('Error al cargar el dashboard. Inténtalo de nuevo más tarde.');
        totalBikes.value = 0;
        totalPosts.value = 0;
        totalViews.value = 0;
        lastPosts.value = [];
    }
};

onMounted(fetchDashboard);

function goToAllPosts() {
    router.push('/perfil?tab=publicaciones');
}
function goToCreatePost() {
    router.push('/motos/publicacion/crear');
}

function mapPublicacion(post) {
    return {
        ...post,
        bike: {
            ...post.bike,
            displacement: post.bike?.displacement || '',
            power: post.bike?.power || '',
        },
        marca_denorm: post.bike?.marca,
        modelo_denorm: post.bike?.modelo,
        tipo_moneda: { nombre_tipo_moneda: 'US$' },
        condicion_motor: { nombre_condicion: post.condicion_motor || 'N/A' },
        user: auth.user
    };
}
</script>

<style scoped>
.dashboard-home {
    padding: 15px;
    max-width: 100%;
    /* margin: 0 auto; */
}

.dashboard-header {
    margin-bottom: 32px;
}

.dashboard-title {
    font-size: 2.2rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
}

.dashboard-subtitle {
    color: #6c757d;
    font-size: 1.1rem;
}

.dashboard-stats {
    margin-bottom: 40px;
}

.stat-card {
    background: #fff;
    border-radius: 18px;
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 1.5rem 1.25rem;
    min-height: 120px;
}

.stat-icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    color: #fff;
}

.stat-bg-red {
    background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
}

.stat-bg-blue {
    background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
}

.stat-bg-green {
    background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%);
}

.stat-info {
    flex: 1;
}

.stat-value {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
}

.stat-label {
    font-size: 1rem;
    color: #6c757d;
}

.stat-desc {
    font-size: 0.95rem;
    color: #adb5bd;
}

.recent-posts-header {
    margin-bottom: 1.5rem;
}

.recent-title {
    font-size: 1.35rem;
    font-weight: 700;
    margin-bottom: 0.15rem;
}

.recent-subtitle {
    color: #6c757d;
    font-size: 1rem;
}

.recent-posts-list {
    margin-bottom: 2.5rem;
}

.more-bikes-cta {
    background: #f8f9fa;
    border-radius: 1rem;
    border: 1.5px dashed #e0e0e0;
}
</style>