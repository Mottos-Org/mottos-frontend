<template>
  <div class="bike-details-page">
    <div v-if="loading" class="loading-container">
      <div class="spinner-border text-danger" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p>Cargando detalles de la motocicleta...</p>
    </div>

    <div v-else-if="bike" class="bike-details-content">
      <div class="bike-details-hero">
        <div class="hero-image-wrapper" @click="openImageViewer">
          <img
            :src="currentImage?.url || '/placeholder-bike.jpg'"
            :alt="`${bike.marca?.nombre_marca} ${bike.modelo?.nombre_modelo}`"
            class="hero-image"
            @error="handleImageError"
          />
          <div class="image-overlay-indicator">
            <i class="bi bi-zoom-in"></i>
            <span>Click para ampliar</span>
          </div>
          
          <button 
            v-if="bike.images?.length > 1" 
            @click.stop="previousImage"
            class="nav-arrow prev"
            :disabled="currentImageIndex === 0"
          >
            <i class="bi bi-chevron-left"></i>
          </button>
          <button 
            v-if="bike.images?.length > 1"
            @click.stop="nextImage" 
            class="nav-arrow next"
            :disabled="currentImageIndex === bike.images.length - 1"
          >
            <i class="bi bi-chevron-right"></i>
          </button>
          
          <div class="hero-overlay">
            <div class="hero-title">
              <h1>{{ bike.marca?.nombre_marca }} {{ bike.modelo?.nombre_modelo }}</h1>
              <span class="hero-year">{{ bike.year }}</span>
              <span class="bike-type">{{ bike.bike_type?.nombre_tipo }}</span>
            </div>
            <div class="hero-stats">
              <span v-if="bike.displacement" class="stat">
                <i class="bi bi-gear"></i> {{ bike.displacement }}
              </span>
              <span v-if="bike.power" class="stat">
                <i class="bi bi-lightning"></i> {{ bike.power }}
              </span>
              <span v-if="bike.torque" class="stat">
                <i class="bi bi-speedometer"></i> {{ bike.torque }}
              </span>
            </div>
          </div>
          
          <div v-if="isOwner" class="hero-actions">
            <button @click.stop="editBike" class="action-btn edit" title="Editar">
              <i class="bi bi-pencil"></i>
            </button>
            <button @click.stop="sellBike" class="action-btn sell" title="Publicar en venta">
              <i class="bi bi-currency-dollar"></i>
            </button>
            <button @click.stop="showImageUploadModal = true" class="action-btn upload" title="Gestionar imágenes">
              <i class="bi bi-images"></i>
            </button>
            <button @click.stop="confirmDeleteBike" class="action-btn delete" title="Eliminar">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
        
        <div v-if="bike.images?.length > 0" class="gallery-thumbnails">
          <img
            v-for="(img, idx) in bike.images"
            :key="img.image_id"
            :src="img.url"
            :alt="`Imagen ${idx + 1}`"
            :class="{ active: idx === currentImageIndex }"
            @click="currentImageIndex = idx"
          />
          <button v-if="isOwner" class="add-image-btn" @click="showImageUploadModal = true">
            <i class="bi bi-plus"></i>
          </button>
        </div>
        
        <div v-else-if="isOwner" class="no-images-section">
          <div class="no-images-content">
            <i class="bi bi-images"></i>
            <p>Esta motocicleta no tiene imágenes</p>
            <button @click="showImageUploadModal = true" class="btn btn-primary">
              <i class="bi bi-plus-circle"></i>
              Subir Imágenes
            </button>
          </div>
        </div>
      </div>

      <BikeOwnerCard
        v-if="bike.owner && !isOwner"
        :owner="bike.owner"
        :bike="bike"
      />

      <div class="specs-container">
        <div class="specs-grid">
          <SpecCard
            v-if="hasEngineSpecs"
            icon="bi bi-gear"
            title="Motor"
            :specs="engineSpecs"
          />
          
          <SpecCard
            v-if="bike.fuel_system"
            icon="bi bi-fuel-pump"
            title="Sistema de Combustible"
            :specs="fuelSpecs"
          />
          
          <SpecCard
            v-if="hasTransmissionSpecs"
            icon="bi bi-shift"
            title="Transmisión"
            :specs="transmissionSpecs"
          />
          
          <SpecCard
            v-if="hasDimensionSpecs"
            icon="bi bi-arrows-angle-expand"
            title="Dimensiones & Peso"
            :specs="dimensionSpecs"
          />
          
          <SpecCard
            v-if="bike.tires?.length > 0"
            icon="bi bi-circle"
            title="Neumáticos"
            :specs="tireSpecs"
          />
          
          <SpecCard
            v-if="bike.brakes?.length > 0"
            icon="bi bi-stop-circle"
            title="Frenos"
            :specs="brakeSpecs"
          />
          
          <SpecCard
            v-if="bike.suspensions?.length > 0"
            icon="bi bi-layers"
            title="Suspensión"
            :specs="suspensionSpecs"
          />
        </div>
        
        <div class="bike-meta">
          <span><i class="bi bi-calendar"></i> Registrada: {{ formatDate(bike.created_at) }}</span>
          <span v-if="bike.updated_at !== bike.created_at">
            <i class="bi bi-pencil"></i> Actualizada: {{ formatDate(bike.updated_at) }}
          </span>
          <span><i class="bi bi-images"></i> {{ bike.images?.length || 0 }} imagen(es)</span>
        </div>
      </div>
    </div>

    <div v-if="showImageViewer" class="image-viewer-overlay" @click="closeImageViewer">
      <div class="image-viewer-container">
        <button @click="closeImageViewer" class="close-viewer">
          <i class="bi bi-x-lg"></i>
        </button>
        
        <img 
          :src="currentImage?.url" 
          :alt="`${bike?.marca?.nombre_marca} ${bike?.modelo?.nombre_modelo}`"
          class="viewer-image"
          @click.stop
        />
        
        <div v-if="bike.images?.length > 1" class="viewer-navigation">
          <button @click.stop="previousImage" :disabled="currentImageIndex === 0">
            <i class="bi bi-chevron-left"></i>
          </button>
          <span>{{ currentImageIndex + 1 }} / {{ bike.images.length }}</span>
          <button @click.stop="nextImage" :disabled="currentImageIndex === bike.images.length - 1">
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <ImageUploadModal
      v-if="showImageUploadModal"
      :bike-id="bikeId"
      :existing-images="bike?.images || []"
      @close="showImageUploadModal = false"
      @images-updated="handleImagesUpdated"
    />

    <EditBikeModal
      v-if="showEditBikeModal"
      :bike="bike"
      @close="showEditBikeModal = false"
      @bike-updated="handleBikeUpdated"
    />

    <ConfirmationModal
      v-if="showDeleteBikeModal"
      title="¿Eliminar motocicleta?"
      message="Esta acción eliminará permanentemente tu motocicleta y todas sus imágenes. No se puede deshacer."
      confirm-text="Eliminar"
      confirm-class="btn-danger"
      confirm-icon="bi bi-trash"
      :loading="deletingBike"
      @confirm="deleteBike"
      @cancel="showDeleteBikeModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../../stores/authStore';
