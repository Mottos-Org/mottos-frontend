<template>
    <div class="edit-article-page">
        <div class="container">
            <div v-if="loading" class="loading-container">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando artículo...</span>
                </div>
                <p>Cargando artículo para editar...</p>
            </div>

            <div v-else-if="article">
                <div v-if="formData.status === 'draft'" class="draft-notice">
                    <div class="alert alert-warning">
                        <i class="bi bi-info-circle"></i>
                        <strong>Editando borrador:</strong> Este artículo no está publicado aún.
                    </div>
                </div>

                <ArticleHeader 
                    title="Editar Artículo"
                    :subtitle="`Editando: ${article.title}`"
                    :back-route="`/noticias/${article.slug}`"
                />

                <form @submit.prevent="handleSubmit" class="article-form">
                    <BasicInfoSection 
                        :form-data="formData"
                        :errors="errors"
                        @update:form-data="updateFormData"
                    />

                    <ContentSection 
                        :content="formData.content"
                        :error="errors.content"
                        @update:content="updateContent"
                    />

                    <EditImagesSection 
                        :featured-image="featuredImageFile"
                        :gallery-images="galleryImageFiles"
                        :current-featured-image="article.featured_image_url"
                        :current-gallery-images="article.gallery_image_urls"
                        :removed-gallery-images="removedGalleryImages"
                        :errors="errors"
                        @update:featured-image="updateFeaturedImage"
                        @update:gallery-images="updateGalleryImages"
                        @remove:gallery-image="removeGalleryImage"
                    />

                    <TagsSettingsSection 
                        :form-data="formData"
                        @update:form-data="updateFormData"
                    />

                    <FormActions 
                        :submitting="submitting"
                        :status="formData.status"
                        @submit="handleSubmit"
                        @save-draft="saveDraft"
                        edit-mode
                    />
                </form>
            </div>

            <div v-else class="error-container">
                <div class="error-message">
                    <i class="bi bi-exclamation-triangle"></i>
                    <h4>Artículo no encontrado</h4>
                    <p>El artículo que intentas editar no existe o no tienes permisos para editarlo.</p>
                    <router-link to="/noticias" class="btn btn-primary">
                        Volver a Noticias
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../../stores/authStore';
import api from '../../services/api';

import ArticleHeader from '../../components/forms/article/ArticleHeader.vue';
import BasicInfoSection from '../../components/forms/article/BasicInfoSection.vue';
import ContentSection from '../../components/forms/article/ContentSection.vue';
import EditImagesSection from '../../components/forms/article/EditImagesSection.vue';
import TagsSettingsSection from '../../components/forms/article/TagsSettingsSection.vue';
import FormActions from '../../components/forms/article/FormActions.vue';

const router = useRouter();
const route = useRoute();
const toast = useToast();
const auth = useAuthStore();

const loading = ref(true);
const submitting = ref(false);
const article = ref(null);
const featuredImageFile = ref(null);
const galleryImageFiles = ref([]);
const removedGalleryImages = ref([]);
const errors = ref({});

const formData = reactive({
    title: '',
    excerpt: '',
    content: '',
    tags: [],
    is_featured: false,
    status: 'draft'
});

onMounted(async () => {
    await loadArticle();
});

const loadArticle = async () => {
    try {
        loading.value = true;
        const response = await api.get(`/api/news/${route.params.slug}`);
        article.value = response.data.article;
        
        if (!canEditArticle()) {
            toast.error('No tienes permisos para editar este artículo');
            router.push(`/noticias/${article.value.slug}`);
            return;
        }
        
        populateForm();
        
    } catch (error) {
        console.error('Error loading article:', error);
        toast.error('Error al cargar el artículo');
        router.push('/noticias');
    } finally {
        loading.value = false;
    }
};

const canEditArticle = () => {
    if (!auth.isLoggedIn) return false;
    
    if (auth.hasRole('Administrador')) return true;
    
    if (auth.hasRole('Noticiero')) {
        return article.value?.author_id === auth.userId;
    }
    
    return false;
};

