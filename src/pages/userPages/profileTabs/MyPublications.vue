<template>
    <div class="my-publications">
        <div class="header-section">
            <div class="header-content">
                <h4>
                    <i class="bi bi-file-post"></i>
                    Mis Publicaciones
                </h4>
                <p>Gestiona y revisa todas tus publicaciones</p>
            </div>
            <div class="header-actions">
                <router-link 
                    v-if="activeTab === 'bikes'"
                    to="/motos/publicacion/crear" 
                    class="btn btn-primary publish-btn"
                >
                    <i class="bi bi-plus-circle"></i>
                    Nueva Publicación
                </router-link>
                <button 
                    v-else
                    class="btn btn-primary publish-btn"
                    @click="createMarketplacePost"
                >
                    <i class="bi bi-plus-circle"></i>
                    Nueva Publicación
                </button>
            </div>
        </div>

        <!-- Tab Switcher -->
        <div class="tab-switcher">
            <button 
                :class="['tab-btn', { active: activeTab === 'bikes' }]"
                @click="switchTab('bikes')"
            >
                <i class="bi bi-bicycle"></i>
                Motos
                <span v-if="bikesTotal > 0" class="tab-count">{{ bikesTotal }}</span>
            </button>
            <button 
                :class="['tab-btn', { active: activeTab === 'marketplace' }]"
                @click="switchTab('marketplace')"
            >
                <i class="bi bi-tag"></i>
                Mercado
                <span v-if="marketTotal > 0" class="tab-count">{{ marketTotal }}</span>
            </button>
        </div>

        <div class="stats-row">
            <div class="stat-card">
                <div class="stat-icon active">
                    <i class="bi bi-check-circle"></i>
                </div>
                <div class="stat-content">
                    <h5>{{ stats.active }}</h5>
                    <span>Activas</span>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon pending">
                    <i class="bi bi-clock"></i>
                </div>
                <div class="stat-content">
                    <h5>{{ stats.pending }}</h5>
                    <span>Pendientes</span>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon expired">
                    <i class="bi bi-x-circle"></i>
                </div>
                <div class="stat-content">
                    <h5>{{ stats.expired }}</h5>
                    <span>Expiradas</span>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon total">
                    <i class="bi bi-collection"></i>
                </div>
                <div class="stat-content">
                    <h5>{{ stats.total }}</h5>
                    <span>Total</span>
                </div>
            </div>
        </div>

        <div class="filters-section">
            <div class="filter-tabs">
                <button 
                    v-for="filter in statusFilters" 
                    :key="filter.value"
                    class="filter-tab"
                    :class="{ active: activeStatusFilter === filter.value }"
                    @click="setStatusFilter(filter.value)"
                >
                    <i :class="filter.icon"></i>
                    {{ filter.label }}
                    <span v-if="filter.count" class="count-badge">{{ filter.count }}</span>
                </button>
            </div>
            <div class="filter-actions">
                <select 
                    v-model="sortBy" 
                    class="form-select"
                    @change="applyFilters"
                >
                    <option value="created_at">Más recientes</option>
                    <option value="fecha_vencimiento" v-if="activeTab === 'bikes'">Por vencimiento</option>
                    <option value="precio">Por precio</option>
                    <option value="views_count">Más vistas</option>
                </select>
            </div>
        </div>

        <LoadingStates 
            v-if="loading && items.length === 0"
            type="initial"
        />

        <div v-if="!loading && filteredItems.length === 0 && hasSearched" class="empty-state">
            <div class="empty-icon">
                <i :class="activeTab === 'bikes' ? 'bi bi-file-post' : 'bi bi-tag'"></i>
            </div>
            <h5>{{ getEmptyStateTitle() }}</h5>
            <p>{{ getEmptyStateMessage() }}</p>
            <router-link 
                v-if="activeStatusFilter === 'all' && activeTab === 'bikes'"
                to="/motos/publicacion/crear" 
                class="btn btn-primary"
            >
                <i class="bi bi-plus-circle"></i>
                Crear Primera Publicación
            </router-link>
            <button 
                v-if="activeStatusFilter === 'all' && activeTab === 'marketplace'"
                class="btn btn-primary"
                @click="createMarketplacePost"
            >
                <i class="bi bi-plus-circle"></i>
                Crear Primera Publicación
            </button>
        </div>

        <div v-if="filteredItems.length > 0" class="publications-section">
            <div class="publications-grid">
                <!-- Bike Posts -->
                <div 
                    v-if="activeTab === 'bikes'"
                    v-for="publicacion in filteredItems" 
                    :key="publicacion.publicacion_id"
                    class="publication-item"
                >
                    <MyPublicationCard 
                        :publicacion="publicacion"
                        @edit="handleEdit"
                        @delete="handleDelete"
                        @toggle-status="handleToggleStatus"
                    />
                </div>

                <!-- Marketplace Posts -->
                <div 
                    v-if="activeTab === 'marketplace'"
                    v-for="item in filteredItems" 
                    :key="item.publicacion_marketplace_id"
                    class="publication-item"
                >
                    <MyMarketplaceCard 
                        :item="item"
                        @edit="handleEditMarket"
                        @delete="handleDeleteMarket"
                        @toggle-status="handleToggleStatusMarket"
                    />
                </div>
            </div>
        </div>

        <LoadingStates 
            v-if="paginationData && hasMorePages"
            type="load-more"
            :loading="loadingMore"
            @load-more="loadMore"
        />
        
        <LoadingStates 
            v-if="items.length > 0 && !hasMorePages"
            type="end"
        />

        <teleport to="body">
            <transition name="fade-modal">
                <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
                    <div class="modal-box">
                        <div class="modal-icon">
                            <div class="icon-circle">
                                <i class="bi bi-trash"></i>
                            </div>
                        </div>
                        <h4 class="modal-title">¿Estás seguro?</h4>
                        <p class="modal-subtitle">
                            ¿Deseas eliminar esta publicación? Esta acción no se puede deshacer.
                        </p>
                        <div class="modal-actions">
                            <button class="btn cancel-btn" @click="showDeleteModal = false">
                                Cancelar
                            </button>
                            <button class="btn delete-btn" @click="confirmDelete" :disabled="deleting">
                                <div v-if="deleting" class="spinner-border spinner-border-sm me-2"></div>
                                <i v-if="!deleting" class="bi bi-trash me-1"></i>
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            </transition>
        </teleport>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../../../stores/authStore';
