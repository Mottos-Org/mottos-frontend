<template>
    <div class="admin-dashboard">
        <div class="dashboard-header">
            <div>
                <h1 class="dashboard-title">Dashboard General</h1>
                <p class="dashboard-subtitle">Últimos {{ dashboardData?.period_days || 30 }} días</p>
            </div>
            <button class="refresh-button" @click="fetchDashboardData" :disabled="loading">
                <i class="bi bi-arrow-clockwise" :class="{ 'spinning': loading }"></i>
                Actualizar
            </button>
        </div>

        <div v-if="loading" class="loading-state">
            <pulse-loader :loading="loading" color="#d63636" size="15px" />
            <p>Cargando estadísticas...</p>
        </div>

        <div v-else-if="error" class="error-state">
            <i class="bi bi-exclamation-triangle"></i>
            <p>{{ error }}</p>
            <button class="retry-button" @click="fetchDashboardData">Reintentar</button>
        </div>

        <div v-else class="dashboard-content">
            <!-- Stats Cards -->
            <div class="stats-grid">
                <!-- Posts Card -->
                <div class="stat-card primary">
                    <div class="stat-icon">
                        <i class="bi bi-file-earmark-text"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-header">
                            <span class="stat-label">Publicaciones</span>
                            <span class="stat-badge" :class="getGrowthClass(dashboardData.posts.growth_percentage)">
                                <i class="bi" :class="getGrowthIcon(dashboardData.posts.growth_percentage)"></i>
                                {{ dashboardData.posts.growth_percentage }}%
                            </span>
                        </div>
                        <div class="stat-value">{{ dashboardData.posts.total }}</div>
                        <div class="stat-details">
                            <span><i class="bi bi-check-circle"></i> {{ dashboardData.posts.approved }} aprobadas</span>
                            <span><i class="bi bi-clock"></i> {{ dashboardData.posts.pending_approval }} pendientes</span>
                        </div>
                    </div>
                </div>

                <!-- Users Card -->
                <div class="stat-card success">
                    <div class="stat-icon">
                        <i class="bi bi-people"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-header">
                            <span class="stat-label">Usuarios</span>
                            <span class="stat-badge" :class="getGrowthClass(dashboardData.users.growth_percentage)">
                                <i class="bi" :class="getGrowthIcon(dashboardData.users.growth_percentage)"></i>
                                {{ dashboardData.users.growth_percentage }}%
                            </span>
                        </div>
                        <div class="stat-value">{{ dashboardData.users.total }}</div>
                        <div class="stat-details">
                            <span><i class="bi bi-person-check"></i> {{ dashboardData.users.verified }} verificados</span>
                            <span><i class="bi bi-person-plus"></i> {{ dashboardData.users.recent }} nuevos</span>
                        </div>
                    </div>
                </div>

                <!-- Views Card -->
                <div class="stat-card info">
                    <div class="stat-icon">
                        <i class="bi bi-eye"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-header">
                            <span class="stat-label">Visualizaciones</span>
                            <span class="stat-badge" :class="getGrowthClass(dashboardData.views.growth_percentage)">
                                <i class="bi" :class="getGrowthIcon(dashboardData.views.growth_percentage)"></i>
                                {{ dashboardData.views.growth_percentage }}%
                            </span>
                        </div>
                        <div class="stat-value">{{ dashboardData.views.total }}</div>
                        <div class="stat-details">
                            <span><i class="bi bi-graph-up"></i> {{ dashboardData.views.average_per_post }} promedio</span>
                            <span><i class="bi bi-people"></i> {{ dashboardData.views.unique_viewers_recent }} únicos</span>
                        </div>
                    </div>
                </div>

                <!-- Messages Card -->
                <div class="stat-card warning">
                    <div class="stat-icon">
                        <i class="bi bi-chat-dots"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-header">
                            <span class="stat-label">Mensajes</span>
                            <span v-if="dashboardData.messages.unread > 0" class="stat-badge danger">
                                {{ dashboardData.messages.unread }} sin leer
                            </span>
                        </div>
                        <div class="stat-value">{{ dashboardData.messages.total }}</div>
                        <div class="stat-details">
                            <span><i class="bi bi-clock-history"></i> {{ dashboardData.messages.recent }} recientes</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Charts Section -->
            <div class="charts-grid">
                <!-- Posts Trend -->
                <div class="chart-card">
                    <div class="chart-header">
                        <h3>
                            <i class="bi bi-graph-up-arrow"></i>
                            Tendencia de Publicaciones
                        </h3>
                    </div>
                    <div class="chart-content">
                        <div v-if="dashboardData.trends.posts_per_day.length === 0" class="empty-chart">
                            <i class="bi bi-inbox"></i>
                            <p>No hay datos disponibles</p>
                        </div>
                        <div v-else class="bar-chart">
                            <div 
                                v-for="item in dashboardData.trends.posts_per_day" 
                                :key="item.date"
                                class="bar-item"
                            >
                                <div class="bar-wrapper">
                                    <div 
                                        class="bar" 
                                        :style="{ height: getBarHeight(item.count, maxPostsPerDay) }"
                                        :title="`${item.count} publicaciones`"
                                    >
                                        <span class="bar-value">{{ item.count }}</span>
                                    </div>
                                </div>
                                <span class="bar-label">{{ formatDate(item.date) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Top Brands -->
                <div class="chart-card">
                    <div class="chart-header">
                        <h3>
                            <i class="bi bi-award"></i>
                            Marcas Más Populares
                        </h3>
                    </div>
                    <div class="chart-content">
                        <div v-if="dashboardData.top_brands.length === 0" class="empty-chart">
                            <i class="bi bi-inbox"></i>
                            <p>No hay datos disponibles</p>
                        </div>
                        <div v-else class="brands-list">
                            <div 
                                v-for="(brand, index) in dashboardData.top_brands" 
                                :key="brand.marca"
                                class="brand-item"
                            >
                                <div class="brand-info">
                                    <span class="brand-rank">{{ index + 1 }}</span>
                                    <span class="brand-name">{{ brand.marca }}</span>
                                </div>
                                <div class="brand-progress">
                                    <div 
                                        class="brand-bar" 
                                        :style="{ width: getBrandPercentage(brand.count) }"
                                    ></div>
                                </div>
                                <span class="brand-count">{{ brand.count }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Top Viewed Posts -->
            <div class="posts-section">
                <div class="section-header">
                    <h3>
                        <i class="bi bi-fire"></i>
                        Publicaciones Más Vistas
                    </h3>
                </div>
                <div v-if="dashboardData.top_viewed_posts.length === 0" class="empty-state">
                    <i class="bi bi-inbox"></i>
                    <p>No hay publicaciones para mostrar</p>
                </div>
                <div v-else class="posts-grid">
                    <div 
                        v-for="post in dashboardData.top_viewed_posts" 
                        :key="post.publicacion_id"
                        class="post-card"
                    >
                        <div class="post-image">
                            <img 
                                :src="post.featured_image_url || '/default_post.png'" 
                                :alt="post.descripcion"
                                @error="(e) => e.target.src = '/default_post.png'"
                            />
                            <div class="post-badges">
                                <span class="badge-views">
                                    <i class="bi bi-eye"></i>
                                    {{ post.views }}
                                </span>
                                <span v-if="post.approved" class="badge-approved">
                                    <i class="bi bi-check-circle"></i>
                                </span>
                                <span v-else class="badge-pending">
                                    <i class="bi bi-clock"></i>
                                </span>
                            </div>
                        </div>
                        <div class="post-info">
                            <h4 class="post-title">{{ truncateText(post.descripcion, 50) }}</h4>
                            <div class="post-meta">
                                <span class="post-price">${{ formatPrice(post.precio) }}</span>
                                <span class="post-bike">
                                    <i class="bi bi-gear"></i>
                                    {{ post.bike.marca }} {{ post.bike.modelo }}
                                </span>
                            </div>
                            <div class="post-user">
                                <i class="bi bi-person"></i>
                                {{ post.user.nombres }} {{ post.user.apellidos }}
                            </div>
                            <div class="post-date">
                                <i class="bi bi-calendar"></i>
                                {{ formatDateTime(post.created_at) }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../services/api';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';

const dashboardData = ref(null);
const loading = ref(true);
const error = ref(null);

const API_BASE_URL = import.meta.env.VITE_API_URL;

const maxPostsPerDay = computed(() => {
    if (!dashboardData.value?.trends?.posts_per_day?.length) return 1;
    return Math.max(...dashboardData.value.trends.posts_per_day.map(item => item.count));
});

const totalBrands = computed(() => {
    if (!dashboardData.value?.top_brands?.length) return 1;
    return dashboardData.value.top_brands.reduce((sum, brand) => sum + brand.count, 0);
});

async function fetchDashboardData() {
    loading.value = true;
    error.value = null;
    
    try {
        const response = await api.get(`${API_BASE_URL}/api/admin/dashboard`);
        dashboardData.value = response.data;
    } catch (err) {
        console.error('Error fetching dashboard data:', err);
        error.value = 'Error al cargar las estadísticas. Por favor, intenta de nuevo.';
    } finally {
        loading.value = false;
    }
}

function getGrowthClass(percentage) {
    if (percentage > 0) return 'positive';
    if (percentage < 0) return 'negative';
    return 'neutral';
}

function getGrowthIcon(percentage) {
    if (percentage > 0) return 'bi-arrow-up';
    if (percentage < 0) return 'bi-arrow-down';
    return 'bi-dash';
}

function getBarHeight(count, max) {
    const percentage = (count / max) * 100;
    return `${Math.max(percentage, 5)}%`;
}

function getBrandPercentage(count) {
    const percentage = (count / totalBrands.value) * 100;
    return `${percentage}%`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-DO', { month: 'short', day: 'numeric' });
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-DO', { 
        year: 'numeric',
        month: 'short', 
        day: 'numeric'
    });
}

function formatPrice(price) {
    return Number(price).toLocaleString('es-DO', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function truncateText(text, length) {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
}

onMounted(() => {
    fetchDashboardData();
});
</script>

<style scoped>
.admin-dashboard {
    padding: 40px;
    max-width: 1600px;
    margin: 0 auto;
    min-height: 100vh;
}

.dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
}

.dashboard-title {
    font-size: 32px;
    font-weight: 700;
    color: #111827;
    margin: 0;
}

.dashboard-subtitle {
    font-size: 14px;
    color: #6b7280;
    margin: 4px 0 0 0;
}

.refresh-button {
    padding: 10px 20px;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-weight: 600;
    color: #374151;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
}

.refresh-button:hover:not(:disabled) {
    background: #f9fafb;
    border-color: #d1d5db;
}

.refresh-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.spinning {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.loading-state,
.error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
    color: #6b7280;
}

.error-state i {
    font-size: 48px;
    color: #ef4444;
    margin-bottom: 16px;
}

.retry-button {
    margin-top: 16px;
    padding: 10px 20px;
    background: #d63636;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.retry-button:hover {
    background: #b82828;
}

.dashboard-content {
    width: 100%;
}

/* Stats Grid - Fixed widths */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    margin-bottom: 32px;
}

.stat-card {
    background: white;
    border-radius: 16px;
    padding: 24px;
    display: flex;
    gap: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
    border-left: 4px solid;
    min-width: 0;
}

.stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.stat-card.primary { border-color: #d63636; }
.stat-card.success { border-color: #10b981; }
.stat-card.info { border-color: #3b82f6; }
.stat-card.warning { border-color: #f59e0b; }

.stat-icon {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    flex-shrink: 0;
}

.primary .stat-icon {
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
    color: #d63636;
}

.success .stat-icon {
    background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
    color: #10b981;
}

.info .stat-icon {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    color: #3b82f6;
}

.warning .stat-icon {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    color: #f59e0b;
}

.stat-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
}

.stat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
}

.stat-label {
    font-size: 14px;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.stat-badge {
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
}

.stat-badge.positive {
    background: #d1fae5;
    color: #10b981;
}

.stat-badge.negative {
    background: #fee2e2;
    color: #ef4444;
}

.stat-badge.neutral {
    background: #f3f4f6;
    color: #6b7280;
}

.stat-badge.danger {
    background: #fee2e2;
    color: #dc2626;
}

.stat-value {
    font-size: 36px;
    font-weight: 700;
    color: #111827;
    line-height: 1;
}

.stat-details {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 13px;
    color: #6b7280;
}

.stat-details span {
    display: flex;
    align-items: center;
    gap: 6px;
}

.stat-details i {
    font-size: 12px;
}

/* Charts Grid - Fixed widths */
.charts-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    margin-bottom: 32px;
}

.chart-card {
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    min-width: 0;
}

.chart-header {
    margin-bottom: 24px;
}

.chart-header h3 {
    font-size: 18px;
    font-weight: 700;
    color: #111827;
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0;
}

.chart-header i {
    color: #d63636;
}

.chart-content {
    width: 100%;
}

.empty-chart {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    color: #9ca3af;
}

.empty-chart i {
    font-size: 48px;
    margin-bottom: 12px;
}

/* Bar Chart */
.bar-chart {
    display: flex;
    align-items: flex-end;
    gap: 16px;
    height: 200px;
    width: 100%;
}

.bar-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    min-width: 0;
}

.bar-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-end;
}

.bar {
    width: 100%;
    background: linear-gradient(180deg, #d63636 0%, #b82828 100%);
    border-radius: 8px 8px 0 0;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 8px;
    cursor: pointer;
    transition: all 0.3s;
    position: relative;
}

.bar:hover {
    transform: scaleY(1.05);
    filter: brightness(1.1);
}

.bar-value {
    font-size: 12px;
    font-weight: 700;
    color: white;
}

.bar-label {
    font-size: 11px;
    color: #6b7280;
    font-weight: 600;
    white-space: nowrap;
}

/* Brands List */
.brands-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.brand-item {
    display: flex;
    align-items: center;
    gap: 12px;
}

.brand-info {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 150px;
}

.brand-rank {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
    color: #d63636;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    flex-shrink: 0;
}

.brand-name {
    font-weight: 600;
    color: #374151;
}

.brand-progress {
    flex: 1;
    height: 12px;
    background: #f3f4f6;
    border-radius: 6px;
    overflow: hidden;
}

.brand-bar {
    height: 100%;
    background: linear-gradient(90deg, #d63636 0%, #b82828 100%);
    border-radius: 6px;
    transition: width 0.5s ease;
}

.brand-count {
    min-width: 40px;
    text-align: right;
    font-weight: 700;
    color: #111827;
    flex-shrink: 0;
}

/* Posts Section */
.posts-section {
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-header {
    margin-bottom: 24px;
}

.section-header h3 {
    font-size: 20px;
    font-weight: 700;
    color: #111827;
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0;
}

.section-header i {
    color: #f59e0b;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    color: #9ca3af;
}

.empty-state i {
    font-size: 48px;
    margin-bottom: 12px;
}

.posts-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
}

.post-card {
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s;
    min-width: 0;
}

.post-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.post-image {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;
    background: #f3f4f6;
}

.post-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.post-badges {
    position: absolute;
    top: 12px;
    right: 12px;
    display: flex;
    gap: 8px;
}

.badge-views,
.badge-approved,
.badge-pending {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 4px;
    backdrop-filter: blur(8px);
}

.badge-views {
    background: rgba(0, 0, 0, 0.7);
    color: white;
}

.badge-approved {
    background: rgba(16, 185, 129, 0.9);
    color: white;
}

.badge-pending {
    background: rgba(245, 158, 11, 0.9);
    color: white;
}

.post-info {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.post-title {
    font-size: 15px;
    font-weight: 600;
    color: #111827;
    margin: 0;
    line-height: 1.4;
}

.post-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
}

.post-price {
    font-size: 18px;
    font-weight: 700;
    color: #d63636;
}

.post-bike {
    font-size: 12px;
    color: #6b7280;
    display: flex;
    align-items: center;
    gap: 4px;
}

.post-user,
.post-date {
    font-size: 12px;
    color: #9ca3af;
    display: flex;
    align-items: center;
    gap: 6px;
}

@media (max-width: 1200px) {
    .charts-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .admin-dashboard {
        padding: 20px;
    }

    .dashboard-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
    }

    .stats-grid {
        grid-template-columns: 1fr;
    }

    .posts-grid {
        grid-template-columns: 1fr;
    }

    .bar-chart {
        gap: 8px;
    }
}
</style>