import api from '../../services/api';
import EditBikeModal from '../../components/forms/bikes/EditBikeModal.vue';
import ImageUploadModal from '../../components/forms/bikes/ImageUploadModal.vue';
import ConfirmationModal from '../../components/ui/ConfirmationModal.vue';
import SpecCard from '../../components/ui/SpecCard.vue';
import BikeOwnerCard from '../../components/ui/BikeOwnerCard.vue';
import { formatDate } from '../../utils/formatUtils';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const auth = useAuthStore();

const bikeId = computed(() => route.params.id);
const bike = ref(null);
const loading = ref(false);
const currentImageIndex = ref(0);
const showImageUploadModal = ref(false);
const showEditBikeModal = ref(false);
const showDeleteBikeModal = ref(false);
const showImageViewer = ref(false);
const deletingBike = ref(false);

const isOwner = computed(() => {
  const currentUserId = String(auth.userId);
  const bikeOwnerId = String(bike.value?.user_id);

  return auth.isLoggedIn && currentUserId === bikeOwnerId;
});

const currentImage = computed(() => {
    return bike.value?.images?.[currentImageIndex.value] || null;
});

const hasEngineSpecs = computed(() => {
    if (!bike.value) return false;
    return bike.value.displacement || bike.value.engine || bike.value.power || 
           bike.value.torque || bike.value.top_speed || bike.value.cooling || 
           bike.value.compression || bike.value.bore_stroke || 
           bike.value.valves_per_cylinder || bike.value.lubrication;
});

