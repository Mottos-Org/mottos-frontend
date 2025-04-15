<template>
    <div>
        <div class="text-center mb-4">
            <img class="rounded-circle mb-2" src="https://via.placeholder.com/80" alt="Profile" />
            <h5 class="fw-bold mb-0">Winston Pichardo</h5>
            <small class="text-muted">winstonpichardo1420@gmail.com</small>
            <button class="btn btn-outline-danger w-100 mt-3" @click="showConfirmLogout = true">
                <i class="bi bi-box-arrow-left me-2"></i>Cerrar sesión
            </button>
        </div>
        <hr />
        <div>
            <h6 class="text-uppercase text-muted small fw-bold">Menú principal</h6>
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
    </div>
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
import { ref } from 'vue';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/authStore';

defineProps({
    activeTab: String,
});

const toast = useToast();
const router = useRouter();
const auth = useAuthStore();

const showConfirmLogout = ref(false);

const sidebarTabs = [
    { id: 'dashboard', label: 'Cuenta', icon: 'bi bi-person' },
    { id: 'profile', label: 'Perfil', icon: 'bi bi-person-circle' },
    { id: 'publications', label: 'Mis Publicaciones', icon: 'bi bi-motorcycle' },
    { id: 'messages', label: 'Mensajes', icon: 'bi bi-envelope' },
    { id: 'favorites', label: 'Favoritos', icon: 'bi bi-heart' },
    { id: 'events', label: 'Eventos', icon: 'bi bi-calendar-event' },
];

function confirmLogout() {
    auth.clearAuth();
    toast.warning('Has cerrado la sesión...');
    router.push('/auth/login');
    showConfirmLogout.value = false;
}
</script>

<style scoped>
.nav-link {
    color: #333;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    transition: background-color 0.2s ease;
}

.nav-link:hover {
    background-color: #f8f9fa;
}

.active-tab {
    background-color: #d63636;
    color: white !important;
}

.active-tab i {
    color: white !important;
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
</style>