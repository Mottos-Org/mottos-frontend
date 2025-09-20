<template>
    <div class="not-found-page">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-8 col-md-10">
                    <div class="not-found-container">
                        <div class="error-icon">
                            <div class="motorcycle-container">
                                <i class="fa fa-motorcycle"></i>
                                <div class="exhaust-smoke">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                        <h1 class="error-number">
                            <span class="digit">4</span>
                            <span class="digit delay-1">0</span>
                            <span class="digit delay-2">4</span>
                        </h1>
                        <div class="error-content">
                            <h2 class="error-title">¡Ups! Página no encontrada</h2>
                            <p class="error-description">
                                Parece que la página que buscas tomó un desvío inesperado. 
                                No te preocupes, te ayudamos a regresar al camino correcto.
                            </p>
                        </div>
                        <div class="error-actions">
                            <router-link to="/" class="btn btn-primary btn-home">
                                <i class="bi bi-house-door"></i>
                                Ir al Inicio
                            </router-link>
                            <router-link to="/motos/publicaciones" class="btn btn-outline-primary btn-motos">
                                <i class="fa fa-motorcycle"></i>
                                Ver Motos
                            </router-link>
                            <router-link to="/noticias" class="btn btn-outline-primary btn-news">
                                <i class="bi bi-newspaper"></i>
                                Ver Noticias
                            </router-link>
                            <button @click="goBack" class="btn btn-outline-secondary btn-back">
                                <i class="bi bi-arrow-left"></i>
                                Volver Atrás
                            </button>
                        </div>
                        <div class="quick-nav">
                            <h4>¿Buscas algo específico?</h4>
                            <div class="quick-links">
                                <router-link to="/about-us" class="quick-link">
                                    <i class="bi bi-info-circle"></i>
                                    Acerca de
                                </router-link>
                                <router-link to="/contact-us" class="quick-link">
                                    <i class="bi bi-envelope"></i>
                                    Contacto
                                </router-link>
                                <router-link to="/faq" class="quick-link">
                                    <i class="bi bi-question-circle"></i>
                                    FAQ
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-decoration">
            <div class="road-lines"></div>
            <div class="floating-icons">
                <i class="bi bi-gear-fill icon-1"></i>
                <i class="bi bi-speedometer2 icon-2"></i>
                <i class="bi bi-fuel-pump icon-3"></i>
                <i class="bi bi-shield-check icon-4"></i>
                <i class="bi bi-tools icon-5"></i>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

document.title = '404 - Página no encontrada | Mottos.com.do';

const goBack = () => {
    if (window.history.length > 1) {
        router.go(-1);
    } else {
        router.push('/');
    }
};
</script>

<style scoped>
.not-found-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    display: flex;
    align-items: center;
    padding: 2rem 0;
    position: relative;
    overflow: hidden;
}

.not-found-container {
    text-align: center;
    position: relative;
    z-index: 10;
}

.error-icon {
    margin-bottom: 2rem;
}

.motorcycle-container {
    position: relative;
    display: inline-block;
    animation: bounce 2s infinite;
}

.motorcycle-container i {
    font-size: 5rem;
    color: #dc3545;
    filter: drop-shadow(0 4px 8px rgba(220, 53, 69, 0.3));
}

.exhaust-smoke {
    position: absolute;
    right: -20px;
    top: 20px;
}

.exhaust-smoke span {
    position: absolute;
    width: 8px;
    height: 8px;
    background: #adb5bd;
    border-radius: 50%;
    opacity: 0;
    animation: smoke 2s infinite;
}

.exhaust-smoke span:nth-child(1) { animation-delay: 0s; }
.exhaust-smoke span:nth-child(2) { animation-delay: 0.3s; }
.exhaust-smoke span:nth-child(3) { animation-delay: 0.6s; }

.error-number {
    font-size: 8rem;
    font-weight: 900;
    margin: 2rem 0;
    font-family: 'Montserrat', sans-serif;
    line-height: 1;
}

.digit {
    display: inline-block;
    background: linear-gradient(135deg, #dc3545, #8D0000);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: digitPulse 2s infinite;
    text-shadow: 0 4px 20px rgba(220, 53, 69, 0.3);
}

.delay-1 { animation-delay: 0.2s; }
.delay-2 { animation-delay: 0.4s; }

.error-content {
    margin-bottom: 3rem;
}

.error-title {
    font-size: 2rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 1rem;
    font-family: 'Montserrat', sans-serif;
}

.error-description {
    font-size: 1.1rem;
    color: #6c757d;
    line-height: 1.6;
    max-width: 600px;
    margin: 0 auto;
}

.error-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 3rem;
}

