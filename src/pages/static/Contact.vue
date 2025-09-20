<template>
    <div class="contact-page">
        <div class="hero-section">
            <div class="container">
                <h1>Contacto</h1>
                <p class="hero-subtitle">¿Tienes alguna pregunta? Estamos aquí para ayudarte</p>
            </div>
        </div>

        <div class="container content-container">
            <div class="row">
                <div class="col-lg-8 mx-auto">
                    <div class="contact-card">
                        <div class="contact-info">
                            <h2>¡Ponte en Contacto!</h2>
                            <p>
                                Estamos siempre dispuestos a ayudarte. Si tienes preguntas sobre la plataforma, 
                                quieres registrar tu club, o necesitas soporte técnico, no dudes en contactarnos.
                            </p>

                            <div class="contact-methods">
                                <div class="contact-method">
                                    <div class="method-icon">
                                        <i class="bi bi-envelope"></i>
                                    </div>
                                    <div class="method-info">
                                        <h4>Email</h4>
                                        <p>info@mottos.com.do</p>
                                        <small>Respuesta en 24-48 horas</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="social-section">
                        <h3>Síguenos en Redes Sociales</h3>
                        <div class="social-links">
                            <a href="#" class="social-link instagram">
                                <i class="bi bi-instagram"></i>
                                <span>Instagram</span>
                            </a>
                            <a href="#" class="social-link tiktok">
                                <i class="bi bi-tiktok"></i>
                                <span>TikTok</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
document.title = 'Contacto - Mottos.com.do';
</script>

<style scoped>
.contact-page {
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

.contact-card {
    background: white;
    border-radius: 16px;
    padding: 3rem;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    margin-bottom: 3rem;
}

.contact-info h2 {
    color: #1a1a1a;
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1rem;
}

.contact-info p {
    font-size: 1.1rem;
    line-height: 1.8;
    color: #666;
    margin-bottom: 2rem;
}

.contact-methods {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-bottom: 3rem;
}

.contact-method {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    text-align: left;
}

.method-icon {
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #dc3545, #c82333);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.5rem;
    flex-shrink: 0;
}

.method-info h4 {
    color: #1a1a1a;
    font-weight: 700;
    margin-bottom: 0.25rem;
}

.method-info p {
    color: #333;
    font-size: 1.1rem;
    margin-bottom: 0.25rem;
}

.method-info small {
    color: #666;
    font-size: 0.9rem;
}

.contact-form-section {
    border-top: 1px solid #eee;
    padding-top: 2rem;
}

.contact-form-section h3 {
    color: #1a1a1a;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 2rem;
}

.form-group {
    margin-bottom: 1.5rem;
    text-align: left;
}

.form-group label {
    display: block;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
}

.form-control {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
}

.form-control:focus {
    outline: none;
    border-color: #dc3545;
    box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.1);
}

.btn {
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.btn-primary {
    background: #dc3545;
    color: white;
}

.btn-primary:hover:not(:disabled) {
    background: #c82333;
    transform: translateY(-2px);
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.social-section {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    text-align: center;
}

.social-section h3 {
    color: #1a1a1a;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 2rem;
}

.social-links {
    display: flex;
    justify-content: center;
    gap: 2rem;
}

.social-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    border-radius: 12px;
    text-decoration: none;
    transition: all 0.3s ease;
    min-width: 100px;
}

.social-link.instagram {
    background: linear-gradient(135deg, #E4405F, #C13584);
    color: white;
}

.social-link.tiktok {
    background: linear-gradient(135deg, #000000, #444444);
    color: white;
}

.social-link:hover {
    transform: translateY(-5px);
    text-decoration: none;
    color: white;
}

.social-link i {
    font-size: 2rem;
}

.social-link span {
    font-weight: 600;
}

@media (max-width: 768px) {
    .hero-section {
        padding: 3rem 0 2rem;
    }
    
    .hero-section h1 {
        font-size: 2rem;
    }
    
    .contact-card {
        padding: 2rem;
        margin: 1rem;
    }
    
    .contact-methods {
        gap: 1rem;
    }
    
    .social-links {
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }
    
    .social-link {
        width: 200px;
    }
}
</style>