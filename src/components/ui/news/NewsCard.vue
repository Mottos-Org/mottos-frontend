<template>
    <article class="news-card" :class="{ 'featured': featured }">
        <div class="card-image" @click="goToArticle">
            <img 
                v-if="article.featured_image_url"
                :src="article.featured_image_url"
                :alt="article.title"
                loading="lazy"
            >
            <div v-else class="placeholder-image">
                <i class="bi bi-newspaper"></i>
            </div>
            
            <div class="image-overlay">
                <div class="reading-time">
                    <i class="bi bi-clock"></i>
                    {{ article.reading_time }} min
                </div>
                <div v-if="article.is_featured" class="featured-badge">
                    <i class="bi bi-star-fill"></i>
                    Destacado
                </div>
            </div>
        </div>
        
        <div class="card-content">
            <div class="article-meta">
                <div class="author-info">
                    <i class="bi bi-person-circle"></i>
                    {{ article.author.name }}
                </div>
                <div class="publish-date">
                    <i class="bi bi-calendar3"></i>
                    {{ article.formatted_published_date }}
                </div>
            </div>
            
            <h3 class="article-title" @click="goToArticle">
                {{ cleanTitle }}
            </h3>
            
            <p class="article-excerpt">
                {{ cleanExcerpt }}
            </p>
            
            <div class="article-tags" v-if="article.tags && article.tags.length > 0">
                <span 
                    v-for="tag in article.tags.slice(0, 3)" 
                    :key="tag"
                    class="tag"
                    @click="filterByTag(tag)"
                >
                    #{{ tag }}
                </span>
                <span v-if="article.tags.length > 3" class="tag-more">
                    +{{ article.tags.length - 3 }}
                </span>
            </div>
            
            <div class="card-footer">
                <div class="article-stats">
                    <span class="views">
                        <i class="bi bi-eye"></i>
                        {{ article.views_count }}
                    </span>
                </div>
                
                <button class="btn btn-primary read-more" @click="goToArticle">
                    <i class="bi bi-arrow-right"></i>
                    Leer Más
                </button>
            </div>
        </div>
    </article>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
    article: Object,
    featured: Boolean
});

const emit = defineEmits(['filter-by-tag']);
const router = useRouter();

const cleanTitle = computed(() => {
    return props.article.title?.replace(/"/g, '') || 'Sin título';
});

const cleanExcerpt = computed(() => {
    return props.article.excerpt?.replace(/"/g, '') || 'Sin descripción disponible.';
});

const goToArticle = () => {
    // Navigate to article detail page
    router.push(`/noticias/${props.article.slug}`);
};

const filterByTag = (tag) => {
    emit('filter-by-tag', tag);
};
</script>

<style scoped>
.news-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    transition: all 0.3s ease;
    border: 1px solid rgba(220, 53, 69, 0.08);
    height: fit-content;
}

.news-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.15);
    border-color: rgba(220, 53, 69, 0.15);
}

.news-card.featured {
    border: 2px solid #ffc107;
    background: linear-gradient(135deg, #ffffff 0%, #fffbf0 100%);
}

.card-image {
    position: relative;
    height: 200px;
    overflow: hidden;
    cursor: pointer;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.news-card:hover .card-image img {
    transform: scale(1.05);
}

.placeholder-image {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    color: #6c757d;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.image-overlay {
    position: absolute;
    top: 1rem;
    left: 1rem;
    right: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0.5rem;
}

.reading-time, .featured-badge {
    padding: 0.5rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    backdrop-filter: blur(10px);
}

.reading-time {
    background: rgba(0,0,0,0.7);
    color: white;
}

.featured-badge {
    background: rgba(255, 193, 7, 0.9);
    color: #000;
}

.card-content {
    padding: 1.5rem;
}

.article-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    font-size: 0.85rem;
    color: #6c757d;
}

.author-info, .publish-date {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.article-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 0.75rem;
    line-height: 1.3;
    cursor: pointer;
    transition: color 0.3s ease;
}

.article-title:hover {
    color: #dc3545;
}

.article-excerpt {
    color: #6c757d;
    line-height: 1.5;
    margin-bottom: 1rem;
    font-size: 0.95rem;
}

.article-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.tag {
    background: rgba(220, 53, 69, 0.1);
    color: #dc3545;
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.tag:hover {
    background: #dc3545;
    color: white;
    transform: translateY(-1px);
}

.tag-more {
    background: #e9ecef;
    color: #6c757d;
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 500;
}

.card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(0,0,0,0.1);
}

.article-stats {
    display: flex;
    align-items: center;
    gap: 1rem;
    color: #6c757d;
    font-size: 0.9rem;
}

.views {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.read-more {
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.read-more:hover {
    transform: translateX(2px);
    box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
}

@media (max-width: 768px) {
    .article-meta {
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
    }
    
    .card-footer {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
    }
    
    .read-more {
        justify-content: center;
    }
}
</style>