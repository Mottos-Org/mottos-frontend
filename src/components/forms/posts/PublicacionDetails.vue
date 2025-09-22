<template>
    <div class="publicacion-details">
        <div class="section-header">
            <div class="header-content">
                <div class="icon-badge">
                    <i class="bi bi-card-text"></i>
                </div>
                <h3>Detalles de la Publicación</h3>
                <p>Completa la información de tu moto para la venta</p>
            </div>
        </div>

        <div class="form-container">
            <div class="row g-4">
                <div class="col-lg-8">
                    <div class="form-section description-section">
                        <div class="section-title">
                            <div class="title-icon">
                                <i class="bi bi-file-text"></i>
                            </div>
                            <div>
                                <h4>Descripción</h4>
                                <span class="section-subtitle">Cuéntanos sobre tu motocicleta</span>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">
                                Describe tu motocicleta
                                <span class="required">*</span>
                            </label>
                            <div class="textarea-wrapper">
                                <textarea
                                    v-model="localFormData.descripcion"
                                    class="form-control enhanced-textarea"
                                    :class="{ 'is-invalid': errors.descripcion }"
                                    rows="5"
                                    placeholder="Describe el estado, modificaciones, historial de mantenimiento, razón de venta, etc..."
                                    maxlength="500"
                                    @input="updateForm"
                                ></textarea>
                                <div class="character-counter" :class="{ 'near-limit': localFormData.descripcion.length > 450 }">
                                    {{ localFormData.descripcion.length }}/500
                                </div>
                            </div>
                            <div v-if="errors.descripcion" class="invalid-feedback">
                                {{ errors.descripcion }}
                            </div>
                        </div>
                    </div>

                    <div class="form-section">
                        <div class="section-title">
                            <div class="title-icon">
                                <i class="bi bi-gear"></i>
                            </div>
                            <div>
                                <h4>Estado y Kilometraje</h4>
                                <span class="section-subtitle">Información técnica importante</span>
                            </div>
                        </div>
                        
                        <div class="row g-3">
                            <div class="col-md-6">
                                <div class="input-card">
                                    <div class="card-icon">
                                        <i class="bi bi-heart-pulse"></i>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">
                                            Condición del motor
                                            <span class="required">*</span>
                                        </label>
                                        <select
                                            v-model="localFormData.condicion_id"
                                            class="form-select enhanced-select"
                                            :class="{ 'is-invalid': errors.condicion_id }"
                                            @change="updateForm"
                                        >
                                            <option value="">Selecciona la condición</option>
                                            <option value="1">🟢 Excelente</option>
                                            <option value="2">🟡 Buena</option>
                                            <option value="3">🟠 Regular</option>
                                            <option value="4">🔴 Necesita reparación</option>
                                        </select>
                                        <div v-if="errors.condicion_id" class="invalid-feedback">
                                            {{ errors.condicion_id }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="col-md-6">
                                <div class="input-card">
                                    <div class="card-icon">
                                        <i class="bi bi-speedometer2"></i>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">
                                            Kilometraje
                                            <span class="required">*</span>
                                        </label>
                                        <div class="enhanced-input-group">
                                            <input
                                                v-model="localFormData.recorrido"
                                                type="text"
                                                class="form-control"
                                                :class="{ 'is-invalid': errors.recorrido }"
                                                placeholder="Ej: 15,000"
                                                @input="updateForm"
                                            />
                                            <select
                                                v-model="localFormData.unidad_metrica_id"
                                                class="form-select unit-select"
                                                @change="updateForm"
                                            >
                                                <option value="1">KM</option>
                                                <option value="2">Millas</option>
                                            </select>
                                        </div>
                                        <div v-if="errors.recorrido" class="invalid-feedback">
                                            {{ errors.recorrido }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="form-section location-section">
                        <div class="section-title">
                            <div class="title-icon">
                                <i class="bi bi-geo-alt"></i>
                            </div>
                            <div>
                                <h4>Ubicación</h4>
                                <span class="section-subtitle">¿Dónde pueden ver tu moto?</span>
                            </div>
                        </div>
                        
                        <div class="location-card">
                            <div class="location-icon">
                                <i class="bi bi-map"></i>
                            </div>
                            <div class="form-group">
                                <label class="form-label">
                                    ¿Dónde se encuentra tu moto?
                                    <span class="required">*</span>
                                </label>
                                <LocationSelector
                                    :selected-location="localFormData.ubicacion_id"
                                    :error="errors.ubicacion_id"
                                    @location-selected="handleLocationSelected"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="form-section pricing-section premium-card">
                        <div class="section-title pricing-title">
                            <div class="title-icon pricing-icon">
                                <i class="bi bi-currency-dollar"></i>
                            </div>
                            <div>
                                <h4>Precio</h4>
                                <span class="section-subtitle">¿Cuánto vale tu moto?</span>
                            </div>
                        </div>
                        
                        <div class="price-card">
                            <div class="form-group">
                                <label class="form-label">
                                    Precio de venta
                                    <span class="required">*</span>
                                </label>
                                <div class="enhanced-price-group">
                                    <select
                                        v-model="localFormData.tipo_moneda_id"
                                        class="currency-select premium-select"
                                        @change="updateForm"
                                    >
                                        <option value="1">RD$</option>
                                        <option value="2">US$</option>
                                    </select>
                                    <input
                                        v-model="localFormData.precio"
                                        type="number"
                                        class="form-control price-input premium-input"
                                        :class="{ 'is-invalid': errors.precio }"
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        @input="updateForm"
                                    />
                                </div>
                                <div v-if="errors.precio" class="invalid-feedback">
                                    {{ errors.precio }}
                                </div>
                            </div>

                            <div class="negotiable-toggle">
                                <div class="toggle-card" :class="{ active: localFormData.negociable }">
                                    <input
                                        v-model="localFormData.negociable"
                                        type="checkbox"
                                        id="negociable"
                                        class="toggle-input"
                                        @change="updateForm"
                                    />
                                    <label for="negociable" class="toggle-label">
                                        <div class="toggle-content">
                                            <div class="toggle-icon">
                                                <i class="bi bi-arrow-left-right"></i>
                                            </div>
                                            <div class="toggle-text">
                                                <strong>Precio negociable</strong>
                                                <small>Los compradores podrán hacer ofertas</small>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="form-section expiry-section">
                        <div class="section-title">
                            <div class="title-icon">
                                <i class="bi bi-calendar-check"></i>
                            </div>
                            <div>
                                <h4>Vigencia</h4>
                                <span class="section-subtitle">¿Hasta cuándo estará activa?</span>
                            </div>
                        </div>
                        
                        <div class="date-card">
                            <div class="calendar-icon">
                                <i class="bi bi-calendar3"></i>
                            </div>
                            <div class="form-group">
                                <label class="form-label">
                                    Fecha de vencimiento
                                    <span class="required">*</span>
                                </label>
                                <input
                                    v-model="localFormData.fecha_vencimiento"
                                    type="date"
                                    class="form-control enhanced-date"
                                    :class="{ 'is-invalid': errors.fecha_vencimiento }"
                                    :min="minDate"
                                    @change="updateForm"
                                />
                                <div class="date-helper">
                                    <i class="bi bi-info-circle"></i>
                                    Tu publicación estará activa hasta esta fecha
                                </div>
                                <div v-if="errors.fecha_vencimiento" class="invalid-feedback">
                                    {{ errors.fecha_vencimiento }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="tips-card">
                        <div class="tips-header">
                            <div class="tips-icon">
                                <i class="bi bi-lightbulb"></i>
                            </div>
                            <h5>💡 Consejos para tu publicación</h5>
                        </div>
                        <div class="tips-content">
                            <div class="tip-item">
                                <div class="tip-icon">✅</div>
                                <span>Sé honesto sobre el estado de tu moto</span>
                            </div>
                            <div class="tip-item">
                                <div class="tip-icon">🔧</div>
                                <span>Incluye detalles sobre modificaciones</span>
                            </div>
                            <div class="tip-item">
                                <div class="tip-icon">📋</div>
                                <span>Menciona el historial de mantenimiento</span>
                            </div>
                            <div class="tip-item">
                                <div class="tip-icon">📄</div>
                                <span>Indica si tienes documentos al día</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import LocationSelector from './LocationSelector.vue';

const props = defineProps({
    formData: {
        type: Object,
        required: true
    },
    errors: {
        type: Object,
        default: () => ({})
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update-form']);

const localFormData = reactive({ ...props.formData });

const minDate = computed(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
});

const updateForm = () => {
    emit('update-form', { ...localFormData });
};

const handleLocationSelected = (locationId) => {
    localFormData.ubicacion_id = locationId;
    updateForm();
};

onMounted(() => {
    if (!localFormData.fecha_vencimiento) {
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 30);
        localFormData.fecha_vencimiento = defaultDate.toISOString().split('T')[0];
        updateForm();
    }
});
</script>

<style scoped>
.publicacion-details {
    padding: 0;
    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    min-height: 100vh;
}

.section-header {
    text-align: center;
    margin-bottom: 3rem;
    padding: 2rem 0;
}

.header-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.icon-badge {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #dc3545, #ff6b7a);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 30px rgba(220, 53, 69, 0.3);
    position: relative;
}

.icon-badge::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(135deg, #dc3545, #ff6b7a);
    border-radius: inherit;
    z-index: -1;
    filter: blur(8px);
    opacity: 0.7;
}

.icon-badge i {
    font-size: 2rem;
    color: white;
}

.section-header h3 {
    color: #1a1a1a;
    font-weight: 700;
    margin: 0;
    font-size: 2rem;
}

.section-header p {
    color: #6c757d;
    margin: 0;
    font-size: 1.1rem;
}

.form-section {
    background: white;
    border-radius: 20px;
    padding: 2rem;
    margin-bottom: 2rem;
    border: 1px solid rgba(0, 0, 0, 0.05);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.form-section:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.1);
}

.section-title {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #f8f9fa;
}

.title-icon {
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #dc3545, #ff6b7a);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.25rem;
}

.section-title h4 {
    margin: 0;
    color: #1a1a1a;
    font-weight: 700;
    font-size: 1.3rem;
}

.section-subtitle {
    color: #6c757d;
    font-size: 0.9rem;
    font-weight: 400;
}

.description-section {
    background: linear-gradient(135deg, #fff5f5 0%, #ffffff 100%);
}

.textarea-wrapper {
    position: relative;
}

.enhanced-textarea {
    border: 2px solid #e9ecef;
    border-radius: 15px;
    padding: 1rem;
    font-size: 1rem;
    line-height: 1.6;
    resize: vertical;
    transition: all 0.3s ease;
    min-height: 120px;
}

.enhanced-textarea:focus {
    border-color: #dc3545;
    box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.1);
    transform: scale(1.02);
}

.character-counter {
    position: absolute;
    bottom: 10px;
    right: 15px;
    background: rgba(255, 255, 255, 0.9);
    padding: 0.25rem 0.5rem;
    border-radius: 20px;
    font-size: 0.8rem;
    color: #6c757d;
    border: 1px solid rgba(0, 0, 0, 0.1);
}

.character-counter.near-limit {
    color: #dc3545;
    background: rgba(220, 53, 69, 0.1);
    border-color: #dc3545;
}

.input-card, .location-card, .date-card {
    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    border-radius: 15px;
    padding: 1.5rem;
    border: 1px solid rgba(0, 0, 0, 0.05);
    position: relative;
    overflow: hidden;
}

.input-card::before, .location-card::before, .date-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #dc3545, #ff6b7a);
}

.card-icon, .location-icon, .calendar-icon {
    position: absolute;
    top: -10px;
    right: -10px;
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #dc3545, #ff6b7a);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1rem;
    opacity: 0.8;
}

.enhanced-select, .enhanced-input-group .form-control {
    border: 2px solid #e9ecef;
    border-radius: 12px;
    padding: 0.875rem;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.enhanced-select:focus, .enhanced-input-group .form-control:focus {
    border-color: #dc3545;
    box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.1);
    transform: translateY(-2px);
}

.enhanced-input-group {
    display: flex;
    gap: 0;
    border-radius: 12px;
    overflow: hidden;
}

.unit-select {
    min-width: 80px;
    border-left: none;
    border-radius: 0;
    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
    font-weight: 600;
}

.premium-card {
    background: linear-gradient(135deg, #fff5f5 0%, #ffffff 50%, #f0f8ff 100%);
    border: 2px solid rgba(220, 53, 69, 0.1);
    position: relative;
    overflow: hidden;
}

.premium-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #dc3545, #007bff, #28a745);
}

.pricing-icon {
    background: linear-gradient(135deg, #28a745, #20c997) !important;
}

.price-card {
    background: white;
    border-radius: 15px;
    padding: 1.5rem;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
}

.enhanced-price-group {
    display: flex;
    gap: 0;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.premium-select, .premium-input {
    border: none;
    font-size: 1.1rem;
    font-weight: 600;
}

.currency-select {
    background: linear-gradient(135deg, #dc3545, #ff6b7a);
    color: white;
    min-width: 80px;
}

.price-input {
    flex: 1;
    text-align: center;
    font-size: 1.2rem;
}

.negotiable-toggle {
    margin-top: 1.5rem;
}

.toggle-card {
    background: linear-gradient(135deg, #f8f9fa, #ffffff);
    border: 2px solid #e9ecef;
    border-radius: 15px;
    padding: 1rem;
    transition: all 0.3s ease;
    cursor: pointer;
}

.toggle-card:hover {
    border-color: #dc3545;
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.toggle-card.active {
    background: linear-gradient(135deg, rgba(220, 53, 69, 0.1), rgba(255, 255, 255, 0.8));
    border-color: #dc3545;
}

.toggle-input {
    display: none;
}

.toggle-content {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.toggle-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #dc3545, #ff6b7a);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    transition: all 0.3s ease;
}

.toggle-card.active .toggle-icon {
    transform: rotate(180deg);
}

.toggle-text small {
    display: block;
    color: #6c757d;
    margin-top: 0.25rem;
}

.enhanced-date {
    border: 2px solid #e9ecef;
    border-radius: 12px;
    padding: 0.875rem;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.enhanced-date:focus {
    border-color: #dc3545;
    box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.1);
}

.date-helper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
    color: #6c757d;
    font-size: 0.875rem;
}

.date-helper i {
    color: #17a2b8;
}

.tips-card {
    background: linear-gradient(135deg, #e8f5e9 0%, #ffffff 100%);
    border: 2px solid rgba(40, 167, 69, 0.2);
    border-radius: 20px;
    padding: 1.5rem;
    margin-top: 2rem;
    position: relative;
    overflow: hidden;
}

.tips-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #28a745, #20c997);
}

.tips-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.tips-icon {
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #ffc107, #fd7e14);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.25rem;
}

.tips-header h5 {
    color: #1a1a1a;
    font-weight: 700;
    margin: 0;
    font-size: 1.1rem;
}

.tip-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid rgba(40, 167, 69, 0.1);
}

.tip-item:last-child {
    border-bottom: none;
}

.tip-icon {
    font-size: 1.25rem;
    min-width: 30px;
}

.tip-item span {
    color: #495057;
    font-size: 0.95rem;
    font-weight: 500;
}

.form-label {
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 0.75rem;
    display: block;
    font-size: 1rem;
}

.required {
    color: #dc3545;
    margin-left: 0.25rem;
}

.form-control, .form-select {
    transition: all 0.3s ease;
}

.form-control:focus, .form-select:focus {
    transform: translateY(-2px);
}

.invalid-feedback {
    display: block;
    color: #dc3545;
    font-size: 0.875rem;
    margin-top: 0.5rem;
    font-weight: 500;
}

@media (max-width: 768px) {
    .form-section {
        padding: 1.5rem;
        margin-bottom: 1.5rem;
    }
    
    .section-title {
        flex-direction: column;
        text-align: center;
        gap: 0.75rem;
    }
    
    .enhanced-price-group {
        flex-direction: column;
        gap: 0.75rem;
    }
    
    .currency-select, .price-input {
        border-radius: 12px;
    }
    
    .icon-badge {
        width: 60px;
        height: 60px;
    }
    
    .icon-badge i {
        font-size: 1.5rem;
    }
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.form-section {
    animation: slideUp 0.6s ease-out;
}

.form-section:nth-child(2) { animation-delay: 0.1s; }
.form-section:nth-child(3) { animation-delay: 0.2s; }
.form-section:nth-child(4) { animation-delay: 0.3s; }
</style>