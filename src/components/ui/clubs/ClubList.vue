<template>
    <div class="club-list-container">
        <div class="list-header">
            <h2 class="list-title">
                <i class="bi bi-people-fill"></i>
                Clubes Registrados
            </h2>
            <p class="list-subtitle">Descubre y únete a los clubes de motociclistas</p>
            
            <!-- Search bar -->
            <div class="search-section">
                <div class="search-wrapper">
                    <i class="bi bi-search search-icon"></i>
                    <input
                        v-model="searchQuery"
                        type="text"
                        class="search-input"
                        placeholder="Busca clubes por nombre..."
                        @input="handleSearch"
                    />
                </div>
            </div>

            <div class="stats">
                <span class="stat-item">
                    <i class="bi bi-building"></i>
                    {{ totalClubs }} {{ totalClubs === 1 ? 'club' : 'clubes' }}
                </span>
            </div>
        </div>

        <!-- Loading state -->
        <div v-if="loading && clubs.length === 0" class="loading-state">
            <div class="spinner-border text-danger" role="status">
                <span class="visually-hidden">Cargando clubes...</span>
            </div>
            <p>Cargando clubes...</p>
        </div>

        <!-- Empty state -->
        <div v-else-if="!loading && clubs.length === 0" class="empty-state">
            <div class="empty-icon">
                <i class="bi bi-inbox"></i>
            </div>
            <h4>{{ searchQuery ? 'No se encontraron clubes' : 'No hay clubes disponibles' }}</h4>
            <p>{{ searchQuery ? 'Intenta con otro término de búsqueda' : 'Vuelve más tarde para ver nuevos clubes' }}</p>
        </div>

        <!-- Clubs grid with infinite scroll -->
        <div v-else class="clubs-grid" ref="scrollContainer" @scroll="handleScroll">
            <ClubCard
                v-for="club in clubs"
                :key="club.club_id"
                :club="club"
                @join="handleJoinClub"
                @view-details="handleViewDetails"
            />
        </div>

        <!-- Loading more indicator -->
        <div v-if="loading && clubs.length > 0" class="loading-more">
            <div class="spinner-border spinner-border-sm text-danger"></div>
            <span>Cargando más clubes...</span>
        </div>

        <!-- End of results message -->
        <div v-if="!hasMorePages && clubs.length > 0" class="end-of-results">
            <i class="bi bi-check-circle"></i>
            <p>No hay más clubes para mostrar</p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import api from '@/services/api';
import ClubCard from './ClubCard.vue';

const props = defineProps({
    perPage: {
        type: Number,
        default: 12
    }
});

const emit = defineEmits(['join-club', 'view-details']);

const toast = useToast();

const clubs = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const lastPage = ref(1);
const totalClubs = ref(0);
const searchQuery = ref('');
const scrollContainer = ref(null);
const searchTimeout = ref(null);

const hasMorePages = computed(() => {
    return currentPage.value < lastPage.value;
});

const fetchClubs = async (page = 1, append = false) => {
    try {
        loading.value = true;
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('per_page', props.perPage);
        
        if (searchQuery.value.trim()) {
            params.append('search', searchQuery.value.trim());
        }

        const response = await api.get(`/api/clubs?${params.toString()}`);
        
        if (append) {
            clubs.value.push(...(response.data.clubs || []));
        } else {
            clubs.value = response.data.clubs || [];
        }
        
        currentPage.value = response.data.pagination.current_page;
        lastPage.value = response.data.pagination.last_page;
        totalClubs.value = response.data.pagination.total;
    } catch (error) {
        console.error('Error fetching clubs:', error);
        toast.error('Error al cargar los clubes');
        if (!append) {
            clubs.value = [];
        }
    } finally {
        loading.value = false;
    }
};

const handleSearch = () => {
    // Clear previous timeout
    if (searchTimeout.value) {
        clearTimeout(searchTimeout.value);
    }

    // Reset to page 1 for new search
    currentPage.value = 1;
    
    // Debounce search (wait 500ms after user stops typing)
    searchTimeout.value = setTimeout(() => {
        fetchClubs(1, false);
    }, 500);
};

const handleScroll = () => {
    const el = scrollContainer.value;
    if (!el || loading.value || !hasMorePages.value) return;

    // Check if scrolled to bottom (within 200px)
    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 200) {
        currentPage.value++;
        fetchClubs(currentPage.value, true);
    }
};

const handleJoinClub = (club) => {
    emit('join-club', club);
    toast.info(`Te uniste a ${club.club_name}`);
};

const handleViewDetails = (club) => {
    emit('view-details', club);
};

onMounted(() => {
    fetchClubs();
});
</script>

<style scoped>
.club-list-container {
    width: 100%;
}

.list-header {
    text-align: center;
    margin-bottom: 3rem;
}

.list-title {
    font-size: 2rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
}

.list-title i {
    color: #dc3545;
}

.list-subtitle {
    color: #6c757d;
    font-size: 1.05rem;
    margin-bottom: 1.5rem;
}

/* Search section */
.search-section {
    margin: 2rem 0 1.5rem 0;
    display: flex;
    justify-content: center;
}

.search-wrapper {
    position: relative;
    width: 100%;
    max-width: 500px;
}

.search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #adb5bd;
    font-size: 1.1rem;
    pointer-events: none;
}

.search-input {
    width: 100%;
    padding: 0.875rem 1rem 0.875rem 3rem;
    border: 2px solid #e9ecef;
    border-radius: 12px;
    font-size: 0.95rem;
    color: #1a1a1a;
    background: white;
    transition: all 0.3s ease;
    font-family: inherit;
}

.search-input::placeholder {
    color: #adb5bd;
}

.search-input:focus {
    outline: none;
    border-color: #dc3545;
    box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.stats {
    display: flex;
    justify-content: center;
    gap: 2rem;
}

.stat-item {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: #495057;
    font-weight: 600;
    font-size: 0.95rem;
}

.stat-item i {
    color: #dc3545;
}

.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    color: #6c757d;
}

.loading-state .spinner-border {
    width: 3rem;
    height: 3rem;
    margin-bottom: 1rem;
}

.empty-state {
    text-align: center;
    padding: 4rem 2rem;
    background: linear-gradient(135deg, #f8f9fa, #ffffff);
    border: 2px dashed #e9ecef;
    border-radius: 16px;
}

.empty-icon {
    font-size: 3rem;
    color: #e9ecef;
    margin-bottom: 1rem;
}

.empty-state h4 {
    color: #1a1a1a;
    font-weight: 700;
    margin-bottom: 0.5rem;
}

.empty-state p {
    color: #6c757d;
    margin: 0;
}

.clubs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
}

.loading-more {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 2rem;
    color: #6c757d;
}

.end-of-results {
    text-align: center;
    padding: 2rem;
    color: #6c757d;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

.end-of-results i {
    font-size: 1.5rem;
    color: #28a745;
}

@media (max-width: 1200px) {
    .clubs-grid {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1.5rem;
    }
}

@media (max-width: 768px) {
    .list-title {
        font-size: 1.75rem;
    }

    .list-subtitle {
        font-size: 0.95rem;
    }

    .search-wrapper {
        max-width: 100%;
    }

    .search-input {
        padding: 0.75rem 1rem 0.75rem 2.75rem;
        font-size: 0.9rem;
    }

    .clubs-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .stats {
        gap: 1rem;
    }
}
</style>