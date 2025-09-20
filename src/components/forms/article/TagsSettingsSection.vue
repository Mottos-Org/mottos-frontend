<template>
    <div class="form-section">
        <h3>
            <i class="bi bi-tags"></i>
            Etiquetas y Configuración
        </h3>
        
        <div class="row">
            <div class="col-md-8">
                <div class="form-group">
                    <label for="tags" class="form-label">
                        Etiquetas
                    </label>
                    <div class="tags-input-container">
                        <div class="tags-display">
                            <span v-for="(tag, index) in localFormData.tags" :key="index" class="tag-badge">
                                {{ tag }}
                                <button type="button" @click="removeTag(index)" class="tag-remove">
                                    <i class="bi bi-x"></i>
                                </button>
                            </span>
                        </div>
                        <input
                            type="text"
                            v-model="newTag"
                            @keydown.enter.prevent="addTag"
                            @keydown.comma.prevent="addTag"
                            class="form-control"
                            placeholder="Escribe una etiqueta y presiona Enter..."
                        >
                    </div>
                    <div class="form-text">
                        Separa las etiquetas con Enter o comas. Ej: motocicleta, tips, mantenimiento
                    </div>
                </div>
            </div>
            
            <div class="col-md-4">
                <div class="form-group">
                    <label class="form-label">Configuración</label>
                    <div class="form-check">
                        <input
                            type="checkbox"
                            id="is-featured"
                            v-model="localFormData.is_featured"
                            class="form-check-input"
                        >
                        <label for="is-featured" class="form-check-label">
                            <i class="bi bi-star"></i>
                            Artículo destacado
                        </label>
                    </div>
                    
                    <div class="form-group mt-3">
                        <label for="status" class="form-label">Estado</label>
                        <select
                            id="status"
                            v-model="localFormData.status"
                            class="form-select"
                        >
                            <option value="draft">Borrador</option>
                            <option value="published">Publicado</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    formData: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['update:formData']);

const newTag = ref('');

const localFormData = computed({
    get: () => props.formData,
    set: (value) => emit('update:formData', value)
});

const addTag = () => {
    const tag = newTag.value.trim().toLowerCase();
    if (tag && !localFormData.value.tags.includes(tag)) {
        const updatedFormData = { 
            ...localFormData.value, 
            tags: [...localFormData.value.tags, tag] 
        };
        emit('update:formData', updatedFormData);
        newTag.value = '';
    }
};

const removeTag = (index) => {
    const updatedTags = [...localFormData.value.tags];
    updatedTags.splice(index, 1);
    const updatedFormData = { 
        ...localFormData.value, 
        tags: updatedTags 
    };
    emit('update:formData', updatedFormData);
};
</script>

<style scoped>
.form-section {
    padding: 2rem;
    border-bottom: 1px solid #eee;
}

.form-section h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.form-section h3 i {
    color: #dc3545;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-label {
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
    display: block;
}

.tags-input-container {
    border: 2px solid #e9ecef;
    border-radius: 8px;
    padding: 0.5rem;
    background: white;
    min-height: 120px;
    transition: border-color 0.3s ease;
}

.tags-input-container:focus-within {
    border-color: #dc3545;
    box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.1);
}

.tags-display {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    min-height: 40px;
    align-items: flex-start;
}

.tag-badge {
    background: #dc3545;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.tag-remove {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    font-size: 0.75rem;
    padding: 2px;
    border-radius: 2px;
    transition: background-color 0.2s ease;
}

.tag-remove:hover {
    background: rgba(255,255,255,0.2);
}

.tags-input-container .form-control {
    border: none;
    padding: 0.5rem 0;
    margin: 0;
    background: transparent;
    box-shadow: none;
}

.tags-input-container .form-control:focus {
    box-shadow: none;
    outline: none;
}

.form-check {
    padding: 1rem;
    background: rgba(220, 53, 69, 0.05);
    border-radius: 8px;
    border: 1px solid rgba(220, 53, 69, 0.1);
}

.form-check-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-weight: 500;
    color: #333;
}

.form-check-input:checked {
    background-color: #dc3545;
    border-color: #dc3545;
}

.form-check-input:focus {
    box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.1);
}

.form-select {
    border: 2px solid #e9ecef;
    border-radius: 8px;
    padding: 0.75rem;
    font-size: 1rem;
    transition: all 0.3s ease;
    background-color: white;
}

.form-select:focus {
    border-color: #dc3545;
    box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.1);
    outline: none;
}

.form-text {
    color: #6c757d;
    font-size: 0.875rem;
    margin-top: 0.5rem;
}

@media (max-width: 768px) {
    .form-section {
        padding: 1.5rem;
    }
    
    .row > .col-md-8,
    .row > .col-md-4 {
        margin-bottom: 1.5rem;
    }
    
    .tags-input-container {
        min-height: 100px;
    }
}
</style>