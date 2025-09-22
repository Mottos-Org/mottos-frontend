<template>
    <div class="bike-selection">
        <div class="section-header">
            <h3>
                <i class="bi bi-motorcycle"></i>
                {{ isEditing ? 'Motocicleta de la Publicación' : 'Selecciona tu Motocicleta' }}
            </h3>
            <p>{{ isEditing ? 'Esta es la moto que estás publicando' : 'Elige una de tus motos registradas o crea una nueva' }}</p>
        </div>

        <div v-if="isEditing && selectedBike" class="editing-bike-info">
            <div class="bike-card selected editing-mode">
                <div class="card-header">
                    <div class="status-indicator">
                        <div class="status-dot available"></div>
                        <span class="status-text">Disponible</span>
                    </div>
                    <div class="bike-year">{{ selectedBike.year }}</div>
                </div>

                <div class="bike-info">
                    <h4 class="bike-name">
                        {{ selectedBike.marca.nombre_marca }} 
                        <span class="model-name">{{ selectedBike.modelo.nombre_modelo }}</span>
                    </h4>
                    
                    <div class="bike-specs">
                        <div class="spec-item">
                            <i class="bi bi-gear-fill"></i>
                            <span>{{ selectedBike.displacement }}</span>
                        </div>
                        <div class="spec-item">
                            <i class="bi bi-speedometer2"></i>
                            <span>{{ selectedBike.bike_type.nombre_tipo }}</span>
                        </div>
                        <div class="spec-item">
                            <i class="bi bi-lightning-charge-fill"></i>
                            <span>{{ selectedBike.power || 'N/A' }}</span>
                        </div>
                    </div>
                </div>

                <div class="editing-badge">
                    <i class="bi bi-pencil-square"></i>
                    <span>Editando esta moto</span>
                </div>
            </div>
        </div>

        <div v-else-if="loading" class="loading-container">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando motos...</span>
            </div>
            <p>Cargando tus motocicletas...</p>
        </div>

        <div v-else-if="userBikes.length === 0" class="no-bikes-state">
            <div class="no-bikes-icon">
                <i class="bi bi-plus-circle"></i>
            </div>
            <h4>No tienes motos registradas</h4>
            <p>Para crear una publicación, primero necesitas registrar tu motocicleta</p>
            <button @click="$emit('create-new-bike')" class="btn btn-primary">
                <i class="bi bi-plus"></i>
                Registrar mi Primera Moto
            </button>
        </div>

        <div v-else class="bikes-container">
            <div v-if="availableBikes.length > 0" class="bikes-section">
                <div class="section-divider">
                    <h4 class="section-title">
                        <i class="bi bi-check-circle-fill text-success"></i>
                        Motos Disponibles ({{ availableBikes.length }})
                    </h4>
                </div>
                <div class="bikes-grid">
                    <div 
                        v-for="bike in availableBikes" 
                        :key="bike.bike_id"
                        class="bike-card"
                        :class="{ selected: selectedBike?.bike_id === bike.bike_id }"
                        @click="handleBikeClick(bike)"
                    >
                        <div class="card-header">
                            <div class="status-indicator">
                                <div class="status-dot available"></div>
                                <span class="status-text">Disponible</span>
                            </div>
                            <div class="bike-year">{{ bike.year }}</div>
                        </div>

                        <div class="bike-info">
                            <h4 class="bike-name">
                                {{ bike.marca.nombre_marca }} 
                                <span class="model-name">{{ bike.modelo.nombre_modelo }}</span>
                            </h4>
                            
                            <div class="bike-specs">
                                <div class="spec-item">
                                    <i class="bi bi-gear-fill"></i>
                                    <span>{{ bike.displacement }}</span>
                                </div>
                                <div class="spec-item">
                                    <i class="bi bi-speedometer2"></i>
                                    <span>{{ bike.bike_type.nombre_tipo }}</span>
                                </div>
                                <div class="spec-item">
                                    <i class="bi bi-lightning-charge-fill"></i>
                                    <span>{{ bike.power || 'N/A' }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="selection-check">
                            <i class="bi bi-check-circle-fill"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="soldBikes.length > 0" class="bikes-section sold-section">
                <div class="section-divider">
                    <h4 class="section-title sold-title">
                        <i class="bi bi-exclamation-triangle-fill text-warning"></i>
                        Ya en Venta ({{ soldBikes.length }})
                    </h4>
                    <p class="section-subtitle">Estas motos ya tienen publicaciones activas</p>
                </div>
                <div class="bikes-grid">
                    <div 
                        v-for="bike in soldBikes" 
                        :key="bike.bike_id"
                        class="bike-card unavailable"
                        @click="handleBikeClick(bike)"
                    >
                        <div class="card-header">
                            <div class="status-indicator">
                                <div class="status-dot unavailable"></div>
                                <span class="status-text">Ya en venta</span>
                            </div>
                            <div class="bike-year">{{ bike.year }}</div>
                        </div>

                        <div class="bike-info">
                            <h4 class="bike-name">
                                {{ bike.marca.nombre_marca }} 
                                <span class="model-name">{{ bike.modelo.nombre_modelo }}</span>
                            </h4>
                            
                            <div class="bike-specs">
                                <div class="spec-item">
                                    <i class="bi bi-gear-fill"></i>
                                    <span>{{ bike.displacement }}</span>
                                </div>
                                <div class="spec-item">
                                    <i class="bi bi-speedometer2"></i>
                                    <span>{{ bike.bike_type.nombre_tipo }}</span>
                                </div>
                                <div class="spec-item">
                                    <i class="bi bi-lightning-charge-fill"></i>
                                    <span>{{ bike.power || 'N/A' }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="unavailable-status">
                            <div class="unavailable-badge">
                                <i class="bi bi-exclamation-triangle-fill"></i>
                                <span>Ya en venta</span>
                            </div>
                        </div>

                        <div class="unavailable-overlay">
                            <div class="lock-icon">
                                <i class="bi bi-lock-fill"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="add-bike-section">
                <button @click="$emit('create-new-bike')" class="btn btn-outline-primary btn-add-bike">
                    <i class="bi bi-plus-circle"></i>
                    Registrar Nueva Moto
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    userBikes: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    },
    selectedBike: {
        type: Object,
        default: null
    },
    isEditing: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['bike-selected', 'create-new-bike']);

