<template>
    <div class="spec-card">
        <div class="spec-header">
            <div class="spec-icon">
                <i :class="icon"></i>
            </div>
            <h3 class="spec-title">{{ title }}</h3>
        </div>
        
        <div class="spec-content">
            <div 
                v-for="(value, key) in filteredSpecs" 
                :key="key"
                class="spec-item"
            >
                <span class="spec-label">{{ key }}:</span>
                <span class="spec-value">{{ value }}</span>
            </div>
            
            <div v-if="Object.keys(filteredSpecs).length === 0" class="spec-empty">
                <i class="bi bi-info-circle"></i>
                <span>No hay especificaciones disponibles</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    icon: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    specs: {
        type: Object,
        required: true
    }
});

// Filter out empty/null/undefined values
const filteredSpecs = computed(() => {
    const filtered = {};
    
    Object.entries(props.specs).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '' && value !== 'N/A') {
            // Handle arrays (like components)
            if (Array.isArray(value) && value.length > 0) {
                filtered[key] = value.join(', ');
            } else if (typeof value === 'string' || typeof value === 'number') {
                filtered[key] = value;
            }
        }
    });
    
    return filtered;
});
</script>

<style scoped>
.spec-card {
    background: #fff;
    border: 1px solid #e9ecef;
    border-radius: 12px;
    padding: 1.5rem;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    height: fit-content;
}

.spec-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    border-color: #dc3545;
}

.spec-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #f8f9fa;
}

.spec-icon {
    background: #dc3545;
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    box-shadow: 0 2px 8px rgba(220, 53, 69, 0.2);
}

.spec-title {
    color: #1a1a1a;
    font-weight: 700;
    font-size: 1.1rem;
    margin: 0;
}

.spec-content {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.spec-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 0.5rem 0;
    border-bottom: 1px solid #f8f9fa;
    gap: 1rem;
}

.spec-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
}

.spec-label {
    color: #6c757d;
    font-weight: 600;
    font-size: 0.9rem;
    flex-shrink: 0;
    min-width: fit-content;
}

.spec-value {
    color: #1a1a1a;
    font-weight: 500;
    text-align: right;
    word-break: break-word;
    line-height: 1.4;
}

.spec-empty {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1.5rem 0;
    color: #6c757d;
    font-style: italic;
    justify-content: center;
    text-align: center;
}

.spec-empty i {
    font-size: 1.1rem;
    opacity: 0.7;
}

/* Responsive Design */
@media (max-width: 768px) {
    .spec-card {
        padding: 1rem;
    }
    
    .spec-header {
        gap: 0.5rem;
        margin-bottom: 1rem;
    }
    
    .spec-icon {
        width: 36px;
        height: 36px;
        font-size: 1.1rem;
    }
    
    .spec-title {
        font-size: 1rem;
    }
    
    .spec-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.25rem;
    }
    
    .spec-value {
        text-align: left;
        font-size: 0.9rem;
    }
}

@media (max-width: 480px) {
    .spec-card {
        padding: 0.75rem;
    }
    
    .spec-content {
        gap: 0.5rem;
    }
    
    .spec-item {
        padding: 0.375rem 0;
    }
}
</style>