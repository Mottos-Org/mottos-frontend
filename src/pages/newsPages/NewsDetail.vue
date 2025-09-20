<template>
    <div class="news-detail-page">
        <div v-if="loading" class="loading-container">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando artículo...</span>
            </div>
            <p>Cargando artículo...</p>
        </div>

        <div v-else-if="article" class="article-container">
            <ArticleHero :article="article" />

            <div v-if="article.status === 'draft'" class="draft-banner">
                <div class="container">
                    <div class="draft-alert">
                        <div class="draft-icon">
                            <i class="bi bi-eye-slash"></i>
                        </div>
                        <div class="draft-content">
                            <h4>Artículo en Borrador</h4>
                            <p>Este artículo no está publicado y solo es visible para administradores y noticieros.</p>
                        </div>
                        <div class="draft-actions" v-if="canEditArticle">
                            <router-link 
                                :to="`/noticias/${article.slug}/editar`" 
                                class="btn btn-outline-light btn-sm"
                            >
                                <i class="bi bi-pencil"></i>
                                Editar
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>

            <div class="container">
                <div class="row">
                    <div class="col-lg-8 col-md-12">
                        <div v-if="article.status === 'published' && canEditArticle" class="published-edit-container">
                            <div class="published-edit-bar">
                                <div class="edit-info">
                                    <i class="bi bi-info-circle"></i>
                                    <span>Tienes permisos para editar este artículo</span>
                                </div>
                                <router-link 
                                    :to="`/noticias/${article.slug}/editar`" 
                                    class="btn btn-edit-published"
                                >
                                    <i class="bi bi-pencil-square"></i>
                                    Editar Artículo
                                </router-link>
                            </div>
                        </div>

                        <div v-if="article.status === 'draft'" class="status-badge-container">
                            <div class="status-badge draft">
                                <i class="bi bi-file-earmark-text"></i>
                                Borrador
                            </div>
                        </div>

                        <div v-if="article.featured_image_url" class="featured-image-section">
                            <div class="featured-image-container" @click="openImageModal(article.featured_image_url, 'Imagen principal')">
                                <img 
                                    :src="article.featured_image_url" 
                                    :alt="cleanTitle"
                                    class="featured-image"
                                >
                                <div class="enlarge-hint">
                                    <i class="bi bi-arrows-fullscreen"></i>
                                    <span>Click para ampliar</span>
                                </div>
                            </div>
                        </div>

                        <div class="article-content">
                            <div class="content-wrapper" v-html="renderedContent"></div>
                        </div>

                        <div v-if="article.gallery_image_urls && article.gallery_image_urls.length > 0" class="gallery-section">
                            <h3>
                                <i class="bi bi-images"></i>
                                Galería de Imágenes
                            </h3>
                            <div class="image-gallery">
                                <div 
                                    v-for="(image, index) in article.gallery_image_urls" 
                                    :key="index"
                                    class="gallery-item"
                                    @click="openGalleryModal(index)"
                                >
                                    <img :src="image" :alt="`Imagen ${index + 1} de ${cleanTitle}`" loading="lazy">
                                    <div class="gallery-overlay">
                                        <i class="bi bi-arrows-fullscreen"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <SocialShare :title="cleanTitle" />
                    </div>

                    <div class="col-lg-4 col-md-12">
                        <ArticleSidebar 
                            :article="article" 
                            :related-articles="relatedArticles" 
                            :can-edit="canEditArticle"
                        />
                    </div>
                </div>
            </div>

            <div v-if="canEditArticle" class="floating-edit-btn">
                <router-link 
                    :to="`/noticias/${article.slug}/editar`" 
                    class="btn-floating-edit"
                    :title="`Editar: ${cleanTitle}`"
                >
                    <i class="bi bi-pencil-fill"></i>
                </router-link>
            </div>
        </div>

        <div v-else class="error-container">
            <div class="error-message">
                <i class="bi bi-exclamation-triangle"></i>
                <h4>Artículo no encontrado</h4>
                <p>El artículo que buscas no existe o ha sido eliminado.</p>
                <router-link to="/noticias" class="btn btn-primary">
                    Volver a Noticias
                </router-link>
            </div>
        </div>

        <ImageModal 
            :show="showImageModal"
            :images="modalImages"
            v-model:currentIndex="currentModalIndex"
            @close="closeImageModal"
        />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../../stores/authStore';
import { marked } from 'marked';
import api from '../../services/api';

import ArticleHero from '../../components/ui/news/newsDetail/ArticleHero.vue';
import ArticleSidebar from '../../components/ui/news/newsDetail/ArticleSidebar.vue';
import SocialShare from '../../components/ui/news/newsDetail/SocialShare.vue';
import ImageModal from '../../components/ui/news/newsDetail/ImageModal.vue';