import api from '../../../services/api';
import LoadingStates from '../../../components/ui/posts/LoadingStates.vue';
import MyPublicationCard from '../../../components/ui/posts/MyPublicationCard.vue';
import MyMarketplaceCard from '../../../components/ui/marketplace/MyMarketplaceCard.vue';

const router = useRouter();
const toast = useToast();
const auth = useAuthStore();

const activeTab = ref('bikes'); // 'bikes' or 'marketplace'
const items = ref([]);
const loading = ref(false);
const loadingMore = ref(false);
const hasSearched = ref(false);
const paginationData = ref(null);
const deleting = ref(false);
const showDeleteModal = ref(false);
const itemToDelete = ref(null);
const togglingStatus = ref(false);
const bikesTotal = ref(0);
const marketTotal = ref(0);

const activeStatusFilter = ref('all');
const sortBy = ref('created_at');

const filters = reactive({
    user_id: auth.userId,
    per_page: '12',
    page: 1,
    sort_by: 'created_at',
    sort_direction: 'desc'
});

const stats = computed(() => {
    const active = items.value.filter(item => {
        if (activeTab.value === 'bikes') {
            return item.is_active && item.approved && !isExpired(item.fecha_vencimiento);
        } else {
            return item.is_active && item.approved;
        }
    }).length;
    
    const pending = items.value.filter(item => !item.approved).length;
    
    const expired = activeTab.value === 'bikes' 
        ? items.value.filter(item => isExpired(item.fecha_vencimiento)).length
        : 0;
    
    return {
        active,
        pending, 
        expired,
        total: items.value.length
    };
});

const statusFilters = computed(() => {
    const filters = [
        { 
            label: 'Todas', 
            value: 'all', 
            icon: 'bi bi-collection',
            count: stats.value.total
        },
        { 
            label: 'Activas', 
            value: 'active', 
            icon: 'bi bi-check-circle',
            count: stats.value.active
        },
        { 
            label: 'Pendientes', 
            value: 'pending', 
            icon: 'bi bi-clock',
            count: stats.value.pending
        }
    ];
    
    // Only add expired filter for bikes tab
    if (activeTab.value === 'bikes') {
        filters.push({ 
            label: 'Expiradas', 
            value: 'expired', 
            icon: 'bi bi-x-circle',
            count: stats.value.expired
        });
    }
    
    return filters;
});