const availableBikes = computed(() => {
    return props.userBikes.filter(bike => !bike.en_venta);
});

const soldBikes = computed(() => {
    return props.userBikes.filter(bike => bike.en_venta);
});

const handleBikeClick = (bike) => {
    if (!bike.en_venta && !props.isEditing) {
        emit('bike-selected', bike);
    }
};
</script>

<style scoped>
.bike-selection {
    padding: 0;
}

.section-header {
    text-align: center;
    margin-bottom: 2.5rem;
}

.section-header h3 {
    color: #1a1a1a;
    font-weight: 700;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-size: 1.5rem;
}

.section-header h3 i {
    color: #dc3545;
}

.section-header p {
    color: #6c757d;
    margin: 0;
    font-size: 1rem;
}

.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3rem;
    color: #6c757d;
}

.loading-container .spinner-border {
    width: 3rem;
    height: 3rem;
    margin-bottom: 1rem;
}

.no-bikes-state {
    text-align: center;
    padding: 3rem;
}

.no-bikes-icon i {
    font-size: 4rem;
    color: #dc3545;
    margin-bottom: 1rem;
}

.no-bikes-state h4 {
    color: #1a1a1a;
    margin-bottom: 1rem;
}

.no-bikes-state p {
    color: #6c757d;
    margin-bottom: 2rem;
}

.bikes-section {
    margin-bottom: 3rem;
}

.section-divider {
    margin-bottom: 2rem;
    text-align: left;
}

.section-title {
    color: #1a1a1a;
    font-weight: 700;
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.section-title i {
    font-size: 1.1rem;
}

.section-subtitle {
    color: #6c757d;
    margin: 0;
    font-size: 0.95rem;
}

.sold-section {
    background: rgba(255, 193, 7, 0.02);
    border: 1px solid rgba(255, 193, 7, 0.1);
    border-radius: 12px;
    padding: 2rem;
    margin-top: 3rem;
}

.sold-title {
    color: #856404;
}

.bikes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 2rem;
}

.bike-card {
    background: white;
    border: 2px solid #e9ecef;
    border-radius: 16px;
    padding: 0;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0,0,0,0.04);
}

.bike-card:not(.unavailable):hover {
    border-color: #dc3545;
    box-shadow: 0 8px 30px rgba(220, 53, 69, 0.15);
    transform: translateY(-4px);
}

.bike-card.selected {
    border-color: #dc3545;
    background: white;
    box-shadow: 0 8px 35px rgba(220, 53, 69, 0.2);
    transform: translateY(-4px);
}

.bike-card.selected::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #dc3545, #ff6b7a);
}

.bike-card.unavailable {
    background: #f8f9fa;
    border-color: #e9ecef;
    cursor: not-allowed;
}

.bike-card.unavailable:hover {
    transform: none;
    box-shadow: 0 2px 12px rgba(0,0,0,0.04);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 1.25rem 0.75rem;
    border-bottom: 1px solid #f1f3f4;
}

.status-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
}

.status-dot.available {
    background: #28a745;
    box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.2);
}

