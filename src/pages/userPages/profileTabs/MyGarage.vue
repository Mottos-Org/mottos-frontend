<template>
    <div class="my-garage">
        <div class="header-section">
            <div class="header-content">
                <h4>
                    <i class="bi bi-motorcycle"></i>
                    Mi Garaje
                </h4>
                <p>Gestiona tu colección de motocicletas</p>
            </div>
            <div class="header-actions">
                <button @click="showCreateBikeModal = true" class="btn btn-primary add-bike-btn">
                    <i class="bi bi-plus-circle"></i>
                    Agregar Moto
                </button>
            </div>
        </div>

        <div class="stats-row">
            <div class="stat-card">
                <div class="stat-icon total">
                    <i class="fa fa-motorcycle"></i>
                </div>
                <div class="stat-content">
                    <h5>{{ bikes.length }}</h5>
                    <span>Total Motos</span>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon for-sale">
                    <i class="bi bi-currency-dollar"></i>
                </div>
                <div class="stat-content">
                    <h5>{{ stats.forSale }}</h5>
                    <span>En Venta</span>
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
                    <option value="year">Por año</option>
                    <option value="marca">Por marca</option>
                    <option value="displacement">Por cilindrada</option>
                </select>
            </div>
        </div>

        <LoadingStates 
            v-if="loading && bikes.length === 0"
            type="initial"
        />

        <div v-if="!loading && filteredBikes.length === 0 && hasSearched" class="empty-state">
            <div class="empty-icon">
                <i class="bi bi-motorcycle"></i>
            </div>
            <h5>{{ getEmptyStateTitle() }}</h5>
            <p>{{ getEmptyStateMessage() }}</p>
            <button 
                v-if="activeStatusFilter === 'all'"
                @click="showCreateBikeModal = true" 
                class="btn btn-primary"
            >
                <i class="bi bi-plus-circle"></i>
                Agregar Primera Moto
            </button>
        </div>

        <div v-if="filteredBikes.length > 0" class="bikes-section">
            <div class="bikes-grid">
                <BikeCard 
                    v-for="bike in filteredBikes" 
                    :key="bike.bike_id"
                    :bike="bike"
                    @edit="handleEdit"
                    @delete="handleDelete"
                    @sell="handleSell"
                    @view-details="handleViewDetails"
                />
            </div>
        </div>

        <LoadingStates 
            v-if="paginationData && hasMorePages"
            type="load-more"
            :loading="loadingMore"
            @load-more="loadMore"
        />
        
        <LoadingStates 
            v-if="bikes.length > 0 && !hasMorePages"
            type="end"
        />

        <CreateBikeModal 
            v-if="showCreateBikeModal"
            @close="showCreateBikeModal = false"
            @bike-created="handleBikeCreated"
        />

        <EditBikeModal 
            v-if="showEditBikeModal"
            :bike="bikeToEdit"
            @close="showEditBikeModal = false"
            @bike-updated="handleBikeUpdated"
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
                            ¿Deseas eliminar esta motocicleta de tu garaje? Esta acción no se puede deshacer.
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
import CreateBikeModal from '../../../components/forms/bikes/CreateBikeModal.vue';
import EditBikeModal from '../../../components/forms/bikes/EditBikeModal.vue';
import BikeCard from '../../../components/ui/bikes/BikeCard.vue';

const router = useRouter();
const toast = useToast();
const auth = useAuthStore();

const bikes = ref([]);
const loading = ref(false);
const loadingMore = ref(false);
const hasSearched = ref(false);
const paginationData = ref(null);
const deleting = ref(false);
const showCreateBikeModal = ref(false);
const showEditBikeModal = ref(false);
const showDeleteModal = ref(false);
const bikeToEdit = ref(null);
const bikeToDelete = ref(null);

const activeStatusFilter = ref('all');
const sortBy = ref('created_at');

const filters = reactive({
    per_page: '12',
    page: 1,
    sort_by: 'created_at',
    sort_direction: 'desc'
});

const stats = computed(() => {
    const forSale = bikes.value.filter(b => b.en_venta).length;
    const personal = bikes.value.filter(b => !b.en_venta).length;
    
    return {
        forSale,
        personal,
        total: bikes.value.length
    };
});

const statusFilters = computed(() => [
    { 
        label: 'Todas', 
        value: 'all', 
        icon: 'bi bi-collection',
        count: stats.value.total
    },
    { 
        label: 'En Venta', 
        value: 'for-sale', 
        icon: 'bi bi-currency-dollar',
        count: stats.value.forSale
    },
]);

const hasMorePages = computed(() => {
    return paginationData.value && paginationData.value.current_page < paginationData.value.last_page;
});

