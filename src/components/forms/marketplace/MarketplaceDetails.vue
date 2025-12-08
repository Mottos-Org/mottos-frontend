<template>
    <div class="marketplace-details">
        <div class="section-header">
            <div class="header-content">
                <div class="icon-badge">
                    <i class="bi bi-tag"></i>
                </div>
                <h3>Detalles del Producto</h3>
                <p>Completa la información de tu producto para el mercado</p>
            </div>
        </div>

        <div class="form-container">
            <div class="row g-4">
                <div class="col-lg-8">
                    <div class="form-section">
                        <div class="section-title">
                            <div class="title-icon">
                                <i class="bi bi-card-heading"></i>
                            </div>
                            <div>
                                <h4>Título del Producto</h4>
                                <span class="section-subtitle">Describe brevemente qué estás vendiendo</span>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">
                                Título
                                <span class="required">*</span>
                            </label>
                            <input
                                v-model="localFormData.publicacion_titulo"
                                type="text"
                                class="form-control enhanced-input"
                                :class="{ 'is-invalid': errors.publicacion_titulo }"
                                placeholder="Ej: Motor Yamaha en perfectas condiciones"
                                maxlength="100"
                                @input="updateForm"
                            />
                            <div class="character-counter" :class="{ 'near-limit': localFormData.publicacion_titulo.length > 85 }">
                                {{ localFormData.publicacion_titulo.length }}/100
                            </div>
                            <div v-if="errors.publicacion_titulo" class="invalid-feedback">
                                {{ errors.publicacion_titulo }}
                            </div>
                        </div>
                    </div>

                    <div class="form-section description-section">
                        <div class="section-title">
                            <div class="title-icon">
                                <i class="bi bi-file-text"></i>
                            </div>
                            <div>
                                <h4>Descripción</h4>
                                <span class="section-subtitle">Proporciona detalles sobre tu producto</span>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">
                                Describe tu producto
                                <span class="required">*</span>
                            </label>
                            <div class="textarea-wrapper">
                                <textarea
                                    v-model="localFormData.publicacion_descripcion"
                                    class="form-control enhanced-textarea"
                                    :class="{ 'is-invalid': errors.publicacion_descripcion }"
                                    rows="5"
                                    placeholder="Describe el estado, características, marca, modelo, etc..."
                                    maxlength="500"
                                    @input="updateForm"
                                ></textarea>
                                <div class="character-counter" :class="{ 'near-limit': localFormData.publicacion_descripcion.length > 450 }">
                                    {{ localFormData.publicacion_descripcion.length }}/500
                                </div>
                            </div>
                            <div v-if="errors.publicacion_descripcion" class="invalid-feedback">
                                {{ errors.publicacion_descripcion }}
                            </div>
                        </div>
                    </div>

                    <div class="form-section">
                        <div class="section-title">
                            <div class="title-icon">
                                <i class="bi bi-tag-fill"></i>
                            </div>
                            <div>
                                <h4>Categoría y Precio</h4>
                                <span class="section-subtitle">Clasifica tu producto y establece el precio</span>
                            </div>
                        </div>
                        
                        <div class="row g-3">
                            <div class="col-md-6">
                                <div class="input-card">
                                    <div class="form-group">
                                        <label class="form-label">
                                            Categoría
                                            <span class="required">*</span>
                                        </label>
                                        <select
                                            v-model="localFormData.category"
                                            class="form-select enhanced-select"
                                            :class="{ 'is-invalid': errors.category }"
                                            @change="updateForm"
                                        >
                                            <option value="">Selecciona una categoría</option>
                                            <option value="parts">🔧 Piezas</option>
                                            <option value="accessories">🎽 Accesorios</option>
                                            <option value="other">📦 Otros</option>
                                        </select>
                                        <div v-if="errors.category" class="invalid-feedback">
                                            {{ errors.category }}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="input-card">
                                    <div class="form-group">
                                        <label class="form-label">
                                            Precio
                                            <span class="required">*</span>
                                        </label>
                                        <div class="enhanced-input-group">
                                            <select
                                                v-model="localFormData.tipo_moneda_id"
                                                class="form-select currency-select"
                                                @change="updateForm"
                                            >
                                                <option value="1">RD$</option>
                                                <option value="2">US$</option>
                                            </select>
                                            <input
                                                v-model="localFormData.precio"
                                                type="number"
                                                class="form-control"
                                                :class="{ 'is-invalid': errors.precio }"
                                                placeholder="0.00"
                                                step="0.01"
                                                min="0"
                                                @input="updateForm"
                                            />
                                        </div>
                                        <div v-if="errors.precio" class="invalid-feedback">
                                            {{ errors.precio }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="form-section">
                        <div class="section-title">
                            <div class="title-icon">
                                <i class="bi bi-geo-alt-fill"></i>
                            </div>
                            <div>
                                <h4>Ubicación y Vencimiento</h4>
                                <span class="section-subtitle">Dónde y hasta cuándo estará disponible</span>
                            </div>
                        </div>
                        
                        <div class="row g-3">
                            <div class="input-card">
                                <LocationSelector
                                    :selected-location="localFormData.ubicacion_id"
                                    :validation-error="errors.ubicacion_id"
                                    @location-selected="handleLocationSelected"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="form-section sticky-section">
                        <div class="section-title">
                            <div class="title-icon">
                                <i class="bi bi-currency-exchange"></i>
                            </div>
                            <div>
                                <h4>Opciones</h4>
                            </div>
                        </div>

                        <div class="toggle-card">
                            <div class="toggle-header">
                                <div class="toggle-info">
                                    <i class="bi bi-handshake"></i>
                                    <div>
                                        <h5>Precio Negociable</h5>
                                        <p>Permite que los compradores negocien el precio</p>
                                    </div>
                                </div>
                                <label class="toggle-switch">
                                    <input
                                        v-model="localFormData.negociable"
                                        type="checkbox"
                                        @change="updateForm"
                                    />
                                    <span class="toggle-slider"></span>
                                </label>
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
import LocationSelector from '../posts/LocationSelector.vue';

const props = defineProps({
    formData: {
        type: Object,
        required: true
    },
    errors: {
        type: Object,
        default: () => ({})
    },
    isEditing: {
        type: Boolean,
        default: false
    },
    postId: {
        type: [String, Number],
        default: null
    }
});

const emit = defineEmits(['update-form']);

const localFormData = reactive({ ...props.formData });

const minDate = computed(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
});

