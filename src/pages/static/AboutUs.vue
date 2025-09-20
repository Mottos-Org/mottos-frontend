<template>
    <div class="about-page">
        <div class="hero-section">
            <div class="container">
                <h1>Acerca de Mottos.com.do</h1>
                <p class="hero-subtitle">La plataforma líder de motociclismo en República Dominicana</p>
            </div>
        </div>

        <div class="container content-container">
            <div class="row">
                <div class="col-lg-8 mx-auto">
                    <section class="content-section">
                        <h2>Nuestra Historia</h2>
                        <p>
                            Mottos.com.do nació de la pasión por las motocicletas y el deseo de crear una comunidad 
                            unificada para todos los amantes del motociclismo en República Dominicana. Desde nuestros 
                            inicios, hemos trabajado incansablemente para conectar a motociclistas, clubes, 
                            concesionarios y entusiastas en una sola plataforma.
                        </p>
                        <p>
                            Con más de <strong>9,652,156 motos publicadas</strong> y <strong>895,604 concesionarios</strong> 
                            registrados, nos hemos convertido en el punto de encuentro más importante del motociclismo dominicano.
                        </p>
                    </section>

                    <section class="content-section">
                        <h2>Nuestra Misión</h2>
                        <p>
                            Facilitar y enriquecer la experiencia del motociclismo en República Dominicana, 
                            proporcionando una plataforma integral donde los usuarios puedan:
                        </p>
                        
                        <div class="mission-grid">
                            <div class="mission-item">
                                <div class="mission-icon">
                                    <i class="bi bi-arrow-left-right"></i>
                                </div>
                                <h4>Compra y Venta</h4>
                                <p>Facilitar la compra y venta de motocicletas tanto de <strong>particulares</strong> como de <strong>concesionarios</strong></p>
                            </div>
                            
                            <div class="mission-item">
                                <div class="mission-icon">
                                    <i class="bi bi-people-fill"></i>
                                </div>
                                <h4>Clubes</h4>
                                <p>Encontrar y conectar con clubes de motocicletas en toda la República Dominicana</p>
                            </div>
                            
                            <div class="mission-item">
                                <div class="mission-icon">
                                    <i class="bi bi-calendar-event"></i>
                                </div>
                                <h4>Eventos</h4>
                                <p>Descubrir eventos y actividades relacionadas con el motociclismo</p>
                            </div>
                            
                            <div class="mission-item">
                                <div class="mission-icon">
                                    <i class="bi bi-newspaper"></i>
                                </div>
                                <h4>Noticias</h4>
                                <p>Acceder a noticias y contenido especializado del mundo del motociclismo</p>
                            </div>
                            
                            <div class="mission-item">
                                <div class="mission-icon">
                                    <i class="bi bi-heart-fill"></i>
                                </div>
                                <h4>Comunidad</h4>
                                <p>Conectar con una comunidad apasionada por las dos ruedas</p>
                            </div>
                        </div>
                    </section>

                    <section class="content-section">
                        <h2>Nuestra Visión</h2>
                        <p>
                            Ser la plataforma de referencia para el motociclismo en el Caribe, 
                            promoviendo una cultura de seguridad, hermandad y pasión por las motocicletas.
                        </p>
                    </section>

                    <section class="content-section">
                        <h2>Nuestros Valores</h2>
                        <div class="values-grid">
                            <div class="value-item">
                                <div class="value-icon">
                                    <i class="bi bi-people"></i>
                                </div>
                                <h4>Comunidad</h4>
                                <p>Fomentamos la unión y el compañerismo entre motociclistas.</p>
                            </div>
                            <div class="value-item">
                                <div class="value-icon">
                                    <i class="bi bi-shield-check"></i>
                                </div>
                                <h4>Seguridad</h4>
                                <p>Promovemos prácticas seguras de conducción y responsabilidad vial.</p>
                            </div>
                            <div class="value-item">
                                <div class="value-icon">
                                    <i class="bi bi-heart"></i>
                                </div>
                                <h4>Pasión</h4>
                                <p>Compartimos el amor por las motocicletas y la libertad que representan.</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
