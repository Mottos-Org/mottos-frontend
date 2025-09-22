<template>
    <div class="publicacion-review">
        <div class="section-header">
            <h3>
                <i class="bi bi-check2-circle"></i>
                Revisa tu Publicación
            </h3>
            <p>Verifica que toda la información esté correcta antes de publicar</p>
        </div>

        <div class="review-container">
            <div class="row">
                <div class="col-lg-8">
                    <div class="review-section">
                        <h4>
                            <i class="bi bi-motorcycle"></i>
                            Motocicleta Seleccionada
                        </h4>
                        <div class="bike-review-card">
                            <div class="bike-header">
                                <div class="bike-main-info">
                                    <h5 class="bike-name">
                                        {{ selectedBike.marca.nombre_marca }} 
                                        {{ selectedBike.modelo.nombre_modelo }}
                                    </h5>
                                    <div class="bike-year">{{ selectedBike.year }}</div>
                                </div>
                                <div class="bike-status">
                                    <div class="status-indicator available">
                                        <div class="status-dot"></div>
                                        <span>Disponible</span>
                                    </div>
                                </div>
                            </div>
                            <div class="bike-specs-review">
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
                    </div>

                    <div v-if="imageData.images.length > 0" class="review-section">
                        <h4>
                            <i class="bi bi-images"></i>
                            Imágenes ({{ imageData.images.length }})
                        </h4>
                        <div class="images-review-grid">
                            <div 
                                v-for="(image, index) in imageData.images" 
                                :key="index"
                                class="image-review-item"
                                :class="{ 'featured': imageData.featuredIndex === index }"
                            >
                                <img :src="image.preview" :alt="`Imagen ${index + 1}`" />
                                <div v-if="imageData.featuredIndex === index" class="featured-badge">
                                    <i class="bi bi-star-fill"></i>
                                    Principal
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="review-section">
                        <h4>
                            <i class="bi bi-card-text"></i>
                            Detalles de la Publicación
                        </h4>
                        <div class="details-grid">
                            <div class="detail-card">
                                <div class="detail-header">
                                    <i class="bi bi-file-text"></i>
                                    <h6>Descripción</h6>
                                </div>
                                <p class="detail-content">{{ publicacionData.descripcion }}</p>
                            </div>

                            <div class="detail-card">
                                <div class="detail-header">
                                    <i class="bi bi-gear"></i>
                                    <h6>Estado y Kilometraje</h6>
                                </div>
                                <div class="detail-content">
                                    <div class="detail-row">
                                        <span class="label">Condición:</span>
                                        <span class="value condition">{{ getConditionName(publicacionData.condicion_id) }}</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="label">Kilometraje:</span>
                                        <span class="value">{{ formatNumber(publicacionData.recorrido) }} {{ getUnitName(publicacionData.unidad_metrica_id) }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="detail-card">
                                <div class="detail-header">
                                    <i class="bi bi-geo-alt"></i>
                                    <h6>Ubicación</h6>
                                </div>
                                <div class="detail-content">
                                    <div class="location-info">
                                        <i class="bi bi-pin-map"></i>
                                        <span>{{ getLocationName(publicacionData.ubicacion_id) }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="detail-card">
                                <div class="detail-header">
                                    <i class="bi bi-calendar"></i>
                                    <h6>Vigencia</h6>
                                </div>
                                <div class="detail-content">
                                    <div class="date-info">
                                        <span class="label">Activa hasta:</span>
                                        <span class="value date">{{ formatDate(publicacionData.fecha_vencimiento) }}</span>
                                    </div>
                                    <div class="duration-info">
                                        <i class="bi bi-clock"></i>
                                        <span>{{ getDurationText(publicacionData.fecha_vencimiento) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="price-summary">
                        <div class="price-header">
                            <h4>
                                <i class="bi bi-currency-dollar"></i>
                                Precio de Venta
                            </h4>
                        </div>
                        <div class="price-display">
                            <div class="currency">{{ getCurrencyName(publicacionData.tipo_moneda_id) }}</div>
                            <div class="price">{{ formatPrice(publicacionData.precio) }}</div>
                            <div v-if="publicacionData.negociable" class="negotiable-badge">
                                <i class="bi bi-arrow-left-right"></i>
                                Precio negociable
                            </div>
                        </div>
                    </div>

                    <div class="status-card">
                        <div class="status-header">
                            <i class="bi bi-info-circle"></i>
                            <h5>Estado de Publicación</h5>
                        </div>
                        <div class="status-content">
                            <div class="status-item">
                                <i class="bi bi-check-circle-fill text-success"></i>
                                <span>Lista para publicar</span>
                            </div>
                            <div class="status-item">
                                <i class="bi bi-eye-fill text-primary"></i>
                                <span>Será visible públicamente</span>
                            </div>
                            <div class="status-item">
                                <i class="bi bi-clock-fill text-warning"></i>
                                <span>{{ getDurationText(publicacionData.fecha_vencimiento) }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="action-buttons">
                        <button 
                            @click="handleSubmit" 
                            class="btn btn-primary btn-publish"
                            :disabled="submitting"
                        >
                            <div v-if="submitting" class="spinner-border spinner-border-sm me-2" role="status"></div>
                            <i v-else class="bi bi-upload"></i>
                            {{ submitting ? 'Publicando...' : 'Publicar Moto' }}
                        </button>
                        
                        <div class="terms-notice">
                            <i class="bi bi-shield-check"></i>
                            <span>
                                Al publicar aceptas nuestros 
                                <a href="/terminos" target="_blank" class="terms-link">términos y condiciones</a>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import api from '../../../services/api';
import { useAuthStore } from '../../../stores/authStore';

const props = defineProps({
    selectedBike: {
        type: Object,
        required: true
    },
    publicacionData: {
        type: Object,
        required: true
    },
    imageData: {
        type: Object,
        default: () => ({ images: [], featuredIndex: null })
    },
    submitting: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['submit']);

const authStore = useAuthStore();
const userAddresses = ref([]);
const loadingAddresses = ref(false);

const loadUserAddresses = async () => {
    try {
        loadingAddresses.value = true;
        const userId = authStore.userId;
        if (!userId) return;

        const response = await api.get(`/api/users/${userId}/addresses`);
        userAddresses.value = response.data.addresses || [];
    } catch (error) {
        console.error('Error loading addresses:', error);
        userAddresses.value = [];
    } finally {
        loadingAddresses.value = false;
    }
};

const getConditionName = (condicionId) => {
    const conditions = {
        1: '🟢 Excelente',
        2: '🟡 Buena',
        3: '🟠 Regular',
        4: '🔴 Necesita reparación'
    };
    return conditions[condicionId] || 'No especificado';
};

const getUnitName = (unitId) => {
    return unitId === 1 ? 'KM' : 'Millas';
};

const getCurrencyName = (currencyId) => {
    return currencyId === 1 ? 'RD$' : 'US$';
};

const getLocationName = (locationId) => {
    if (loadingAddresses.value) return 'Cargando ubicación...';

    console.log(userAddresses);
    
    const address = userAddresses.value.find(addr => addr.direccion_id == locationId);
    
    if (!address) return 'Ubicación no encontrada';
    
    const parts = [];
    
    if (address.calle) parts.push(address.calle);
    if (address.sector) parts.push(address.sector);
    if (address.municipio) parts.push(address.municipio);
    if (address.provincia) parts.push(address.provincia);
    if (address.pais) parts.push(address.pais.nombre_pais);
    
    return parts.length > 0 ? parts.join(', ') : 'República Dominicana';
};

const formatNumber = (number) => {
    if (typeof number === 'string') {
        return number;
    }
    return new Intl.NumberFormat('es-DO').format(number);
};

const formatPrice = (price) => {
    return new Intl.NumberFormat('es-DO', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(price);
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-DO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const getDurationText = (dateString) => {
    const today = new Date();
    const expireDate = new Date(dateString);
    const diffTime = expireDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return 'Vencida';
    if (diffDays === 1) return '1 día restante';
    if (diffDays <= 30) return `${diffDays} días restantes`;
    
    const months = Math.floor(diffDays / 30);
    return months === 1 ? '1 mes restante' : `${months} meses restantes`;
};

const handleSubmit = () => {
    emit('submit');
};

onMounted(() => {
    loadUserAddresses();
});
</script>

<style scoped>
.publicacion-review {
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

.review-section {
    background: white;
    border: 1px solid #e9ecef;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
}

.review-section h4 {
    color: #1a1a1a;
    font-weight: 600;
    margin-bottom: 1.25rem;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.review-section h4 i {
    color: #dc3545;
}

.bike-review-card {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 1.25rem;
}

.bike-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
}

.bike-name {
    color: #1a1a1a;
    font-weight: 700;
    margin: 0;
    font-size: 1.1rem;
}

.bike-year {
    background: linear-gradient(135deg, #dc3545, #ff6b7a);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.875rem;
    font-weight: 600;
}

.status-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.status-dot {
    width: 8px;
    height: 8px;
    background: #28a745;
    border-radius: 50%;
    box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.2);
}

.status-indicator span {
    color: #28a745;
    font-size: 0.875rem;
    font-weight: 600;
}

.bike-specs-review {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
}

.spec-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #495057;
    font-size: 0.9rem;
    font-weight: 500;
}

.spec-item i {
    color: #dc3545;
    font-size: 1rem;
}

.details-grid {
    display: grid;
    gap: 1rem;
}

.detail-card {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 1rem;
}

.detail-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
}

.detail-header i {
    color: #dc3545;
    font-size: 1rem;
}

.detail-header h6 {
    color: #1a1a1a;
    font-weight: 600;
    margin: 0;
    font-size: 0.95rem;
}

.detail-content {
    color: #495057;
    font-size: 0.9rem;
    line-height: 1.5;
    text-align: left;
}

.detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
}

.detail-row:last-child {
    margin-bottom: 0;
}

.label {
    font-weight: 500;
    color: #6c757d;
}

.value {
    font-weight: 600;
    color: #1a1a1a;
}

.condition {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    background: #28a745;
    color: white;
}

.location-info, .date-info, .duration-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
}

.duration-info {
    color: #6c757d;
    font-size: 0.85rem;
    margin-bottom: 0;
}

.price-summary {
    background: linear-gradient(135deg, #fff5f5, #fff);
    border: 2px solid rgba(220, 53, 69, 0.1);
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    text-align: center;
}

.price-header h4 {
    color: #1a1a1a;
    font-weight: 600;
    margin-bottom: 1rem;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.price-header h4 i {
    color: #dc3545;
}

.price-display {
    text-align: center;
}

.currency {
    color: #6c757d;
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
}

.price {
    color: #1a1a1a;
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 0.75rem;
}

.negotiable-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    background: rgba(220, 53, 69, 0.1);
    color: #dc3545;
    padding: 0.375rem 0.75rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 600;
}

.status-card {
    background: white;
    border: 1px solid #e9ecef;
    border-radius: 12px;
    padding: 1.25rem;
    margin-bottom: 1.5rem;
}

.status-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.status-header i {
    color: #17a2b8;
    font-size: 1.1rem;
}

.status-header h5 {
    color: #1a1a1a;
    font-weight: 600;
    margin: 0;
    font-size: 1rem;
}

.status-content {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.status-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
}

.status-item i {
    font-size: 1rem;
}

.action-buttons {
    text-align: center;
}

.btn-publish {
    width: 100%;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    font-weight: 700;
    border-radius: 12px;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.btn-primary {
    background: #dc3545;
    border-color: #dc3545;
    color: white;
}

.btn-primary:hover:not(:disabled) {
    background: #c82333;
    border-color: #c82333;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(220, 53, 69, 0.3);
}

.btn-primary:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
}

.terms-notice {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    color: #6c757d;
    text-align: center;
}

.terms-notice i {
    color: #28a745;
    font-size: 1rem;
}

.terms-link {
    color: #dc3545;
    text-decoration: none;
    font-weight: 600;
}

.terms-link:hover {
    text-decoration: underline;
}

/* ✅ NEW: Image review styles */
.images-review-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 1rem;
}

.image-review-item {
    position: relative;
    aspect-ratio: 4/3;
    border-radius: 8px;
    overflow: hidden;
    border: 2px solid #e9ecef;
}

.image-review-item.featured {
    border-color: #ffc107;
    box-shadow: 0 2px 8px rgba(255, 193, 7, 0.3);
}

.image-review-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.featured-badge {
    position: absolute;
    top: 0.25rem;
    left: 0.25rem;
    background: #ffc107;
    color: #212529;
    padding: 0.125rem 0.5rem;
    border-radius: 10px;
    font-size: 0.7rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

@media (max-width: 768px) {
    .review-section {
        padding: 1rem;
        margin-bottom: 1rem;
    }
    
    .bike-header {
        flex-direction: column;
        gap: 0.75rem;
        align-items: flex-start;
    }
    
    .bike-specs-review {
        flex-direction: column;
        gap: 0.75rem;
    }
    
    .detail-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.25rem;
    }
    
    .price {
        font-size: 2rem;
    }
}
</style>