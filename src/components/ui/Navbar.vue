<template>
    <nav class="navbar-container">
        <div class="top-side">
            <div class="logo" style="margin-left: 7.5%">
                <img src="/mottos-logo.png" alt="Mottos" class="logo-image" />
            </div>
            <motion.button class="hamburger" :whileHover="{ scale: 1.1 }" :whilePress="{ scale: 0.95 }"
                @click="showMobileMenu = !showMobileMenu">
                <i class="fas fa-bars"></i>
            </motion.button>
            <div class="publish-btn desktop-only" style="margin-right: 7.5%">
                <i class="icon-moto fa fa-motorcycle"></i>
                <h2>PUBLICA TU MOTO</h2>
            </div>
        </div>
        <div class="bottom-side" :class="{ 'mobile-show': showMobileMenu }">
            <div class="nav-links" style="margin-left: 7.5%">
                <div v-for="(item, index) in moduleLinks" :key="`module-${index}`" class="nav-item">
                    <router-link :to="item.path" class="nav-link" :class="{ 'highlighted': isActiveRoute(item.path) }">
                        <i :class="{ 'highlighted': isActiveRoute(item.path) }"></i>
                        {{ item.label }}
                        <span class="underline-animation"></span>
                    </router-link>
                </div>
            </div>
            <div class="nav-links" style="margin-right: 7.5%">
                <div v-for="(item, index) in authLinks" :key="`auth-${index}`" class="nav-item">
                    <router-link :to="item.path" class="nav-link" :class="{ 'highlighted': isActiveRoute(item.path) }">
                        <i :class="{ 'highlighted': isActiveRoute(item.path) }"></i>
                        {{ item.label }}
                        <span class="underline-animation"></span>
                    </router-link>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { ref, computed } from 'vue';
import { motion } from 'motion-v';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../../stores/authStore';

const auth = useAuthStore();
const route = useRoute();
const showMobileMenu = ref(false);

const moduleLinks = ref([
    { path: '/', label: 'INICIO' },
    { path: '/motos', label: 'PUBLICACIONES' },
    { path: '/contacto', label: 'CONTACTO' },
]);

const isActiveRoute = (path) => {
    return path === '/' ? route.path === '/' : route.path.startsWith(path);
};

const authLinks = computed(() => {
    return auth.isLoggedIn
        ? [{ path: '/auth/mi-cuenta', label: 'MI CUENTA' }]
        : [
              { path: '/auth/login', label: 'INICIAR SESIÓN' },
              { path: '/auth/register', label: 'REGISTRO' },
          ];
});
</script>

<style scoped>
.navbar-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    background-color: #1c1c1c;
    color: #fff;
    /* margin-bottom: 5%; */
}

.navbar-container .top-side {
    width: 100%;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #33373B;
}

.navbar-container .bottom-side {
    width: 100%;
}

.logo-image {
    height: 50px;
    width: auto;
    margin-right: 1rem;
}

.nav-links {
    display: flex;
    list-style: none;
    gap: 1.5rem;
}

.publish-btn {
    background-color: #b70000;
    color: #fff;
    border: none;
    padding: 14.5px 12.5px;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 3px;
}

.publish-btn h2 {
    margin: 0;
    font-weight: 700;
    font-size: 14px;
}

.publish-btn:hover {
    transform: scale(1.1);
    background-color: #d80000;
}

.publish-btn .icon-moto {
    margin-right: 0.5rem;
}

.bottom-side {
    padding: 7.5px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.nav-links a {
    color: #fff;
    text-decoration: none;
    font-weight: 700;
    font-size: 14px;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 5px;
}

.nav-link {
    position: relative;
    padding: 5px;
    transition: all 0.3s ease;
}

.nav-link:hover {
    color: #dc2626;
    transform: scale(1.05);

}

.highlighted {
    color: #8b0000 !important;
}

.underline-animation {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #dc2626;
    transform: scaleX(0);
    transition: transform 0.3s;
    transform-origin: left;
}

.nav-link:hover .underline-animation {
    transform: scaleX(1);
}

.hamburger {
    display: none;
    background: none;
    border: none;
    color: white;
    font-size: 1.8rem;
    cursor: pointer;
    padding: 0 1rem;
    transition: all 0.3s ease;
}

.hamburger:hover {
    color: #dc2626;
    /* transform: scale(1.1); */
}

.desktop-only {
    display: flex;
}

@media screen and (max-width: 768px) {
    .bottom-side {
        max-height: 0;
        overflow: hidden;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: max-height 0.4s ease, opacity 0.3s ease, transform 0.3s ease, visibility 0.3s;
        flex-direction: column;
        gap: 1rem;
        padding: 0 1rem;
        align-items: flex-end;
    }

    .bottom-side.mobile-show {
        max-height: 500px;
        opacity: 1;
        transform: translateY(0);
        visibility: visible;
        padding: 1rem;
    }

    .hamburger {
        display: block;
    }

    .desktop-only {
        display: none;
    }

    .nav-links {
        flex-direction: column;
        align-items: flex-end;
        margin: 0;
        gap: 0.5rem;
        margin-left: unset !important;
        margin-right: unset !important;
    }

    .nav-item {
        width: 100%;
    }

    .nav-link {
        text-align: right;
        width: 100%;
        padding: 0.75rem 1rem;
    }
}
</style>