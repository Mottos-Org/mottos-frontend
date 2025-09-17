<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <PublicacionesFiltros 
                    :model-value="filters"
                    @update:model-value="updateFilters"
                    @apply-filters="applyFilters"
                    @clear-filters="clearFilters"
                />
                
                <LoadingStates 
                    v-if="loading && publicaciones.length === 0"
                    type="initial"
                />
                
                <ResultsInfo 
                    v-if="paginationData"
                    :pagination="paginationData"
                />
                
                <LoadingStates 
                    v-if="!loading && publicaciones.length === 0 && hasSearched"
                    type="no-results"
                />
                
                <div v-if="publicaciones.length > 0" class="publications-list">
                    <transition-group name="fade" tag="div">
                        <PublicacionCard 
                            v-for="publicacion in publicaciones"
                            :key="publicacion.publicacion_id"
                            :publicacion="publicacion"
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
                    v-if="publicaciones.length > 0 && !hasMorePages"
                    type="end"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive, onUnmounted } from 'vue';
import { useToast } from 'vue-toastification';
import api from '../../services/api';
import PublicacionesFiltros from '../../components/ui/posts/PublicacionesFiltros.vue';
import PublicacionCard from '../../components/ui/posts/PublicacionCard.vue';
import LoadingStates from '../../components/ui/posts/LoadingStates.vue';
import ResultsInfo from '../../components/ui/posts/ResultsInfo.vue';

const toast = useToast();
const publicaciones = ref([]);
const loading = ref(false);
const loadingMore = ref(false);
const hasSearched = ref(false);
const paginationData = ref(null);

const filters = reactive({
    marca: '',
    modelo: '',
    precio_min: '',
    precio_max: '',
    year_min: '',
    year_max: '',
    condicion_id: '',
    negociable: '',
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

const fetchPublicaciones = async (append = false) => {
    try {
        if (!append) {
            loading.value = true;
            publicaciones.value = [];
        } else {
            loadingMore.value = true;
        }

        const params = buildQueryParams();
        const response = await api.get(`/api/publicaciones?${params.toString()}`);
        
        if (append) {
            publicaciones.value.push(...response.data.data);
        } else {
            publicaciones.value = response.data.data;
        }
        
        paginationData.value = extractPaginationData(response.data);
        hasSearched.value = true;
        
    } catch (error) {
        console.error('Error fetching publicaciones:', error);
        toast.error('Error al cargar las publicaciones');
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
    
    // Always add these required parameters for the public view
    params.append('approved_only', '0');
    params.append('is_active', '0');
    
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
        await fetchPublicaciones(true);
    }
};

const applyFilters = async () => {
    filters.page = 1;
    await fetchPublicaciones();
};

const clearFilters = async () => {
    Object.keys(filters).forEach(key => {
        if (key === 'per_page') {
            filters[key] = '15';
        } else if (key === 'page') {
            filters[key] = 1;
        } else {
            filters[key] = '';
        }
    });
    
    await fetchPublicaciones();
};

// Infinite scroll
const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    
    if (scrollTop + clientHeight >= scrollHeight - 100 && hasMorePages.value && !loadingMore.value) {
        loadMore();
    }
};

onMounted(async () => {
    await fetchPublicaciones();
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.publications-list {
    padding: 10px;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from {
    opacity: 0;
    transform: translateX(-50px);
}

.fade-leave-to {
    opacity: 0;
    transform: translateX(50px);
}

:deep(.publications-list > div) {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
}

.col-12 {
    padding-right: 0px;
    padding-left: 0px;
}
</style>