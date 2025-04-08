<template>
    <router-view v-slot="{ Component }">
        <Transition :name="$route.meta.transition || 'route-fade'" mode="out-in">
            <component :is="Component" :key="$route.fullPath" />
        </Transition>
    </router-view>
</template>

<script setup>
import { useRoute } from 'vue-router'
const $route = useRoute()
</script>

<style scoped>
.route-fade-enter-active,
.route-fade-leave-active {
    transition: opacity 0.3s, transform 0.3s;
}

.route-fade-enter-from {
    opacity: 0;
    transform: translateX(-50px);
}

.route-fade-leave-to {
    opacity: 0;
    transform: translateX(50px);
}
</style>