document.title = 'Acerca de - Mottos.com.do';
</script>

<style scoped>
.about-page {
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
    max-width: 600px;
    margin: 0 auto;
}

.content-container {
    padding: 4rem 0;
}

.content-section {
    margin-bottom: 3rem;
}

.content-section h2 {
    color: #1a1a1a;
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    border-bottom: 3px solid #dc3545;
    padding-bottom: 0.5rem;
    display: inline-block;
}

.content-section p {
    font-size: 1.1rem;
    line-height: 1.8;
    color: #333;
    margin-bottom: 1.5rem;
}

.content-section ul {
    font-size: 1.1rem;
    line-height: 1.8;
    color: #333;
    padding-left: 2rem;
    text-align: left;
}

.content-section li {
    margin-bottom: 0.75rem;
}

.mission-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
}

.mission-item {
    background: white;
    padding: 2rem 1.5rem;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    transition: all 0.3s ease;
    border: 2px solid transparent;
}

.mission-item:hover {
    transform: translateY(-5px);
    border-color: rgba(220, 53, 69, 0.2);
    box-shadow: 0 8px 30px rgba(220, 53, 69, 0.15);
}

.mission-icon {
    width: 70px;
    height: 70px;
    background: linear-gradient(135deg, #8D0000, #dc3545);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
    font-size: 1.8rem;
    color: white;
    transition: transform 0.3s ease;
}

.mission-item:hover .mission-icon {
    transform: scale(1.1) rotate(5deg);
}

.mission-item h4 {
    color: #1a1a1a;
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 1rem;
    font-family: 'Montserrat', sans-serif;
}

.mission-item p {
    color: #666;
    font-size: 1rem;
    line-height: 1.6;
    margin: 0;
}

.mission-item p strong {
    color: #dc3545;
    font-weight: 700;
}

.values-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.value-item {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
    border: 2px solid transparent;
}

.value-item:hover {
    transform: translateY(-5px);
    border-color: rgba(220, 53, 69, 0.2);
    box-shadow: 0 8px 30px rgba(220, 53, 69, 0.15);
}

.value-icon {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #dc3545, #c82333);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
    font-size: 2rem;
    color: white;
    transition: transform 0.3s ease;
}

.value-item:hover .value-icon {
    transform: scale(1.1);
}

.value-item h4 {
    color: #1a1a1a;
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 1rem;
    font-family: 'Montserrat', sans-serif;
}

.value-item p {
    color: #666;
    font-size: 1rem;
    line-height: 1.6;
    margin: 0;
}

.cta-box {
    background: linear-gradient(135deg, rgba(220, 53, 69, 0.05) 0%, rgba(220, 53, 69, 0.02) 100%);
    border: 2px solid rgba(220, 53, 69, 0.1);
    border-radius: 12px;
    padding: 2rem;
    text-align: center;
    margin-top: 2rem;
}

.cta-box p {
    margin-bottom: 2rem;
    font-size: 1.1rem;
    color: #333;
}

.btn {
    padding: 0.75rem 2rem;
    border-radius: 8px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
    display: inline-block;
}

.btn-primary {
    background: #dc3545;
    color: white;
    border: 2px solid #dc3545;
}

.btn-primary:hover {
    background: #c82333;
    border-color: #c82333;
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
    
    .hero-subtitle {
        font-size: 1rem;
    }
    
    .content-container {
        padding: 2rem 0;
    }
    
    .content-section h2 {
        font-size: 1.5rem;
    }
    
    .mission-grid,
    .values-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
    
    .mission-item,
    .value-item {
        padding: 1.5rem;
    }
    
    .mission-icon {
        width: 60px;
        height: 60px;
        font-size: 1.6rem;
    }
    
    .value-icon {
        width: 70px;
        height: 70px;
        font-size: 1.8rem;
    }
}

@media (max-width: 480px) {
    .mission-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    
    .mission-item {
        padding: 1.25rem;
    }
    
    .mission-icon {
        width: 55px;
        height: 55px;
        font-size: 1.4rem;
        border-radius: 12px;
    }
}
</style>