.status-dot.unavailable {
    background: #dc3545;
    box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.2);
}

.status-text {
    font-size: 0.875rem;
    font-weight: 600;
    color: #495057;
}

.bike-card.unavailable .status-text {
    color: #dc3545;
}

.bike-card:not(.unavailable) .status-text {
    color: #28a745;
}

.bike-year {
    background: linear-gradient(135deg, #dc3545, #ff6b7a);
    color: white;
    padding: 0.375rem 0.875rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 700;
    letter-spacing: 0.5px;
}

.bike-info {
    padding: 1.25rem;
}

.bike-name {
    color: #1a1a1a;
    font-weight: 700;
    margin: 0 0 1rem 0;
    font-size: 1.25rem;
    line-height: 1.3;
}

.model-name {
    display: block;
    font-weight: 500;
    color: #6c757d;
    font-size: 1rem;
    margin-top: 0.25rem;
}

.bike-specs {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.spec-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: #495057;
    font-size: 0.95rem;
    font-weight: 500;
}

.spec-item i {
    color: #dc3545;
    width: 18px;
    font-size: 1rem;
    flex-shrink: 0;
}

.bike-card.unavailable .bike-info {
    opacity: 0.6;
}

.selection-check {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    opacity: 0;
    transition: all 0.3s ease;
    transform: scale(0.8);
}

.bike-card.selected .selection-check {
    opacity: 1;
    transform: scale(1);
}

.selection-check i {
    color: #dc3545;
    font-size: 2rem;
    filter: drop-shadow(0 2px 4px rgba(220, 53, 69, 0.3));
}

.unavailable-status {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
}

.unavailable-badge {
    background: rgba(220, 53, 69, 0.9);
    color: white;
    padding: 0.75rem 1.25rem;
    border-radius: 25px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 700;
    font-size: 0.9rem;
    box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
    border: 2px solid rgba(255, 255, 255, 0.2);
}

.unavailable-badge i {
    font-size: 1rem;
}

.unavailable-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(248, 249, 250, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(1px);
    z-index: 2;
}

.lock-icon i {
    font-size: 3rem;
    color: #adb5bd;
    opacity: 0.4;
}

.add-bike-section {
    text-align: center;
    padding-top: 2rem;
    border-top: 1px solid #e9ecef;
}

.btn {
    padding: 0.875rem 1.75rem;
    border-radius: 12px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    border: 2px solid transparent;
    text-decoration: none;
    font-size: 1rem;
}

.btn-primary {
    background: #dc3545;
    color: white;
    border-color: #dc3545;
}

.btn-primary:hover {
    background: #c82333;
    border-color: #c82333;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(220, 53, 69, 0.3);
}

.btn-outline-primary {
    background: transparent;
    color: #dc3545;
    border-color: #dc3545;
}

.btn-outline-primary:hover {
    background: #dc3545;
    color: white;
    border-color: #dc3545;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(220, 53, 69, 0.3);
}

.btn-add-bike {
    font-size: 1.1rem;
    padding: 1rem 2rem;
}

/* ✅ NEW: Just add styles for editing mode */
.editing-bike-info {
    margin-bottom: 2rem;
}

.bike-card.editing-mode {
    border-color: #ffc107;
    background: linear-gradient(135deg, rgba(255, 193, 7, 0.1), white);
    cursor: default;
}

.editing-badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: #ffc107;
    color: #212529;
    padding: 0.5rem 1rem;
    border-radius: 15px;
    font-size: 0.875rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    z-index: 3;
}

@media (max-width: 768px) {
    .bikes-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
    
    .bike-card {
        margin: 0 0.5rem;
    }
    
    .section-title {
        font-size: 1.1rem;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }
    
    .sold-section {
        padding: 1.5rem;
        margin-top: 2rem;
    }
    
    .card-header {
        padding: 1rem 1rem 0.5rem;
    }
    
    .bike-info {
        padding: 1rem;
    }
    
    .bike-name {
        font-size: 1.1rem;
    }
    
    .model-name {
        font-size: 0.95rem;
    }
    
    .spec-item {
        font-size: 0.9rem;
    }
    
    .unavailable-badge {
        padding: 0.5rem 1rem;
        font-size: 0.8rem;
    }
}

@media (max-width: 480px) {
    .section-header h3 {
        font-size: 1.25rem;
        flex-direction: column;
        gap: 0.25rem;
    }
    
    .bikes-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    
    .card-header {
        flex-direction: column;
        gap: 0.75rem;
        align-items: flex-start;
    }
    
    .bike-year {
        align-self: flex-start;
    }
    
    .unavailable-badge {
        padding: 0.5rem 0.875rem;
        font-size: 0.75rem;
    }
}
</style>