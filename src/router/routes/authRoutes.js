import Login from '../../pages/authPages/Login.vue'
import Register from '../../pages/authPages/Register.vue'
import UserProfile from '../../pages/userPages/UserProfile.vue'

export const authRoutes = [
    {
        path: '/auth/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/auth/register',
        name: 'Register',
        component: Register
    },
    {
        path: '/auth/mi-cuenta',
        name: 'Mi cuenta',
        component: UserProfile
    }
]
