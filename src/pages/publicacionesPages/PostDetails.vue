<template>
    <div class="post-details-page">
        <div v-if="loading" class="loading-container">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
        </div>

        <div v-else-if="post" class="container-fluid">
            <div class="row">
                <div class="col-lg-8 col-md-12">
                    <ImageGallery
                        :images="postImages"
                        :current-image-index="currentImageIndex"
                        :title="postTitle"
                        :is-negotiable="post.negociable"
                        :loading="imagesLoading"
                        @image-selected="currentImageIndex = $event"
                    />

                    <div v-if="!post.approved" class="alert alert-warning">
                        <i class="bi bi-exclamation-triangle-fill me-2"></i>
                        Esta publicación está pendiente de aprobación por un administrador.
                    </div>

                    <PostHeader
                        :title="postTitle"
                        :year="post.bike?.year"
                        :location="locationText"
                        :views-count="post.views_count"
                        :currency="post.tipo_moneda?.nombre_tipo_moneda"
                        :price="post.precio"
                        :post-id="post.publicacion_id"
                        :post-owner-id="post.user.user_id"
                    />

                    <div class="description-section">
                        <h3><i class="bi bi-card-text me-2"></i>Descripción</h3>
                        <p class="description-text">{{ post.descripcion }}</p>
                    </div>

                    <SpecificationSection
                        v-if="engineSpecs.length"
                        title="Motor y Rendimiento"
                        icon-class="bi bi-gear-fill me-2"
                        :specs="engineSpecs"
                    />

                    <SpecificationSection
                        title="Especificaciones Generales"
                        icon-class="bi bi-info-circle-fill me-2"
                        :specs="generalSpecs"
                    />

                    <SpecificationSection
                        v-if="fuelSpecs.length"
                        title="Sistema de Combustible"
                        icon-class="bi bi-fuel-pump-fill"
                        :specs="fuelSpecs"
                    />

                    <SpecificationSection
                        v-if="transmissionSpecs.length"
                        title="Transmisión y Tren de Manejo"
                        icon-class="bi bi-diagram-3-fill"
                        :specs="transmissionSpecs"
                    />

                    <SpecificationSection
                        v-if="dimensionSpecs.length"
                        title="Dimensiones y Peso"
                        icon-class="bi bi-rulers"
                        :specs="dimensionSpecs"
                    />

                    <ComponentSection
                        v-if="brakeComponents.length"
                        title="Sistema de Frenos"
                        icon-class="bi bi-disc"
                        :components="brakeComponents"
                    />

                    <ComponentSection
                        v-if="suspensionComponents.length"
                        title="Sistema de Suspensión"
                        icon-class="bi bi-arrows-vertical"
                        :components="suspensionComponents"
                    />

                    <ComponentSection
                        v-if="tireComponents.length"
                        title="Llantas y Neumáticos"
                        icon-class="bi bi-circle"
                        :components="tireComponents"
                    />
                </div>

                <div class="col-lg-4 col-md-12">
                    <SellerCard
                        :seller="post.user"
                        :location="locationText"
                        :published-date="formatDate(post.created_at)"
                        :post-data="post"
                    />

                    <LocationMap 
                        v-if="post?.ubicacion"
                        :location-data="post.ubicacion"
                        :location-items="locationItems"
                    />

                    <InfoGrid
                        title="Estadísticas de la Publicación"
                        icon-class="bi bi-bar-chart me-2"
                        :items="statsItems"
                    />

                    <div class="safety-tips-card">
                        <div class="safety-header">
                            <i class="bi bi-shield-check"></i>
                            <h5>Consejos de Seguridad</h5>
                        </div>
                        <ul class="safety-list">
                            <li>• Inspecciona la moto en persona</li>
                            <li>• Verifica los documentos</li>
                            <li>• Realiza una prueba de manejo</li>
                            <li>• Negocia en lugares públicos</li>
                            <li>• Ve con alguien experimentado y de confianza</li>
                            <li>• Verifica el historial de mantenimiento</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="error-container">
            <div class="error-message">
                <i class="bi bi-exclamation-triangle"></i>
                <h4>Publicación no encontrada</h4>
                <p>La publicación que buscas no existe o ha sido eliminada.</p>
                <router-link to="/motos/publicaciones" class="btn btn-primary">
                    Volver a publicaciones
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import api from '../../services/api';
import ImageGallery from '../../components/ui/posts/postDetails/ImageGallery.vue';
import PostHeader from '../../components/ui/posts/postDetails/PostHeader.vue';
import SpecificationSection from '../../components/ui/posts/postDetails/SpecificationSection.vue';
import ComponentSection from '../../components/ui/posts/postDetails/ComponentSection.vue';
import InfoGrid from '../../components/ui/posts/postDetails/InfoGrid.vue';
import SellerCard from '../../components/ui/posts/postDetails/SellerCard.vue';
import LocationMap from '../../components/ui/posts/postDetails/LocationMap.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const post = ref(null);
const loading = ref(true);
const currentImageIndex = ref(0);
const postImages = ref([]);
const imagesLoading = ref(false);

