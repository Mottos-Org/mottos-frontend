<template>
    <div class="info-section">
        <h3>
            <i :class="iconClass"></i>
            {{ title }}
        </h3>
        <div class="info-grid">
            <div 
                v-for="item in items" 
                :key="item.label"
                class="info-item"
            >
                <div class="info-icon">
                    <i :class="item.icon"></i>
                </div>
                <div class="info-content">
                    <span class="info-label">{{ item.label }}</span>
                    <span class="info-value" :class="item.class">{{ item.value }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    title: String,
    iconClass: String,
    items: Array
});
</script>

<style scoped>
.info-section {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    padding: 28px;
    border-radius: 16px;
    margin-bottom: 24px;
    box-shadow: 
        0 4px 20px rgba(0, 0, 0, 0.08),
        0 1px 3px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(220, 53, 69, 0.08);
    text-align: left;
}

.info-section h3 {
    font-size: 1.3rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 2px solid rgba(220, 53, 69, 0.1);
    display: flex;
    align-items: center;
    gap: 10px;
    letter-spacing: -0.01em;
}

.info-section h3 i {
    color: #dc3545;
    font-size: 1.2rem;
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
}

.info-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 12px;
    border: 1px solid rgba(220, 53, 69, 0.06);
    transition: all 0.3s ease;
    text-align: left;
}

.info-item:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.08);
    border-color: rgba(220, 53, 69, 0.12);
    background: rgba(255, 255, 255, 0.9);
}

.info-icon {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, rgba(220, 53, 69, 0.1) 0%, rgba(253, 126, 20, 0.1) 100%);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: 1px solid rgba(220, 53, 69, 0.15);
}

.info-icon i {
    color: #dc3545;
    font-size: 16px;
}

.info-content {
    display: flex;
    flex-direction: column;
    gap: 3px;
    text-align: left;
}

.info-label {
    font-weight: 500;
    color: #6c757d;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    line-height: 1;
}

.info-value {
    font-weight: 600;
    color: #1a1a1a;
    font-size: 15px;
    line-height: 1.3;
}

/* Status-specific styling */
.info-value.status-available {
    color: #28a745;
    font-weight: 700;
}

.info-value.status-sold {
    color: #dc3545;
    font-weight: 700;
}

.info-value.status-reserved {
    color: #ffc107;
    font-weight: 700;
}

.info-value.condition-excellent {
    color: #28a745;
    font-weight: 700;
}

.info-value.condition-good {
    color: #17a2b8;
    font-weight: 700;
}

.info-value.condition-fair {
    color: #ffc107;
    font-weight: 700;
}

@media (max-width: 768px) {
    .info-section {
        padding: 20px;
        margin-bottom: 20px;
    }
    
    .info-section h3 {
        font-size: 1.2rem;
        margin-bottom: 20px;
        padding-bottom: 12px;
    }
    
    .info-grid {
        grid-template-columns: 1fr;
        gap: 12px;
    }
    
    .info-item {
        padding: 14px;
    }
    
    .info-icon {
        width: 32px;
        height: 32px;
    }
    
    .info-icon i {
        font-size: 14px;
    }
    
    .info-value {
        font-size: 14px;
    }
}

@media (max-width: 480px) {
    .info-section {
        padding: 16px;
    }
    
    .info-item {
        padding: 12px;
        gap: 12px;
    }
}
</style>