<template>
    <div class="news-page">
        <div class="news-hero">
            <div class="container">
                <div class="hero-content">
                    <h1>
                        <i class="bi bi-newspaper"></i>
                        Noticias & Artículos
                    </h1>
                    <p>Mantente al día con las últimas noticias, tendencias y guías sobre motocicletas</p>
                </div>
            </div>
        </div>

        <div class="container">
            <div class="news-header-actions" v-if="auth.hasRole('Administrador') || auth.hasRole('Noticiero')">
                <router-link to="/noticias/crear" class="btn btn-create-article">
                    <i class="bi bi-plus-circle"></i>
                    Crear Artículo
                </router-link>
            </div>

            <NewsFilters
                :model-value="filters"
                :loading="loading"
                @update:model-value="updateFilters"
                @apply-filters="applyFilters"
                @clear-filters="clearFilters"
            />

            <div v-if="loading && articles.length === 0" class="loading-section">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando artículos...</span>
                </div>
                <p>Cargando las últimas noticias...</p>
            </div>

            <div v-if="paginationData && !loading" class="results-info">
                <div class="results-count">
                    <span class="count">{{ paginationData.total }}</span>
                    <span class="text">{{ paginationData.total === 1 ? 'artículo encontrado' : 'artículos encontrados' }}</span>
                </div>
                <div class="page-info" v-if="paginationData.total > 0">
                    Mostrando {{ paginationData.from || 1 }} - {{ paginationData.to || paginationData.total }} de {{ paginationData.total }}
                </div>
            </div>

            <div v-if="featuredArticles.length > 0 && !hasActiveFilters" class="featured-section">
                <h2>
                    <i class="bi bi-star-fill"></i>
                    Artículos Destacados
                </h2>
                <div class="featured-grid">
                    <NewsCard
                        v-for="article in featuredArticles"
                        :key="`featured-${article.article_id}`"
                        :article="article"
                        :featured="true"
                    />
                </div>
            </div>

            <div v-if="articles.length > 0" class="articles-section">
                <h2 v-if="!hasActiveFilters">
                    <i class="bi bi-journal-text"></i>
                    Todos los Artículos
                </h2>
                <h2 v-else>
                    <i class="bi bi-funnel"></i>
                    Resultados de Búsqueda
                </h2>
                
                <div class="articles-grid">
                    <transition-group name="article-fade" tag="div" class="articles-container">
                        <NewsCard
                            v-for="article in articles"
                            :key="article.article_id"
                            :article="article"
                        />
                    </transition-group>
                </div>
            </div>

            <div v-if="!loading && articles.length === 0 && hasSearched" class="no-results">
                <div class="no-results-icon">
                    <i class="bi bi-search"></i>
                </div>
                <h3>No se encontraron artículos</h3>
                <p>Intenta ajustar tus filtros de búsqueda o explora nuestros artículos destacados</p>
                <button class="btn btn-primary" @click="clearFilters">
                    <i class="bi bi-arrow-clockwise"></i>
                    Ver Todos los Artículos
                </button>
            </div>

            <div v-if="hasMorePages" class="load-more-section">
                <button 
                    class="btn btn-outline-primary load-more-btn"
                    :disabled="loadingMore"
                    @click="loadMore"
                >
                    <div v-if="loadingMore" class="spinner-border spinner-border-sm me-2" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                    <i v-else class="bi bi-plus-circle me-2"></i>
                    {{ loadingMore ? 'Cargando...' : 'Cargar Más Artículos' }}
                </button>
            </div>

            <div v-if="articles.length > 0 && !hasMorePages && hasSearched" class="end-results">
                <i class="bi bi-check-circle"></i>
                <span>Has visto todos los artículos disponibles</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive, onUnmounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../../stores/authStore';  // ✅ ADD THIS IMPORT
import api from '../../services/api';
import NewsFilters from '../../components/ui/news/NewsFilters.vue';
import NewsCard from '../../components/ui/news/NewsCard.vue';

const toast = useToast();
const auth = useAuthStore();  // ✅ ADD THIS LINE
const articles = ref([]);
const featuredArticles = ref([]);
const loading = ref(false);
const loadingMore = ref(false);
const hasSearched = ref(false);
const paginationData = ref(null);

const filters = reactive({
    search: '',
    tag: '',
    featured_only: '',
    sort_by: 'published_at',
    sort_direction: 'desc',
    per_page: 12,
    page: 1
});

const hasMorePages = computed(() => {
    return paginationData.value && paginationData.value.has_more_pages;
});

const hasActiveFilters = computed(() => {
    return filters.search || filters.tag || filters.featured_only;
});

const updateFilters = (newFilters) => {
    Object.keys(filters).forEach(key => {
        if (newFilters.hasOwnProperty(key)) {
            filters[key] = newFilters[key];
        }
    });
};

