<template>
    <div class="article-hero">
        <div class="container">
            <div class="hero-content">
                <div class="article-meta">
                    <div class="breadcrumb-nav">
                        <router-link to="/noticias" class="breadcrumb-link">
                            <i class="bi bi-arrow-left"></i>
                            Volver a Noticias
                        </router-link>
                    </div>
                    
                    <div class="article-badges">
                        <span v-if="article.is_featured" class="featured-badge">
                            <i class="bi bi-star-fill"></i>
                            Destacado
                        </span>
                        <span class="reading-time">
                            <i class="bi bi-clock"></i>
                            {{ article.reading_time }} min de lectura
                        </span>
                    </div>
                </div>

                <h1 class="article-title">{{ cleanTitle }}</h1>
                <p class="article-excerpt">{{ cleanExcerpt }}</p>

                <div v-if="article.tags && article.tags.length > 0" class="article-tags-hero">
                    <span 
                        v-for="tag in article.tags" 
                        :key="tag"
                        class="tag-hero"
                    >
                        #{{ tag }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    article: {
        type: Object,
        required: true
    }
});

const cleanTitle = computed(() => {
    return props.article?.title?.replace(/"/g, '') || '';
});

const cleanExcerpt = computed(() => {
    return props.article?.excerpt?.replace(/"/g, '') || '';
});
</script>

<style scoped>
.article-hero {
    background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%);
    color: white;
    padding: 4rem 0 3rem;
    margin-bottom: 3rem;
    position: relative;
    overflow: hidden;
}

.article-hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.1;
}

.hero-content {
    position: relative;
    z-index: 1;
    max-width: 800px;
    margin: 0 auto;
}

.article-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.breadcrumb-nav {
    display: flex;
    align-items: center;
}

.breadcrumb-link {
    color: rgba(255, 255, 255, 0.9);
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    font-weight: 500;
}

.breadcrumb-link:hover {
    color: white;
    transform: translateX(-2px);
}

.article-badges {
    display: flex;
    gap: 1rem;
    align-items: center;
}

.featured-badge, .reading-time {
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    backdrop-filter: blur(10px);
}

.featured-badge {
    background: rgba(255, 193, 7, 0.2);
    border: 1px solid rgba(255, 193, 7, 0.3);
    color: #ffc107;
}

.reading-time {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
}

.article-title {
    font-size: 3rem;
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: 1.5rem;
    letter-spacing: -0.02em;
}

.article-excerpt {
    font-size: 1.25rem;
    line-height: 1.6;
    margin-bottom: 2rem;
    opacity: 0.9;
}

.article-tags-hero {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
}

.tag-hero {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 500;
    border: 1px solid rgba(255, 255, 255, 0.3);
}

@media (max-width: 768px) {
    .article-hero {
        padding: 2rem 0;
        margin-bottom: 2rem;
    }
    
    .article-title {
        font-size: 2rem;
    }
    
    .article-excerpt {
        font-size: 1.1rem;
    }
    
    .article-meta {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
    }
    
    .article-badges {
        justify-content: center;
    }
}

@media (max-width: 480px) {
    .article-title {
        font-size: 1.75rem;
    }
}
</style>