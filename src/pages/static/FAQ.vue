<template>
    <div class="faq-page">
        <div class="hero-section">
            <div class="container">
                <h1>Preguntas Frecuentes</h1>
                <p class="hero-subtitle">Encuentra respuestas a las preguntas más comunes</p>
            </div>
        </div>

        <div class="container content-container">
            <div class="row">
                <div class="col-lg-8 mx-auto">
                    <div class="faq-search">
                        <div class="search-box">
                            <i class="bi bi-search"></i>
                            <input 
                                type="text" 
                                v-model="searchQuery"
                                placeholder="Buscar en preguntas frecuentes..."
                                class="search-input"
                            >
                        </div>
                    </div>

                    <div class="faq-categories">
                        <button 
                            v-for="category in categories" 
                            :key="category.id"
                            @click="activeCategory = category.id"
                            class="category-btn"
                            :class="{ active: activeCategory === category.id }"
                        >
                            <i :class="category.icon"></i>
                            {{ category.name }}
                        </button>
                    </div>

                    <div class="faq-list">
                        <div 
                            v-for="faq in filteredFaqs" 
                            :key="faq.id"
                            class="faq-item"
                        >
                            <div class="faq-question" @click="toggleFaq(faq.id)">
                                <h3>{{ faq.question }}</h3>
                                <div class="faq-toggle">
                                    <i class="bi" :class="openFaqs.includes(faq.id) ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                                </div>
                            </div>
                            <div class="faq-answer" :class="{ open: openFaqs.includes(faq.id) }">
                                <div class="answer-content" v-html="faq.answer"></div>
                            </div>
                        </div>
                    </div>

                    <div v-if="filteredFaqs.length === 0" class="no-results">
                        <i class="bi bi-search"></i>
                        <h3>No se encontraron resultados</h3>
                        <p>Intenta con otros términos de búsqueda o explora diferentes categorías.</p>
                    </div>

                    <div class="contact-cta">
                        <h3>¿No encontraste lo que buscabas?</h3>
                        <p>Nuestro equipo está aquí para ayudarte</p>
                        <router-link to="/contact-us" class="btn btn-primary">
                            Contacta con Nosotros
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

document.title = 'Preguntas Frecuentes - Mottos.com.do';

const searchQuery = ref('');
const activeCategory = ref('all');
const openFaqs = ref([]);

const categories = [
    { id: 'all', name: 'Todas', icon: 'bi-grid' },
    { id: 'account', name: 'Cuenta', icon: 'bi-person' },
    { id: 'clubs', name: 'Clubes', icon: 'bi-people' },
    { id: 'platform', name: 'Plataforma', icon: 'bi-laptop' },
    { id: 'support', name: 'Soporte', icon: 'bi-headset' }
];

