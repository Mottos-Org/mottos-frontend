import PublicacionesList from "../../pages/publicacionesPages/PublicacionesList.vue"
import PostDetails from "../../pages/publicacionesPages/PostDetails.vue"

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
    }
]