const handleLocationSelected = (locationId) => {
    localFormData.ubicacion_id = locationId;
    updateForm();
};

const updateForm = () => {
    emit('update-form', { ...localFormData });
};

const loadPostData = async () => {
    if (!props.isEditing || !props.postId) return;
    
    try {
        loadingPostData.value = true;
        
        const postResponse = await api.get(`/api/marketplace/details/${props.postId}`);
        const post = postResponse.data;

        const ownerId = post?.user?.user_id ?? post?.user_id ?? null;
        const currentUserId = auth.userId ?? String(auth.user?.user_id ?? null);

        if (!ownerId) {
            toast.error('Producto inválido');
            router.replace('/mercado/publicaciones');
            return;
        }

        if (String(ownerId) !== String(currentUserId) && !auth.hasRole('Administrador')) {
            toast.error('No tienes permisos para editar este producto');
            router.replace('/mercado/publicaciones');
            return;
        }
        
        Object.assign(marketplaceData, {
            publicacion_titulo: post.publicacion_titulo,
            publicacion_descripcion: post.publicacion_descripcion,
            precio: post.precio,
            tipo_moneda_id: post.tipo_moneda_id,
            negociable: post.negociable,
            category: post.category,
            fecha_vencimiento: post.fecha_vencimiento.split('T')[0],
            ubicacion_id: post.ubicacion_id
        });
        
        const imagesResponse = await api.get(`/api/marketplace/${props.postId}/images`);
        
        if (imagesResponse.data.images?.length) {
            const existingImages = imagesResponse.data.images
                .sort((a, b) => a.display_order - b.display_order)
                .map(img => ({
                    image_id: img.image_id,
                    id: img.image_id,
                    filename: img.filename,
                    original_name: img.original_name || img.filename,
                    url: img.url,
                    file_size: img.file_size,
                    is_featured: img.is_featured,
                    display_order: img.display_order,
                    isExisting: true,
                    preview: img.url
                }));
            
            const featuredIndex = existingImages.findIndex(img => img.is_featured);
            
            Object.assign(imageData, {
                images: existingImages,
                featuredIndex: featuredIndex >= 0 ? featuredIndex : null
            });
        }
        
    } catch (error) {
        console.error('Error loading marketplace post data:', error);
        toast.error('Error al cargar los datos del producto');
        router.push('/mercado/publicaciones');
    } finally {
        loadingPostData.value = false;
    }
};

