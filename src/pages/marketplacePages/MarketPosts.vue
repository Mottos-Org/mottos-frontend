<template>
    <div class="container-fluid market-posts-page">
        <div class="page-header">
            <h1>Marketplace de Mottos</h1>
            <p class="subtitle">Encuentra repuestos, accesorios y piezas para tu motocicleta.</p>
        </div>

        <div class="row">
            <div class="col-lg-3 col-md-4">
                <MarketplaceFilters
                    :model-value="filters"
                    :total-count="paginationData?.total || 0"
                    @update:model-value="updateFilters"
                    @apply-filters="applyFilters"
                    @clear-filters="clearFilters"
                />
            </div>

            <div class="col-lg-9 col-md-8">
                <div class="search-section">
                    <div class="search-bar">
                        <i class="bi bi-search"></i>
                        <input 
                            v-model="searchQuery"
                            type="text"
                            class="search-input"
                            placeholder="Buscar productos..."
                            @input="debouncedSearch"
                        />
                        <button 
                            v-if="searchQuery"
                            class="clear-search-btn"
                            @click="clearSearch"
                        >
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </div>
                    <div class="results-count" v-if="paginationData">
                        <span>{{ paginationData.total }} resultados</span>
                    </div>
                </div>

                <LoadingStates 
                    v-if="loading && marketItems.length === 0"
                    type="initial"
                    message="Cargando productos del marketplace..."
                />

                <LoadingStates 
                    v-if="!loading && marketItems.length === 0 && hasSearched"
                    type="no-results"
                    title="No encontramos productos"
                    message="No hay productos que coincidan con tus filtros"
                />

                <div v-if="marketItems.length > 0" class="marketplace-grid">
                    <transition-group name="fade" tag="div" class="grid-container">
                        <MarketplaceCard 
                            v-for="item in marketItems"
                            :key="item.publicacion_marketplace_id"
                            :item="item"
                        />
                    </transition-group>
                </div>

                <LoadingStates 
                    v-if="paginationData && hasMorePages"
                    type="load-more"
                    :loading="loadingMore"
                    @load-more="loadMore"
                />

                <LoadingStates 
                    v-if="marketItems.length > 0 && !hasMorePages"
                    type="end"
                    message="Has visto todos los productos disponibles"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue';
import { useToast } from 'vue-toastification';
import api from '@/services/api';
import MarketplaceFilters from '@/components/ui/marketplace/MarketplaceFilters.vue';
import MarketplaceCard from '@/components/ui/marketplace/MarketplaceCard.vue';
import LoadingStates from '@/components/ui/posts/LoadingStates.vue';

const toast = useToast();
const marketItems = ref([]);
const loading = ref(false);
const loadingMore = ref(false);
const hasSearched = ref(false);
const paginationData = ref(null);
const searchQuery = ref('');
let searchDebounceTimer = null;

const filters = reactive({
    category: '',
    negociable: false,
    search: '',
    per_page: '15',
    page: 1
});

const hasMorePages = computed(() => {
    return paginationData.value && paginationData.value.current_page < paginationData.value.last_page;
});

const updateFilters = (newFilters) => {
    Object.keys(filters).forEach(key => {
        if (newFilters.hasOwnProperty(key)) {
            filters[key] = newFilters[key];
        }
    });
};

const debouncedSearch = () => {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
        filters.search = searchQuery.value;
        applyFilters();
    }, 500);
};

const clearSearch = () => {
    searchQuery.value = '';
    filters.search = '';
    applyFilters();
};

const fetchMarketItems = async (append = false) => {
    try {
        if (!append) {
            loading.value = true;
            marketItems.value = [];
        } else {
            loadingMore.value = true;
        }

        const params = buildQueryParams();
        const response = await api.get(`/api/marketplace?${params.toString()}`);
        
        if (append) {
            marketItems.value.push(...response.data.data);
        } else {
            marketItems.value = response.data.data;
        }
        
        paginationData.value = extractPaginationData(response.data);
        hasSearched.value = true;
        
    } catch (error) {
        console.error('Error fetching marketplace items:', error);
        toast.error('Error al cargar los productos del marketplace');
    } finally {
        loading.value = false;
        loadingMore.value = false;
    }
};

const buildQueryParams = () => {
    const params = new URLSearchParams();
    
    // Add pagination
    params.append('page', filters.page);
    params.append('per_page', filters.per_page);
    
    // Add required filters for public view
    params.append('is_active', '1');
    params.append('approved_only', '1');
    
    // Add category filter if selected
    if (filters.category) {
        params.append('category', filters.category);
    }
    
    // Add search filter if provided
    if (filters.search) {
        params.append('search', filters.search);
    }
    
    // Add negociable filter only if checked
    if (filters.negociable) {
        params.append('negociable', '1');
    }
    
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

const loadMore = async () => {
    if (hasMorePages.value && !loadingMore.value) {
        filters.page++;
        await fetchMarketItems(true);
    }
};

const applyFilters = async () => {
    filters.page = 1;
    await fetchMarketItems();
};

const clearFilters = async () => {
    searchQuery.value = '';
    Object.keys(filters).forEach(key => {
        if (key === 'per_page') {
            filters[key] = '15';
        } else if (key === 'page') {
            filters[key] = 1;
        } else if (key === 'negociable') {
            filters[key] = false;
        } else {
            filters[key] = '';
        }
    });
    
    await fetchMarketItems();
};

// Infinite scroll
const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    
    if (scrollTop + clientHeight >= scrollHeight - 100 && hasMorePages.value && !loadingMore.value) {
        loadMore();
    }
};

onMounted(async () => {
    await fetchMarketItems();
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.market-posts-page {
    padding: 40px 20px;
    background: #fafafa;
    min-height: 100vh;
}

.page-header {
    margin-bottom: 32px;
    text-align: center;
}

.page-header h1 {
    font-size: 36px;
    font-weight: 700;
    color: #333;
    margin-bottom: 8px;
}

.subtitle {
    font-size: 16px;
    color: #666;
}

.search-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    gap: 16px;
}

.search-bar {
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 12px 16px;
    transition: border-color 0.2s ease;
}

.search-bar:focus-within {
    border-color: #dc3545;
    box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.search-bar i.bi-search {
    color: #999;
    font-size: 18px;
    margin-right: 12px;
}

.search-input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 15px;
    color: #333;
    background: transparent;
}

.search-input::placeholder {
    color: #999;
}

.clear-search-btn {
    background: none;
    border: none;
    color: #999;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s ease;
}

.clear-search-btn:hover {
    color: #dc3545;
}

.clear-search-btn i {
    font-size: 14px;
}

.results-count {
    font-size: 14px;
    font-weight: 600;
    color: #666;
    white-space: nowrap;
}

.marketplace-grid {
    margin-bottom: 32px;
}

.grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
    justify-items: center;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from {
    opacity: 0;
    transform: translateY(20px);
}

.fade-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}

@media (max-width: 1200px) {
    .grid-container {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    }
}

@media (max-width: 768px) {
    .page-header h1 {
        font-size: 28px;
    }
    
    .search-section {
        flex-direction: column;
        align-items: stretch;
    }
    
    .search-bar {
        width: 100%;
    }
    
    .results-count {
        text-align: center;
    }
    
    .grid-container {
        grid-template-columns: 1fr;
    }
}
</style>