<template>
    <footer class="footer-wrapper">
        <div class="footer-top-cta">
            <div class="footer-top-container">
                <div class="cta-text">
                    <h2>¿TIENES UN CLUB DE MOTOS? REGÍSTRALO EN <br /> MOTTOS.COM.DO</h2>
                    <p style="color: #fae2ca">
                        Permite que los entusiastas de las motos como tú descubran tu club.
                        <br />
                        <span style="color: white; font-weight: bold;">
                            Comparte eventos, actividades y mantén a tu comunidad
                            al tanto de todo lo que ocurre en el mundo del motociclismo.
                        </span>
                    </p>
                </div>
                <div class="cta-buttons">
                    <router-link to="/contact-us" @click="scrollToTop" class="info-btn">+ INFORMACIÓN</router-link>
                    <button class="enter-btn" @click="handleEnterClick">ENTRAR</button>
                </div>
            </div>
        </div>
        <div class="footer-mid-stats">
            <div class="footer-mid-container mx-auto">
                <div class="stats-item">
                    <h3>9,652,156</h3>
                    <span>MOTOS PUBLICADAS</span>
                </div>
                <div class="stats-item">
                    <h3>895,604</h3>
                    <span>CONCESIONARIOS</span>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <div class="footer-bottom-container mx-auto">
                <div class="footer-col">
                    <h4>SÍGUENOS</h4>
                    <ul>
                        <li><a href="https://instagram.com/mottos.com.do" target="_blank" rel="noopener">Instagram</a></li>
                        <li><a href="https://tiktok.com/@mottos.com.do" target="_blank" rel="noopener">TikTok</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>CONTACTO</h4>
                    <ul>
                        <li><router-link to="/about-us" @click="scrollToTop">Acerca de</router-link></li>
                        <li><router-link to="/contact-us" @click="scrollToTop">Contacto</router-link></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>MOTTOS.COM.DO</h4>
                    <ul>
                        <li><router-link to="/faq" @click="scrollToTop">Preguntas Frecuentes</router-link></li>
                        <li><router-link to="/politica-privacidad" @click="scrollToTop">Política de Privacidad</router-link></li>
                        <li><router-link to="/terminos" @click="scrollToTop">Términos y Condiciones</router-link></li>
                    </ul>
                </div>
                <div class="footer-col newsletter">
                    <NewsletterSection />
                </div>
            </div>
            <div class="footer-copy text-center">
                © 2025 Mottos.com.do
            </div>
        </div>
    </footer>
</template>

<script setup>
import { useRouter } from 'vue-router';
import NewsletterSection from '../forms/NewsletterSection.vue';

const router = useRouter();

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

const handleEnterClick = () => {
    scrollToTop();
};
</script>

<style scoped>
.footer-top-cta {
    background-color: #8D0000;
    color: #fff;
    padding: 2rem 1rem;
}

.footer-top-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
}

.cta-text {
    text-align: left;
}

.cta-text h2 {
    font-size: 1.8rem;
    font-weight: 800;
    line-height: 1.2;
    font-style: italic;
    font-family: Montserrat, sans-serif;
}

.cta-text p {
    font-size: 0.9rem;
    line-height: 1.4;
}

.cta-buttons {
    display: flex;
    gap: 1rem;
}

.info-btn,
.enter-btn {
    background-color: #fff;
    color: #333;
    border: none;
    padding: 0.5rem 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-block;
    border-radius: 4px;
}

.enter-btn {
    background-color: #2c3e50;
    color: #fff;
}

.info-btn:hover,
.enter-btn:hover {
    transform: translateY(-2px) scale(1.02);
    text-decoration: none;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.info-btn:hover {
    color: #333;
    background-color: #f8f9fa;
}

.enter-btn:hover {
    color: #fff;
    background-color: #34495e;
}

.info-btn:active,
.enter-btn:active {
    transform: translateY(0) scale(1);
}

.footer-mid-stats {
    background-color: #1A1F28;
    padding: 50px;
    color: #fff;
    border-bottom: 1px solid gray;
}

.footer-mid-container {
    max-width: 1200px;
    display: flex;
    gap: 75px;
    align-items: center;
}

.stats-item {
    text-align: left;
}

.stats-item h3 {
    font-size: 1.5rem;
    font-weight: 800;
    font-style: italic;
    font-family: Montserrat, sans-serif;
}

.stats-item span {
    font-size: 0.9rem;
    color: #ccc;
}

.footer-bottom {
    background-color: #1A1F28;
    padding: 2rem 1rem 1rem;
    color: #fff;
}

.footer-bottom-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    gap: 2rem;
    justify-content: space-between;
    flex-wrap: wrap;
}

.footer-col {
    flex: 1 1 200px;
    min-width: 200px;
    text-align: left;
}

.footer-col h4 {
    margin-bottom: 1rem;
    font-size: 1rem;
    font-weight: 800;
    line-height: 1.2;
    font-style: italic;
    font-family: Montserrat, sans-serif;
}

.footer-col ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.footer-col li {
    margin-bottom: 0.5rem;
}

.footer-col li a,
.footer-col li .router-link-exact-active,
.footer-col li .router-link-active {
    color: #99a3b6;
    text-decoration: none;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    padding: 0.25rem 0;
    display: inline-block;
    position: relative;
}

.footer-col li a:hover,
.footer-col li .router-link-exact-active:hover,
.footer-col li .router-link-active:hover {
    color: #dc3545;
    text-decoration: none;
    transform: translateX(4px);
}

.footer-col li a:hover::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #dc3545;
    transform: scaleX(1);
    transition: transform 0.3s ease;
}

.footer-col li a::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #dc3545;
    transform: scaleX(0);
    transition: transform 0.3s ease;
}

.footer-col li .router-link-exact-active {
    color: #dc3545;
    font-weight: 600;
}

.footer-col li .router-link-exact-active::after {
    transform: scaleX(1);
}

.footer-copy {
    margin-top: 2rem;
    font-size: 0.8rem;
    color: #ccc;
}

.footer-copy .heart {
    color: red;
}

.footer-copy a {
    color: #fff;
    text-decoration: none;
    transition: color 0.2s;
}

.footer-copy a:hover {
    color: #ccc;
}

.router-link-active {
    position: relative;
}

@media (max-width: 768px) {
    .footer-top-container {
        flex-direction: column;
        text-align: center;
        gap: 1.5rem;
    }
    
    .cta-text h2 {
        font-size: 1.4rem;
    }
    
    .cta-buttons {
        flex-direction: column;
        width: 100%;
        gap: 0.5rem;
    }
    
    .info-btn,
    .enter-btn {
        width: 100%;
        text-align: center;
        padding: 0.75rem 1rem;
    }
    
    .footer-mid-container {
        flex-direction: column;
        gap: 2rem;
        text-align: center;
    }
    
    .footer-bottom-container {
        flex-direction: column;
        gap: 2rem;
    }
    
    .footer-col {
        text-align: center;
        min-width: auto;
    }
    
    .footer-col li a:hover {
        transform: none;
    }
}

:global(html) {
    scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
    .info-btn,
    .enter-btn,
    .footer-col li a {
        transition: none;
    }
    
    .info-btn:hover,
    .enter-btn:hover {
        transform: none;
    }
}
</style>