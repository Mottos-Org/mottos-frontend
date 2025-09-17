<template>
    <div v-if="type === 'initial'" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="mt-2">{{ message || 'Cargando publicaciones...' }}</p>
    </div>

    <div v-else-if="type === 'load-more'" class="text-center mt-4 mb-5">
        <button 
            @click="$emit('load-more')" 
            :disabled="loading"
            class="btn btn-primary btn-lg"
        >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ loading ? 'Cargando...' : 'Cargar más publicaciones' }}
        </button>
    </div>

    <div v-else-if="type === 'end'" class="text-center mt-4 mb-5">
        <div class="end-results">
            <i class="bi bi-check-circle-fill text-success mb-3"></i>
            <p class="text-muted mb-0">{{ message || 'Has visto todas las publicaciones disponibles' }}</p>
        </div>
    </div>

    <div v-else-if="type === 'no-results'" class="text-center py-5 centerdiv">
        <div class="no-results-container">
            <div class="no-results-illustration mb-4">
                <i class="bi bi-search text-muted"></i>
                <i class="bi bi-motorcycle text-primary"></i>
            </div>
            
            <h4 class="no-results-title">{{ title || 'No encontramos motocicletas' }}</h4>
            <p class="no-results-message">{{ message || 'No hay publicaciones que coincidan con tus criterios de búsqueda' }}</p>
            
            <div class="no-results-suggestions">
                <h6 class="mb-3">Sugerencias:</h6>
                <ul class="suggestions-list">
                    <li><i class="bi bi-arrow-right text-primary me-2"></i>Prueba con filtros menos específicos</li>
                    <li><i class="bi bi-arrow-right text-primary me-2"></i>Amplía el rango de precios</li>
                    <li><i class="bi bi-arrow-right text-primary me-2"></i>Considera diferentes años de fabricación</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>

defineProps({
    type: {
        type: String,
        required: true,
        validator: (value) => ['initial', 'load-more', 'end', 'no-results'].includes(value)
    },
    loading: {
        type: Boolean,
        default: false
    },
    message: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        default: ''
    }
});

defineEmits(['load-more', 'clear-filters']);
</script>

<style scoped>
.centerdiv {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.no-results-container {
    max-width: 500px;
    margin: 0 auto;
    padding: 2rem;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 16px;
    border: 1px solid #dee2e6;
}

.no-results-illustration {
    position: relative;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.no-results-illustration .bi-search {
    font-size: 3rem;
    position: absolute;
    animation: pulse 2s infinite;
}

.no-results-illustration .bi-motorcycle {
    font-size: 2.5rem;
    margin-left: 1rem;
    margin-top: 0.5rem;
    animation: fadeInOut 3s infinite;
}

.no-results-title {
    color: #495057;
    font-weight: 600;
    margin-bottom: 1rem;
}

.no-results-message {
    color: #6c757d;
    font-size: 1.1rem;
    margin-bottom: 2rem;
    line-height: 1.5;
}

.no-results-suggestions {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    border: 1px solid #e9ecef;
    margin-bottom: 1.5rem;
    text-align: left;
}

.no-results-suggestions h6 {
    color: #495057;
    font-weight: 600;
    text-align: center;
}

.suggestions-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.suggestions-list li {
    padding: 0.5rem 0;
    color: #6c757d;
    display: flex;
    align-items: center;
}

.suggestions-list li:not(:last-child) {
    border-bottom: 1px solid #f1f3f4;
}

.end-results {
    padding: 2rem;
    background: #f8f9fa;
    /* border-radius: 12px; */
    border: 1px solid #dee2e6;
}

.end-results .bi-check-circle-fill {
    font-size: 3rem;
    display: block;
}

@keyframes pulse {
    0%, 100% { opacity: 0.7; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.05); }
}

@keyframes fadeInOut {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
}

.btn-outline-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
    transition: all 0.2s ease;
}

@media (max-width: 768px) {
    .no-results-container {
        margin: 1rem;
        padding: 1.5rem;
    }
    
    .no-results-illustration {
        height: 60px;
    }
    
    .no-results-illustration .bi-search {
        font-size: 2rem;
    }
    
    .no-results-illustration .bi-motorcycle {
        font-size: 1.8rem;
    }
}
</style>