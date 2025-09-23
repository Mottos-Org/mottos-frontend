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
            v-if="loading && publicaciones.length === 0"
            type="initial"
        />

        <div v-if="!loading && publicaciones.length === 0 && hasSearched" class="empty-state">
            <div class="empty-icon">
                <i class="bi bi-heart"></i>
            </div>
            <h5>No tienes favoritos guardados</h5>
            <p>Comienza explorando las publicaciones y guarda las que te interesen</p>
            <router-link 
                to="/motos/publicaciones" 
                class="btn btn-primary"
            >
                <i class="bi bi-search"></i>
                Explorar Publicaciones
            </router-link>
        </div>

        <div v-if="publicaciones.length > 0" class="publications-section">
            <div class="publications-grid">
                <div 
                    v-for="publicacion in publicaciones" 
                    :key="publicacion.publicacion_id"
                    class="publication-item"
                >
                    <PublicacionCard 
                        :publicacion="publicacion"
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
            v-if="publicaciones.length > 0 && !hasMorePages"
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

const toast = useToast();
const auth = useAuthStore();

const publicaciones = ref([]);
const loading = ref(false);
const loadingMore = ref(false);
const hasSearched = ref(false);
const paginationData = ref(null);

const sortBy = ref('created_at');

const filters = reactive({
    favorites_only: 'true',
    per_page: '12',
    page: 1,
    sort_by: 'created_at',
    sort_direction: 'desc'
});

const hasMorePages = computed(() => {
    return paginationData.value && paginationData.value.current_page < paginationData.value.last_page;
});

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
        console.error('Error fetching favorite publications:', error);
        toast.error('Error al cargar tus publicaciones favoritas');
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

const applyFilters = async () => {
    filters.sort_by = sortBy.value;
    filters.page = 1;
    await fetchPublicaciones();
};

const loadMore = async () => {
    if (hasMorePages.value && !loadingMore.value) {
        filters.page++;
        await fetchPublicaciones(true);
    }
};

watch(sortBy, (newSort) => {
    filters.sort_by = newSort;
    applyFilters();
});

onMounted(async () => {
    await fetchPublicaciones();
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
    
    .filters-section {
        justify-content: stretch;
    }
    
    .filter-actions .form-select {
        min-width: 100%;
    }
}
</style>