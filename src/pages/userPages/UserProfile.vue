<template>
    <div class="container-fluid">
        <div class="row">
            <!-- Sidebar -->
            <div class="col-md-3 col-lg-2 bg-white border-end vh-100 p-3">
                <SidebarMenu :activeTab="activeTab" @switch-tab="switchTab" />
            </div>

            <!-- Main Content -->
            <div class="col-md-9 col-lg-10 p-4 bg-light">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h1 class="h4 fw-bold text-danger">Dashboard</h1>
                    <small class="text-muted">Gestiona tus publicaciones y actividad</small>
                </div>

                <!-- Tab Content -->
                <div class="tab-content bg-white p-4 rounded shadow-sm">
                    <component :is="getCurrentTabComponent()" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import SidebarMenu from '@/components/ui/SidebarMenu.vue';

import DashboardHome from '@/pages/userPages/profileTabs/DashboardHome.vue';
import MyProfile from '@/pages/userPages/profileTabs/MyProfile.vue';
import MyPublications from '@/pages/userPages/profileTabs/MyPublications.vue';
import MyMessages from '@/pages/userPages/profileTabs/MyMessages.vue';
import MyFavorites from '@/pages/userPages/profileTabs/MyFavorites.vue';
import MyEvents from '@/pages/userPages/profileTabs/MyEvents.vue';

const activeTab = ref('dashboard');

const switchTab = (tabId) => {
    activeTab.value = tabId;
};

const tabs = [
    { id: 'dashboard', component: DashboardHome },
    { id: 'profile', component: MyProfile },
    { id: 'publications', component: MyPublications },
    { id: 'messages', component: MyMessages },
    { id: 'favorites', component: MyFavorites },
    { id: 'events', component: MyEvents },
];

const getCurrentTabComponent = () =>
    tabs.find((t) => t.id === activeTab.value)?.component || null;
</script>

<style scoped>
.tab-content {
    min-height: 300px;
}
</style>