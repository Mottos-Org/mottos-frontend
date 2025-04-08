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
                    <button class="info-btn">+ INFORMACIÓN</button>
                    <button class="enter-btn">ENTRAR</button>
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
                        <li><a href="#">Instagram</a></li>
                        <li><a href="#">TikTok</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>CONTACTO</h4>
                    <ul>
                        <li><a href="#">Acerca de</a></li>
                        <li><a href="#">Contacto</a></li>
                        <li><a href="#">Publicidad</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>MOTTOS.COM.DO</h4>
                    <ul>
                        <li><a href="#">Preguntas Frecuentes</a></li>
                        <li><a href="#">Política de Privacidad</a></li>
                        <li><a href="#">Términos y Condiciones</a></li>
                        <li><a href="#">Ayuda</a></li>
                    </ul>
                </div>
                <div class="footer-col newsletter">
                    <h4>NEWSLETTER</h4>
                    <p>
                        ¡Únete a nuestro Newsletter y mantente al día con las mejores ofertas,
                        eventos y noticias del mundo del motociclismo!
                    </p>
                    <div class="newsletter-signup">
                        <input type="email" placeholder="Correo electrónico..." class="newsletter-input" />
                        <button class="newsletter-button">
                            <i class="fa fa-chevron-right"></i>
                        </button>
                    </div>
                    <small class="newsletter-small">¡No te preocupes! No hacemos spam</small>
                </div>
            </div>
            <div class="footer-copy text-center">
                © 2025 Mottos.com.do
            </div>
        </div>
    </footer>
</template>

<script setup>
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
    transition: transform 0.2s;
}

.enter-btn {
    background-color: #2c3e50;
    color: #fff;
}

.info-btn:hover,
.enter-btn:hover {
    transform: scale(1.03);
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

.app-links {
    display: flex;
    gap: 1rem;
}

.store-badge {
    height: 40px;
    cursor: pointer;
    transition: opacity 0.2s;
}

.store-badge:hover {
    opacity: 0.8;
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

.footer-col li a {
    color: #99a3b6;
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.2s;
}

.footer-col li a:hover {
    color: #960000;
}

.newsletter p {
    font-size: 0.9rem;
    color: #99a3b6;
    margin-bottom: 1rem;
}

.newsletter-signup {
    display: flex;
    width: 100%;
    max-width: 600px;
    border: 1px solid #2c2f36;
    background-color: #23272f;
}

.newsletter-input {
    flex: 1;
    background-color: #23272f;
    color: white;
    border: none;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    outline: none;
    width: 100%;
}

.newsletter-button {
    background-color: #8b0000;
    color: white;
    padding: 0 1.5rem;
    font-size: 1.25rem;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
    box-sizing: border-box;
    width: 100%;
    max-width: 50px;
    padding-inline: 0;
}

.newsletter-button:hover {
    background-color: #b70000;
}

.newsletter-small {
    font-size: 1rem;
    font-style: italic;
    color: #737f96;
    margin-top: 0.5rem;
    display: block;
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
</style>