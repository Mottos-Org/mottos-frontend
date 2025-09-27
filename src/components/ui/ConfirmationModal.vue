<template>
    <div class="modal-overlay" @click.self="$emit('cancel')">
        <div class="modal-container">
            <div class="modal-icon">
                <div class="icon-circle" :class="iconClass">
                    <i :class="iconName"></i>
                </div>
            </div>
            
            <h4 class="modal-title">{{ title }}</h4>
            <p class="modal-message">{{ message }}</p>
            
            <div class="modal-actions">
                <button 
                    class="btn cancel-btn" 
                    @click="$emit('cancel')"
                    :disabled="loading"
                >
                    {{ cancelText }}
                </button>
                
                <button 
                    class="btn confirm-btn" 
                    :class="confirmClass"
                    @click="$emit('confirm')"
                    :disabled="loading"
                >
                    <div v-if="loading" class="spinner-border spinner-border-sm me-2"></div>
                    <i v-if="!loading && confirmIcon" :class="confirmIcon" class="me-1"></i>
                    {{ confirmText }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    title: {
        type: String,
        default: '¿Estás seguro?'
    },
    message: {
        type: String,
        default: 'Esta acción no se puede deshacer.'
    },
    confirmText: {
        type: String,
        default: 'Confirmar'
    },
    cancelText: {
        type: String,
        default: 'Cancelar'
    },
    confirmClass: {
        type: String,
        default: 'btn-danger'
    },
    confirmIcon: {
        type: String,
        default: null
    },
    loading: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        default: 'danger' // danger, warning, info
    }
});

defineEmits(['confirm', 'cancel']);

const iconClass = computed(() => {
    switch (props.type) {
        case 'warning':
            return 'warning';
        case 'info':
            return 'info';
        default:
            return 'danger';
    }
});

const iconName = computed(() => {
    switch (props.type) {
        case 'warning':
            return 'bi bi-exclamation-triangle';
        case 'info':
            return 'bi bi-info-circle';
        default:
            return 'bi bi-trash';
    }
});
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    padding: 1rem;
}

.modal-container {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    width: 100%;
    max-width: 420px;
    text-align: center;
    box-shadow: 0 4px 40px rgba(0, 0, 0, 0.15);
    animation: modalEnter 0.3s ease;
}

@keyframes modalEnter {
    from {
        opacity: 0;
        transform: scale(0.9);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

.modal-icon {
    margin-bottom: 1rem;
}

.icon-circle {
    border-radius: 9999px;
    width: 3.5rem;
    height: 3.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    margin: 0 auto;
}

.icon-circle.danger {
    background-color: #fef2f2;
    color: #dc2626;
}

.icon-circle.warning {
    background-color: #fffbeb;
    color: #f59e0b;
}

.icon-circle.info {
    background-color: #eff6ff;
    color: #3b82f6;
}

.modal-title {
    font-weight: 700;
    font-size: 1.25rem;
    color: #111;
    margin-bottom: 0.5rem;
}

.modal-message {
    font-size: 0.95rem;
    color: #6b7280;
    margin-bottom: 2rem;
    line-height: 1.5;
}

.modal-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
}

.btn {
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    transition: all 0.2s ease;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 100px;
    border: 1px solid;
}

.cancel-btn {
    background: white;
    border-color: #d1d5db;
    color: #374151;
}

.cancel-btn:hover:not(:disabled) {
    background-color: #f3f4f6;
}

.confirm-btn {
    color: white;
    border: none;
}

.btn-danger {
    background-color: #dc2626;
}

.btn-danger:hover:not(:disabled) {
    background-color: #b91c1c;
}

.btn-warning {
    background-color: #f59e0b;
}

.btn-warning:hover:not(:disabled) {
    background-color: #d97706;
}

.btn-primary {
    background-color: #3b82f6;
}

.btn-primary:hover:not(:disabled) {
    background-color: #2563eb;
}

.btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.spinner-border-sm {
    width: 0.75rem;
    height: 0.75rem;
    border-width: 0.1em;
}

@media (max-width: 480px) {
    .modal-container {
        padding: 1.5rem;
        margin: 1rem;
    }
    
    .modal-actions {
        flex-direction: column;
    }
    
    .btn {
        width: 100%;
    }
}
</style>