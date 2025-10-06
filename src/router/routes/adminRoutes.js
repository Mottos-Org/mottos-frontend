import AdminMenu from "../../pages/adminPages/AdminMenu.vue"
import AdminPostList from "../../pages/adminPages/AdminPostList.vue"
import AdminPostDetail from "../../pages/adminPages/AdminPostDetail.vue"
import AdminDashboard from "../../pages/adminPages/AdminDashboard.vue"

export const adminRoutes = [
    {
        path: '/auth/admin/menu',
        name: 'Menu de Administrador',
        component: AdminMenu,
        meta: { requiresAuth: true }
    },
    {
        path: '/auth/admin/publicaciones/pending',
        name: 'Lista de Publicaciones Pendientes',
        component: AdminPostList,
        meta: { requiresAuth: true }
    },
    {
        path: '/auth/admin/publicaciones/approve/:id',
        name: 'Detalle de Publicación (admin)',
        component: AdminPostDetail,
        meta: { requiresAuth: true }
    },
    {
        path: '/auth/admin/dashboard',
        name: 'Dashboard General (admin)',
        component: AdminDashboard,
        meta: { requiresAuth: true }
    }
]
