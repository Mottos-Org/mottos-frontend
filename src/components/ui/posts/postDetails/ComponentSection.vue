<template>
    <div class="component-section">
        <h3>
            <i :class="iconClass"></i>
            {{ title }}
        </h3>
        <div class="components-grid">
            <div v-for="component in components" :key="component.id" class="component-card">
                <div class="component-header">
                    <div class="header-icon">
                        <i :class="iconClass"></i>
                    </div>
                    <span class="component-position">{{ component.position }}</span>
                </div>
                <div class="component-details">
                    <div 
                        v-for="detail in component.details" 
                        :key="detail.label"
                        class="detail-row"
                    >
                        <span class="detail-label">{{ detail.label }}</span>
                        <span class="detail-value">{{ detail.value }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    title: String,
    iconClass: String,
    components: Array
});
</script>

<style scoped>
.component-section {
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

.component-section h3 {
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

.component-section h3 i {
    color: #dc3545;
    font-size: 1.2rem;
}

.components-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 20px;
}

.component-card {
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(220, 53, 69, 0.08);
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.3s ease;
    text-align: left;
}

.component-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(220, 53, 69, 0.12);
    border-color: rgba(220, 53, 69, 0.15);
}

.component-header {
    background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%);
    color: white;
    padding: 18px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
    overflow: hidden;
}

.component-header::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
    pointer-events: none;
}

.header-icon {
    width: 32px;
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    text-align: center;
}

.header-icon i {
    font-size: 16px;
    color: white;
}

.component-position {
    font-weight: 700;
    font-size: 16px;
    letter-spacing: -0.01em;
}

.component-details {
    padding: 20px;
    background: white;
}

.detail-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    gap: 16px;
}

.detail-row:last-child {
    margin-bottom: 0;
    border-bottom: none;
    padding-bottom: 0;
}

.detail-label {
    font-weight: 500;
    color: #6c757d;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    flex-shrink: 0;
    min-width: 60px;
}

.detail-value {
    font-weight: 600;
    color: #1a1a1a;
    font-size: 14px;
    text-align: right;
    line-height: 1.3;
}

@media (max-width: 768px) {
    .component-section {
        padding: 20px;
        margin-bottom: 20px;
    }
    
    .component-section h3 {
        font-size: 1.2rem;
        margin-bottom: 20px;
        padding-bottom: 12px;
    }
    
    .components-grid {
        grid-template-columns: 1fr;
        gap: 16px;
    }
    
    .component-card {
        border-radius: 12px;
    }
    
    .component-header {
        padding: 16px;
    }
    
    .header-icon {
        width: 28px;
        height: 28px;
    }
    
    .header-icon i {
        font-size: 14px;
    }
    
    .component-position {
        font-size: 15px;
    }
    
    .component-details {
        padding: 16px;
    }
    
    .detail-row {
        margin-bottom: 10px;
        padding-bottom: 6px;
    }
    
    .detail-label {
        font-size: 12px;
        min-width: 50px;
    }
    
    .detail-value {
        font-size: 13px;
    }
}

@media (max-width: 480px) {
    .component-section {
        padding: 16px;
    }
    
    .components-grid {
        gap: 12px;
    }
    
    .component-header {
        padding: 14px;
    }
    
    .component-details {
        padding: 14px;
    }
    
    .detail-row {
        flex-direction: column;
        gap: 4px;
        align-items: flex-start;
    }
    
    .detail-value {
        text-align: left;
        font-size: 14px;
    }
}
</style>