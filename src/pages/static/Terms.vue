<!-- filepath: /src/pages/static/Terms.vue -->
<template>
    <div class="terms-page">
        <div class="hero-section">
            <div class="container">
                <h1>Términos y Condiciones</h1>
                <p class="hero-subtitle">Normas de uso de nuestra plataforma</p>
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
                                <li><a href="#aceptacion" @click="scrollTo('aceptacion')">1. Aceptación de términos</a></li>
                                <li><a href="#servicios" @click="scrollTo('servicios')">2. Descripción de servicios</a></li>
                                <li><a href="#registro" @click="scrollTo('registro')">3. Registro y cuenta</a></li>
                                <li><a href="#uso-apropiado" @click="scrollTo('uso-apropiado')">4. Uso apropiado</a></li>
                                <li><a href="#contenido-usuario" @click="scrollTo('contenido-usuario')">5. Contenido del usuario</a></li>
                                <li><a href="#propiedad" @click="scrollTo('propiedad')">6. Propiedad intelectual</a></li>
                                <li><a href="#prohibiciones" @click="scrollTo('prohibiciones')">7. Conductas prohibidas</a></li>
                                <li><a href="#terminacion" @click="scrollTo('terminacion')">8. Terminación de cuenta</a></li>
                                <li><a href="#limitacion" @click="scrollTo('limitacion')">9. Limitación de responsabilidad</a></li>
                                <li><a href="#cambios-terminos" @click="scrollTo('cambios-terminos')">10. Cambios a los términos</a></li>
                                <li><a href="#ley-aplicable" @click="scrollTo('ley-aplicable')">11. Ley aplicable</a></li>
                                <li><a href="#contacto-terminos" @click="scrollTo('contacto-terminos')">12. Contacto</a></li>
                            </ul>
                        </nav>

                        <div class="terms-content">
                            <section id="aceptacion" class="terms-section">
                                <h2>1. Aceptación de términos</h2>
                                <p>
                                    Al acceder y utilizar Mottos.com.do ("la plataforma", "el sitio", "nuestro servicio"), 
                                    usted acepta cumplir y estar sujeto a estos Términos y Condiciones. Si no está de 
                                    acuerdo con alguna parte de estos términos, no debe utilizar nuestro servicio.
                                </p>
                                <p>
                                    Estos términos constituyen un acuerdo legalmente vinculante entre usted y Mottos.com.do.
                                </p>
                            </section>

                            <section id="servicios" class="terms-section">
                                <h2>2. Descripción de servicios</h2>
                                <p>Mottos.com.do es una plataforma digital que ofrece:</p>
                                <ul>
                                    <li>Contenido informativo sobre motocicletas y cultura motociclística</li>
                                    <li>Noticias del mundo del motociclismo</li>
                                    <li>Espacio para interacción entre miembros de la comunidad motociclística</li>
                                    <li>Recursos educativos sobre seguridad vial y mantenimiento</li>
                                    <li>Información sobre eventos y actividades relacionadas con motocicletas</li>
                                </ul>
                            </section>

                            <section id="registro" class="terms-section">
                                <h2>3. Registro y cuenta</h2>
                                <p>Para acceder a ciertas funciones, debe registrarse y crear una cuenta:</p>
                                <ul>
                                    <li>Debe proporcionar información veraz y actualizada</li>
                                    <li>Es responsable de mantener la confidencialidad de su contraseña</li>
                                    <li>Debe ser mayor de 18 años o tener autorización parental</li>
                                    <li>Solo puede tener una cuenta activa</li>
                                    <li>Es responsable de todas las actividades en su cuenta</li>
                                </ul>
                            </section>

                            <section id="uso-apropiado" class="terms-section">
                                <h2>4. Uso apropiado</h2>
                                <p>Al utilizar nuestra plataforma, usted se compromete a:</p>
                                <ul>
                                    <li>Usar el servicio solo para fines legales y apropiados</li>
                                    <li>Respetar los derechos de otros usuarios</li>
                                    <li>No interferir con el funcionamiento del sitio</li>
                                    <li>Cumplir con todas las leyes aplicables</li>
                                    <li>Mantener un comportamiento respetuoso en la comunidad</li>
                                </ul>
                            </section>

                            <section id="contenido-usuario" class="terms-section">
                                <h2>5. Contenido del usuario</h2>
                                <p>Respecto al contenido que publique en la plataforma:</p>
                                <ul>
                                    <li>Usted retiene la propiedad de su contenido original</li>
                                    <li>Nos otorga una licencia para usar, mostrar y distribuir su contenido</li>
                                    <li>Es responsable de la exactitud y legalidad de su contenido</li>
                                    <li>No debe publicar contenido que infrinja derechos de terceros</li>
                                    <li>Nos reservamos el derecho de moderar y remover contenido</li>
                                </ul>
                            </section>

                            <section id="propiedad" class="terms-section">
                                <h2>6. Propiedad intelectual</h2>
                                <p>
                                    Todo el contenido de Mottos.com.do, incluyendo textos, imágenes, logos, 
                                    diseños y código, está protegido por derechos de autor y otras leyes de 
                                    propiedad intelectual. No puede usar nuestro contenido sin autorización expresa.
                                </p>
                            </section>

                            <section id="prohibiciones" class="terms-section">
                                <h2>7. Conductas prohibidas</h2>
                                <p>Está estrictamente prohibido:</p>
                                <ul>
                                    <li>Publicar contenido ofensivo, discriminatorio o ilegal</li>
                                    <li>Acosar o intimidar a otros usuarios</li>
                                    <li>Intentar acceder a cuentas de terceros</li>
                                    <li>Usar bots o automatización no autorizada</li>
                                    <li>Distribuir malware o contenido malicioso</li>
                                    <li>Violar derechos de propiedad intelectual</li>
                                    <li>Realizar actividades comerciales no autorizadas</li>
                                </ul>
                            </section>

                            <section id="terminacion" class="terms-section">
                                <h2>8. Terminación de cuenta</h2>
                                <p>
                                    Nos reservamos el derecho de suspender o terminar su cuenta en cualquier momento, 
                                    con o sin notificación previa, si consideramos que ha violado estos términos o 
                                    por cualquier otra razón que consideremos apropiada.
                                </p>
                                <p>
                                    Usted puede cancelar su cuenta en cualquier momento contactándonos o 
                                    usando las opciones disponibles en su perfil.
                                </p>
                            </section>

                            <section id="limitacion" class="terms-section">
                                <h2>9. Limitación de responsabilidad</h2>
                                <p>
                                    Mottos.com.do se proporciona "tal como está" sin garantías de ningún tipo. 
                                    No somos responsables de daños directos, indirectos, incidentales o 
                                    consecuentes que puedan resultar del uso de nuestro servicio.
                                </p>
                                <div class="important-notice">
                                    <i class="bi bi-exclamation-triangle"></i>
                                    <strong>Importante:</strong> La información sobre motocicletas y seguridad vial 
                                    es solo educativa. Siempre consulte con profesionales calificados.
                                </div>
                            </section>

                            <section id="cambios-terminos" class="terms-section">
                                <h2>10. Cambios a los términos</h2>
                                <p>
                                    Nos reservamos el derecho de modificar estos términos en cualquier momento. 
                                    Los cambios significativos se notificarán con al menos 30 días de anticipación. 
                                    El uso continuado del servicio después de los cambios constituye aceptación 
                                    de los nuevos términos.
                                </p>
                            </section>

                            <section id="ley-aplicable" class="terms-section">
                                <h2>11. Ley aplicable</h2>
                                <p>
                                    Estos términos se rigen por las leyes de la República Dominicana. 
                                    Cualquier disputa será resuelta en los tribunales competentes de 
                                    Santo Domingo, República Dominicana.
                                </p>
                            </section>

                            <section id="contacto-terminos" class="terms-section">
                                <h2>12. Contacto</h2>
                                <p>
                                    Si tiene preguntas sobre estos Términos y Condiciones, puede contactarnos:
                                </p>
                                <div class="contact-info">
                                    <div class="contact-item">
                                        <i class="bi bi-envelope"></i>
                                        <span>legal@mottos.com.do</span>
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
.terms-page {
    min-height: 100vh;
    background: #f8f9fa;
}

