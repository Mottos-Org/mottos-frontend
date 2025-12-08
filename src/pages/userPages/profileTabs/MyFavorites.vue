<template>
    <div class="my-favorites">
        <div class="header-section">
            <div class="header-content">
                <h4>
                    <i class="bi bi-heart-fill"></i>
                    Mis Favoritos
                </h4>
                <p>Gestiona y revisa todas las publicaciones que has guardado en favoritos</p>
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

        <div class="filters-section">
            <div class="filter-actions">
                <select 
                    v-model="sortBy" 
                    class="form-select"
                    @change="applyFilters"
                >
                    <option value="created_at">Más recientes</option>
                    <option value="precio">Por precio</option>
                    <option value="views_count">Más vistas</option>
                </select>
            </div>
        </div>

        <LoadingStates 
            v-if="loading && items.length === 0"
            type="initial"
        />

        <div v-if="!loading && items.length === 0 && hasSearched" class="empty-state">
            <div class="empty-icon">
                <i class="bi bi-heart"></i>
            </div>
            <h5>No tienes favoritos guardados</h5>
            <p v-if="activeTab === 'bikes'">
                Comienza explorando las publicaciones y guarda las que te interesen
            </p>
            <p v-else>
                Explora el mercado y guarda los productos que te interesen
            </p>
            <router-link 
                :to="activeTab === 'bikes' ? '/motos/publicaciones' : '/mercado/publicaciones'" 
                class="btn btn-primary"
            >
                <i class="bi bi-search"></i>
                {{ activeTab === 'bikes' ? 'Explorar Publicaciones' : 'Explorar Mercado' }}
            </router-link>
        </div>

        <div v-if="items.length > 0" class="publications-section">
            <div class="publications-grid">
                <!-- Bike Posts -->
                <div 
                    v-if="activeTab === 'bikes'"
                    v-for="publicacion in items" 
                    :key="publicacion.publicacion_id"
                    class="publication-item"
                >
                    <PublicacionCard :publicacion="publicacion" />
                </div>

                <!-- Marketplace Posts -->
                <div 
                    v-if="activeTab === 'marketplace'"
                    v-for="item in items" 
                    :key="item.publicacion_marketplace_id"
                    class="publication-item"
                >
                    <MarketplaceCard :item="item" />
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
    </div>
</template>

<script setup>
import { ref, onMounted, reactive, watch, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../../../stores/authStore';
import api from '../../../services/api';
import LoadingStates from '../../../components/ui/posts/LoadingStates.vue';
import PublicacionCard from '../../../components/ui/posts/PublicacionCard.vue';
import MarketplaceCard from '../../../components/ui/marketplace/MarketplaceCard.vue';

const toast = useToast();
const auth = useAuthStore();

const activeTab = ref('bikes'); // 'bikes' or 'marketplace'
const items = ref([]);
const loading = ref(false);
const loadingMore = ref(false);
const hasSearched = ref(false);
const paginationData = ref(null);
const bikesTotal = ref(0);
const marketTotal = ref(0);

const sortBy = ref('created_at');

const filters = reactive({
    per_page: '12',
    page: 1,
    sort_by: 'created_at',
    sort_direction: 'desc'
});

const hasMorePages = computed(() => {
    return paginationData.value && paginationData.value.current_page < paginationData.value.last_page;
});

const fetchItems = async (append = false) => {
    try {
        if (!append) {
            loading.value = true;
            items.value = [];
        } else {
            loadingMore.value = true;
        }

        let response;
        const params = buildQueryParams();
        
        if (activeTab.value === 'bikes') {
            params.append('favorites_only', 'true');
            response = await api.get(`/api/publicaciones?${params.toString()}`);
        } else {
            params.append('liked_only', 'true');
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
        console.error('Error fetching favorites:', error);
        toast.error('Error al cargar tus favoritos');
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
        filters.page = 1;
        await fetchItems();
    }
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

watch(sortBy, (newSort) => {
    filters.sort_by = newSort;
    applyFilters();
});

onMounted(async () => {
    await fetchItems();
});
</script>

<style scoped>
.my-favorites {
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

.filters-section {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 2rem;
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
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    gap: 2rem;
}

.publication-item {
    display: flex;
    justify-content: center;
}

.btn {
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    border: 1px solid;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
}

.btn-primary {
    background: #dc3545;
    border-color: #dc3545;
    color: white;
}

.btn-primary:hover {
    background: #c82333;
    border-color: #c82333;
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
    
    .filters-section {
        justify-content: stretch;
    }
    
    .filter-actions .form-select {
        min-width: 100%;
    }
}
</style>