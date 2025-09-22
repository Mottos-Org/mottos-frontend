<template>
    <div class="location-selector">
        <div class="address-section">
            <div v-if="userAddresses.length > 0" class="saved-addresses">
                <h6 class="addresses-title">
                    <i class="bi bi-bookmark-fill"></i>
                    Tus direcciones guardadas
                </h6>
                <div class="addresses-grid">
                    <div
                        v-for="address in userAddresses"
                        :key="address.direccion_id"
                        class="address-card"
                        :class="{ 
                            'selected': selectedLocation === address.direccion_id,
                            'hover-effect': true 
                        }"
                        @click="selectAddress(address.direccion_id)"
                    >
                        <div class="address-icon">
                            <i class="bi bi-house-door"></i>
                        </div>
                        <div class="address-content">
                            <div class="address-street">{{ address.calle }}</div>
                            <div class="address-location">
                                <i class="bi bi-geo-alt"></i>
                                <span>{{ formatLocation(address) }}</span>
                            </div>
                        </div>
                        <div class="selection-indicator" v-if="selectedLocation === address.direccion_id">
                            <i class="bi bi-check-circle-fill"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="loading" class="loading-state">
                <div class="loading-spinner">
                    <div class="spinner-border spinner-border-sm text-danger" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                </div>
                <span>Cargando tus direcciones...</span>
            </div>

            <div v-if="!loading && userAddresses.length === 0" class="empty-state">
                <div class="empty-icon">
                    <i class="bi bi-geo-alt"></i>
                </div>
                <h6>No tienes direcciones guardadas</h6>
                <p>Puedes agregar una nueva dirección para futuras publicaciones</p>
                <button @click="showAddAddressModal = true" class="btn btn-outline-primary btn-sm">
                    <i class="bi bi-plus-circle"></i>
                    Agregar nueva dirección
                </button>
            </div>

            <div v-if="userAddresses.length > 0" class="add-address-section">
                <button
                    @click="showAddAddressModal = true"
                    class="btn btn-outline-secondary btn-sm add-address-btn"
                >
                    <i class="bi bi-plus-circle"></i>
                    Usar otra dirección
                </button>
            </div>
        </div>

        <div v-if="error" class="error-state">
            <div class="alert alert-danger">
                <i class="bi bi-exclamation-triangle"></i>
                {{ error }}
            </div>
        </div>

        <div v-if="validationError" class="invalid-feedback">
            {{ validationError }}
        </div>

        <div v-if="showAddAddressModal" class="modal-overlay" @click.self="showAddAddressModal = false">
            <div class="address-modal">
                <div class="modal-header">
                    <h5>Agregar Nueva Dirección</h5>
                    <button @click="showAddAddressModal = false" class="btn-close">
                        <i class="bi bi-x"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label class="form-label">Dirección completa</label>
                        <textarea
                            v-model="newAddress.calle"
                            class="form-control"
                            rows="3"
                            placeholder="Ej: Residencial Lidia, B303, Los Alcarrizos..."
                        ></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button @click="showAddAddressModal = false" class="btn btn-outline-secondary">
                        Cancelar
                    </button>
                    <button @click="saveNewAddress" class="btn btn-primary" :disabled="!newAddress.calle.trim()">
                        <i class="bi bi-save"></i>
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useToast } from 'vue-toastification';
import api from '../../../services/api';
import { useAuthStore } from '../../../stores/authStore';

const props = defineProps({
    selectedLocation: {
        type: [String, Number],
        default: null
    },
    error: {
        type: String,
        default: null
    }
});

const emit = defineEmits(['location-selected']);

const toast = useToast();
const authStore = useAuthStore();

const userAddresses = ref([]);
const loading = ref(false);
const error = ref(null);
const showAddAddressModal = ref(false);

const newAddress = reactive({
    calle: ''
});

const validationError = computed(() => props.error);

const loadUserAddresses = async () => {
    try {
        loading.value = true;
        error.value = null;
        
        const userId = authStore.userId;
        if (!userId) {
            error.value = 'Usuario no autenticado';
            return;
        }

        const response = await api.get(`/api/users/${userId}/addresses`);
        userAddresses.value = response.data.addresses || [];
        
    } catch (err) {
        console.error('Error loading user addresses:', err);
        error.value = 'Error al cargar las direcciones';
        userAddresses.value = [];
    } finally {
        loading.value = false;
    }
};

const selectAddress = (addressId) => {
    emit('location-selected', addressId);
};

const formatLocation = (address) => {
    const parts = [];
    
    if (address.sector) parts.push(address.sector);
    if (address.municipio) parts.push(address.municipio);
    if (address.provincia) parts.push(address.provincia);
    if (address.pais) parts.push(address.pais.nombre_pais);
    
    return parts.length > 0 ? parts.join(', ') : 'República Dominicana';
};

const saveNewAddress = async () => {
    try {
        if (!newAddress.calle.trim()) {
            toast.error('Debes ingresar una dirección');
            return;
        }

        const userId = authStore.user?.user_id;
        if (!userId) {
            toast.error('Usuario no autenticado');
            return;
        }

        const response = await api.post(`/api/users/${userId}/addresses`, {
            calle: newAddress.calle.trim(),
            pais_id: 1 // Default to Dominican Republic
        });

        await loadUserAddresses();
        
        if (response.data.direccion_id) {
            emit('location-selected', response.data.direccion_id);
        }
        
        newAddress.calle = '';
        showAddAddressModal.value = false;
        
        toast.success('Dirección agregada exitosamente');
        
    } catch (err) {
        console.error('Error saving address:', err);
        toast.error('Error al guardar la dirección');
    }
};

