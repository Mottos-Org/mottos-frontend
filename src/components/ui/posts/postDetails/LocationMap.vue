<template>
    <div class="location-map-section">
        <h3>
            <i class="bi bi-geo-alt-fill me-2"></i>
            Ubicación
        </h3>
        
        <div v-if="!hasApiKey" class="map-error">
            <i class="bi bi-exclamation-triangle"></i>
            <div>
                <h5>Mapa no disponible</h5>
                <p>La clave API de Google Maps no está configurada.</p>
                <div class="fallback-location">
                    <div v-for="item in locationItems" :key="item.label" class="location-item">
                        <i :class="item.icon"></i>
                        <span><strong>{{ item.label }}:</strong> {{ item.value }}</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div v-else-if="loading" class="map-loading">
            <div class="spinner-border spinner-border-sm text-primary" role="status">
                <span class="visually-hidden">Geocodificando...</span>
            </div>
            <span class="ms-2">Obteniendo ubicación exacta...</span>
        </div>
        
        <div v-else class="map-container">
            <div v-if="!mapReady && coordinates" class="map-initializing">
                <div class="spinner-border spinner-border-sm text-primary" role="status">
                    <span class="visually-hidden">Inicializando mapa...</span>
                </div>
                <span class="ms-2">Cargando mapa...</span>
            </div>
            
            <div 
                ref="mapElement" 
                class="google-map"
                :style="{ opacity: mapReady ? 1 : 0 }"
            ></div>
            
            <div v-if="coordinates" class="location-details">
                <div class="location-address">
                    <i class="bi bi-geo-alt"></i>
                    <span>{{ fullAddress }}</span>
                </div>
            </div>
            
            <div v-if="geocodeError" class="map-error-inline">
                <i class="bi bi-exclamation-triangle"></i>
                <div>
                    <h5>No se pudo obtener la ubicación exacta</h5>
                    <p>Mostrando la información de ubicación disponible:</p>
                    <div class="fallback-location">
                        <div v-for="item in locationItems" :key="item.label" class="location-item">
                            <i :class="item.icon"></i>
                            <span><strong>{{ item.label }}:</strong> {{ item.value }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed, watch } from 'vue';

const props = defineProps({
    locationData: Object,
    locationItems: Array
});

const mapElement = ref(null);
const loading = ref(false);
const coordinates = ref(null);
const geocodeError = ref(false);
const mapReady = ref(false);
let map = null;
let marker = null;
let geocoder = null;

const hasApiKey = computed(() => {
    return import.meta.env.VITE_GOOGLE_MAPS_API_KEY && import.meta.env.VITE_GOOGLE_MAPS_API_KEY !== '';
});

const fullAddress = computed(() => {
    if (!props.locationData) return '';
    const parts = [];
    if (props.locationData.calle) parts.push(props.locationData.calle);
    if (props.locationData.sector?.nombre_sector) parts.push(props.locationData.sector.nombre_sector);
    if (props.locationData.municipio?.nombre_municipio) parts.push(props.locationData.municipio.nombre_municipio);
    if (props.locationData.provincia?.nombre_provincia) parts.push(props.locationData.provincia.nombre_provincia);
    if (props.locationData.pais?.nombre_pais) parts.push(props.locationData.pais.nombre_pais);
    return parts.join(', ');
});

const createCustomMarkerElement = () => {
    const markerElement = document.createElement('div');
    markerElement.className = 'custom-marker';
    markerElement.innerHTML = `
        <div class="marker-content">
            <div class="marker-pin">
                <i class="bi bi-geo-alt-fill"></i>
            </div>
            <div class="marker-pulse"></div>
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .custom-marker {
            cursor: pointer;
            transform: translate(-50%, -100%);
        }
        
        .marker-content {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .marker-pin {
            width: 40px;
            height: 40px;
            background: #dc3545;
            border: 3px solid white;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            z-index: 1;
            position: relative;
        }
        
        .marker-pin i {
            color: white;
            font-size: 18px;
            transform: rotate(45deg);
            margin-top: -2px;
            margin-left: -1px;
        }
        
        .marker-pin:hover {
            transform: rotate(-45deg) scale(1.1);
            box-shadow: 0 6px 12px rgba(0,0,0,0.4);
        }
        
        .marker-pulse {
            position: absolute;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(220, 53, 69, 0.3);
            animation: pulse 2s infinite;
            z-index: 0;
        }
        
        @keyframes pulse {
            0% {
                transform: scale(1);
                opacity: 1;
            }
            70% {
                transform: scale(2);
                opacity: 0;
            }
            100% {
                transform: scale(2.5);
                opacity: 0;
            }
        }
    `;
    
    if (!document.querySelector('#custom-marker-styles')) {
        style.id = 'custom-marker-styles';
        document.head.appendChild(style);
    }
    
    return markerElement;
};