const hasMorePages = computed(() => {
    return paginationData.value && paginationData.value.current_page < paginationData.value.last_page;
});

const filteredItems = computed(() => {
    let filtered = [...items.value];
    
    switch (activeStatusFilter.value) {
        case 'active':
            if (activeTab.value === 'bikes') {
                filtered = filtered.filter(item => item.is_active && item.approved && !isExpired(item.fecha_vencimiento));
            } else {
                filtered = filtered.filter(item => item.is_active && item.approved);
            }
            break;
        case 'pending':
            filtered = filtered.filter(item => !item.approved);
            break;
        case 'expired':
            if (activeTab.value === 'bikes') {
                filtered = filtered.filter(item => isExpired(item.fecha_vencimiento));
            }
            break;
        default:
            break;
    }
    
    return filtered;
});

const isExpired = (fechaVencimiento) => {
    if (!fechaVencimiento) return false;
    return new Date(fechaVencimiento) < new Date();
};

const getEmptyStateTitle = () => {
    const type = activeTab.value === 'bikes' ? 'publicaciones' : 'productos del mercado';
    switch (activeStatusFilter.value) {
        case 'active': return `No tienes ${type} activas`;
        case 'pending': return `No tienes ${type} pendientes`;
        case 'expired': return `No tienes ${type} expiradas`;
        default: return `No tienes ${type}`;
    }
};

const getEmptyStateMessage = () => {
    const type = activeTab.value === 'bikes' ? 'publicaciones' : 'productos';
    switch (activeStatusFilter.value) {
        case 'active': return `Tus ${type} activas aparecerán aquí una vez aprobadas`;
        case 'pending': return `No hay ${type} esperando aprobación`;
        case 'expired': return `Las ${type} vencidas aparecerán aquí`;
        default: return `Comienza creando tu primer ${activeTab.value === 'bikes' ? 'publicación de motocicleta' : 'producto del mercado'}`;
    }
};

const fetchItems = async (append = false) => {
    try {
        if (!append) {
            loading.value = true;
            items.value = [];
        } else {
            loadingMore.value = true;
        }

        const params = buildQueryParams();
        let response;
        
        if (activeTab.value === 'bikes') {
            response = await api.get(`/api/publicaciones?${params.toString()}`);
        } else {
            response = await api.get(`/api/marketplace?${params.toString()}`);
        }
        
        if (append) {
            items.value.push(...response.data.data);
        } else {
            items.value = response.data.data;
        }
        
        paginationData.value = extractPaginationData(response.data);
        
        // Update total counts
        if (activeTab.value === 'bikes') {
            bikesTotal.value = paginationData.value.total;
        } else {
            marketTotal.value = paginationData.value.total;
        }
        
        hasSearched.value = true;
        
    } catch (error) {
        console.error('Error fetching publications:', error);
        toast.error('Error al cargar tus publicaciones');
    } finally {
        loading.value = false;
        loadingMore.value = false;
    }
};

const buildQueryParams = () => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
            params.append(key, value);
        }
    });
    
    return params;
};

const extractPaginationData = (data) => ({
    current_page: data.current_page,
    last_page: data.last_page,
    per_page: data.per_page,
    total: data.total,
    from: data.from,
    to: data.to
});

const switchTab = async (tab) => {
    if (activeTab.value !== tab) {
        activeTab.value = tab;
        activeStatusFilter.value = 'all';
        filters.page = 1;
        await fetchItems();
    }
};

const setStatusFilter = async (filterValue) => {
    activeStatusFilter.value = filterValue;
    filters.page = 1;
    await fetchItems();
};

const applyFilters = async () => {
    filters.sort_by = sortBy.value;
    filters.page = 1;
    await fetchItems();
};

const loadMore = async () => {
    if (hasMorePages.value && !loadingMore.value) {
        filters.page++;
        await fetchItems(true);
    }
};

// Bike post handlers
const handleEdit = (publicacion) => {
    router.push(`/motos/publicacion/${publicacion.publicacion_id}/editar`);
};

const handleDelete = (publicacion) => {
    itemToDelete.value = { type: 'bike', data: publicacion };
    showDeleteModal.value = true;
};

