<template>
    <div class="sidebar">
        <div class="info-card">
            <h4>
                <i class="bi bi-info-circle"></i>
                Información del Artículo
            </h4>
            <div class="info-list">
                <div class="info-item">
                    <span class="info-label">Autor:</span>
                    <span class="info-value">{{ article.author.name }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Publicado:</span>
                    <span class="info-value">{{ formatFullDate(article.published_at) }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Tiempo de lectura:</span>
                    <span class="info-value">{{ article.reading_time }} minutos</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Visualizaciones:</span>
                    <span class="info-value">{{ article.views_count }}</span>
                </div>
            </div>
        </div>

        <div v-if="article.tags && article.tags.length > 0" class="tags-card">
            <h4>
                <i class="bi bi-tags"></i>
                Etiquetas
            </h4>
            <div class="tags-list">
                <router-link 
                    v-for="tag in article.tags" 
                    :key="tag"
                    :to="`/noticias?tag=${tag}`"
                    class="tag-link"
                >
                    #{{ tag }}
                </router-link>
            </div>
        </div>

        <div v-if="relatedArticles.length > 0" class="related-articles-card">
            <h4>
                <i class="bi bi-journal-text"></i>
                Artículos Relacionados
            </h4>
            <div class="related-list">
                <router-link 
                    v-for="related in relatedArticles" 
                    :key="related.article_id"
                    :to="`/noticias/${related.slug}`"
                    class="related-item"
                >
                    <div class="related-image">
                        <img 
                            v-if="related.featured_image_url"
                            :src="related.featured_image_url" 
                            :alt="related.title"
                        >
                        <div v-else class="placeholder-image">
                            <i class="bi bi-newspaper"></i>
                        </div>
                    </div>
                    <div class="related-content">
                        <h5>{{ cleanRelatedTitle(related.title) }}</h5>
                        <span class="related-date">{{ related.formatted_published_date }}</span>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    article: {
        type: Object,
        required: true
    },
    relatedArticles: {
        type: Array,
        default: () => []
    }
});

const formatFullDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-DO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const cleanRelatedTitle = (title) => {
    return title?.replace(/"/g, '') || '';
};
</script>

<style scoped>
.sidebar {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.info-card, .tags-card, .related-articles-card {
    background: white;
    padding: 2rem;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.info-card h4, .tags-card h4, .related-articles-card h4 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.info-card h4 i, .tags-card h4 i, .related-articles-card h4 i {
    color: #dc3545;
}

.info-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.info-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(0,0,0,0.1);
}

.info-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
}

.info-label {
    font-weight: 600;
    color: #6c757d;
    flex-shrink: 0;
}

.info-value {
    font-weight: 500;
    color: #1a1a1a;
    text-align: right;
}

.tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
}

.tag-link {
    background: rgba(220, 53, 69, 0.1);
    color: #dc3545;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.3s ease;
}

.tag-link:hover {
    background: #dc3545;
    color: white;
    transform: translateY(-1px);
}

.related-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.related-item {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    border-radius: 12px;
    text-decoration: none;
    transition: all 0.3s ease;
    border: 1px solid transparent;
}

.related-item:hover {
    background: rgba(220, 53, 69, 0.05);
    border-color: rgba(220, 53, 69, 0.1);
}

.related-image {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    overflow: hidden;
    flex-shrink: 0;
}

.related-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.placeholder-image {
    width: 100%;
    height: 100%;
    background: #f8f9fa;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: #6c757d;
}

.related-content h5 {
    font-size: 0.95rem;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 0.25rem;
    line-height: 1.3;
}

.related-date {
    font-size: 0.8rem;
    color: #6c757d;
}

@media (max-width: 480px) {
    .info-item {
        flex-direction: column;
        gap: 0.25rem;
        align-items: flex-start;
    }
    
    .info-value {
        text-align: left;
    }
}
</style>