const filteredBikes = computed(() => {
    let filtered = [...bikes.value];
    
    switch (activeStatusFilter.value) {
        case 'for-sale':
            filtered = filtered.filter(b => b.en_venta);
            break;
        case 'personal':
            filtered = filtered.filter(b => !b.en_venta);
            break;
        default:
            break;
    }
    
    return filtered;
});

// Helper functions
const getEmptyStateTitle = () => {
    switch (activeStatusFilter.value) {
        case 'for-sale': return 'No tienes motos en venta';
        case 'personal': return 'No tienes motos personales';
        default: return 'No tienes motos en tu garaje';
    }
};

const getEmptyStateMessage = () => {
    switch (activeStatusFilter.value) {
        case 'for-sale': return 'Las motos que pongas en venta aparecerán aquí';
        case 'personal': return 'Las motos de tu colección personal aparecerán aquí';
        default: return 'Comienza agregando tu primera motocicleta';
    }
};

const fetchBikes = async (append = false) => {
    try {
        if (!append) {
            loading.value = true;
            bikes.value = [];
        } else {
            loadingMore.value = true;
        }

        const params = buildQueryParams();
        
        const response = await api.get(`/api/bikes?${params.toString()}`);
        
        if (append) {
            bikes.value.push(...response.data.data);
        } else {
            bikes.value = response.data.data;
        }
        
        paginationData.value = extractPaginationData(response.data);
        hasSearched.value = true;
    } catch (error) {
        toast.error('Error al cargar tus motocicletas');
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

const setStatusFilter = async (filterValue) => {
    activeStatusFilter.value = filterValue;
    filters.page = 1;
    await fetchBikes();
};

const applyFilters = async () => {
    filters.sort_by = sortBy.value;
    filters.page = 1;
    await fetchBikes();
};

const loadMore = async () => {
    if (hasMorePages.value && !loadingMore.value) {
        filters.page++;
        await fetchBikes(true);
    }
};

const handleEdit = (bike) => {
    bikeToEdit.value = bike;
    showEditBikeModal.value = true;
};

const handleDelete = (bike) => {
    bikeToDelete.value = bike;
    showDeleteModal.value = true;
};

const handleSell = (bike) => {
    router.push('/motos/publicacion/crear?bikeId=' + bike.bike_id);
};

const handleViewDetails = (bike) => {
    router.push({ 
        name: 'MyBikeDetails', 
        params: { id: bike.bike_id } 
    });
};

const handleBikeCreated = async (newBike) => {
    showCreateBikeModal.value = false;
    toast.success('¡Motocicleta agregada exitosamente!');
    await fetchBikes();
};

const handleBikeUpdated = async (updatedBike) => {
    showEditBikeModal.value = false;
    bikeToEdit.value = null;
    toast.success('¡Motocicleta actualizada exitosamente!');
    await fetchBikes();
};

const confirmDelete = async () => {
    if (!bikeToDelete.value) return;
    
    try {
        deleting.value = true;
        
        const response = await api.delete(`/api/bikes/${bikeToDelete.value.bike_id}`);
        
        const index = bikes.value.findIndex(b => b.bike_id === bikeToDelete.value.bike_id);
        if (index > -1) {
            bikes.value.splice(index, 1);
        }
        
        toast.success('Motocicleta eliminada exitosamente');
        showDeleteModal.value = false;
        bikeToDelete.value = null;
        
    } catch (error) {
        console.error('Error deleting bike:', error);
        
        if (error.response?.status === 404) {
            toast.error('La motocicleta no existe o ya fue eliminada');
        } else if (error.response?.status === 403) {
            toast.error('No puedes eliminar una motocicleta que está en venta');
        } else {
            toast.error('Error al eliminar la motocicleta');
        }
    } finally {
        deleting.value = false;
    }
};

watch(sortBy, (newSort) => {
    filters.sort_by = newSort;
    applyFilters();
});

onMounted(async () => {
    await fetchBikes();
});
</script>

<style scoped>
.my-garage {
    padding: 15px;
}

.header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
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

.stat-icon.total { background: linear-gradient(135deg, #dc3545, #c82333); }
.stat-icon.for-sale { background: linear-gradient(135deg, #28a745, #20c997); }
.stat-icon.personal { background: linear-gradient(135deg, #007bff, #6610f2); }

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

.bikes-section {
    margin-bottom: 2rem;
}

.bikes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 2rem;
}

.add-bike-btn {
    background-color: #dc3545;
    color: #fff;
    border: none;
    padding: 14.5px 12.5px;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 15px;
    gap: 0.5rem;
}

.add-bike-btn:hover {
    transform: scale(1.05);
    background-color: #c82333;
}

/* Modal styles (reuse from MyPublications) */
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
    
    .filters-section {
        justify-content: stretch;
    }
    
    .filter-actions .form-select {
        min-width: 100%;
    }
    
    .bikes-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    
    .stats-row {
        grid-template-columns: 1fr;
    }
}
</style>