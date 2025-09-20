<template>
    <div class="privacy-page">
        <div class="hero-section">
            <div class="container">
                <h1>Política de Privacidad</h1>
                <p class="hero-subtitle">Tu privacidad es importante para nosotros</p>
                <div class="last-updated">
                    <i class="bi bi-calendar"></i>
                    Última actualización: 20 de Septiembre, 2025
                </div>
            </div>
        </div>

        <div class="container content-container">
            <div class="row">
                <div class="col-lg-9 mx-auto">
                    <div class="content-card">
                        <nav class="table-of-contents">
                            <h3>Contenido</h3>
                            <ul>
                                <li><a href="#introduccion" @click="scrollTo('introduccion')">1. Introducción</a></li>
                                <li><a href="#informacion" @click="scrollTo('informacion')">2. Información que recopilamos</a></li>
                                <li><a href="#uso" @click="scrollTo('uso')">3. Cómo usamos tu información</a></li>
                                <li><a href="#compartir" @click="scrollTo('compartir')">4. Compartir información</a></li>
                                <li><a href="#cookies" @click="scrollTo('cookies')">5. Cookies y tecnologías similares</a></li>
                                <li><a href="#seguridad" @click="scrollTo('seguridad')">6. Seguridad de datos</a></li>
                                <li><a href="#derechos" @click="scrollTo('derechos')">7. Tus derechos</a></li>
                                <li><a href="#menores" @click="scrollTo('menores')">8. Menores de edad</a></li>
                                <li><a href="#cambios" @click="scrollTo('cambios')">9. Cambios a esta política</a></li>
                                <li><a href="#contacto" @click="scrollTo('contacto')">10. Contacto</a></li>
                            </ul>
                        </nav>

                        <div class="policy-content">
                            <section id="introduccion" class="policy-section">
                                <h2>1. Introducción</h2>
                                <p>
                                    En Mottos.com.do, respetamos tu privacidad y nos comprometemos a proteger 
                                    tu información personal. Esta Política de Privacidad describe cómo recopilamos, 
                                    usamos, almacenamos y protegemos tu información cuando utilizas nuestros servicios.
                                </p>
                                <p>
                                    Al utilizar nuestro sitio web y servicios, aceptas las prácticas descritas 
                                    en esta política.
                                </p>
                            </section>

                            <section id="informacion" class="policy-section">
                                <h2>2. Información que recopilamos</h2>
                                
                                <h3>2.1 Información que nos proporcionas directamente</h3>
                                <ul>
                                    <li><strong>Información de cuenta:</strong> Nombre, email, contraseña</li>
                                    <li><strong>Información de perfil:</strong> Foto de perfil, ubicación, preferencias</li>
                                    <li><strong>Contenido del usuario:</strong> Comentarios, publicaciones, mensajes</li>
                                    <li><strong>Información de contacto:</strong> Cuando nos contactas o solicitas soporte</li>
                                </ul>

                                <h3>2.2 Información que recopilamos automáticamente</h3>
                                <ul>
                                    <li><strong>Información del dispositivo:</strong> Tipo de dispositivo, sistema operativo, navegador</li>
                                    <li><strong>Información de uso:</strong> Páginas visitadas, tiempo de navegación, clics</li>
                                    <li><strong>Información de ubicación:</strong> Dirección IP, ubicación aproximada</li>
                                    <li><strong>Cookies y tecnologías similares:</strong> Para mejorar la experiencia del usuario</li>
                                </ul>
                            </section>

                            <section id="uso" class="policy-section">
                                <h2>3. Cómo usamos tu información</h2>
                                <p>Utilizamos tu información para:</p>
                                <ul>
                                    <li><strong>Proporcionar nuestros servicios:</strong> Mantener tu cuenta, procesar solicitudes</li>
                                    <li><strong>Mejorar la experiencia:</strong> Personalizar contenido y funcionalidades</li>
                                    <li><strong>Comunicación:</strong> Enviarte actualizaciones, noticias y soporte</li>
                                    <li><strong>Seguridad:</strong> Detectar y prevenir actividades fraudulentas</li>
                                    <li><strong>Análisis:</strong> Entender cómo se utiliza nuestro servicio para mejorarlo</li>
                                    <li><strong>Marketing:</strong> Con tu consentimiento, enviarte información promocional</li>
                                </ul>
                            </section>

                            <section id="compartir" class="policy-section">
                                <h2>4. Compartir información</h2>
                                <p>No vendemos tu información personal. Podemos compartir tu información solo en estos casos:</p>
                                
                                <h3>4.1 Con tu consentimiento</h3>
                                <p>Compartiremos tu información cuando hayas dado tu consentimiento explícito.</p>
                                
                                <h3>4.2 Proveedores de servicios</h3>
                                <p>Con terceros que nos ayudan a operar nuestros servicios (hosting, análisis, email).</p>
                                
                                <h3>4.3 Requerimientos legales</h3>
                                <p>Cuando sea requerido por ley o para proteger nuestros derechos legales.</p>
                                
                                <h3>4.4 Información pública</h3>
                                <p>La información que elijas hacer pública (perfil, comentarios) será visible para otros usuarios.</p>
                            </section>

                            <section id="cookies" class="policy-section">
                                <h2>5. Cookies y tecnologías similares</h2>
                                <p>Utilizamos cookies y tecnologías similares para:</p>
                                <ul>
                                    <li>Mantener tu sesión iniciada</li>
                                    <li>Recordar tus preferencias</li>
                                    <li>Analizar el tráfico del sitio</li>
                                    <li>Personalizar tu experiencia</li>
                                </ul>
                                <p>
                                    Puedes controlar las cookies a través de la configuración de tu navegador. 
                                    Sin embargo, deshabilitar ciertas cookies puede afectar la funcionalidad del sitio.
                                </p>
                            </section>

                            <section id="seguridad" class="policy-section">
                                <h2>6. Seguridad de datos</h2>
                                <p>
                                    Implementamos medidas de seguridad técnicas y organizacionales para proteger 
                                    tu información personal contra acceso no autorizado, alteración, divulgación o destrucción.
                                </p>
                                <p>Estas medidas incluyen:</p>
                                <ul>
                                    <li>Encriptación de datos en tránsito y en reposo</li>
                                    <li>Controles de acceso estrictos</li>
                                    <li>Monitoreo regular de sistemas</li>
                                    <li>Capacitación del personal en seguridad</li>
                                </ul>
                            </section>

                            <section id="derechos" class="policy-section">
                                <h2>7. Tus derechos</h2>
                                <p>Tienes los siguientes derechos con respecto a tu información personal:</p>
                                <ul>
                                    <li><strong>Rectificación:</strong> Solicitar corrección de información incorrecta</li>
                                    <li><strong>Eliminación:</strong> Solicitar eliminación de tu información</li>
                                    <li><strong>Portabilidad:</strong> Solicitar transferencia de tus datos</li>
                                    <li><strong>Limitación:</strong> Solicitar restricción del procesamiento</li>
                                    <li><strong>Oposición:</strong> Oponerte al procesamiento de tus datos</li>
                                </ul>
                                <p>Para ejercer estos derechos, contacta con nosotros usando la información de contacto proporcionada.</p>
                            </section>

                            <section id="cambios" class="policy-section">
                                <h2>8. Cambios a esta política</h2>
                                <p>
                                    Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos 
                                    sobre cambios significativos publicando la nueva política en nuestro sitio web 
                                    y/o enviándote un email.
                                </p>
                                <p>
                                    La fecha de "Última actualización" al inicio de esta política indica 
                                    cuándo fue revisada por última vez.
                                </p>
                            </section>

                            <section id="contacto" class="policy-section">
                                <h2>9. Contacto</h2>
                                <p>
                                    Si tienes preguntas sobre esta Política de Privacidad o sobre cómo 
                                    manejamos tu información personal, puedes contactarnos:
                                </p>
                                <div class="contact-info">
                                    <div class="contact-method">
                                        <i class="bi bi-envelope"></i>
                                        <span>Email: privacidad@mottos.com.do</span>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
