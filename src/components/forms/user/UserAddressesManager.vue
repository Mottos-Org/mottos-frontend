<template>
  <div class="addresses-manager w-100">
    <div class="card p-3 mb-3 header-card">
      <div class="header-row">
        <div class="header-badge">
          <i class="bi bi-bookmark-fill"></i>
        </div>
        <div class="header-texts">
          <h4 class="header-title">Tus direcciones guardadas</h4>
          <p class="header-sub">Direcciones guardadas recientemente</p>
        </div>
      </div>

      <div v-if="loadingList" class="text-muted mt-3 d-flex align-items-center gap-2">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
        </div>
        Cargando tus direcciones guardadas...
      </div>

      <div v-else>
        <div v-if="addresses.length === 0" class="empty-state mt-3">
          <p>No tienes direcciones guardadas.</p>
        </div>

        <ul class="list-group mt-3">
          <li v-for="addr in addresses" :key="addr.direccion_id" class="list-group-item item-card">
            <div class="left-col">
              <div class="addr-icon">
                <i class="bi bi-house-door-fill"></i>
              </div>
            </div>

            <div class="main-col">
              <div class="addr-title"><strong>{{ addr.calle }}</strong></div>
              <div class="addr-line">
                <i class="bi bi-geo-alt-fill pin"></i>
                <span class="small text-muted">
                  {{ addr.sector?.nombre_sector || '' }}{{ addr.sector ? ' · ' : '' }}{{ addr.municipio?.nombre_municipio || '' }}
                </span>
              </div>
              <div class="addr-line small text-muted">
                {{ addr.provincia?.nombre_provincia ? addr.provincia.nombre_provincia : 'República Dominicana' }}
              </div>
            </div>

            <div class="right-col">
              <button class="icon-btn" @click="startEdit(addr)" title="Editar">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="icon-btn danger" @click="askDelete(addr)" title="Eliminar">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </li>
        </ul>

        <div class="mt-3">
          <button class="btn brand-btn" @click="openNew" v-if="!showForm">
            <i class="bi bi-plus-lg me-2"></i> Agregar nueva
          </button>
        </div>
      </div>
    </div>

    <transition name="slide-fade" mode="out-in">
      <div v-if="showForm" class="card p-3 mb-3" key="form">
        <AddUserAddressForm
          :existing-addresses="addresses"
          :initial="editing ? {
            direccion_id: form.direccion_id,
            pais_id: form.pais_id,
            region_id: form.region_id,
            provincia_id: form.provincia_id,
            municipio_id: form.municipio_id,
            distrito_id: form.distrito_id,
            sector_id: form.sector_id,
            calle: form.calle
          } : null"
          @saved="onFormSaved"
          @cancel="resetForm(true)"
        />
      </div>
    </transition>

    <transition name="slide-fade" mode="out-in">
      <div class="card p-3" key="help">
        <h5>Ayuda</h5>
        <p class="small text-muted">Usa esta sección para agregar direcciones que luego puedas seleccionar al crear publicaciones.</p>
      </div>
    </transition>

    <teleport to="body">
      <transition name="fade-modal">
        <div v-if="showDeleteModal" class="modal-overlay">
          <div class="modal-box">
            <div class="modal-icon">
              <div class="icon-circle">
                <i class="bi bi-trash"></i>
              </div>
            </div>
            <h4 class="modal-title">¿Eliminar esta dirección?</h4>
            <p class="modal-subtitle">{{ deleteTarget?.calle }}</p>
            <div class="modal-actions">
              <button class="btn cancel-btn" @click="showDeleteModal = false">Cancelar</button>
              <button class="btn logout-btn" @click="confirmDelete" :disabled="deleting">
                {{ deleting ? 'Eliminando...' : 'Eliminar' }}
              </button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue';
import { useToast } from 'vue-toastification';
import api from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import AddUserAddressForm from './AddUserAddressForm.vue';

const toast = useToast();
const auth = useAuthStore();

const addresses = ref([]);
const loadingList = ref(false);
const geoLoading = ref(false);
const geographic = reactive({ regions: [] });
const saving = ref(false);
const editing = ref(false);
const showForm = ref(false);
const formCard = ref(null);