onMounted(() => {
    if (!localFormData.fecha_vencimiento) {
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 30);
        localFormData.fecha_vencimiento = defaultDate.toISOString().split('T')[0];
        updateForm();
    }

    loadPostData();
});
</script>

<style scoped>
.marketplace-details {
    padding: 2rem;
    background: white;
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.section-header {
    margin-bottom: 2rem;
    text-align: center;
}

.header-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
}

.icon-badge {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 2rem;
}

.header-content h3 {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0;
}

.header-content p {
    color: #6c757d;
    margin: 0;
}

.form-section {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    text-align: left;
}

.section-title {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.title-icon {
    width: 40px;
    height: 40px;
    background: white;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #dc3545;
    font-size: 1.25rem;
}

.section-title h4 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0;
}

.section-subtitle {
    font-size: 0.875rem;
    color: #6c757d;
}

.form-label {
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.required {
    color: #dc3545;
}

.enhanced-input,
.enhanced-textarea,
.enhanced-select,
.enhanced-date {
    border: 2px solid #e9ecef;
    border-radius: 8px;
    padding: 0.75rem;
    font-size: 0.95rem;
    transition: all 0.2s ease;
}

.enhanced-input:focus,
.enhanced-textarea:focus,
.enhanced-select:focus,
.enhanced-date:focus {
    border-color: #dc3545;
    box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.textarea-wrapper {
    position: relative;
}

.character-counter {
    bottom: 10px;
    right: 10px;
    font-size: 0.75rem;
    color: #6c757d;
    /* background: white; */
    padding: 2px 8px;
    border-radius: 4px;
    text-align: left;
}

.character-counter.near-limit {
    color: #dc3545;
    font-weight: 600;
}

.input-card {
    background: white;
    border-radius: 10px;
    padding: 1rem;
}

.enhanced-input-group {
    display: flex;
    gap: 0.5rem;
}

.currency-select {
    flex: 0 0 100px;
    border: 2px solid #e9ecef;
    border-radius: 8px;
}

.toggle-card {
    background: white;
    border-radius: 10px;
    padding: 1.25rem;
}

.toggle-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
}

.toggle-info {
    display: flex;
    gap: 1rem;
    flex: 1;
}

.toggle-info i {
    font-size: 1.5rem;
    color: #dc3545;
}

.toggle-info h5 {
    font-size: 0.95rem;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0 0 0.25rem 0;
}

.toggle-info p {
    font-size: 0.8rem;
    color: #6c757d;
    margin: 0;
}

.toggle-switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 28px;
}

.toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    border-radius: 28px;
    transition: 0.3s;
}

.toggle-slider:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    border-radius: 50%;
    transition: 0.3s;
}

input:checked + .toggle-slider {
    background-color: #dc3545;
}

input:checked + .toggle-slider:before {
    transform: translateX(22px);
}

.sticky-section {
    position: sticky;
    top: 20px;
}

@media (max-width: 992px) {
    .sticky-section {
        position: relative;
        top: 0;
    }
}
</style>