const initializeMap = async () => {
    console.log('Initializing map...', {
        hasGoogle: !!window.google,
        hasCoordinates: !!coordinates.value,
        hasMapElement: !!mapElement.value,
        mapElementInDOM: document.contains(mapElement.value)
    });

    if (!window.google || !coordinates.value) {
        console.error('Missing Google Maps or coordinates');
        return;
    }

    await nextTick();
    
    if (!mapElement.value) {
        console.error('Map element still not available after nextTick');
        setTimeout(() => initializeMap(), 100); // Retry after 100ms
        return;
    }
    
    try {
        const mapOptions = {
            center: coordinates.value,
            zoom: 15,
            mapId: 'DEMO_MAP_ID', // Required for AdvancedMarkerElement
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
            zoomControl: true,
            styles: [
                {
                    featureType: "poi.business",
                    stylers: [{ visibility: "off" }]
                }
            ]
        };
        
        map = new window.google.maps.Map(mapElement.value, mapOptions);
        
        const markerElement = createCustomMarkerElement();
        
        marker = new window.google.maps.marker.AdvancedMarkerElement({
            position: coordinates.value,
            map: map,
            title: 'Ubicación de la motocicleta',
            content: markerElement
        });
        
        const infoWindow = new window.google.maps.InfoWindow({
            content: `
                <div style="padding: 12px; max-width: 250px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                        <span style="font-size: 20px;">🏍️</span>
                        <h6 style="margin: 0; color: #dc3545; font-weight: 600;">Ubicación de la motocicleta</h6>
                    </div>
                    <p style="margin: 0; font-size: 14px; color: #666; line-height: 1.4;">${fullAddress.value}</p>
                    <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee; font-size: 12px; color: #999;">
                        Click en el mapa para más opciones
                    </div>
                </div>
            `,
            ariaLabel: 'Ubicación de la motocicleta'
        });
        
        marker.addListener('click', () => {
            infoWindow.open({
                anchor: marker,
                map: map
            });
        });
        
        map.addListener('idle', () => {
            console.log('Map is ready!');
            mapReady.value = true;
        });
        
        map.addListener('click', () => {
            infoWindow.close();
        });
        
        console.log('Map initialization complete with AdvancedMarkerElement!');
        
    } catch (error) {
        console.error('Error initializing map:', error);
        
        try {
            marker = new window.google.maps.Marker({
                position: coordinates.value,
                map: map,
                title: 'Ubicación de la motocicleta',
                animation: window.google.maps.Animation.DROP
            });
            
            const infoWindow = new window.google.maps.InfoWindow({
                content: `
                    <div style="padding: 8px; max-width: 200px;">
                        <h6 style="margin: 0 0 8px 0; color: #dc3545;">🏍️ Ubicación de la motocicleta</h6>
                        <p style="margin: 0; font-size: 14px; color: #666;">${fullAddress.value}</p>
                    </div>
                `
            });
            
            marker.addListener('click', () => {
                infoWindow.open(map, marker);
            });
            
            mapReady.value = true;
        } catch (fallbackError) {
            console.error('Fallback marker also failed:', fallbackError);
            geocodeError.value = true;
        }
    }
};

