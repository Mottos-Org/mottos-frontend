<template>
    <div class="container-fluid">
        <div class="dashboard-header">
            <h1 class="mb-2 fw-bold">Menú de Administrador</h1>
            <p class="mb-4 text-muted">Gestiona usuarios, publicaciones y estadísticas del sitio.</p>
        </div>
        <div class="row g-4">
            <div class="col-md-3" v-for="option in adminOptions" :key="option.title">
                <AdminMenuCard
                    :title="option.title"
                    :icon="option.icon"
                    :description="option.description"
                    :to="option.to"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import AdminMenuCard from '@/components/ui/admin/AdminMenuCard.vue';

const adminOptions = [
    {
        title: 'Dashboard General',
        icon: 'bi bi-speedometer2',
        description: 'Visión general de estadísticas y actividad del sitio.',
        to: '/auth/admin/dashboard'
    },
    {
        title: 'Publicaciones pendientes por aprobar',
        icon: 'bi bi-file-earmark-text',
        description: 'Gestiona y modera las publicaciones pendientes.',
        to: '/auth/admin/publicaciones/pending'
    },
    {
        title: 'Usuarios',
        icon: 'bi bi-people',
        description: 'Administra los usuarios registrados y sus permisos.',
        to: '/admin/usuarios'
    },
    {
        title: 'Notificaciones Masivas',
        icon: 'bi bi-megaphone',
        description: 'Envía notificaciones/boletines a todos los usuarios.',
        to: '/admin/notificaciones'
    },
    {
        title: 'Reportes',
        icon: 'bi bi-flag',
        description: 'Visualiza y gestiona reportes de contenido o usuarios.',
        to: '/admin/reportes'
    }
];
</script>

<style scoped>
.container-fluid {
    padding: 10%;
}

.dashboard-header {
    margin-bottom: 100px;
    text-align: left;
}
</style>