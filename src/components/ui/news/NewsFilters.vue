<template>
    <div class="news-filters">
        <div class="filters-header">
            <h3>
                <i class="bi bi-funnel"></i>
                Filtros
            </h3>
            <button 
                class="btn btn-sm btn-outline-secondary"
                @click="$emit('clear-filters')"
                :disabled="loading"
            >
                <i class="bi bi-arrow-clockwise"></i>
                Limpiar
            </button>
        </div>
        
        <div class="filters-grid">
            <div class="filter-group">
                <label class="filter-label">
                    <i class="bi bi-search"></i>
                    Buscar
                </label>
                <input
                    v-model="localFilters.search"
                    type="text"
                    class="form-control"
                    placeholder="Buscar artículos..."
                    @keyup.enter="$emit('apply-filters')"
                    :disabled="loading"
                >
            </div>
            
            <div class="filter-group">
                <label class="filter-label">
                    <i class="bi bi-tag"></i>
                    Etiqueta
                </label>
                <select v-model="localFilters.tag" class="form-select" :disabled="loading">
                    <option value="">Todas las etiquetas</option>
                    <option value="electric">Eléctrico</option>
                    <option value="trends">Tendencias</option>
                    <option value="technology">Tecnología</option>
                    <option value="photography">Fotografía</option>
                    <option value="tips">Consejos</option>
                    <option value="tutorial">Tutorial</option>
                    <option value="eco-friendly">Eco-friendly</option>
                    <option value="2025">2025</option>
                </select>
            </div>
            
            <div class="filter-group">
                <label class="filter-label">
                    <i class="bi bi-star"></i>
                    Tipo
                </label>
                <select v-model="localFilters.featured_only" class="form-select" :disabled="loading">
                    <option value="">Todos los artículos</option>
                    <option value="true">Solo destacados</option>
                    <option value="false">Solo regulares</option>
                </select>
            </div>
            
            <div class="filter-group">
                <label class="filter-label">
                    <i class="bi bi-sort-down"></i>
                    Ordenar por
                </label>
                <div class="sort-controls">
                    <select v-model="localFilters.sort_by" class="form-select" :disabled="loading">
                        <option value="published_at">Fecha de publicación</option>
                        <option value="title">Título</option>
                        <option value="views_count">Vistas</option>
                    </select>
                    <button 
                        class="btn btn-outline-secondary sort-direction-btn"
                        @click="toggleSortDirection"
                        :disabled="loading"
                        :title="localFilters.sort_direction === 'desc' ? 'Descendente' : 'Ascendente'"
                    >
                        <i :class="localFilters.sort_direction === 'desc' ? 'bi bi-sort-down' : 'bi bi-sort-up'"></i>
                    </button>
                </div>
            </div>
        </div>
        
        <div class="filters-actions">
            <button 
                class="btn btn-primary"
                style="background-color: #b70000; border-color: #b70000;"
                @click="$emit('apply-filters')"
                :disabled="loading"
            >
                <i class="bi bi-search"></i>
                Buscar Artículos
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed, watch } from 'vue';

const props = defineProps({
    modelValue: Object,
    loading: Boolean
});

const emit = defineEmits(['update:modelValue', 'apply-filters', 'clear-filters']);

const localFilters = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
});

const toggleSortDirection = () => {
    const newDirection = localFilters.value.sort_direction === 'desc' ? 'asc' : 'desc';
    emit('update:modelValue', {
        ...localFilters.value,
        sort_direction: newDirection
    });
};

watch(() => [localFilters.value.tag, localFilters.value.featured_only, localFilters.value.sort_by, localFilters.value.sort_direction], 
    () => {
        emit('apply-filters');
    }
);
</script>

<style scoped>
.news-filters {
    background: white;
    padding: 2rem;
    border-radius: 16px;
    margin-bottom: 2rem;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    border: 1px solid rgba(220, 53, 69, 0.08);
}

.filters-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.filters-header h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.filters-header h3 i {
    color: #dc3545;
}

.filters-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.filter-label {
    font-weight: 500;
    color: #495057;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.filter-label i {
    color: #dc3545;
    font-size: 0.85rem;
}

.form-control, .form-select {
    border-radius: 8px;
    border: 1px solid #dee2e6;
    padding: 0.75rem;
    transition: all 0.3s ease;
}

.form-control:focus, .form-select:focus {
    border-color: #dc3545;
    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

.sort-controls {
    display: flex;
    gap: 0.5rem;
}

.sort-controls .form-select {
    flex: 1;
}

.sort-direction-btn {
    border-radius: 8px;
    padding: 0.75rem;
    min-width: 50px;
    transition: all 0.3s ease;
}

.sort-direction-btn:hover {
    background-color: #dc3545;
    border-color: #dc3545;
    color: white;
}

.filters-actions {
    text-align: center;
}

.filters-actions .btn {
    padding: 0.75rem 2rem;
    font-weight: 600;
    border-radius: 50px;
    transition: all 0.3s ease;
}

.filters-actions .btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

@media (max-width: 768px) {
    .news-filters {
        padding: 1.5rem;
    }
    
    .filters-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }
    
    .filters-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    
    .sort-controls {
        flex-direction: column;
    }
    
    .sort-direction-btn {
        min-width: auto;
    }
}
</style>