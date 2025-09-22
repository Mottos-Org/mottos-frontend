import PublicacionesList from "../../pages/publicacionesPages/PublicacionesList.vue"
import PostDetails from "../../pages/publicacionesPages/PostDetails.vue"
import CreatePublicacion from "../../components/ui/posts/CreatePublicacion.vue"
import EditPost from "../../pages/publicacionesPages/EditPost.vue"

export const postRoutes = [
    {
        path: '/motos/publicaciones',
        name: 'Publicaciones',
        component: PublicacionesList
    },
    {
        path: '/motos/publicacion/:id',
        name: 'PostDetails',
        component: PostDetails,
        props: true
    },
    {
        path: '/motos/publicacion/crear',
        name: 'CreatePublicacion',
        component: CreatePublicacion,
        meta: { requiresAuth: true }
    },
    {
        path: '/motos/publicacion/:id/editar',
        name: 'EditPublicacion',
        component: EditPost,
        meta: { requiresAuth: true }
    }
]