document.title = 'Política de Privacidad - Mottos.com.do';

const scrollTo = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
        });
    }
};
</script>

<style scoped>
.privacy-page {
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
    margin-bottom: 1rem;
}

.last-updated {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255,255,255,0.1);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
}

.content-container {
    padding: 4rem 0;
}

.content-card {
    background: white;
    border-radius: 16px;
    padding: 0;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    overflow: hidden;
}

.table-of-contents {
    background: #f8f9fa;
    padding: 2rem;
    border-bottom: 1px solid #eee;
    text-align: left;
}

.table-of-contents h3 {
    color: #1a1a1a;
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 1rem;
}

.table-of-contents ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.table-of-contents li {
    margin-bottom: 0.5rem;
}

.table-of-contents a {
    color: #666;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
}

.table-of-contents a:hover {
    color: #dc3545;
    text-decoration: none;
}

.policy-content {
    padding: 3rem;
}

.policy-section {
    margin-bottom: 3rem;
    scroll-margin-top: 100px;
}

.policy-section h2 {
    color: #1a1a1a;
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #dc3545;
    display: inline-block;
}

.policy-section h3 {
    color: #333;
    font-size: 1.25rem;
    font-weight: 600;
    margin: 2rem 0 1rem 0;
    text-align: left;
}

.policy-section p {
    font-size: 1.1rem;
    line-height: 1.8;
    color: #333;
    margin-bottom: 1.5rem;
    text-align: left;
}

.policy-section ul {
    font-size: 1.1rem;
    line-height: 1.8;
    color: #333;
    padding-left: 2rem;
    margin-bottom: 1.5rem;
    text-align: left;
}

.policy-section li {
    margin-bottom: 0.75rem;
}

.policy-section strong {
    color: #dc3545;
    font-weight: 600;
}

.contact-info {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 8px;
    border-left: 4px solid #dc3545;
}

.contact-method {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
}

.contact-method:last-child {
    margin-bottom: 0;
}

.contact-method i {
    color: #dc3545;
    font-size: 1.1rem;
    width: 20px;
}

.contact-method span {
    font-weight: 500;
    color: #333;
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
    
    .policy-content {
        padding: 2rem;
    }
    
    .table-of-contents {
        padding: 1.5rem;
    }
    
    .table-of-contents ul {
        columns: 1;
    }
    
    .policy-section h2 {
        font-size: 1.5rem;
    }
}

@media (min-width: 769px) {
    .table-of-contents ul {
        columns: 2;
        column-gap: 2rem;
    }
}
</style>