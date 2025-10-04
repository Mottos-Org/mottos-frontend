<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-3 col-lg-2 bg-white border-end vh-100 p-3 admin-sidebar-container">
                <div class="admin-sidebar-header text-center mb-4">
                    <div class="admin-logo mb-2">
                        <i class="bi bi-shield-lock-fill"></i>
                    </div>
                    <h5 class="fw-bold mb-0">{{ sidebarTitle }}</h5>
                    <small class="text-muted">{{ sidebarSubtitle }}</small>
                </div>
                <ul class="nav flex-column admin-nav">
                    <li v-for="tab in tabs" :key="tab.id" class="nav-item">
                        <a href="#" class="nav-link d-flex align-items-center"
                            :class="{ 'active-admin-tab': activeTab === tab.id }" @click.prevent="switchTab(tab.id)">
                            <i :class="tab.icon" class="me-2"></i>
                            {{ tab.label }}
                        </a>
                    </li>
                </ul>
            </div>

            <div class="col-md-9 col-lg-10 p-4 bg-light">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h1 class="h4 fw-bold text-danger mb-0">
                        {{ getCurrentTabTitle() }}
                    </h1>
                </div>
                <div class="admin-tab-content bg-white rounded shadow-sm p-5 text-center">
                    <Transition name="fade" mode="out-in">
                        <component :is="getCurrentTabComponent()" :key="activeTab" />
                    </Transition>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
    sidebarTitle: { type: String, default: 'Panel Admin' },
    sidebarSubtitle: { type: String, default: 'Gestión de Publicaciones' },
    tabs: { type: Array, required: true }
});

const activeTab = ref(props.tabs[0]?.id || '');

function switchTab(tabId) {
    activeTab.value = tabId;
}

function getCurrentTabTitle() {
    return props.tabs.find(tab => tab.id === activeTab.value)?.label || '';
}

function getCurrentTabComponent() {
    return props.tabs.find(tab => tab.id === activeTab.value)?.component || null;
}

watch(
    () => props.tabs,
    (newTabs) => {
        if (!newTabs.some(tab => tab.id === activeTab.value)) {
            activeTab.value = newTabs[0]?.id || '';
        }
    }
);
</script>

<style scoped>
.admin-sidebar-container {
    min-height: 100vh;
    border-right: 2px solid #f3f3f3;
    background: #fff;
    padding-top: 2rem;
}

.admin-sidebar-header .admin-logo {
    font-size: 2.5rem;
    color: #d63636;
    background: #f8d7da;
    border-radius: 50%;
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 0.5rem auto;
}

.admin-nav .nav-link {
    color: #333;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    margin-bottom: 0.5rem;
    font-weight: 500;
    transition: background 0.2s, color 0.2s;
}

.admin-nav .nav-link:hover {
    background: #f8d7da;
    color: #d63636;
}

.active-admin-tab {
    background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
    color: #fff !important;
}

.admin-nav .nav-link.active-admin-tab:hover {
    background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
    color: #fff !important;
}

.admin-tab-content {
    min-height: 350px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from {
    opacity: 0;
    transform: translateY(30px);
}

.fade-leave-to {
    opacity: 0;
    transform: translateY(-30px);
}

@media (max-width: 768px) {
    .admin-sidebar-container {
        min-height: unset;
        padding-top: 1rem;
    }
}
</style>