onMounted(() => {
    loadUserAddresses();
});
</script>

<style scoped>
.location-selector {
    width: 100%;
}

.address-section {
    min-height: 120px;
}

.addresses-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #1a1a1a;
    font-weight: 600;
    margin-bottom: 1rem;
    font-size: 1rem;
}

.addresses-title i {
    color: #dc3545;
}

.addresses-grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: 1fr;
}

.address-card {
    background: white;
    border: 2px solid #e9ecef;
    border-radius: 12px;
    padding: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    display: flex;
    align-items: center;
    gap: 1rem;
}

.address-card.hover-effect:hover {
    border-color: #dc3545;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(220, 53, 69, 0.15);
}

.address-card.selected {
    border-color: #dc3545;
    background: linear-gradient(135deg, rgba(220, 53, 69, 0.05), white);
    box-shadow: 0 8px 25px rgba(220, 53, 69, 0.2);
}

.address-icon {
    width: 45px;
    height: 45px;
    background: linear-gradient(135deg, #dc3545, #ff6b7a);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.1rem;
    flex-shrink: 0;
}

.address-content {
    flex: 1;
}

.address-street {
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 0.25rem;
    font-size: 1rem;
}

.address-location {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #6c757d;
    font-size: 0.875rem;
}

.address-location i {
    color: #dc3545;
    font-size: 0.75rem;
}

.selection-indicator {
    color: #28a745;
    font-size: 1.25rem;
    animation: checkmark 0.3s ease-out;
}

@keyframes checkmark {
    0% { transform: scale(0); opacity: 0; }
    50% { transform: scale(1.2); opacity: 0.8; }
    100% { transform: scale(1); opacity: 1; }
}

.loading-state {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 2rem;
    color: #6c757d;
    font-size: 0.95rem;
}

.loading-spinner {
    display: flex;
    align-items: center;
    justify-content: center;
}

.empty-state {
    text-align: center;
    padding: 2rem 1rem;
    background: linear-gradient(135deg, #f8f9fa, #ffffff);
    border: 2px dashed #e9ecef;
    border-radius: 12px;
}

.empty-icon {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #6c757d, #868e96);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
    color: white;
    font-size: 1.5rem;
}

.empty-state h6 {
    color: #1a1a1a;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.empty-state p {
    color: #6c757d;
    margin-bottom: 1rem;
    font-size: 0.9rem;
}

.add-address-section {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e9ecef;
}

.add-address-btn {
    width: 100%;
    border-style: dashed;
    border-width: 2px;
    padding: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
}

.add-address-btn:hover {
    border-color: #dc3545;
    color: #dc3545;
    background: rgba(220, 53, 69, 0.05);
}

.error-state {
    margin: 1rem 0;
}

.error-state .alert {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
    border-radius: 10px;
    font-size: 0.9rem;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1060;
    padding: 1rem;
}

.address-modal {
    background: white;
    border-radius: 15px;
    width: 100%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
    padding: 1.5rem;
    border-bottom: 1px solid #e9ecef;
    display: flex;
    justify-content: between;
    align-items: center;
}

.modal-header h5 {
    margin: 0;
    color: #1a1a1a;
    font-weight: 700;
}

.btn-close {
    background: none;
    border: none;
    color: #6c757d;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.btn-close:hover {
    background: #f8f9fa;
    color: #dc3545;
}

.modal-body {
    padding: 1.5rem;
}

.modal-footer {
    padding: 1.5rem;
    border-top: 1px solid #e9ecef;
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
}

.btn {
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
}

.btn-primary {
    background: #dc3545;
    border-color: #dc3545;
    color: white;
}

.btn-primary:hover:not(:disabled) {
    background: #c82333;
    border-color: #c82333;
}

.btn-outline-secondary {
    background: transparent;
    border-color: #6c757d;
    color: #6c757d;
}

.btn-outline-secondary:hover {
    background: #6c757d;
    color: white;
}

.btn-outline-primary {
    background: transparent;
    border-color: #dc3545;
    color: #dc3545;
}

.btn-outline-primary:hover {
    background: #dc3545;
    color: white;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.form-group {
    margin-bottom: 1rem;
}

.form-label {
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 0.5rem;
    display: block;
}

.form-control {
    border: 2px solid #e9ecef;
    border-radius: 8px;
    padding: 0.75rem;
    font-size: 0.95rem;
    transition: all 0.3s ease;
    width: 100%;
}

.form-control:focus {
    border-color: #dc3545;
    box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.1);
    outline: none;
}

.invalid-feedback {
    display: block;
    color: #dc3545;
    font-size: 0.875rem;
    margin-top: 0.5rem;
    font-weight: 500;
}

@media (max-width: 768px) {
    .addresses-grid {
        gap: 0.75rem;
    }
    
    .address-card {
        padding: 0.875rem;
        gap: 0.75rem;
    }
    
    .address-icon {
        width: 40px;
        height: 40px;
        font-size: 1rem;
    }
    
    .modal-overlay {
        padding: 0.5rem;
    }
    
    .modal-header,
    .modal-body,
    .modal-footer {
        padding: 1rem;
    }
    
    .modal-footer {
        flex-direction: column;
    }
    
    .modal-footer .btn {
        width: 100%;
        justify-content: center;
    }
}
</style>