const form = reactive({
  direccion_id: null,
  pais_id: 1,
  region_id: null,
  provincia_id: null,
  municipio_id: null,
  distrito_id: null,
  sector_id: null,
  calle: ''
});

const userId = computed(() => auth.userId || auth.user?.user_id);

const provinces = computed(() => {
  const r = geographic.regions?.find(x => x.region_id === form.region_id);
  return r?.provinces || [];
});
const municipios = computed(() => {
  const p = provinces.value.find(x => x.provincia_id === form.provincia_id);
  return p?.municipalities || [];
});
const distritos = computed(() => {
  const m = municipios.value.find(x => x.municipio_id === form.municipio_id);
  return m?.districts || [];
});
const sectores = computed(() => {
  const d = distritos.value.find(x => x.distrito_id === form.distrito_id);
  return d?.sectors || [];
});

const loadGeographic = async () => {
  geoLoading.value = true;
  try {
    const res = await api.get('/api/dropdown-options/geographic/1'); // TODO: make dynamic (default country = 1)
    Object.assign(geographic, res.data);
  } catch (e) {
    console.error('Failed to load geographic data', e);
    toast.error('No se pudieron cargar los datos geográficos');
  } finally {
    geoLoading.value = false;
  }
};

const loadAddresses = async () => {
  if (!userId.value) return;
  loadingList.value = true;
  try {
    const res = await api.get(`/api/users/${userId.value}/addresses`);
    addresses.value = res.data.addresses || [];
  } catch (e) {
    console.error('Failed to load addresses', e);
    toast.error('No se pudieron cargar tus direcciones');
  } finally {
    loadingList.value = false;
  }
};

const resetForm = (hide = true) => {
  editing.value = false;
  form.direccion_id = null;
  form.region_id = null;
  form.provincia_id = null;
  form.municipio_id = null;
  form.distrito_id = null;
  form.sector_id = null;
  form.calle = '';
  if (hide) showForm.value = false;
};