const postTitle = computed(() => {
    if (!post.value) return '';
    return `${post.value.bike?.marca?.nombre_marca || ''} ${post.value.bike?.modelo?.nombre_modelo || ''}`.trim();
});

const locationText = computed(() => {
    if (!post.value?.ubicacion) return 'Santo Domingo';
    const { municipio, provincia } = post.value.ubicacion;
    return `${municipio?.nombre_municipio || ''}, ${provincia?.nombre_provincia || ''}`.replace(/^,\s*/, '');
});

const engineSpecs = computed(() => {
    if (!post.value?.bike) return [];
    const bike = post.value.bike;
    return [
        { label: 'Motor', value: bike.engine },
        { label: 'Desplazamiento', value: bike.displacement },
        { label: 'Potencia', value: bike.power },
        { label: 'Torque', value: bike.torque },
        { label: 'Velocidad Máxima', value: bike.top_speed },
        { label: 'Refrigeración', value: bike.cooling },
        { label: 'Carrera x Diámetro', value: bike.bore_stroke },
        { label: 'Compresión', value: bike.compression },
        { label: 'Válvulas por Cilindro', value: bike.valves_per_cylinder },
        { label: 'Lubricación', value: bike.lubrication }
    ].filter(spec => spec.value);
});

const fuelSpecs = computed(() => {
    if (!post.value?.bike?.fuel_system) return [];
    const fuel = post.value.bike.fuel_system;
    return [
        { label: 'Sistema', value: fuel.fuel_system },
        { label: 'Control de Combustible', value: fuel.fuel_control },
        { label: 'Capacidad del Tanque', value: fuel.fuel_capacity }
    ].filter(spec => spec.value);
});

const transmissionSpecs = computed(() => {
    if (!post.value?.bike) return [];
    const bike = post.value.bike;
    return [
        { label: 'Transmisión', value: bike.transmission },
        { label: 'Caja de Cambios', value: bike.gearbox },
        { label: 'Embrague', value: bike.clutch },
        { label: 'Sistema de Arranque', value: bike.starter }
    ].filter(spec => spec.value);
});

const dimensionSpecs = computed(() => {
    if (!post.value?.bike) return [];
    const bike = post.value.bike;
    return [
        { label: 'Peso Total', value: bike.total_weight },
        { label: 'Peso en Seco', value: bike.dry_weight },
        { label: 'Longitud Total', value: bike.total_length },
        { label: 'Ancho Total', value: bike.total_width },
        { label: 'Altura Total', value: bike.total_height },
        { label: 'Altura del Asiento', value: bike.seat_height },
        { label: 'Distancia al Suelo', value: bike.ground_clearance },
        { label: 'Chasis', value: bike.frame }
    ].filter(spec => spec.value);
});

const generalSpecs = computed(() => {
    if (!post.value) return [];
    return [
        { label: 'Año', value: post.value.bike?.year || 'N/A' },
        { label: 'Tipo de Motocicleta', value: post.value.bike?.bike_type?.nombre_tipo || 'N/A' },
        { label: 'Kilometraje', value: `${formatKilometers(post.value.recorrido)} ${post.value.unidad_metrica?.nombre_unidad_metrica || 'KM'}` },
        { label: 'Condición', value: post.value.condicion_motor?.nombre_condicion, class: 'condition-badge' },
        { 
            label: 'Estado de Venta', 
            value: post.value.bike?.en_venta ? 'Disponible' : 'No Disponible',
            class: post.value.bike?.en_venta ? 'status-badge active' : 'status-badge'
        }
    ];
});

const brakeComponents = computed(() => {
    if (!post.value?.bike?.brakes?.length) return [];
    return post.value.bike.brakes.map(brake => ({
        id: brake.bike_brake_id,
        position: brake.front ? 'Freno Delantero' : 'Freno Trasero',
        details: [
            { label: 'Marca', value: brake.maker?.nombre || 'N/A' },
            { label: 'Descripción', value: brake.brake_description || 'N/A' }
        ]
    }));
});

const suspensionComponents = computed(() => {
    if (!post.value?.bike?.suspensions?.length) return [];
    return post.value.bike.suspensions.map(suspension => ({
        id: suspension.bike_suspension_id,
        position: suspension.front ? 'Suspensión Delantera' : 'Suspensión Trasera',
        details: [
            { label: 'Marca', value: suspension.maker?.nombre || 'N/A' },
            { label: 'Descripción', value: suspension.suspension_description || 'N/A' }
        ]
    }));
});