const handleToggleStatus = async (publicacion) => {
    try {
        togglingStatus.value = true;
        const newStatus = !publicacion.is_active;
        
        const response = await api.put(`/api/publicaciones/disable-enable/${publicacion.publicacion_id}`, {
            is_active: newStatus
        });
        
        publicacion.is_active = response.data.is_active;
        
        const statusText = newStatus ? 'activada' : 'desactivada';
        toast.success(`Publicación ${statusText} exitosamente`);
        
    } catch (error) {
        console.error('Error toggling publication status:', error);
        toast.error('Error al cambiar el estado de la publicación');
    } finally {
        togglingStatus.value = false;
    }
};

// Marketplace post handlers
const handleEditMarket = (item) => {
    router.push(`/mercado/publicacion/${item.publicacion_marketplace_id}/editar`);
};

const handleDeleteMarket = (item) => {
    itemToDelete.value = { type: 'marketplace', data: item };
    showDeleteModal.value = true;
};

const handleToggleStatusMarket = async (item) => {
    try {
        togglingStatus.value = true;
        const newStatus = !item.is_active;
        
        const response = await api.put(`/api/marketplace/disable-enable/${item.publicacion_marketplace_id}/`, {
            is_active: newStatus
        });
        
        item.is_active = response.data.is_active;
        
        const statusText = newStatus ? 'activada' : 'desactivada';
        toast.success(`Publicación ${statusText} exitosamente`);
        
    } catch (error) {
        console.error('Error toggling marketplace status:', error);
        toast.error('Error al cambiar el estado de la publicación');
    } finally {
        togglingStatus.value = false;
    }
};

const confirmDelete = async () => {
    if (!itemToDelete.value) return;
    
    try {
        deleting.value = true;
        
        if (itemToDelete.value.type === 'bike') {
            await api.delete(`/api/publicaciones/${itemToDelete.value.data.publicacion_id}`);
            const index = items.value.findIndex(p => p.publicacion_id === itemToDelete.value.data.publicacion_id);
            if (index > -1) items.value.splice(index, 1);
        } else {
            await api.delete(`/api/marketplace/${itemToDelete.value.data.publicacion_marketplace_id}`);
            const index = items.value.findIndex(p => p.publicacion_marketplace_id === itemToDelete.value.data.publicacion_marketplace_id);
            if (index > -1) items.value.splice(index, 1);
        }
        
        toast.success('Publicación eliminada exitosamente');
        showDeleteModal.value = false;
        itemToDelete.value = null;
        
    } catch (error) {
        console.error('Error deleting publication:', error);
        toast.error('Error al eliminar la publicación');
    } finally {
        deleting.value = false;
    }
};

const createMarketplacePost = () => {
    router.push('/mercado/publicacion/crear');
};

watch(sortBy, (newSort) => {
    filters.sort_by = newSort;
    applyFilters();
});

onMounted(async () => {
    await fetchItems();
});
</script>

<style scoped>
.my-publications {
    padding: 15px;
}

.header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e9ecef;
}

.header-content h4 {
    color: #1a1a1a;
    font-weight: 700;
    margin-bottom: 0.25rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.header-content h4 i {
    color: #dc3545;
}

.header-content p {
    color: #6c757d;
    margin: 0;
}

.tab-switcher {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    padding: 0.25rem;
    background: #f8f9fa;
    border-radius: 10px;
}

.tab-btn {
    flex: 1;
    padding: 0.75rem 1.5rem;
    background: transparent;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    color: #6c757d;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    position: relative;
}

.tab-btn i {
    font-size: 1.1rem;
}

.tab-btn:hover {
    background: rgba(220, 53, 69, 0.05);
    color: #dc3545;
}

.tab-btn.active {
    background: white;
    color: #dc3545;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.tab-count {
    padding: 0.15rem 0.5rem;
    background: #dc3545;
    color: white;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 700;
    min-width: 24px;
    text-align: center;
}

.tab-btn.active .tab-count {
    background: #dc3545;
}

.tab-btn:not(.active) .tab-count {
    background: #6c757d;
}

.stats-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
}

.stat-card {
    background: white;
    border: 1px solid #e9ecef;
    border-radius: 12px;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: all 0.3s ease;
}

.stat-card:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    transform: translateY(-2px);
}