const faqs = [
    {
        id: 1,
        category: 'account',
        question: '¿Cómo puedo crear una cuenta en Mottos.com.do?',
        answer: `
            <p>Crear una cuenta es muy sencillo:</p>
            <ol>
                <li>Haz clic en el botón "Registrarse" en la página principal</li>
                <li>Completa el formulario con tu información personal</li>
                <li>Verifica tu email haciendo clic en el enlace que te enviaremos</li>
                <li>¡Listo! Ya puedes empezar a usar la plataforma</li>
            </ol>
        `
    },
    {
        id: 2,
        category: 'account',
        question: '¿Olvidé mi contraseña, qué puedo hacer?',
        answer: `
            <p>No te preocupes, recuperar tu contraseña es fácil:</p>
            <ol>
                <li>Ve a la página de inicio de sesión</li>
                <li>Haz clic en "¿Olvidaste tu contraseña?"</li>
                <li>Ingresa tu email registrado</li>
                <li>Revisa tu correo y sigue las instrucciones</li>
            </ol>
        `
    },
    {
        id: 3,
        category: 'clubs',
        question: '¿Cómo puedo registrar mi club de motos?',
        answer: `
            <p>Para registrar tu club en nuestra plataforma:</p>
            <ol>
                <li>Debes tener una cuenta activa en Mottos.com.do</li>
                <li>Contacta con nuestro equipo a través del formulario de contacto</li>
                <li>Proporciona la información de tu club (nombre, ubicación, actividades)</li>
                <li>Nuestro equipo revisará y aprobará tu solicitud</li>
            </ol>
            <p><strong>Beneficios de registrar tu club:</strong></p>
            <ul>
                <li>Mayor visibilidad para tu club</li>
                <li>Posibilidad de publicar eventos</li>
                <li>Conectar con otros clubes</li>
                <li>Acceso a herramientas de gestión</li>
            </ul>
        `
    },
    {
        id: 4,
        category: 'clubs',
        question: '¿Cuánto cuesta registrar un club?',
        answer: `
            <p>El registro básico de clubes es <strong>completamente gratuito</strong>.</p>
            <p>Incluye:</p>
            <ul>
                <li>Perfil público del club</li>
                <li>Publicación de información básica</li>
                <li>Contacto con otros clubes</li>
            </ul>
            <p>Para funcionalidades adicionales como eventos premium y herramientas avanzadas, 
            contáctanos para conocer nuestros planes especiales.</p>
        `
    },
    {
        id: 5,
        category: 'platform',
        question: '¿Qué tipo de contenido puedo encontrar en Mottos.com.do?',
        answer: `
            <p>En nuestra plataforma encontrarás:</p>
            <ul>
                <li><strong>Noticias:</strong> Últimas noticias del mundo del motociclismo</li>
                <li><strong>Clubes:</strong> Directorio completo de clubes de motos</li>
                <li><strong>Eventos:</strong> Actividades, rodadas y encuentros</li>
                <li><strong>Consejos:</strong> Tips de seguridad y mantenimiento</li>
                <li><strong>Comunidad:</strong> Espacio para conectar con otros motociclistas</li>
            </ul>
        `
    },
    {
        id: 6,
        category: 'platform',
        question: '¿Es gratis usar Mottos.com.do?',
        answer: `
            <p><strong>¡Sí! El uso básico de Mottos.com.do es completamente gratuito.</strong></p>
            <p>Puedes:</p>
            <ul>
                <li>Crear tu cuenta de usuario</li>
                <li>Navegar por el contenido</li>
                <li>Conectar con clubes</li>
                <li>Leer noticias y artículos</li>
                <li>Participar en la comunidad</li>
            </ul>
            <p>Para funcionalidades premium y servicios especializados, 
            ofrecemos planes adaptados a las necesidades específicas.</p>
        `
    },
    {
        id: 7,
        category: 'support',
        question: '¿Cómo puedo reportar un problema técnico?',
        answer: `
            <p>Si encuentras algún problema técnico:</p>
            <ol>
                <li>Intenta refrescar la página o cerrar/abrir el navegador</li>
                <li>Si el problema persiste, contacta con nosotros</li>
                <li>Incluye detalles como: navegador, dispositivo, descripción del error</li>
                <li>Nuestro equipo técnico te ayudará lo antes posible</li>
            </ol>
            <p><strong>Tiempo de respuesta:</strong> 24-48 horas máximo</p>
        `
    },
    {
        id: 8,
        category: 'support',
        question: '¿Puedo usar Mottos.com.do en mi móvil?',
        answer: `
            <p><strong>¡Por supuesto!</strong> Mottos.com.do está optimizado para todos los dispositivos.</p>
            <p>Puedes acceder desde:</p>
            <ul>
                <li>Navegador móvil (Chrome, Safari, Firefox, etc.)</li>
                <li>Tablet</li>
                <li>Computadora de escritorio</li>
                <li>Laptop</li>
            </ul>
            <p>La experiencia se adapta automáticamente al tamaño de tu pantalla 
            para que siempre tengas la mejor experiencia posible.</p>
        `
    }
];

const filteredFaqs = computed(() => {
    let filtered = faqs;
    
    if (activeCategory.value !== 'all') {
        filtered = filtered.filter(faq => faq.category === activeCategory.value);
    }
    
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(faq => 
            faq.question.toLowerCase().includes(query) ||
            faq.answer.toLowerCase().includes(query)
        );
    }
    
    return filtered;
});

const toggleFaq = (id) => {
    if (openFaqs.value.includes(id)) {
        openFaqs.value = openFaqs.value.filter(faqId => faqId !== id);
    } else {
        openFaqs.value.push(id);
    }
};

