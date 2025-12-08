<template>
    <div class="filters-container">
        <div class="filters-header">
            <h2>Categorías</h2>
        </div>

        <div class="categories-section">
            <button 
                class="category-button"
                :class="{ active: localFilters.category === '' }"
                @click="selectCategory('')"
            >
                <span class="category-label">Todas las categorías</span>
                <span class="category-count">{{ totalCount }}</span>
            </button>

            <button 
                v-for="cat in categories" 
                :key="cat.value"
                class="category-button"
                :class="{ active: localFilters.category === cat.value }"
                @click="selectCategory(cat.value)"
            >
                <span class="category-label">{{ cat.label }}</span>
                <span class="category-count">{{ cat.count }}</span>
            </button>
        </div>

        <div class="filters-divider"></div>

        <div class="filters-section">
            <h3>Filtros adicionales</h3>
            
            <label class="checkbox-label">
                <input 
                    v-model="localFilters.negociable"
                    type="checkbox"
                    @change="immediateUpdate"
                />
                <span>Solo negociables</span>
            </label>
        </div>

        <button class="clear-filters-button" @click="clearFilters">
            Limpiar filtros
        </button>
    </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    },
    totalCount: {
        type: Number,
        default: 0
    }
});

const emit = defineEmits(['update:modelValue', 'apply-filters', 'clear-filters']);

const localFilters = reactive({ ...props.modelValue });

const categories = ref([
    { label: 'Repuestos', value: 'parts', count: 2 },
    { label: 'Accesorios', value: 'accessories', count: 2 },
    { label: 'Otros', value: 'other', count: 2 }
]);

const selectCategory = (category) => {
    localFilters.category = category;
    immediateUpdate();
};

const immediateUpdate = () => {
    emit('update:modelValue', { ...localFilters });
    emit('apply-filters');
};

const clearFilters = () => {
    Object.keys(localFilters).forEach(key => {
        if (key === 'per_page') {
            localFilters[key] = '15';
        } else if (key === 'page') {
            localFilters[key] = 1;
        } else if (key === 'sort_by') {
            localFilters[key] = 'recent';
        } else if (key === 'negociable') {
            localFilters[key] = false;
        } else {
            localFilters[key] = '';
        }
    });
    emit('clear-filters');
};

watch(() => props.modelValue, (newVal) => {
    Object.assign(localFilters, newVal);
}, { deep: true });
</script>

<style scoped>
.filters-container {
    background: #f5f5f5;
    padding: 20px;
    border-radius: 8px;
}

.filters-header h2 {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 16px;
    color: #1c1c1c;
}

.categories-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.category-button {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
    color: #1c1c1c;
}

.category-button:hover {
    background: #f8f9fa;
    border-color: #dc3545;
}

.category-button.active {
    background: #dc3545;
    color: white;
    border-color: #dc3545;
}

.category-label {
    font-size: 14px;
    font-weight: 500;
}

.category-count {
    font-size: 12px;
    background: rgba(0, 0, 0, 0.1);
    padding: 2px 8px;
    border-radius: 12px;
}

.category-button.active .category-count {
    background: rgba(255, 255, 255, 0.2);
}

.filters-divider {
    height: 1px;
    background: #e0e0e0;
    margin: 20px 0;
}

.filters-section h3 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
    color: #1c1c1c;
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 14px;
    padding: 8px 0;
    color: #1c1c1c;
}

.checkbox-label input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
}

.clear-filters-button {
    width: 100%;
    padding: 12px;
    background: white;
    border: 2px solid #dc3545;
    color: #dc3545;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 20px;
    transition: all 0.2s ease;
}

.clear-filters-button:hover {
    background: #dc3545;
    color: white;
}

@media (max-width: 768px) {
    .filters-container {
        margin-bottom: 20px;
    }
}
</style>