.stat-icon {
    width: 50px;
    height: 50px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: white;
}

.stat-icon.active { background: linear-gradient(135deg, #28a745, #20c997); }
.stat-icon.pending { background: linear-gradient(135deg, #ffc107, #fd7e14); }
.stat-icon.expired { background: linear-gradient(135deg, #dc3545, #e83e8c); }
.stat-icon.total { background: linear-gradient(135deg, #007bff, #6610f2); }

.stat-content h5 {
    font-size: 2rem;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0;
    line-height: 1;
}

.stat-content span {
    color: #6c757d;
    font-size: 0.9rem;
    font-weight: 500;
}

.filters-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
}

.filter-tabs {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.filter-tab {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border: 2px solid #e9ecef;
    border-radius: 20px;
    background: white;
    color: #6c757d;
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.filter-tab:hover {
    border-color: #dc3545;
    color: #dc3545;
}

.filter-tab.active {
    background: #dc3545;
    border-color: #dc3545;
    color: white;
}

.count-badge {
    background: rgba(255, 255, 255, 0.2);
    padding: 0.125rem 0.5rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 700;
}

.filter-tab.active .count-badge {
    background: rgba(255, 255, 255, 0.3);
}

.filter-actions .form-select {
    min-width: 200px;
    border: 2px solid #e9ecef;
    border-radius: 8px;
}

.empty-state {
    text-align: center;
    padding: 4rem 2rem;
    background: white;
    border-radius: 12px;
    border: 1px solid #e9ecef;
}

.empty-icon i {
    font-size: 4rem;
    color: #e9ecef;
    margin-bottom: 1rem;
}

.empty-state h5 {
    color: #1a1a1a;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.empty-state p {
    color: #6c757d;
    margin-bottom: 2rem;
}

.publications-section {
    margin-bottom: 2rem;
}

.publications-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 2rem;
}

.publication-item {
    display: flex;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.35);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    transition: all 0.3s ease;
}

.modal-box {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    width: 100%;
    max-width: 420px;
    text-align: center;
    box-shadow: 0 4px 40px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
}

.modal-icon {
    margin-bottom: 1rem;
}

.icon-circle {
    background-color: #fef2f2;
    color: #dc2626;
    border-radius: 9999px;
    width: 3.5rem;
    height: 3.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    margin: 0 auto;
}

.modal-title {
    font-weight: 700;
    font-size: 1.25rem;
    color: #111;
    margin-bottom: 0.25rem;
}

.modal-subtitle {
    font-size: 0.95rem;
    color: #6b7280;
    margin-bottom: 1.5rem;
    line-height: 1.5;
}

.modal-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
}

.publish-btn {
    background-color: #b70000;
    color: #fff;
    border: none;
    padding: 14.5px 12.5px;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 15px;
    text-decoration: none;
}

.publish-btn:hover {
    transform: scale(1.1);
    background-color: #d80000;
}

.cancel-btn {
    background: white;
    border: 1px solid #d1d5db;
    color: #111;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-weight: 600;
    transition: all 0.2s ease;
    cursor: pointer;
    display: flex;
    align-items: center;
}

.cancel-btn:hover {
    background-color: #f3f4f6;
}

.delete-btn {
    background-color: #dc2626;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    border: none;
    font-weight: 600;
    transition: all 0.2s ease;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 100px;
}

.delete-btn:hover:not(:disabled) {
    background-color: #b91c1c;
}

.delete-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.spinner-border-sm {
    width: 0.75rem;
    height: 0.75rem;
    border-width: 0.1em;
}

.fade-modal-enter-active,
.fade-modal-leave-active {
    transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-modal-enter-from,
.fade-modal-leave-to {
    opacity: 0;
    transform: scale(0.95);
}

.fade-modal-enter-to,
.fade-modal-leave-from {
    opacity: 1;
    transform: scale(1);
}

@media (max-width: 768px) {
    .header-section {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
    }
    
    .tab-switcher {
        flex-direction: column;
    }
    
    .tab-btn {
        width: 100%;
    }
    
    .stats-row {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .filters-section {
        flex-direction: column;
        align-items: stretch;
    }
    
    .filter-tabs {
        justify-content: center;
    }
    
    .filter-actions .form-select {
        width: 100%;
    }
    
    .publications-grid {
        grid-template-columns: 1fr;
    }
}
</style>