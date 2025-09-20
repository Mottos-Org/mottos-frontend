import AboutUs from "../../pages/static/AboutUs.vue";
import Contact from "../../pages/static/Contact.vue";
import PrivacyPolicy from "../../pages/static/PrivacyPolicy.vue";
import Terms from "../../pages/static/Terms.vue";
import FAQ from "../../pages/static/FAQ.vue";

export const docRoutes = [
    {
        path: '/terminos',
        name: 'Terms',
        component: Terms
    },
    {
        path: '/politica-privacidad',
        name: 'PrivacyPolicy',
        component: PrivacyPolicy
    },
    {
        path: '/faq',
        name: 'FAQ',
        component: FAQ
    },
    {
        path: '/about-us',
        name: 'AboutUs',
        component: AboutUs
    },
    {
        path: '/contact-us',
        name: 'Contact',
        component: Contact
    }
]