const hasTransmissionSpecs = computed(() => {
    if (!bike.value) return false;
    return bike.value.transmission || bike.value.gearbox || 
           bike.value.clutch || bike.value.starter;
});

const hasDimensionSpecs = computed(() => {
    if (!bike.value) return false;
    return bike.value.total_length || bike.value.total_width || 
           bike.value.total_height || bike.value.seat_height || 
           bike.value.ground_clearance || bike.value.total_weight || 
           bike.value.dry_weight || bike.value.frame;
});

const engineSpecs = computed(() => ({
    'Cilindrada': bike.value?.displacement,
    'Tipo': bike.value?.engine,
    'Potencia': bike.value?.power,
    'Torque': bike.value?.torque,
    'Velocidad Máxima': bike.value?.top_speed,
    'Refrigeración': bike.value?.cooling,
    'Compresión': bike.value?.compression,
    'Calibre x Carrera': bike.value?.bore_stroke,
    'Válvulas por Cilindro': bike.value?.valves_per_cylinder,
    'Lubricación': bike.value?.lubrication,
}));

const fuelSpecs = computed(() => ({
    'Capacidad': bike.value?.fuel_system?.fuel_capacity,
    'Control': bike.value?.fuel_system?.fuel_control,
    'Sistema': bike.value?.fuel_system?.fuel_system,
}));

const transmissionSpecs = computed(() => ({
    'Transmisión': bike.value?.transmission,
    'Caja de Cambios': bike.value?.gearbox,
    'Embrague': bike.value?.clutch,
    'Arranque': bike.value?.starter,
}));

const dimensionSpecs = computed(() => ({
    'Largo Total': bike.value?.total_length,
    'Ancho Total': bike.value?.total_width,
    'Alto Total': bike.value?.total_height,
    'Altura del Asiento': bike.value?.seat_height,
    'Distancia al Suelo': bike.value?.ground_clearance,
    'Peso Total': bike.value?.total_weight,
    'Peso en Seco': bike.value?.dry_weight,
    'Chasis': bike.value?.frame,
}));

const tireSpecs = computed(() => {
    const specs = {};
    if (bike.value?.tires) {
        bike.value.tires.forEach(tire => {
            const position = tire.front ? 'Delantero' : 'Trasero';
            specs[position] = `${tire.maker?.nombre} ${tire.size}" - ${tire.tire_description}`;
        });
    }
    return specs;
});

const brakeSpecs = computed(() => {
    const specs = {};
    if (bike.value?.brakes) {
        bike.value.brakes.forEach(brake => {
            const position = brake.front ? 'Delantero' : 'Trasero';
            specs[position] = `${brake.maker?.nombre} - ${brake.brake_description}`;
        });
    }
    return specs;
});

const suspensionSpecs = computed(() => {
    const specs = {};
    if (bike.value?.suspensions) {
        bike.value.suspensions.forEach(suspension => {
            const position = suspension.front ? 'Delantera' : 'Trasera';
            specs[position] = `${suspension.maker?.nombre} - ${suspension.suspension_description}`;
        });
    }
    return specs;
});

