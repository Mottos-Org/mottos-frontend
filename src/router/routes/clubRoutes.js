import ClubList from "../../pages/clubPages/ClubList.vue"
import CreateClub from "../../pages/clubPages/CreateClub.vue"
import EditClub from "../../pages/clubPages/EditClub.vue"
import ClubDetail from "../../pages/clubPages/ClubDetail.vue"

export const clubRoutes = [
    {
        path: '/clubes',
        name: 'ClubList',
        component: ClubList
    },
    {
        path: '/clubes/crear',
        name: 'CreateClub',
        component: CreateClub,
        meta: { 
            requiresAuth: true // Private route for garage context
        },
    },
    {
        path: '/clubes/:id',
        name: 'ClubDetail',
        component: ClubDetail
    },
    {
        path: '/clubes/:id/editar',
        name: 'EditClub',
        component: EditClub,
        meta: { 
            requiresAuth: true // Private route for garage context
        },
    },
]