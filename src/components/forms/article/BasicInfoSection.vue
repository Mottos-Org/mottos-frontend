<template>
    <div class="form-section">
        <h3>
            <i class="bi bi-info-circle"></i>
            Información Básica
        </h3>
        
        <div class="row">
            <div class="col-12">
                <div class="form-group">
                    <label for="title" class="form-label required">
                        Título del Artículo
                    </label>
                    <input
                        type="text"
                        id="title"
                        :value="formData.title"
                        @input="updateTitle($event.target.value)"
                        class="form-control"
                        :class="{ 'is-invalid': errors.title }"
                        placeholder="Ej: Guía completa de mantenimiento de motocicletas"
                        required
                    >
                    <div v-if="errors.title" class="invalid-feedback">
                        {{ errors.title }}
                    </div>
                </div>
            </div>
            
            <div class="col-12">
                <div class="form-group">
                    <label for="excerpt" class="form-label required">
                        Resumen/Excerpt
                    </label>
                    <textarea
                        id="excerpt"
                        :value="formData.excerpt"
                        @input="updateExcerpt($event.target.value)"
                        class="form-control"
                        :class="{ 'is-invalid': errors.excerpt }"
                        rows="3"
                        placeholder="Breve descripción del artículo que aparecerá en las tarjetas de vista previa..."
                        required
                    ></textarea>
                    <div v-if="errors.excerpt" class="invalid-feedback">
                        {{ errors.excerpt }}
                    </div>
                    <div class="form-text">
                        Máximo 200 caracteres. Actual: {{ formData.excerpt.length }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    formData: {
        type: Object,
        required: true
    },
    errors: {
        type: Object,
        default: () => ({})
    }
});

const emit = defineEmits(['update:formData']);

const updateTitle = (value) => {
    emit('update:formData', { ...props.formData, title: value });
};

const updateExcerpt = (value) => {
    emit('update:formData', { ...props.formData, excerpt: value });
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

.form-label.required::after {
    content: ' *';
    color: #dc3545;
}

.form-control {
    border: 2px solid #e9ecef;
    border-radius: 8px;
    padding: 0.75rem;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.form-control:focus {
    border-color: #dc3545;
    box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.1);
}

.form-group {
    margin-bottom: 1.5rem;
    text-align: left;
}

@media (max-width: 768px) {
    .form-section {
        padding: 1.5rem;
    }
}
</style>