.hero-section {
    background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
    color: white;
    padding: 4rem 0 3rem 0;
    text-align: center;
}

.hero-section h1 {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1rem;
}

.hero-subtitle {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0.9;
}

.last-updated {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255,255,255,0.1);
    padding: 0.5rem 1rem;
    border-radius: 25px;
    font-size: 0.9rem;
}

.content-container {
    padding: 3rem 0;
}

.content-card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
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

.terms-content {
    padding: 2rem;
}

.terms-section {
    margin-bottom: 3rem;
}

.terms-section h2 {
    color: #dc3545;
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid rgba(220, 53, 69, 0.1);
}

.terms-section p {
    line-height: 1.7;
    margin-bottom: 1rem;
    color: #495057;
    text-align: left;
}

.terms-section ul {
    padding-left: 1.5rem;
    margin-bottom: 1rem;
    text-align: left;
}

.terms-section li {
    margin-bottom: 0.5rem;
    color: #495057;
    line-height: 1.6;
}

.important-notice {
    background: #fff3cd;
    border: 1px solid #ffeaa7;
    border-radius: 8px;
    padding: 1rem;
    margin: 1.5rem 0;
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    text-align: left;
}

.important-notice i {
    color: #856404;
    font-size: 1.2rem;
    margin-top: 0.1rem;
}

.important-notice strong {
    color: #856404;
}

.contact-info {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 12px;
    border: 2px solid #e9ecef;
    margin-top: 1rem;
}

.contact-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
    color: #495057;
}

.contact-item:last-child {
    margin-bottom: 0;
}

.contact-item i {
    color: #dc3545;
    font-size: 1.1rem;
    width: 20px;
}

@media (max-width: 768px) {
    .hero-section h1 {
        font-size: 2rem;
    }
    
    .hero-subtitle {
        font-size: 1rem;
    }
    
    .table-of-contents,
    .terms-content {
        padding: 1.5rem;
    }
    
    .content-container {
        padding: 2rem 0;
    }
}

@media (min-width: 769px) {
    .table-of-contents ul {
        columns: 2;
        column-gap: 2rem;
    }
}
</style>