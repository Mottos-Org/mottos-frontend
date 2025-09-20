import NewsList from '../../pages/newsPages/NewsList.vue';
import NewsDetail from '../../pages/newsPages/NewsDetail.vue';
import UnsubscribeNewsLetter from '../../pages/newsPages/UnsubscribeNewsLetter.vue';
import CreateArticle from '../../pages/newsPages/CreateArticle.vue';
import EditArticle from '../../pages/newsPages/EditArticle.vue';

export const newsRoutes = [
    {
        path: '/noticias',
        name: 'Noticias',
        component: NewsList
    },
    {
        path: '/noticias/:slug',
        name: 'NewsDetail',
        component: NewsDetail,
        props: true
    },
    {
        path: '/newsletter/unsubscribe',
        name: 'UnsubscribeNewsLetter',
        component: UnsubscribeNewsLetter
    },
    {
        path: '/noticias/crear',
        name: 'CreateArticle',
        component: CreateArticle,
        meta: { requiresAuth: true, roles: ['Administrador', 'Noticiero'] }
    },
    {
        path: '/noticias/:slug/editar',
        name: 'EditArticle',
        component: EditArticle,
        meta: { requiresAuth: true, roles: ['Administrador', 'Noticiero'] }
    }
]
