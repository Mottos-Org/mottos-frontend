import NotFound from '../pages/NotFound.vue'
import { useToast } from 'vue-toastification';
import { authRoutes } from './routes/authRoutes'
import { postRoutes } from './routes/postRoutes'
import { useAuthStore } from '../stores/authStore'
import { createRouter, createWebHistory } from 'vue-router'

const toast = useToast();

const routes = [
    ...authRoutes,
    ...postRoutes,
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    
    if (requiresAuth && !authStore.isLoggedIn) {
        toast.warning("Debes iniciar sesión para acceder a esta página.");
        next({ path: '/auth/login' });
    } else {
        next();
    }
});

export default router