const tireComponents = computed(() => {
    if (!post.value?.bike?.tires?.length) return [];
    return post.value.bike.tires.map(tire => ({
        id: tire.bike_tire_id,
        position: tire.front ? 'Llanta Delantera' : 'Llanta Trasera',
        details: [
            { label: 'Marca', value: tire.maker?.nombre || 'N/A' },
            { label: 'Tamaño', value: tire.size || 'N/A' },
            { label: 'Descripción', value: tire.tire_description || 'N/A' },
            ...(tire.wheel_travel ? [{ label: 'Recorrido de Rueda', value: tire.wheel_travel }] : [])
        ]
    }));
});

const locationItems = computed(() => {
    if (!post.value?.ubicacion) return [];
    const loc = post.value.ubicacion;
    return [
        { label: 'Dirección', value: loc.calle, icon: 'bi bi-building' },
        { label: 'Sector', value: loc.sector?.nombre_sector || 'N/A', icon: 'bi bi-geo' },
        { label: 'Municipio', value: loc.municipio?.nombre_municipio || 'N/A', icon: 'bi bi-pin-map' },
        { label: 'Provincia', value: loc.provincia?.nombre_provincia || 'N/A', icon: 'bi bi-map' },
        { label: 'Región', value: loc.region?.nombre_region || 'N/A', icon: 'bi bi-globe' },
        { label: 'País', value: loc.pais?.nombre_pais || 'N/A', icon: 'bi bi-flag' }
    ].filter(item => item.value !== 'N/A');
});

const statsItems = computed(() => {
    if (!post.value) return [];
    return [
        { label: `${post.value.views_count} visualizaciones`, icon: 'bi bi-eye' },
        { label: `Publicada ${formatDate(post.value.fecha_publicacion)}`, icon: 'bi bi-clock' },
        { 
            label: post.value.is_active ? 'Activa' : 'Inactiva',
            icon: 'bi bi-activity',
            class: post.value.is_active ? 'text-success' : 'text-muted'
        }
    ];
});

const fetchPostDetails = async () => {
    try {
        loading.value = true;
        const response = await api.get(`/api/publicaciones/details/${route.params.id}`);
        post.value = response.data.post;
        
        await fetchPostImages();
    } catch (error) {
        console.error('Error fetching post details:', error);
        if (error.response?.status === 404) {
            toast.error('Publicación no encontrada');
        } else {
            toast.error('Error al cargar la publicación');
        }
    } finally {
        loading.value = false;
    }
};

const fetchPostImages = async () => {
    try {
        imagesLoading.value = true;
        const response = await api.get(`/api/publicaciones/${route.params.id}/images`);
        
        if (response.data.images && response.data.images.length > 0) {
            // Sort images by display_order and extract URLs
            const sortedImages = response.data.images
                .sort((a, b) => a.display_order - b.display_order)
                .map(image => image.url);
            
            postImages.value = sortedImages;
        } else {
            postImages.value = [];
        }
    } catch (error) {
        console.error('Error fetching post images:', error);
        postImages.value = [];
        console.warn('Could not load post images, showing empty gallery');
    } finally {
        imagesLoading.value = false;
    }
};

const formatKilometers = (km) => {
    if (!km) return '0';
    return new Intl.NumberFormat('es-DO').format(parseInt(km));
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hace 1 día';
    if (diffDays < 30) return `Hace ${diffDays} días`;
    
    return date.toLocaleDateString('es-DO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
};

const formatFullDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-DO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

onMounted(() => {
    fetchPostDetails();
});
</script>

<style scoped>
.post-details-page {
    background-color: #f8f9fa;
    min-height: 100vh;
    padding: 2% 10%;
}

.loading-container, .error-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 50vh;
}

.error-message {
    text-align: center;
    padding: 2rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.error-message i {
    font-size: 3rem;
    color: #dc3545;
    margin-bottom: 1rem;
}

.description-section {
    background: white;
    padding: 24px;
    border-radius: 12px;
    margin-bottom: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.description-section h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 2px solid #f0f0f0;
    display: flex;
    align-items: center;
}

.description-text {
    color: #555;
    line-height: 1.6;
    font-size: 16px;
    text-align: left;
}

.safety-tips-card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    text-align: left;
}

.safety-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
}

.safety-header i {
    color: #28a745;
    font-size: 1.5rem;
}

.safety-header h5 {
    margin: 0;
    color: #333;
}

.safety-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.safety-list li {
    padding: 8px 0;
    color: #666;
    font-size: 14px;
    border-bottom: 1px solid #f0f0f0;
}

.safety-list li:last-child {
    border-bottom: none;
}

@media (max-width: 768px) {
    .post-details-page {
        padding: 10px 0;
    }
    
    .container-fluid {
        padding: 0 10px;
    }
}
</style>