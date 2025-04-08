import { createRouter, createWebHistory } from 'vue-router'
import { authRoutes } from './routes/authRoutes'
import NotFound from '../pages/NotFound.vue'

const routes = [
    ...authRoutes,
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