const route = useRoute();
const toast = useToast();
const auth = useAuthStore();
const article = ref(null);
const relatedArticles = ref([]);
const loading = ref(true);
const showImageModal = ref(false);
const currentModalIndex = ref(0);
const modalImages = ref([]);

const canEditArticle = computed(() => {
    if (!auth.isLoggedIn || !article.value) return false;
    
    // Admin can edit any article
    if (auth.hasRole('Administrador')) return true;
    
    // Noticiero can edit their own articles
    if (auth.hasRole('Noticiero')) {
        // You'll need to compare with the actual author_id from your API
        // For now, let's assume all noticieros can edit
        return true; // Update this logic based on your API response
    }
    
    return false;
});

const cleanTitle = computed(() => {
    return article.value?.title?.replace(/"/g, '') || '';
});

const cleanExcerpt = computed(() => {
    return article.value?.excerpt?.replace(/"/g, '') || '';
});

const renderedContent = computed(() => {
    if (!article.value?.content) return '';
    try {
        const cleanContent = article.value.content.replace(/^"/, '').replace(/"$/, '');
        return marked(cleanContent);
    } catch (error) {
        console.error('Error rendering markdown:', error);
        return article.value.content;
    }
});

const fetchArticle = async () => {
    try {
        loading.value = true;
        const response = await api.get(`/api/news/${route.params.slug}`);
        article.value = response.data.article;

        console.log(article.value);
        
        await fetchRelatedArticles();
    } catch (error) {
        console.error('Error fetching article:', error);
        if (error.response?.status === 404) {
            toast.error('Artículo no encontrado');
        } else {
            toast.error('Error al cargar el artículo');
        }
    } finally {
        loading.value = false;
    }
};

const fetchRelatedArticles = async () => {
    try {
        if (article.value?.tags?.length > 0) {
            const response = await api.get(`/api/news?tag=${article.value.tags[0]}&per_page=3`);
            relatedArticles.value = response.data.articles.filter(a => a.article_id !== article.value.article_id);
        }
    } catch (error) {
        console.error('Error fetching related articles:', error);
    }
};

const openImageModal = (imageSrc, altText) => {
    modalImages.value = [{ src: imageSrc, alt: altText }];
    currentModalIndex.value = 0;
    showImageModal.value = true;
    document.body.style.overflow = 'hidden';
};

const openGalleryModal = (startIndex) => {
    modalImages.value = article.value.gallery_image_urls.map((url, index) => ({
        src: url,
        alt: `Imagen ${index + 1} de ${cleanTitle.value}`
    }));
    currentModalIndex.value = startIndex;
    showImageModal.value = true;
    document.body.style.overflow = 'hidden';
};

const closeImageModal = () => {
    showImageModal.value = false;
    document.body.style.overflow = '';
};

watch(() => route.params.slug, (newSlug) => {
    if (newSlug) {
        fetchArticle();
    }
});

onMounted(() => {
    fetchArticle();
});
</script>

<style scoped>
.news-detail-page {
    min-height: 100vh;
    background: #f8f9fa;
}

.loading-container, .error-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 50vh;
    text-align: center;
    padding: 2rem;
}

.loading-container .spinner-border {
    width: 3rem;
    height: 3rem;
    margin-bottom: 1rem;
}

.error-message {
    background: white;
    padding: 3rem;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.error-message i {
    font-size: 4rem;
    color: #dc3545;
    margin-bottom: 1rem;
}

.featured-image-section {
    margin-bottom: 3rem;
}

.featured-image-container {
    position: relative;
    cursor: pointer;
    transition: transform 0.3s ease;
    border-radius: 16px;
    overflow: hidden;
}

.featured-image-container:hover {
    transform: scale(1.02);
}

.featured-image-container:hover .enlarge-hint {
    opacity: 1;
}

.featured-image {
    width: 100%;
    max-height: 500px;
    object-fit: cover;
    display: block;
    box-shadow: 0 8px 32px rgba(0,0,0,0.15);
}

.enlarge-hint {
    position: absolute;
    bottom: 16px;
    left: 16px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
    opacity: 0;
    transition: opacity 0.3s ease;
    backdrop-filter: blur(10px);
}

.article-content {
    background: white;
    padding: 3rem;
    border-radius: 16px;
    margin-bottom: 3rem;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.content-wrapper {
    line-height: 1.8;
    font-size: 1.1rem;
    color: #333;
    text-align: left;
}

.content-wrapper :deep(h1),
.content-wrapper :deep(h2),
.content-wrapper :deep(h3) {
    color: #1a1a1a;
    margin-top: 2rem;
    margin-bottom: 1rem;
    font-weight: 700;
}

.content-wrapper :deep(h2) {
    font-size: 1.75rem;
    border-bottom: 2px solid rgba(220, 53, 69, 0.1);
    padding-bottom: 0.5rem;
}

.content-wrapper :deep(h3) {
    font-size: 1.5rem;
    color: #dc3545;
}

.content-wrapper :deep(p) {
    margin-bottom: 1.5rem;
}

.content-wrapper :deep(ul),
.content-wrapper :deep(ol) {
    margin-bottom: 1.5rem;
    padding-left: 2rem;
}

.content-wrapper :deep(li) {
    margin-bottom: 0.5rem;
}

.content-wrapper :deep(strong) {
    color: #dc3545;
    font-weight: 700;
}

.content-wrapper :deep(em) {
    font-style: italic;
    color: #6c757d;
}

.gallery-section {
    background: white;
    padding: 2rem;
    border-radius: 16px;
    margin-bottom: 3rem;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.gallery-section h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.gallery-section h3 i {
    color: #dc3545;
}

.image-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.gallery-item {
    position: relative;
    overflow: hidden;
    border-radius: 12px;
    cursor: pointer;
    transition: transform 0.3s ease;
}

.gallery-item:hover {
    transform: scale(1.02);
}

.gallery-item img {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.gallery-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    color: white;
    font-size: 2rem;
}

.gallery-item:hover .gallery-overlay {
    opacity: 1;
}

.draft-banner {
    background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
    color: white;
    padding: 1rem 0;
    box-shadow: 0 2px 10px rgba(220, 53, 69, 0.3);
    position: sticky;
    top: 0;
    z-index: 1000;
    margin-bottom: 25px;
    text-align: left;
}

.draft-alert {
    display: flex;
    align-items: center;
    gap: 1rem;
    animation: pulse 2s infinite;
}

.draft-icon {
    font-size: 2rem;
    opacity: 0.9;
}

.draft-content h4 {
    margin: 0 0 0.25rem 0;
    font-weight: 700;
    font-size: 1.1rem;
}

.draft-content p {
    margin: 0;
    opacity: 0.9;
    font-size: 0.95rem;
}

.draft-actions {
    margin-left: auto;
}

.btn-outline-light {
    border: 2px solid rgba(255,255,255,0.3);
    color: white;
    transition: all 0.3s ease;
}

.btn-outline-light:hover {
    background: rgba(255,255,255,0.1);
    border-color: white;
    color: white;
    transform: translateY(-1px);
}

.status-badge-container {
    margin-bottom: 2rem;
    display: flex;
    justify-content: flex-end;
}

.status-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 25px;
    font-weight: 600;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.status-badge.draft {
    background: linear-gradient(135deg, #dc3545, #c82333);
    color: white;
    box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
}

.published-edit-container {
    margin-bottom: 2rem;
}

.published-edit-bar {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border: 2px solid #dc3545;
    border-radius: 12px;
    padding: 1rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 2px 12px rgba(220, 53, 69, 0.1);
}

.edit-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #495057;
    font-weight: 500;
}

.edit-info i {
    color: #dc3545;
    font-size: 1.1rem;
}

.btn-edit-published {
    background: #dc3545;
    color: white;
    padding: 0.5rem 1.25rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    border: 2px solid #dc3545;
}

.btn-edit-published:hover {
    background: #c82333;
    border-color: #c82333;
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
    text-decoration: none;
}

.floating-edit-btn {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 1000;
}

.btn-floating-edit {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    background: #dc3545;
    color: white;
    border-radius: 50%;
    text-decoration: none;
    box-shadow: 0 4px 20px rgba(220, 53, 69, 0.4);
    transition: all 0.3s ease;
    font-size: 1.5rem;
}

.btn-floating-edit:hover {
    background: #c82333;
    color: white;
    transform: translateY(-3px) scale(1.1);
    box-shadow: 0 8px 25px rgba(220, 53, 69, 0.5);
    text-decoration: none;
}

.btn-floating-edit i {
    font-size: 1.5rem;
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.8;
    }
}

@media (max-width: 768px) {
    .draft-alert {
        flex-direction: column;
        text-align: center;
        gap: 0.75rem;
    }
    
    .draft-actions {
        margin-left: 0;
    }
    
    .draft-icon {
        font-size: 1.5rem;
    }
    
    .status-badge-container {
        justify-content: center;
        margin-bottom: 1.5rem;
    }
    
    .published-edit-bar {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
        padding: 1.25rem;
    }
    
    .edit-info {
        justify-content: center;
    }
    
    .btn-edit-published {
        width: 100%;
        justify-content: center;
        padding: 0.75rem 1.5rem;
    }
    
    .floating-edit-btn {
        bottom: 1.5rem;
        right: 1.5rem;
    }
    
    .btn-floating-edit {
        width: 56px;
        height: 56px;
        font-size: 1.4rem;
    }
}

@media (max-width: 480px) {
    .floating-edit-btn {
        bottom: 1rem;
        right: 1rem;
    }
    
    .btn-floating-edit {
        width: 52px;
        height: 52px;
        font-size: 1.3rem;
    }
}

/* Hide floating button on very small screens to avoid overlap */
@media (max-width: 360px) {
    .floating-edit-btn {
        display: none;
    }
}
</style>