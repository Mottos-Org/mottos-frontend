<template>
    <div class="bike-card">
        <!-- Hero Section with Image/Gradient -->
        <div class="card-hero">
            <img 
                v-if="bike.featured_image_url && !imageError" 
                :src="bike.featured_image_url" 
                :alt="`${bike.marca.nombre_marca} ${bike.modelo.nombre_modelo}`"
                class="hero-image"
                @error="handleImageError"
                @load="handleImageLoad"
            />
            
            <div class="image-overlay"></div>
            
            <div class="hero-content">
                <div class="status-badge-hero" :class="{ 'for-sale': bike.en_venta, 'personal': !bike.en_venta }">
                    <i :class="bike.en_venta ? 'bi bi-currency-dollar' : 'bi bi-house'"></i>
                    {{ bike.en_venta ? 'En Venta' : 'Personal' }}
                </div>
                
                <div class="bike-info-overlay">
                    <h3 class="bike-title">{{ bike.marca.nombre_marca }} {{ bike.modelo.nombre_modelo }}</h3>
                    <div class="bike-details">
                        <span class="year">{{ bike.year }}</span>
                        <span class="separator">•</span>
                        <span class="displacement">{{ bike.displacement }}</span>
                        <span class="separator">•</span>
                        <span class="type">{{ bike.bike_type?.nombre_tipo || 'N/A' }}</span>
                    </div>
                </div>
            </div>

            <div v-if="!bike.featured_image_url || imageError" class="no-image-placeholder">
                <i class="bi bi-motorcycle"></i>
                <span>Sin imagen</span>
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
import { ref, computed } from 'vue';

const props = defineProps({
    bike: {
        type: Object,
        required: true
    }
});

defineEmits(['edit', 'delete', 'sell', 'view-details']);

const imageError = ref(false);

const hasAdditionalSpecs = computed(() => {
    return props.bike.tires?.length || props.bike.brakes?.length || props.bike.suspensions?.length;
});

const handleImageError = () => {
    imageError.value = true;
    console.warn('Bike image failed to load:', props.bike.featured_image_url);
};

const handleImageLoad = () => {
    imageError.value = false;
};

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
    max-width: 425px;
    min-width: 350px;
}

.bike-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
    border-color: #d0d0d0;
}

/* Hero Section - Similar to PublicacionCard */
.card-hero {
    height: 200px;
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, #dc3545 0%, #c82333 50%, #b71c1c 100%);
}

.hero-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    transition: transform 0.3s ease;
    z-index: 0;
    image-rendering: crisp-edges;
    image-rendering: -webkit-optimize-contrast;
}

.bike-card:hover .hero-image {
    transform: scale(1.05);
}

.image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.1) 0%,
        rgba(0, 0, 0, 0.0) 25%,
        rgba(0, 0, 0, 0.0) 65%,
        rgba(0, 0, 0, 0.7) 100%
    );
    z-index: 1;
    pointer-events: none;
}

.hero-content {
    position: relative;
    height: 100%;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    z-index: 2;
}

.status-badge-hero {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    align-self: flex-end;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.status-badge-hero.for-sale {
    background: rgba(40, 167, 69, 0.2);
    color: #fff;
}

.status-badge-hero.personal {
    background: rgba(0, 123, 255, 0.2);
    color: #fff;
}

.bike-info-overlay {
    color: white;
}

.bike-title {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.8);
    line-height: 1.2;
}

.bike-details {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    font-weight: 500;
    text-shadow: 0 1px 8px rgba(0, 0, 0, 0.8);
}

.separator {
    opacity: 0.7;
    font-weight: 300;
}

.no-image-placeholder {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    color: rgba(255, 255, 255, 0.8);
    z-index: 1;
}

.no-image-placeholder i {
    font-size: 2.5rem;
}

.no-image-placeholder span {
    font-size: 0.875rem;
    font-weight: 500;
}

.card-content {
    padding: 1.5rem;
    flex: 1;
}

.specs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 0.75rem;
    margin-bottom: 1rem;
}

.spec-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    color: #495057;
    background: #f8f9fa;
    padding: 0.5rem 0.75rem;
    border-radius: 20px;
    transition: all 0.2s ease;
}

.spec-item:hover {
    background: #e9ecef;
}

.spec-item i {
    color: #dc3545;
    font-size: 0.875rem;
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
    background: #e8f5e8;
    border-radius: 12px;
    font-size: 0.75rem;
    color: #2d5a2d;
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
    background: white;
    cursor: pointer;
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

/* Hover effects for the gradient background */
.bike-card:hover .image-overlay {
    background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.05) 0%,
        rgba(0, 0, 0, 0.0) 25%,
        rgba(0, 0, 0, 0.0) 65%,
        rgba(0, 0, 0, 0.6) 100%
    );
}

.bike-card:hover .bike-title {
    text-shadow: 0 3px 16px rgba(0, 0, 0, 0.9);
}

@media (max-width: 768px) {
    .bike-card {
        max-width: 100%;
        min-width: 100%;
    }
    
    .bike-card:hover {
        transform: translateY(-2px);
    }
    
    .bike-card:hover .hero-image {
        transform: scale(1.02);
    }
    
    .card-hero {
        height: 180px;
    }
    
    .hero-content {
        padding: 0.75rem;
    }
    
    .bike-title {
        font-size: 1.1rem;
    }
    
    .bike-details {
        font-size: 0.8rem;
    }
    
    .specs-grid {
        grid-template-columns: 1fr;
        gap: 0.5rem;
    }
    
    .card-actions {
        flex-direction: column;
    }
    
    .btn-sm {
        flex: none;
    }
}

@media (max-width: 480px) {
    .card-hero {
        height: 160px;
    }
}
</style>