const fetchArticles = async (append = false) => {
    try {
        if (!append) {
            loading.value = true;
            articles.value = [];
        } else {
            loadingMore.value = true;
        }

        const params = buildQueryParams();
        const response = await api.get(`/api/news?${params.toString()}`);
        
        if (append) {
            articles.value.push(...response.data.articles);
        } else {
            articles.value = response.data.articles;
        }
        
        paginationData.value = response.data.pagination;
        hasSearched.value = true;
        
    } catch (error) {
        console.error('Error fetching articles:', error);
        toast.error('Error al cargar los artículos');
    } finally {
        loading.value = false;
        loadingMore.value = false;
    }
};

const fetchFeaturedArticles = async () => {
    try {
        const response = await api.get('/api/news?featured_only=true&per_page=3');
        featuredArticles.value = response.data.articles;
    } catch (error) {
        console.error('Error fetching featured articles:', error);
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

const loadMore = async () => {
    if (hasMorePages.value && !loadingMore.value) {
        filters.page++;
        await fetchArticles(true);
    }
};

const applyFilters = async () => {
    filters.page = 1;
    await fetchArticles();
};

const clearFilters = async () => {
    filters.search = '';
    filters.tag = '';
    filters.featured_only = '';
    filters.sort_by = 'published_at';
    filters.sort_direction = 'desc';
    filters.page = 1;
    
    await fetchArticles();
};

const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    
    if (scrollTop + clientHeight >= scrollHeight - 100 && hasMorePages.value && !loadingMore.value) {
        loadMore();
    }
};

onMounted(async () => {
    await fetchFeaturedArticles();
    await fetchArticles();
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.news-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
}

.news-hero {
    background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%);
    color: white;
    padding: 4rem 0 3rem;
    margin-bottom: 3rem;
    position: relative;
    overflow: hidden;
}

.news-hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.1;
}

.hero-content {
    position: relative;
    z-index: 1;
    text-align: center;
}

.hero-content h1 {
    font-size: 3.5rem;
    font-weight: 800;
    margin-bottom: 1rem;
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
}

.hero-content h1 i {
    font-size: 3rem;
}

.hero-content p {
    font-size: 1.25rem;
    opacity: 0.9;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
}

.results-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding: 1rem 1.5rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.results-count .count {
    font-weight: 700;
    font-size: 1.25rem;
    color: #dc3545;
}

.results-count .text {
    color: #6c757d;
    margin-left: 0.5rem;
}

.page-info {
    font-size: 0.9rem;
    color: #6c757d;
}

.featured-section, .articles-section {
    margin-bottom: 3rem;
}

.featured-section h2, .articles-section h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.featured-section h2 i {
    color: #ffc107;
}

.articles-section h2 i {
    color: #dc3545;
}

.featured-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
}

.articles-grid {
    margin-bottom: 2rem;
}

.articles-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 2rem;
}

.loading-section {
    text-align: center;
    padding: 4rem 2rem;
    color: #6c757d;
}

.loading-section .spinner-border {
    width: 3rem;
    height: 3rem;
    margin-bottom: 1rem;
}

.no-results {
    text-align: center;
    padding: 4rem 2rem;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.no-results-icon {
    font-size: 4rem;
    color: #6c757d;
    margin-bottom: 1.5rem;
}

.no-results h3 {
    color: #1a1a1a;
    margin-bottom: 1rem;
}

.no-results p {
    color: #6c757d;
    margin-bottom: 2rem;
}

.load-more-section {
    text-align: center;
    margin: 3rem 0;
}

.load-more-btn {
    padding: 1rem 2rem;
    font-weight: 600;
    border-radius: 50px;
    transition: all 0.3s ease;
}

.load-more-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,123,255,0.3);
}

.end-results {
    text-align: center;
    padding: 2rem;
    color: #28a745;
    font-weight: 500;
}

.end-results i {
    font-size: 1.25rem;
    margin-right: 0.5rem;
}

.article-fade-enter-active, .article-fade-leave-active {
    transition: all 0.5s ease;
}

.article-fade-enter-from {
    opacity: 0;
    transform: translateY(30px);
}

.article-fade-leave-to {
    opacity: 0;
    transform: translateY(-30px);
}

.news-header-actions {
    margin-bottom: 2rem;
    display: flex;
    justify-content: flex-end;
}

.btn-create-article {
    background: #dc3545;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    border: 2px solid #dc3545;
}

.btn-create-article:hover {
    background: #c82333;
    border-color: #c82333;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
    color: white;
    text-decoration: none;
}

@media (max-width: 768px) {
    .news-hero {
        padding: 2rem 0;
        margin-bottom: 2rem;
    }
    
    .hero-content h1 {
        font-size: 2.5rem;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .hero-content h1 i {
        font-size: 2rem;
    }
    
    .hero-content p {
        font-size: 1.1rem;
    }
    
    .results-info {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }
    
    .featured-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
    
    .articles-container {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
    
    .featured-section h2, .articles-section h2 {
        font-size: 1.5rem;
    }
    
    .news-header-actions {
        justify-content: center;
        margin-bottom: 1.5rem;
    }
    
    .btn-create-article {
        width: 100%;
        justify-content: center;
    }
}
</style>