<template>
    <div class="container-fluid">
        <div class="row">
            <!-- Sidebar -->
            <div class="col-md-3 col-lg-2 bg-white border-end vh-100 p-3 sidebar-container">
                <SidebarMenu :activeTab="activeTab" @switch-tab="switchTab" />
            </div>

            <!-- Main Content -->
            <div class="col-md-9 col-lg-10 p-4 bg-light">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h1 class="h4 fw-bold text-danger">Centro de Usuario</h1>
                    <small class="text-muted">Gestiona todo tipo de detalles sobre tu cuenta</small>
                </div>

                <!-- Tab Content -->
                <div class="tab-content bg-white rounded shadow-sm">
                    <Transition name="fade" mode="out-in">
                        <component
                            :is="getCurrentTabComponent()"
                            :switchTab="switchTab"
                        />
                    </Transition>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import SidebarMenu from '@/components/ui/SidebarMenu.vue';
import DashboardHome from '@/pages/userPages/profileTabs/DashboardHome.vue';
import MyProfile from '@/pages/userPages/profileTabs/MyProfile.vue';
import MyPublications from '@/pages/userPages/profileTabs/MyPublications.vue';
import MyMessages from '@/pages/userPages/profileTabs/MyMessages.vue';
import MyFavorites from '@/pages/userPages/profileTabs/MyFavorites.vue';
import MyPreferences from './profileTabs/MyPreferences.vue';
import AccountVerification from './profileTabs/AccountVerification.vue';
import MyGarage from './profileTabs/MyGarage.vue';
import PostMessages from './profileTabs/PostMessages.vue';

const activeTab = ref('dashboard');
const switchTab = (tabId) => { activeTab.value = tabId; };

const tabs = [
    { id: 'dashboard', component: DashboardHome },
    { id: 'my-garage', component: MyGarage },
    { id: 'profile', component: MyProfile },
    { id: 'publications', component: MyPublications },
    { id: 'messages', component: MyMessages },
    { id: 'favorites', component: MyFavorites },
    { id: 'settings', component: MyPreferences },
    { id: 'verification', component: AccountVerification },
    { id: 'post-messages', component: PostMessages },
];

const getCurrentTabComponent = () =>
    tabs.find((t) => t.id === activeTab.value)?.component || null;
</script>

<style scoped>
.tab-content {
    min-height: 300px;
}

@media (max-width: 768px) {
    .sidebar-container {
        height: fit-content !important;
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from {
    opacity: 0;
    transform: translateX(-50px);
}

.fade-leave-to {
    opacity: 0;
    transform: translateX(50px);
}
</style>