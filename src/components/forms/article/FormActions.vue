<template>
    <div class="form-actions">
        <button 
            type="button" 
            @click="handleSaveDraft" 
            class="btn btn-outline-secondary" 
            :disabled="submitting"
        >
            <i class="bi bi-save"></i>
            Guardar Borrador
        </button>
        
        <div class="action-group">
            <router-link to="/noticias" class="btn btn-light">
                <i class="bi bi-x"></i>
                Cancelar
            </router-link>
            
            <button 
                type="submit" 
                class="btn btn-primary" 
                :disabled="submitting"
                @click="handleSubmit"
            >
                <div v-if="submitting" class="spinner-border spinner-border-sm me-2" role="status">
                    <span class="visually-hidden">Procesando...</span>
                </div>
                <i v-else class="bi bi-send"></i>
                {{ submittingText }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    submitting: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        default: 'draft'
    }
});

const emit = defineEmits(['submit', 'save-draft']);

const submittingText = computed(() => {
    if (props.submitting) {
        return props.status === 'published' ? 'Publicando...' : 'Guardando...';
    }
    return props.status === 'published' ? 'Publicar Artículo' : 'Guardar Borrador';
});

const handleSubmit = () => {
    emit('submit');
};

const handleSaveDraft = () => {
    emit('save-draft');
};
</script>

<style scoped>
.form-actions {
    padding: 2rem;
    background: #f8f9fa;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #e9ecef;
}

.action-group {
    display: flex;
    gap: 1rem;
    align-items: center;
}

.btn {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    border: 2px solid transparent;
    cursor: pointer;
}

.btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

.btn-primary {
    background: #dc3545;
    color: white;
    border-color: #dc3545;
}

.btn-primary:hover:not(:disabled) {
    background: #c82333;
    border-color: #c82333;
}

.btn-outline-secondary {
    background: transparent;
    color: #6c757d;
    border-color: #6c757d;
}

.btn-outline-secondary:hover:not(:disabled) {
    background: #6c757d;
    color: white;
}

.btn-light {
    background: #f8f9fa;
    color: #6c757d;
    border-color: #dee2e6;
}

.btn-light:hover:not(:disabled) {
    background: #e9ecef;
    color: #495057;
}

.spinner-border-sm {
    width: 1rem;
    height: 1rem;
}

@media (max-width: 768px) {
    .form-actions {
        flex-direction: column;
        gap: 1rem;
        padding: 1.5rem;
    }
    
    .action-group {
        width: 100%;
        justify-content: center;
    }
    
    .btn {
        flex: 1;
        justify-content: center;
    }
}
</style>