const openNew = async () => {
  resetForm(false);
  showForm.value = true;

  await nextTick();
  if (formCard.value && formCard.value.scrollIntoView) {
    formCard.value.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

const startEdit = async (addr) => {
  editing.value = true;
  form.direccion_id = addr.direccion_id;
  form.region_id = addr.region?.region_id || null;
  form.provincia_id = addr.provincia?.provincia_id || null;
  form.municipio_id = addr.municipio?.municipio_id || null;
  form.distrito_id = addr.distrito?.distrito_id || null;
  form.sector_id = addr.sector?.sector_id || null;
  form.calle = addr.calle || '';
  showForm.value = true;

  await nextTick();
  if (formCard.value && formCard.value.scrollIntoView) {
    formCard.value.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

const showDeleteModal = ref(false);
const deleteTarget = ref(null);
const deleting = ref(false);

const askDelete = (addr) => {
  deleteTarget.value = addr;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (!deleteTarget.value || !userId.value) {
    showDeleteModal.value = false;
    deleteTarget.value = null;
    return;
  }

  deleting.value = true;
  try {
    const remaining = addresses.value
      .filter(a => a.direccion_id !== deleteTarget.value.direccion_id)
      .map(a => ({
        direccion_id: a.direccion_id,
        pais_id: 1,
        region_id: a.region?.region_id || null,
        provincia_id: a.provincia?.provincia_id || null,
        municipio_id: a.municipio?.municipio_id || null,
        distrito_id: a.distrito?.distrito_id || null,
        sector_id: a.sector?.sector_id || null,
        calle: a.calle
      }));

    const res = await api.put(`/api/users/${userId.value}/addresses`, { addresses: remaining });
    toast.success(res.data.message || 'Dirección eliminada');
    await loadAddresses();
  } catch (e) {
    console.error('Error removing address', e);
    toast.error('Error eliminando la dirección');
  } finally {
    deleting.value = false;
    showDeleteModal.value = false;
    deleteTarget.value = null;
  }
};

const onFormSaved = async (resData) => {
  await loadAddresses();
  resetForm(true);
};

onMounted(async () => {
  await Promise.all([loadGeographic(), loadAddresses()]);
});
</script>

<style scoped>
.addresses-manager, 
.addresses-manager .card, 
.addresses-manager .card * { text-align: left; }

.header-card { background: #fff; border-radius: 12px; }
.header-row { display:flex; gap:14px; align-items:center; }
.header-badge {
  width:40px; height:40px; border-radius:10px;
  display:flex; align-items:center; justify-content:center;
  background:#FBEAEA; color:#B70000; font-size:18px;
  box-shadow: 0 4px 12px rgba(183,0,0,0.06);
}
.header-texts .header-title { margin:0; font-size:1.125rem; font-weight:800; }
.header-texts .header-sub { margin:0; color:#6c6f73; font-size:0.9rem; }

.list-group { padding:0; margin:0; list-style:none; }
.item-card {
  display:flex; gap:16px; align-items:center;
  border: 1px solid #f0e7e7; border-radius:12px;
  padding:16px; margin-bottom:12px; background:#fff;
  transition: transform .14s ease, box-shadow .14s ease;
}
.item-card:hover { transform: translateY(-4px); box-shadow: 0 10px 30px rgba(183,0,0,0.06); }

.addr-icon {
  width:56px; height:56px; border-radius:12px;
  background:#B70000; color:#fff; display:flex;
  align-items:center; justify-content:center; font-size:20px;
  box-shadow: 0 6px 18px rgba(183,0,0,0.12);
}
.left-col { flex: 0 0 auto; }

.main-col { flex: 1 1 auto; min-width:0; }
.addr-title { font-size:1.05rem; margin-bottom:6px; }
.addr-line { display:flex; align-items:center; gap:8px; margin-bottom:4px; color:#6c6f73; }
.addr-line .pin { color:#B70000; font-size:0.95rem; }

.right-col { display:flex; gap:8px; align-items:center; }
.icon-btn {
  width:40px; height:40px; border-radius:10px; border:1px solid #f4eaea;
  background:#fff; color:#6b6b6b; display:inline-flex; align-items:center; justify-content:center;
  cursor:pointer; transition: all .12s ease;
}
.icon-btn:hover { transform: translateY(-3px); background:#fff0f0; color:#b70000; border-color:#f4dcdc; }
.icon-btn.danger:hover { background:#ffeceb; color:#b70000; }

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.32s cubic-bezier(.2,.8,.2,1);
}
.slide-fade-enter-from, .slide-fade-leave-to {
  opacity: 0; transform: translateY(12px);
}
.slide-fade-enter-to, .slide-fade-leave-from {
  opacity: 1; transform: translateY(0);
}

.brand-btn {
  background-color: #B70000; color: white; padding: 0.75rem 1.5rem;
  border-radius: 8px; font-weight: 600; transition: all 0.3s ease;
  display: inline-flex; align-items: center; gap: 0.5rem; text-decoration: none;
}

.brand-btn:hover {
  background-color: #930000;
  color: white;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  transition: all 0.3s ease;
}
.modal-box {
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  width: 100%;
  max-width: 420px;
  text-align: center;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15);
}
.modal-icon { margin-bottom: 0.75rem; }
.icon-circle {
  background-color: #fef2f2;
  color: #b91c1c;
  border-radius: 9999px;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  margin: 0 auto;
}
.modal-title { font-weight: 700; font-size: 1.05rem; margin-bottom: 0.25rem; }
.modal-subtitle { font-size: 0.95rem; color: #6b7280; margin-bottom: 1rem; }
.modal-actions { display: flex; justify-content: center; gap: 0.75rem; }
.cancel-btn {
  background: white;
  border: 1px solid #d1d5db;
  color: #111;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
}
.cancel-btn:hover { background-color: #f3f4f6; }
.logout-btn {
  background-color: #dc2626;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 600;
}
.logout-btn[disabled] { opacity: 0.7; cursor: default; }
.fade-modal-enter-active, .fade-modal-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.fade-modal-enter-from, .fade-modal-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

.v-select-custom { --vs-border: 1px solid #ebe6e6; border-radius: 8px; }
.v-select-custom .vs__dropdown-toggle { min-height:44px; padding:8px 12px; border-radius:8px; }
.v-select-custom .vs__selected { color: #111827; }
.v-select-custom .vs__placeholder { color: #9aa1a6; }
</style>