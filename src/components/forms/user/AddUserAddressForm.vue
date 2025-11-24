<template>
  <div class="card p-3">
    <div class="d-flex justify-content-between align-items-start mb-2">
      <h3 class="section-title mb-0">{{ editing ? 'Editar dirección' : 'Agregar nueva dirección' }}</h3>
      <button v-if="showClose" type="button" class="btn-close" @click="$emit('cancel')">
        <i class="bi bi-x"></i>
      </button>
    </div>

    <form @submit.prevent="onSave">
      <div class="mb-2">
        <label class="form-label">País</label>
        <input class="form-control" disabled value="República Dominicana (predeterminado)" />
      </div>

      <div class="row g-2 mb-2">
        <div class="col-6">
          <label class="form-label">Región</label>
          <v-select
            v-model="localForm.region_id"
            :options="geographic.regions || []"
            label="nombre_region"
            :reduce="r => r.region_id"
            placeholder="Seleccionar región"
            @input="onRegionChange"
            :clearable="false"
            class="v-select-custom"
          />
        </div>
        <div class="col-6">
          <label class="form-label">Provincia</label>
          <v-select
            v-model="localForm.provincia_id"
            :options="provinces"
            label="nombre_provincia"
            :reduce="p => p.provincia_id"
            placeholder="Seleccionar provincia"
            @input="onProvinciaChange"
            :disabled="!localForm.region_id"
            :clearable="false"
            class="v-select-custom"
          />
        </div>
      </div>

      <div class="row g-2 mb-2">
        <div class="col-6">
          <label class="form-label">Municipio</label>
          <v-select
            v-model="localForm.municipio_id"
            :options="municipios"
            label="nombre_municipio"
            :reduce="m => m.municipio_id"
            placeholder="Seleccionar municipio"
            @input="onMunicipioChange"
            :disabled="!localForm.provincia_id"
            :clearable="false"
            class="v-select-custom"
          />
        </div>
        <div class="col-6">
          <label class="form-label">Distrito</label>
          <v-select
            v-model="localForm.distrito_id"
            :options="distritos"
            label="nombre_distrito"
            :reduce="d => d.distrito_id"
            placeholder="Seleccionar distrito"
            @input="onDistritoChange"
            :disabled="!localForm.municipio_id"
            :clearable="false"
            class="v-select-custom"
          />
        </div>
      </div>

      <div class="mb-2">
        <label class="form-label">Sector (opcional)</label>
        <v-select
          v-model="localForm.sector_id"
          :options="sectores"
          label="nombre_sector"
          :reduce="s => s.sector_id"
          placeholder="Seleccionar sector"
          :clearable="true"
          class="v-select-custom"
        />
      </div>

      <div class="mb-2">
        <label class="form-label">Dirección (calle)</label>
        <textarea class="form-control" rows="2" v-model="localForm.calle" placeholder="Ej: Nombre y número de la calle."></textarea>
      </div>

      <div class="d-flex gap-2 justify-content-end" style="margin-top: 1.5rem;">
        <button type="button" class="btn brand-outline large-outline btn-outline-secondary" @click="$emit('cancel')" :disabled="saving">Cancelar</button>
        <button class="btn brand-btn large-btn" :disabled="saving">
          {{ saving ? (editing ? 'Guardando...' : 'Guardando...') : (editing ? 'Guardar cambios' : 'Agregar dirección') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, watch } from 'vue';
import { useToast } from 'vue-toastification';
import api from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

const props = defineProps({
  existingAddresses: { type: Array, default: () => [] }, // array from parent to merge with
  initial: { type: Object, default: null }, // if editing
  showClose: { type: Boolean, default: true }
});
const emit = defineEmits(['saved', 'cancel']);

const toast = useToast();
const auth = useAuthStore();

const geographic = reactive({ regions: [] });
const saving = ref(false);

const localForm = reactive({
  direccion_id: null,
  pais_id: 1,
  region_id: null,
  provincia_id: null,
  municipio_id: null,
  distrito_id: null,
  sector_id: null,
  calle: ''
});

const editing = computed(() => !!localForm.direccion_id);

const userId = computed(() => auth.userId || auth.user?.user_id);

const provinces = computed(() => {
  const r = geographic.regions?.find(x => x.region_id === localForm.region_id);
  return r?.provinces || [];
});
const municipios = computed(() => {
  const p = provinces.value.find(x => x.provincia_id === localForm.provincia_id);
  return p?.municipalities || [];
});
const distritos = computed(() => {
  const m = municipios.value.find(x => x.municipio_id === localForm.municipio_id);
  return m?.districts || [];
});
const sectores = computed(() => {
  const d = distritos.value.find(x => x.distrito_id === localForm.distrito_id);
  return d?.sectors || [];
});

const loadGeographic = async () => {
  try {
    const res = await api.get('/api/dropdown-options/geographic/1');
    Object.assign(geographic, res.data);
  } catch (e) {
    console.error('Failed to load geographic data', e);
    toast.error('No se pudieron cargar los datos geográficos');
  }
};

onMounted(async () => {
  await loadGeographic();
  if (props.initial) {
    setFromInitial(props.initial);
  }
});

watch(() => props.initial, (v) => {
  if (v) setFromInitial(v);
});

function setFromInitial(init) {
  localForm.direccion_id = init.direccion_id || null;
  localForm.pais_id = init.pais_id || 1;
  localForm.region_id = init.region?.region_id || init.region_id || null;
  localForm.provincia_id = init.provincia?.provincia_id || init.provincia_id || null;
  localForm.municipio_id = init.municipio?.municipio_id || init.municipio_id || null;
  localForm.distrito_id = init.distrito?.distrito_id || init.distrito_id || null;
  localForm.sector_id = init.sector?.sector_id || init.sector_id || null;
  localForm.calle = init.calle || '';
}

const onRegionChange = () => {
  localForm.provincia_id = null;
  localForm.municipio_id = null;
  localForm.distrito_id = null;
  localForm.sector_id = null;
};

const onProvinciaChange = () => {
  localForm.municipio_id = null;
  localForm.distrito_id = null;
  localForm.sector_id = null;
};

const onMunicipioChange = () => {
  localForm.distrito_id = null;
  localForm.sector_id = null;
};

const onDistritoChange = () => {
  localForm.sector_id = null;
};

const onSave = async () => {
  if (!userId.value) {
    toast.error('Usuario no autenticado');
    return;
  }
  if (!localForm.calle || !localForm.provincia_id || !localForm.municipio_id) {
    toast.error('Completa al menos provincia, municipio y la calle');
    return;
  }

  saving.value = true;
  try {
    const current = {
      direccion_id: localForm.direccion_id || null,
      pais_id: 1,
      region_id: localForm.region_id,
      provincia_id: localForm.provincia_id,
      municipio_id: localForm.municipio_id,
      distrito_id: localForm.distrito_id,
      sector_id: localForm.sector_id,
      calle: localForm.calle
    };

    const merged = (props.existingAddresses || []).map(a => ({
      direccion_id: a.direccion_id,
      pais_id: 1,
      region_id: a.region?.region_id || null,
      provincia_id: a.provincia?.provincia_id || null,
      municipio_id: a.municipio?.municipio_id || null,
      distrito_id: a.distrito?.distrito_id || null,
      sector_id: a.sector?.sector_id || null,
      calle: a.calle
    }));

    if (current.direccion_id) {
      const idx = merged.findIndex(x => x.direccion_id === current.direccion_id);
      if (idx !== -1) merged[idx] = current;
      else merged.push(current);
    } else {
      merged.push(current);
    }

    const res = await api.put(`/api/users/${userId.value}/addresses`, { addresses: merged });
    toast.success('Dirección guardada exitosamente');

    // emit saved so parent can reload/select
    emit('saved', res.data);
  } catch (e) {
    console.error('Error saving address', e);
    toast.error('Error guardando la dirección');
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.v-select-custom { --vs-border: 1px solid #ebe6e6; border-radius: 8px; }
.v-select-custom .vs__dropdown-toggle { min-height:44px; padding:8px 12px; border-radius:8px; }
.v-select-custom .vs__selected { color: #111827; }
.v-select-custom .vs__placeholder { color: #9aa1a6; }

.brand-btn {
  background-color: #B70000; color: white; padding: 0.75rem 1.5rem;
  border-radius: 8px; font-weight: 600; transition: all 0.3s ease;
  display: inline-flex; align-items: center; gap: 0.5rem; text-decoration: none;
}

.brand-btn:hover {
  background-color: #930000;
  color: white;
}

.section-title { font-size: 1.1rem; font-weight: 700; }
.btn-close { background: none; border: none; color: #6c757d; }
</style>