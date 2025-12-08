import MarketPosts from "../../pages/marketplacePages/MarketPosts.vue"
import MarketPostDetails from "../../pages/marketplacePages/MarketPostDetails.vue"
import CreateMarketPost from "../../pages/marketplacePages/CreateMarketPost.vue"
import EditMarketPost from "../../pages/marketplacePages/EditMarketPost.vue"

export const marketplaceRoutes = [
    {
        path: '/mercado/publicaciones',
        name: 'Publicaciones del Mercado',
        component: MarketPosts
    },
    {
        path: '/mercado/publicaciones/:id',
        name: 'MarketPostDetails',
        component: MarketPostDetails
    },
    {
        path: '/mercado/publicacion/crear',
        name: 'CreateMarketPost',
        component: CreateMarketPost,
        meta: { requiresAuth: true }
    },
    {
        path: '/mercado/publicacion/:id/editar',
        name: 'EditMarketPost',
        component: EditMarketPost,
        meta: { requiresAuth: true }
    }
]
