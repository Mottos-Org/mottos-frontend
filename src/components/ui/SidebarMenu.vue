<template>
    <transition name="fade-expand">
        <div>
            <motion.div :initial="{ opacity: 0, y: 30 }" :animate="{ opacity: 1, y: 0 }" :exit="{ opacity: 0, y: 30 }"
                :transition="{ duration: 0.5 }">
                <div v-if="loading" class="loader-container">
                    <pulse-loader :loading="loading" color="#d63636" size="15px" />
                </div>
                <div v-else class="text-center mb-4">
                    <img v-if="auth.user?.profile?.foto_perfil" :src="auth.user?.profile?.foto_perfil_url"
                        alt="Foto de perfil" class="rounded-circle mb-2" style="width: 125px; height: 125px;" />
                    <img v-else class="rounded-circle mb-2" src="/default_profile_pic.png" alt="Foto de perfil"
                        style="width: 125px;" />
                    <h5 class="fw-bold mb-0">{{ auth.user?.user?.nombres }}</h5>
                    <small class="text-muted" style="line-break: anywhere;">{{ auth.user?.user?.email }}</small>

                    <div v-if="!auth.isFullyVerified" class="verification-pending-btn mt-3 mb-2"
                        @click="$emit('switch-tab', 'verification')">
                        <i class="bi bi-exclamation-triangle me-2"></i>
                        Verificación pendiente
                    </div>

                    <button class="btn btn-outline-danger w-100 mt-3" @click="showConfirmLogout = true">
                        <i class="bi bi-box-arrow-left me-2"></i>Cerrar sesión
                    </button>
                </div>
            </motion.div>
            <hr />
            <motion.div :initial="{ opacity: 0, y: 30 }" :animate="{ opacity: 1, y: 0 }" :exit="{ opacity: 0, y: 30 }"
                :transition="{ duration: 0.5 }">
                <div>
                    <h6 class="text-uppercase text-muted small fw-bold">Menú de Cuenta</h6>
                    <ul class="nav flex-column mt-3">
                        <li class="nav-item" v-for="tab in sidebarTabs" :key="tab.id">
                            <a href="#" class="nav-link d-flex align-items-center" :class="{
                                'active-tab': activeTab === tab.id
                            }" @click.prevent="$emit('switch-tab', tab.id)">
                                <i :class="tab.icon" class="me-2"></i> {{ tab.label }}
                            </a>
                        </li>
                    </ul>
                </div>
            </motion.div>
        </div>
    </transition>
    <teleport to="body">
        <transition name="fade-modal">
            <div v-if="showConfirmLogout" class="modal-overlay">
                <div class="modal-box">
                    <div class="modal-icon">
                        <div class="icon-circle">
                            <i class="bi bi-box-arrow-right"></i>
                        </div>
                    </div>
                    <h4 class="modal-title">¿Estás seguro?</h4>
                    <p class="modal-subtitle">¿Deseas cerrar tu sesión?</p>
                    <div class="modal-actions">
                        <button class="btn cancel-btn" @click="showConfirmLogout = false">Cancelar</button>
                        <button class="btn logout-btn" @click="confirmLogout">Cerrar sesión</button>
                    </div>
                </div>
            </div>
        </transition>
    </teleport>
</template>

<script setup>
import { motion } from 'motion-v'
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../../stores/authStore';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';

defineProps({
    activeTab: String,
});

const toast = useToast();
const router = useRouter();
const auth = useAuthStore();
const showConfirmLogout = ref(false);
const emit = defineEmits(['switch-tab']);
const loading = ref(true);

const sidebarTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bi bi-clock-history' },
    { id: 'profile', label: 'Información de Perfil', icon: 'bi bi-person-circle' },
    { id: 'settings', label: 'Preferencias y Ajustes', icon: 'bi bi-gear' },
    { id: 'publications', label: 'Mis Publicaciones', icon: 'fa fa-motorcycle' },
    { id: 'favorites', label: 'Favoritos', icon: 'bi bi-heart' },
    { id: 'messages', label: 'Mensajes', icon: 'bi bi-envelope' },
];

function confirmLogout() {
    auth.clearAuth();
    toast.warning('Has cerrado la sesión...');
    router.push('/auth/login');
    showConfirmLogout.value = false;
}

onMounted(async () => {
    try {
        await auth.fetchUserInfo();
        await auth.fetchVerificationStatus();
    } catch (error) {
        toast.error('Error al obtener la información del usuario');
        console.error(error);
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
.loader-container {
    height: 100%;
    min-height: 250px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.nav-link {
    color: #333;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    transition: background-color 0.2s ease;
}

.nav-link:hover {
    background-color: #ebebebbe;
    transition: all 0.3s ease;
}

.active-tab {
    background-color: #d63636;
    color: white !important;
}

.nav-link.active-tab:hover {
    background-color: #d63636;
    color: white !important;
}

a:hover {
    color: #d63636 !important;
    transition: all 0.3s ease;
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
    padding: 2rem;
    border-radius: 1rem;
    width: 100%;
    max-width: 420px;
    text-align: center;
    box-shadow: 0 4px 40px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
}

.modal-icon {
    margin-bottom: 1rem;
}

.icon-circle {
    background-color: #fef2f2;
    color: #dc2626;
    border-radius: 9999px;
    width: 3.5rem;
    height: 3.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    margin: 0 auto;
}

.modal-title {
    font-weight: 700;
    font-size: 1.25rem;
    color: #111;
    margin-bottom: 0.25rem;
}

.modal-subtitle {
    font-size: 0.95rem;
    color: #6b7280;
    margin-bottom: 1.5rem;
}

.modal-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
}

.cancel-btn {
    background: white;
    border: 1px solid #d1d5db;
    color: #111;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-weight: 600;
    transition: all 0.2s ease;
}

.cancel-btn:hover {
    background-color: #f3f4f6;
}

.logout-btn {
    background-color: #dc2626;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    border: none;
    font-weight: 600;
    transition: all 0.2s ease;
}

.logout-btn:hover {
    background-color: #b91c1c;
}

.fade-modal-enter-active,
.fade-modal-leave-active {
    transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-modal-enter-from,
.fade-modal-leave-to {
    opacity: 0;
    transform: scale(0.95);
}

.fade-expand-enter-active,
.fade-expand-leave-active {
    transition: all 0.3s ease;
    overflow: hidden;
}

.fade-expand-enter-from,
.fade-expand-leave-to {
    max-height: 0;
    opacity: 0;
}

.fade-expand-enter-to,
.fade-expand-leave-from {
    max-height: 500px;
    opacity: 1;
}

.verification-pending-btn {
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.75rem 1rem;
    font-weight: 600;
    font-size: 0.9rem;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(251, 191, 36, 0.3);
}

.verification-pending-btn:hover {
    background: linear-gradient(135deg, #f59e0b, #d97706);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4);
    transition: all 0.5s ease;
}
</style>