onMounted(() => {
    openFaqs.value = [1, 3];
});
</script>

<style scoped>
.faq-page {
    min-height: 100vh;
    background: #f8f9fa;
}

.hero-section {
    background: linear-gradient(135deg, #8D0000 0%, #c82333 100%);
    color: white;
    padding: 4rem 0 3rem;
    text-align: center;
}

.hero-section h1 {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 1rem;
    font-family: 'Montserrat', sans-serif;
}

.hero-subtitle {
    font-size: 1.25rem;
    opacity: 0.9;
}

.content-container {
    padding: 4rem 0;
}

.faq-search {
    margin-bottom: 2rem;
}

.search-box {
    position: relative;
    max-width: 500px;
    margin: 0 auto;
}

.search-box i {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
    font-size: 1.1rem;
}

.search-input {
    width: 100%;
    padding: 1rem 1rem 1rem 3rem;
    border: 2px solid #e9ecef;
    border-radius: 50px;
    font-size: 1rem;
    background: white;
    transition: all 0.3s ease;
    color: #333;
}

.search-input:focus {
    outline: none;
    border-color: #dc3545;
    box-shadow: 0 0 0 4px rgba(220, 53, 69, 0.1);
}

.faq-categories {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 3rem;
    flex-wrap: wrap;
}

.category-btn {
    background: white;
    border: 2px solid #e9ecef;
    padding: 0.75rem 1.5rem;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #333;
}

.category-btn:hover,
.category-btn.active {
    background: #dc3545;
    border-color: #dc3545;
    color: white;
    transform: translateY(-2px);
}

.faq-list {
    max-width: 800px;
    margin: 0 auto;
}

.faq-item {
    background: white;
    border-radius: 12px;
    margin-bottom: 1.5rem;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    overflow: hidden;
}

.faq-question {
    padding: 1.5rem 2rem;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background-color 0.3s ease;
}

.faq-question:hover {
    background: #f8f9fa;
}

.faq-question h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0;
}

.faq-toggle {
    color: #dc3545;
    font-size: 1.2rem;
    transition: transform 0.3s ease;
}

.faq-answer {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
    border-top: 1px solid #f0f0f0;
}

.faq-answer.open {
    max-height: 1000px;
}

.answer-content {
    padding: 2rem;
    color: #333;
    line-height: 1.6;
    text-align: left;
}

.answer-content p {
    margin-bottom: 1rem;
}

.answer-content ul,
.answer-content ol {
    margin-bottom: 1rem;
    padding-left: 2rem;
}

.answer-content li {
    margin-bottom: 0.5rem;
}

.answer-content strong {
    color: #dc3545;
}

.no-results {
    text-align: center;
    padding: 3rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.no-results i {
    font-size: 4rem;
    color: #ccc;
    margin-bottom: 1rem;
}

.no-results h3 {
    color: #1a1a1a;
    margin-bottom: 1rem;
}

.no-results p {
    color: #666;
}

.contact-cta {
    background: linear-gradient(135deg, rgba(220, 53, 69, 0.05) 0%, rgba(220, 53, 69, 0.02) 100%);
    border: 2px solid rgba(220, 53, 69, 0.1);
    border-radius: 12px;
    padding: 2rem;
    text-align: center;
    margin-top: 3rem;
}

.contact-cta h3 {
    color: #1a1a1a;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
}

.contact-cta p {
    color: #666;
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
}

.btn {
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.3s ease;
    display: inline-block;
}

.btn-primary {
    background: #dc3545;
    color: white;
}

.btn-primary:hover {
    background: #c82333;
    transform: translateY(-2px);
    color: white;
    text-decoration: none;
}

@media (max-width: 768px) {
    .hero-section {
        padding: 3rem 0 2rem;
    }
    
    .hero-section h1 {
        font-size: 2rem;
    }
    
    .content-container {
        padding: 2rem 0;
    }
    
    .faq-categories {
        justify-content: flex-start;
        overflow-x: auto;
        padding: 0 1rem;
    }
    
    .category-btn {
        white-space: nowrap;
        flex-shrink: 0;
    }
    
    .faq-question {
        padding: 1rem 1.5rem;
    }
    
    .answer-content {
        padding: 1.5rem;
    }
}
</style>