<template>
    <div class="spec-section">
        <h3>
            <i :class="iconClass"></i>
            {{ title }}
        </h3>
        <div class="specs-grid">
            <div 
                v-for="spec in filteredSpecs" 
                :key="spec.label"
                class="spec-row"
            >
                <span class="spec-label">{{ spec.label }}</span>
                <span class="spec-value" :class="spec.class">{{ spec.value }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    title: String,
    iconClass: String,
    specs: Array
});

const filteredSpecs = computed(() => {
    return props.specs.filter(spec => spec.value && spec.value !== 'N/A');
});
</script>

<style scoped>
.spec-section {
    background: white;
    padding: 24px;
    border-radius: 12px;
    margin-bottom: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.spec-section h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 2px solid #f0f0f0;
    display: flex;
    align-items: center;
    gap: 8px;
}

.specs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
}

.spec-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: #f8f9fa;
    border-radius: 8px;
}

.spec-label {
    font-weight: 500;
    color: #666;
}

.spec-value {
    font-weight: 600;
    color: #333;
}

.condition-badge {
    background: #e8f5e8 !important;
    color: #2d5a2d !important;
    padding: 4px 12px !important;
    border-radius: 12px !important;
}

.status-badge {
    padding: 4px 12px !important;
    border-radius: 12px !important;
    font-size: 12px !important;
}

.status-badge.active {
    background: #e8f5e8 !important;
    color: #2d5a2d !important;
}

.status-badge:not(.active) {
    background: #f8f9fa !important;
    color: #666 !important;
}

@media (max-width: 768px) {
    .specs-grid {
        grid-template-columns: 1fr;
    }
}
</style>