const fetchBikeDetails = async () => {
    try {
        loading.value = true;
        
        const response = await api.get(`/api/bikes/${bikeId.value}`);
        bike.value = response.data;

        if (bike.value.images?.length > 0) {
            const featuredIndex = bike.value.images.findIndex(img => img.is_featured);
            if (featuredIndex !== -1) {
                currentImageIndex.value = featuredIndex;
            }
        }
        
    } catch (error) {
        console.error('Error fetching bike details:', error);
        
        if (error.response?.status === 404) {
            toast.error('Motocicleta no encontrada');
        } else if (error.response?.status === 403) {
            toast.error('No tienes permisos para ver esta motocicleta');
        } else {
            toast.error('Error al cargar los detalles de la motocicleta');
        }
        
        bike.value = null;
    } finally {
        loading.value = false;
    }
};

const openImageViewer = () => {
    if (bike.value?.images?.length > 0) {
        showImageViewer.value = true;
        document.body.style.overflow = 'hidden';
    }
};

const closeImageViewer = () => {
    showImageViewer.value = false;
    document.body.style.overflow = '';
};

const nextImage = () => {
    if (currentImageIndex.value < bike.value.images.length - 1) {
        currentImageIndex.value++;
    }
};

const previousImage = () => {
    if (currentImageIndex.value > 0) {
        currentImageIndex.value--;
    }
};

const handleImageError = () => {
    console.warn('Image failed to load:', currentImage.value?.url);
};

const editBike = () => {
    showEditBikeModal.value = true;
};

const sellBike = () => {
    router.push(`/motos/publicacion/crear?bikeId=${bikeId.value}`);
};

const confirmDeleteBike = () => {
    showDeleteBikeModal.value = true;
};

const deleteBike = async () => {
    try {
        deletingBike.value = true;
        
        await api.delete(`/api/bikes/${bikeId.value}`);
        
        toast.success('Motocicleta eliminada exitosamente');
        
        router.push('/perfil?tab=garage');
        
    } catch (error) {
        console.error('Error deleting bike:', error);
        
        if (error.response?.status === 403) {
            toast.error('No puedes eliminar una motocicleta que está en venta');
        } else {
            toast.error('Error al eliminar la motocicleta');
        }
    } finally {
        deletingBike.value = false;
        showDeleteBikeModal.value = false;
    }
};

const handleImagesUpdated = async (newImages) => {
    console.log('📸 Images updated:', newImages);
    
    await fetchBikeDetails();
    showImageUploadModal.value = false;
};

const handleBikeUpdated = async (updatedBike) => {
    
    await fetchBikeDetails();
    showEditBikeModal.value = false;
    toast.success('Motocicleta actualizada exitosamente');
};

const handleKeydown = (event) => {
    if (!bike.value?.images?.length) return;
    
    if (event.key === 'ArrowLeft') {
        previousImage();
    } else if (event.key === 'ArrowRight') {
        nextImage();
    } else if (event.key === 'Escape') {
        closeImageViewer();
    }
};

onMounted(() => {
    fetchBikeDetails();
    window.addEventListener('keydown', handleKeydown);
});

watch(() => route.params.id, (newId) => {
    if (newId) {
        fetchBikeDetails();
    }
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
    document.body.style.overflow = '';
});
</script>

<style scoped>
.bike-details-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 2rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  color: #6c757d;
}

.bike-details-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.bike-details-hero {
  position: relative;
  background: #fff;
  box-shadow: 0 4px 32px rgba(0,0,0,0.08);
  border-radius: 1.5rem;
  overflow: hidden;
}

.hero-image-wrapper {
  position: relative;
  width: 100%;
  height: 500px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.hero-image-wrapper:hover .hero-image {
  transform: scale(1.02);
}

.image-overlay-indicator {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.hero-image-wrapper:hover .image-overlay-indicator {
  opacity: 1;
}

.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.9);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #333;
}

