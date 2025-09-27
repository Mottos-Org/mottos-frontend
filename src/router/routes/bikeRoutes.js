import BikeDetails from '../../pages/bikePages/BikeDetails.vue'

export const bikeRoutes = [
    {
        path: '/motos/:id',
        name: 'BikeDetails',
        component: BikeDetails,
        meta: { 
            requiresAuth: false // Public route, but owner gets special permissions
        },
        props: true
    },
    {
        path: '/mi-garaje/:id',
        name: 'MyBikeDetails',
        component: BikeDetails,
        meta: { 
            requiresAuth: true // Private route for garage context
        },
        props: true
    }
]