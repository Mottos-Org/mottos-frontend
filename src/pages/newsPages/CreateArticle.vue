<template>
    <div class="create-article-page">
        <div class="container">
            <ArticleHeader 
                title="Crear Nuevo Artículo"
                subtitle="Comparte las últimas noticias y contenido con la comunidad motociclística"
                back-route="/noticias"
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

                <ImagesSection 
                    :featured-image="featuredImageFile"
                    :gallery-images="galleryImageFiles"
                    :errors="errors"
                    @update:featured-image="updateFeaturedImage"
                    @update:gallery-images="updateGalleryImages"
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
                />
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../../stores/authStore';
import api from '../../services/api';

import ArticleHeader from '../../components/forms/article/ArticleHeader.vue';
import BasicInfoSection from '../../components/forms/article/BasicInfoSection.vue';
import ContentSection from '../../components/forms/article/ContentSection.vue';
import ImagesSection from '../../components/forms/article/ImagesSection.vue';
import TagsSettingsSection from '../../components/forms/article/TagsSettingsSection.vue';
import FormActions from '../../components/forms/article/FormActions.vue';

const router = useRouter();
const toast = useToast();
const auth = useAuthStore();

onMounted(() => {
    if (!auth.isLoggedIn || (!auth.hasRole('Administrador') && !auth.hasRole('Noticiero'))) {
        toast.error('No tienes permisos para crear artículos');
        router.push('/noticias');
    }
});

const submitting = ref(false);
const featuredImageFile = ref(null);
const galleryImageFiles = ref([]);
const errors = ref({});

const formData = reactive({
    title: '',
    excerpt: '',
    content: '',
    tags: [],
    is_featured: false,
    status: 'draft'
});

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
    
    if (!featuredImageFile.value) {
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
    
    formData.tags.forEach(tag => {
        formDataObj.append('tags[]', tag);
    });
    
    if (featuredImageFile.value) {
        formDataObj.append('featured_image', featuredImageFile.value);
    }
    
    galleryImageFiles.value.forEach(file => {
        formDataObj.append('gallery_images[]', file);
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
        
        const response = await api.post('/api/admin/news/', formDataObj, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        toast.success(response.data.message);
        router.push(`/noticias/${response.data.article.slug}`);
        
    } catch (error) {
        console.error('Error creating article:', error);
        
        if (error.response?.data?.errors) {
            errors.value = error.response.data.errors;
            toast.error('Hay errores en el formulario');
        } else {
            toast.error(error.response?.data?.message || 'Error al crear el artículo');
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
.create-article-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    padding: 2rem 0;
}

.article-form {
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    overflow: hidden;
}
</style>