.btn {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    border: 2px solid transparent;
    font-size: 1rem;
}

.btn-primary {
    background: #dc3545;
    color: white;
    border-color: #dc3545;
}

.btn-primary:hover {
    background: #c82333;
    border-color: #c82333;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(220, 53, 69, 0.3);
    color: white;
    text-decoration: none;
}

.btn-outline-primary {
    background: transparent;
    color: #dc3545;
    border-color: #dc3545;
}

.btn-outline-primary:hover {
    background: #dc3545;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(220, 53, 69, 0.3);
    text-decoration: none;
}

.btn-outline-secondary {
    background: transparent;
    color: #6c757d;
    border-color: #6c757d;
}

.btn-outline-secondary:hover {
    background: #6c757d;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(108, 117, 125, 0.3);
    text-decoration: none;
}

.quick-nav {
    margin-bottom: 3rem;
}

.quick-nav h4 {
    font-size: 1.2rem;
    font-weight: 600;
    color: #495057;
    margin-bottom: 1.5rem;
}

.quick-links {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

.quick-link {
    background: white;
    color: #495057;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
    border: 2px solid #e9ecef;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.quick-link:hover {
    background: #dc3545;
    color: white;
    border-color: #dc3545;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(220, 53, 69, 0.2);
    text-decoration: none;
}

.fun-fact {
    background: linear-gradient(135deg, rgba(220, 53, 69, 0.05), rgba(220, 53, 69, 0.02));
    border: 2px solid rgba(220, 53, 69, 0.1);
    border-radius: 12px;
    padding: 1.5rem;
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    text-align: left;
    max-width: 500px;
    margin: 0 auto;
}

.fun-fact-icon i {
    font-size: 1.5rem;
    color: #dc3545;
}

.fun-fact-content strong {
    color: #dc3545;
    font-weight: 700;
}

.fun-fact-content p {
    margin: 0.5rem 0 0 0;
    color: #6c757d;
    font-size: 0.95rem;
    line-height: 1.5;
}

.bg-decoration {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    overflow: hidden;
}

.road-lines {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: repeating-linear-gradient(
        to right,
        #adb5bd 0px,
        #adb5bd 20px,
        transparent 20px,
        transparent 40px
    );
    animation: roadMove 3s linear infinite;
}

.floating-icons {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

.floating-icons i {
    position: absolute;
    color: rgba(220, 53, 69, 0.1);
    font-size: 2rem;
    animation: float 6s ease-in-out infinite;
}

.icon-1 { top: 20%; left: 10%; animation-delay: 0s; }
.icon-2 { top: 60%; right: 15%; animation-delay: 1s; }
.icon-3 { top: 30%; right: 25%; animation-delay: 2s; }
.icon-4 { bottom: 30%; left: 20%; animation-delay: 3s; }
.icon-5 { bottom: 20%; right: 30%; animation-delay: 4s; }

@keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
}

@keyframes smoke {
    0% {
        opacity: 0;
        transform: translateY(0) scale(1);
    }
    50% {
        opacity: 0.7;
        transform: translateY(-20px) scale(1.2);
    }
    100% {
        opacity: 0;
        transform: translateY(-40px) scale(0.8);
    }
}

@keyframes digitPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

@keyframes roadMove {
    0% { transform: translateX(0); }
    100% { transform: translateX(40px); }
}

@keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    33% { transform: translateY(-15px) rotate(5deg); }
    66% { transform: translateY(-10px) rotate(-5deg); }
}

@media (max-width: 768px) {
    .error-number {
        font-size: 5rem;
    }
    
    .error-title {
        font-size: 1.5rem;
    }
    
    .error-description {
        font-size: 1rem;
    }
    
    .error-actions {
        flex-direction: column;
        align-items: center;
    }
    
    .btn {
        width: 100%;
        max-width: 280px;
        justify-content: center;
    }
    
    .quick-links {
        flex-direction: column;
        align-items: center;
    }
    
    .quick-link {
        width: 100%;
        max-width: 200px;
        justify-content: center;
    }
    
    .fun-fact {
        flex-direction: column;
        text-align: center;
    }
    
    .motorcycle-container i {
        font-size: 4rem;
    }
    
    .floating-icons i {
        font-size: 1.5rem;
    }
}

@media (max-width: 480px) {
    .not-found-page {
        padding: 1rem 0;
    }
    
    .error-number {
        font-size: 4rem;
        margin: 1rem 0;
    }
    
    .error-title {
        font-size: 1.25rem;
    }
    
    .motorcycle-container i {
        font-size: 3rem;
    }
}
</style>