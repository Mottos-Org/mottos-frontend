<template>
    <div class="bike-card">
        <div class="card-header">
            <div class="bike-info">
                <h3 class="bike-title">{{ bike.marca.nombre_marca }} {{ bike.modelo.nombre_modelo }}</h3>
                <div class="bike-specs">
                    <span class="year">{{ bike.year }}</span>
                    <span class="separator">•</span>
                    <span class="displacement">{{ bike.displacement }}</span>
                    <span class="separator">•</span>
                    <span class="type">{{ bike.bike_type?.nombre_tipo || 'N/A' }}</span>
                </div>
            </div>
            <div class="status-badge" :class="{ 'for-sale': bike.en_venta, 'personal': !bike.en_venta }">
                <i :class="bike.en_venta ? 'bi bi-currency-dollar' : 'bi bi-house'"></i>
                {{ bike.en_venta ? 'En Venta' : 'Personal' }}
            </div>
        </div>

        <div class="card-content">
            <div class="specs-grid">
                <div v-if="bike.engine" class="spec-item">
                    <i class="bi bi-cpu"></i>
                    <span>{{ bike.engine }}</span>
                </div>
                <div v-if="bike.power" class="spec-item">
                    <i class="bi bi-lightning"></i>
                    <span>{{ bike.power }}</span>
                </div>
                <div v-if="bike.torque" class="spec-item">
                    <i class="bi bi-speedometer2"></i>
                    <span>{{ bike.torque }}</span>
                </div>
                <div v-if="bike.fuel_system?.fuel_capacity" class="spec-item">
                    <i class="bi bi-fuel-pump"></i>
                    <span>{{ bike.fuel_system.fuel_capacity }}</span>
                </div>
            </div>

            <!-- Additional details -->
            <div v-if="hasAdditionalSpecs" class="additional-specs">
                <div class="specs-summary">
                    <span v-if="bike.tires?.length" class="spec-badge">
                        <i class="bi bi-circle"></i>
                        Llantas configuradas
                    </span>
                    <span v-if="bike.brakes?.length" class="spec-badge">
                        <i class="bi bi-disc"></i>
                        Frenos configurados
                    </span>
                    <span v-if="bike.suspensions?.length" class="spec-badge">
                        <i class="bi bi-bezier2"></i>
                        Suspensión configurada
                    </span>
                </div>
            </div>
        </div>

        <div class="card-actions">
            <button 
                @click="$emit('view-details', bike)"
                class="btn btn-outline-info btn-sm"
                title="Ver detalles completos"
            >
                <i class="bi bi-eye"></i>
                Ver Detalles
            </button>
            
            <button 
                @click="$emit('edit', bike)"
                class="btn btn-outline-primary btn-sm"
                title="Editar motocicleta"
            >
                <i class="bi bi-pencil"></i>
                Editar
            </button>
            
            <button 
                v-if="!bike.en_venta"
                @click="$emit('sell', bike)"
                class="btn btn-outline-success btn-sm"
                title="Publicar para venta"
            >
                <i class="bi bi-currency-dollar"></i>
                Vender
            </button>
            
            <button 
                v-if="!bike.en_venta"
                @click="$emit('delete', bike)"
                class="btn btn-outline-danger btn-sm"
                title="Eliminar del garaje"
            >
                <i class="bi bi-trash"></i>
                Eliminar
            </button>
        </div>

        <div class="card-footer">
            <span class="created-date">
                <i class="bi bi-calendar"></i>
                Agregada {{ formatDate(bike.created_at) }}
            </span>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    bike: {
        type: Object,
        required: true
    }
});

defineEmits(['edit', 'delete', 'sell', 'view-details']);

const hasAdditionalSpecs = computed(() => {
    return props.bike.tires?.length || props.bike.brakes?.length || props.bike.suspensions?.length;
});

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'hace 1 día';
    if (diffDays < 30) return `hace ${diffDays} días`;
    
    return date.toLocaleDateString('es-DO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
};
</script>

<style scoped>
.bike-card {
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    flex-direction: column;
}

.bike-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
    border-color: #d0d0d0;
}

.card-header {
    padding: 1.5rem;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
}

.bike-info {
    flex: 1;
}

.bike-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 0.5rem;
    line-height: 1.2;
}

.bike-specs {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: #6c757d;
    font-weight: 500;
}

.separator {
    opacity: 0.5;
}

.status-badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 600;
    white-space: nowrap;
}

.status-badge.for-sale {
    background: rgba(40, 167, 69, 0.1);
    color: #28a745;
    border: 1px solid rgba(40, 167, 69, 0.3);
}

.status-badge.personal {
    background: rgba(0, 123, 255, 0.1);
    color: #007bff;
    border: 1px solid rgba(0, 123, 255, 0.3);
}

.card-content {
    padding: 1.5rem;
    flex: 1;
}

.specs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
}

.spec-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #495057;
}

.spec-item i {
    color: #dc3545;
    font-size: 1rem;
}

.additional-specs {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #f0f0f0;
}

.specs-summary {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.spec-badge {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.75rem;
    background: #f8f9fa;
    border-radius: 12px;
    font-size: 0.75rem;
    color: #6c757d;
    font-weight: 500;
}

.spec-badge i {
    color: #28a745;
    font-size: 0.875rem;
}

.card-actions {
    padding: 1rem 1.5rem;
    border-top: 1px solid #f0f0f0;
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.btn-sm {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    text-decoration: none;
    border-width: 1px;
    transition: all 0.2s ease;
    flex: 1;
    justify-content: center;
    min-width: 0;
}

.btn-outline-primary {
    color: #007bff;
    border-color: #007bff;
}

.btn-outline-primary:hover {
    background: #007bff;
    color: white;
}

.btn-outline-success {
    color: #28a745;
    border-color: #28a745;
}

.btn-outline-success:hover {
    background: #28a745;
    color: white;
}

.btn-outline-danger {
    color: #dc3545;
    border-color: #dc3545;
}

.btn-outline-danger:hover {
    background: #dc3545;
    color: white;
}

.btn-outline-info {
    color: #17a2b8;
    border-color: #17a2b8;
}

.btn-outline-info:hover {
    background: #17a2b8;
    color: white;
}

.card-footer {
    padding: 1rem 1.5rem;
    background: #f8f9fa;
    border-top: 1px solid #f0f0f0;
    display: flex;
    justify-content: center;
}

.created-date {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    color: #6c757d;
}

.created-date i {
    color: #dc3545;
}

@media (max-width: 768px) {
    .card-header {
        flex-direction: column;
        align-items: stretch;
    }
    
    .status-badge {
        align-self: flex-start;
    }
    
    .specs-grid {
        grid-template-columns: 1fr;
    }
    
    .card-actions {
        flex-direction: column;
    }
    
    .btn-sm {
        flex: none;
    }
}
</style>