const populateForm = () => {
    Object.assign(formData, {
        title: article.value.title || '',
        excerpt: article.value.excerpt || '',
        content: article.value.content || '',
        tags: article.value.tags || [],
        is_featured: article.value.is_featured || false,
        status: article.value.status || 'draft'
    });
    
    console.log('Form populated with:', formData);
};

const updateFormData = (newFormData) => {
    Object.assign(formData, newFormData);
    console.log('Updated formData:', formData);
};

const updateContent = (newContent) => {
    formData.content = newContent;
    console.log('Updated content:', formData.content);
};

const updateFeaturedImage = (file) => {
    featuredImageFile.value = file;
    console.log('Updated featured image:', file?.name);
};

const updateGalleryImages = (files) => {
    galleryImageFiles.value = files;
    console.log('Updated gallery images:', files.length);
};

const removeGalleryImage = (imageUrl) => {
    if (!removedGalleryImages.value.includes(imageUrl)) {
        removedGalleryImages.value.push(imageUrl);
        console.log('Marked for removal:', imageUrl);
    }
};

const validateForm = () => {
    errors.value = {};
    
    if (!formData.title.trim()) {
        errors.value.title = 'El título es obligatorio';
    }

    if (!formData.excerpt.trim()) {
        errors.value.excerpt = 'El resumen es obligatorio';
    } else if (formData.excerpt.length > 200) {
        errors.value.excerpt = 'El resumen no puede tener más de 200 caracteres';
    }
    
    if (!formData.content.trim()) {
        errors.value.content = 'El contenido es obligatorio';
    }
    
    if (!article.value.featured_image_url && !featuredImageFile.value) {
        errors.value.featured_image = 'La imagen destacada es obligatoria';
    }
    
    return Object.keys(errors.value).length === 0;
};

const buildFormData = () => {
    const formDataObj = new FormData();
    
    formDataObj.append('title', formData.title);
    formDataObj.append('excerpt', formData.excerpt);
    formDataObj.append('content', formData.content);
    formDataObj.append('is_featured', formData.is_featured);
    formDataObj.append('status', formData.status);
    
    // Add tags
    formData.tags.forEach(tag => {
        formDataObj.append('tags[]', tag);
    });
    
    // Add new featured image if selected
    if (featuredImageFile.value) {
        formDataObj.append('featured_image', featuredImageFile.value);
    }
    
    // Add new gallery images
    galleryImageFiles.value.forEach(file => {
        formDataObj.append('gallery_images[]', file);
    });
    
    // Add removed gallery images
    removedGalleryImages.value.forEach(imageUrl => {
        // Extract filename from URL for backend
        const filename = imageUrl.split('/').pop();
        formDataObj.append('remove_gallery_images[]', filename);
    });
    
    return formDataObj;
};

const handleSubmit = async () => {
    if (!validateForm()) {
        toast.error('Por favor corrige los errores en el formulario');
        return;
    }
    
    submitting.value = true;
    
    try {
        const formDataObj = buildFormData();

        // Use POST request for editing
        const response = await api.post(`/api/admin/news/${article.value.article_id}/`, formDataObj, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        toast.success(response.data.message);
        router.push(`/noticias/${response.data.article.slug}`);
        
    } catch (error) {
        console.error('Error updating article:', error);
        
        if (error.response?.data?.errors) {
            errors.value = error.response.data.errors;
            toast.error('Hay errores en el formulario');
        } else {
            toast.error(error.response?.data?.message || 'Error al actualizar el artículo');
        }
    } finally {
        submitting.value = false;
    }
};

const saveDraft = async () => {
    formData.status = 'draft';
    await handleSubmit();
};
</script>

<style scoped>
.edit-article-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    padding: 2rem 0;
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

.draft-notice {
    margin-bottom: 2rem;
}

.draft-notice .alert {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    border-radius: 12px;
    border: none;
    padding: 1rem 1.5rem;
}

.article-form {
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    overflow: hidden;
}
</style>