// Geocode using Maps JavaScript API
const geocodeAddress = async () => {
    if (!fullAddress.value || !hasApiKey.value || !window.google) {
        console.error('Missing requirements for geocoding');
        geocodeError.value = true;
        return;
    }
    
    loading.value = true;
    geocodeError.value = false;
    
    try {
        geocoder = new window.google.maps.Geocoder();
        
        const geocodePromise = new Promise((resolve, reject) => {
            geocoder.geocode(
                { address: fullAddress.value },
                (results, status) => {
                    if (status === 'OK' && results && results.length > 0) {
                        const location = results[0].geometry.location;
                        const coords = {
                            lat: location.lat(),
                            lng: location.lng()
                        };
                        resolve(coords);
                    } else {
                        console.warn('Geocoding failed:', status);
                        reject(new Error(`Geocoding failed: ${status}`));
                    }
                }
            );
        });
        
        coordinates.value = await geocodePromise;
        
    } catch (error) {
        console.error('Geocoding error:', error);
        geocodeError.value = true;
    } finally {
        loading.value = false;
    }
};

watch(coordinates, async (newCoords) => {
    if (newCoords && window.google) {
        await new Promise(resolve => setTimeout(resolve, 200));
        await initializeMap();
    }
});

const loadGoogleMaps = () => {
    return new Promise((resolve, reject) => {
        if (window.google && window.google.maps) {
            resolve();
            return;
        }
        
        if (!hasApiKey.value) {
            reject(new Error('Google Maps API key not found'));
            return;
        }
        
        window.initGoogleMaps = () => {
            delete window.initGoogleMaps;
            resolve();
        };
        
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&callback=initGoogleMaps&libraries=marker,geometry`;
        script.async = true;
        script.defer = true;
        script.onerror = () => {
            console.error('Failed to load Google Maps script');
            reject(new Error('Failed to load Google Maps'));
        };
        
        if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
            document.head.appendChild(script);
        } else {
            resolve();
        }
    });
};

onMounted(async () => {
    if (!hasApiKey.value) {
        console.warn('Google Maps API key not configured');
        geocodeError.value = true;
        return;
    }

    try {
        await loadGoogleMaps();
        await geocodeAddress();
    } catch (error) {
        console.error('Failed to initialize maps:', error);
        geocodeError.value = true;
    }
});
</script>

<style scoped>
.location-map-section {
    background: white;
    padding: 24px;
    border-radius: 12px;
    margin-bottom: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.location-map-section h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 2px solid #f0f0f0;
    display: flex;
    align-items: center;
}

.map-loading,
.map-error,
.map-initializing {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    color: #666;
    font-size: 14px;
}

.map-error {
    flex-direction: column;
    text-align: center;
    gap: 16px;
}

.map-error i {
    font-size: 2rem;
    color: #ffc107;
}

.map-initializing {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(248, 249, 250, 0.9);
    z-index: 10;
    border-radius: 12px 12px 0 0;
}

.fallback-location {
    display: grid;
    gap: 8px;
    max-width: 300px;
}

.location-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: #f8f9fa;
    border-radius: 6px;
    font-size: 14px;
}

.location-item i {
    color: #dc3545;
    min-width: 16px;
}

.map-container {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #e9ecef;
}

.google-map {
    width: 100%;
    height: 300px;
    transition: opacity 0.3s ease; /* Smooth transition */
}

.location-details {
    background: #f8f9fa;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.location-address,
.location-coords {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #666;
}

.location-address i,
.location-coords i {
    color: #dc3545;
    min-width: 16px;
}

.location-address {
    font-weight: 500;
    text-align: left;
}

.location-coords {
    font-family: 'Courier New', monospace;
    font-size: 12px;
}

.map-error-inline {
    padding: 20px;
    text-align: center;
    background: #fff3cd;
    border: 1px solid #ffeaa7;
    border-radius: 8px;
    margin: 10px;
}

.map-error-inline i {
    font-size: 1.5rem;
    color: #ffc107;
    margin-bottom: 10px;
}

.map-error-inline h5 {
    color: #856404;
    margin-bottom: 8px;
}

.map-error-inline p {
    color: #856404;
    font-size: 14px;
    margin-bottom: 15px;
}

@media (max-width: 768px) {
    .google-map {
        height: 250px;
    }
    
    .location-details {
        padding: 12px;
    }
    
    .map-initializing {
        padding: 30px 15px;
        font-size: 13px;
    }
}
</style>