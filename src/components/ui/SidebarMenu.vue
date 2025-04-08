<template>
    <div>
        <div class="text-center mb-4">
            <img class="rounded-circle mb-2" src="https://via.placeholder.com/80" alt="Profile" />
            <h5 class="fw-bold mb-0">Winston Pichardo</h5>
            <small class="text-muted">winstonpichardo1420@gmail.com</small>
            <button class="btn btn-outline-danger w-100 mt-3">
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
</template>

<script setup>
defineProps({
    activeTab: String,
});

const sidebarTabs = [
    { id: 'dashboard', label: 'Cuenta', icon: 'bi bi-person' },
    { id: 'profile', label: 'Perfil', icon: 'bi bi-person-circle' },
    { id: 'publications', label: 'Mis Publicaciones', icon: 'bi bi-motorcycle' },
    { id: 'messages', label: 'Mensajes', icon: 'bi bi-envelope' },
    { id: 'favorites', label: 'Favoritos', icon: 'bi bi-heart' },
    { id: 'events', label: 'Eventos', icon: 'bi bi-calendar-event' },
];
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
</style>