.nav-arrow:hover:not(:disabled) {
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.nav-arrow:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-arrow.prev { left: 1rem; }
.nav-arrow.next { right: 1rem; }

.hero-overlay {
  position: absolute;
  left: 0; right: 0; bottom: 0;
  background: linear-gradient(180deg,rgba(0,0,0,0.0) 40%,rgba(0,0,0,0.8) 100%);
  color: #fff;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.hero-title {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.hero-title h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
}

.hero-year {
  background: #dc3545;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.bike-type {
  background: rgba(255,255,255,0.2);
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 1rem;
  font-weight: 500;
}

.hero-stats {
  display: flex;
  gap: 2rem;
  margin-top: 0.5rem;
  font-size: 1.1rem;
  flex-wrap: wrap;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.hero-actions {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  background: rgba(255,255,255,0.9);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.action-btn.edit { color: #17a2b8; }
.action-btn.sell { color: #28a745; }
.action-btn.upload { color: #6f42c1; }
.action-btn.delete { color: #dc3545; }

.action-btn:hover { 
  background: white;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  transform: translateY(-1px);
}

.gallery-thumbnails {
  display: flex;
  gap: 1rem;
  padding: 1.5rem 2rem;
  background: #fff;
  align-items: center;
  overflow-x: auto;
}

.gallery-thumbnails img {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 0.75rem;
  cursor: pointer;
  opacity: 0.7;
  border: 3px solid transparent;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.gallery-thumbnails img.active {
  opacity: 1;
  border-color: #dc3545;
}

.gallery-thumbnails img:hover {
  opacity: 1;
}

.add-image-btn {
  background: #dc3545;
  color: #fff;
  border: none;
  border-radius: 0.75rem;
  width: 60px;
  height: 60px;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: 0.5rem;
  transition: background 0.2s;
  flex-shrink: 0;
}

.add-image-btn:hover {
  background: #c82333;
}

.no-images-section {
  padding: 2rem;
  background: #f8f9fa;
  text-align: center;
}

.no-images-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #6c757d;
}

.no-images-content i {
  font-size: 3rem;
  color: #dee2e6;
}

.no-images-content p {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  border: none;
}

.btn-primary {
  background: #dc3545;
  color: white;
}

.btn-primary:hover {
  background: #c82333;
  transform: translateY(-1px);
}

.specs-container {
  background: #fff;
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 2px 16px rgba(0,0,0,0.06);
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.bike-meta {
  display: flex;
  gap: 2rem;
  font-size: 1rem;
  color: #6c757d;
  padding-top: 1.5rem;
  border-top: 1px solid #e9ecef;
  flex-wrap: wrap;
}

.bike-meta i {
  margin-right: 0.5rem;
}

.image-viewer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  cursor: pointer;
}

.image-viewer-container {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.close-viewer {
  position: absolute;
  top: -3rem;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  z-index: 10001;
}

.viewer-image {
  max-width: 100%;
  max-height: calc(90vh - 4rem);
  object-fit: contain;
  cursor: default;
}

.viewer-navigation {
  display: flex;
  align-items: center;
  gap: 2rem;
  color: white;
  font-size: 1.1rem;
}

.viewer-navigation button {
  background: rgba(255,255,255,0.2);
  border: none;
  color: white;
  padding: 0.75rem;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.2s;
}

.viewer-navigation button:hover:not(:disabled) {
  background: rgba(255,255,255,0.3);
}

.viewer-navigation button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 900px) {
  .bike-details-page {
    padding: 1rem;
  }
  
  .hero-image-wrapper {
    height: 300px;
  }
  
  .hero-title h1 {
    font-size: 2rem;
  }
  
  .specs-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .gallery-thumbnails {
    padding: 1rem;
  }
  
  .hero-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
}

@media (max-width: 600px) {
  .hero-image-wrapper {
    height: 250px;
  }
  
  .hero-title {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .hero-title h1 {
    font-size: 1.5rem;
  }
  
  .hero-stats {
    gap: 1rem;
    font-size: 1rem;
  }
  
  .gallery-thumbnails img {
    width: 60px;
    height: 45px;
  }
  
  .bike-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .nav-arrow {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
  
  .action-btn {
    width: 45px;
    height: 45px;
    font-size: 1.2rem;
  }
}
</style>