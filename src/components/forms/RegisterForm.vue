<template>
    <div class="card-body">
        <h2>Registro</h2>
        <p>
            Únete a la comunidad más grande de aficionados a las motos y conecta con otros motociclistas.
        </p>

        <form @submit.prevent="handleRegister">
            <h3>INFORMACIÓN PERSONAL</h3>
            <div class="grid grid-cols-2">
                <div>
                    <label for="nombre">Nombre</label>
                    <div class="relative">
                        <i class="fas fa-user"></i>
                        <input id="nombre" type="text" placeholder="Ingrese su nombre" v-model="nombre" required />
                    </div>
                </div>
                <div>
                    <label for="apellido">Apellido</label>
                    <div class="relative">
                        <i class="fas fa-user"></i>
                        <input id="apellido" type="text" placeholder="Ingrese su apellido" v-model="apellido"
                            required />
                    </div>
                </div>
            </div>

            <div>
                <label for="telefono">Teléfono</label>
                <div class="relative">
                    <i class="fas fa-phone"></i>
                    <input id="telefono" type="text" placeholder="+1 (809) 555-5555" v-model="telefono" />
                </div>
            </div>

            <h3>INFORMACIÓN DE CUENTA</h3>

            <div>
                <label for="email">Correo Electrónico</label>
                <div class="relative">
                    <i class="fas fa-envelope"></i>
                    <input id="email" type="email" placeholder="ejemplo@correo.com" v-model="email" required />
                </div>
            </div>

            <div class="grid grid-cols-2">
                <div>
                    <label for="password">Contraseña</label>
                    <div class="relative">
                        <i class="fas fa-lock"></i>
                        <input id="password" type="password" placeholder="Mínimo 8 caracteres" v-model="password"
                            required />
                    </div>
                </div>
                <div>
                    <label for="confirmPassword">Confirmar Contraseña</label>
                    <div class="relative">
                        <i class="fas fa-lock"></i>
                        <input id="confirmPassword" type="password" placeholder="Repita su contraseña"
                            v-model="confirmPassword" required />
                    </div>
                </div>
            </div>

            <div class="password-rules">
                <p>Requisitos de contraseña:</p>
                <ul>
                    <li>Mínimo 8 caracteres</li>
                    <li>Al menos una letra mayúscula</li>
                    <li>Al menos un número</li>
                    <li>Al menos un carácter especial</li>
                </ul>
            </div>

            <div class="terms">
                <input type="checkbox" id="acceptTerms" v-model="acceptTerms" required />
                <label for="acceptTerms">
                    Acepto los
                    <router-link to="#">Términos de uso</router-link>
                    y
                    <router-link to="#">Política de privacidad</router-link>
                </label>
            </div>

            <button type="submit" class="create-account-button">CREAR CUENTA</button>
            <span class="have-account">
                <p>¿Ya tienes una cuenta?</p>
                <router-link to="/auth/login" class="forgot-link">Inicia sesión</router-link>
            </span>
        </form>

        <div class="divider">
            <span>O REGÍSTRATE CON</span>
        </div>

        <div class="social-buttons">
            <button class="social-button google">
                <i class="fab fa-google"></i> Google
            </button>
            <button class="social-button facebook">
                <i class="fab fa-facebook-f"></i> Facebook
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();
const nombre = ref('');
const apellido = ref('');
const telefono = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const acceptTerms = ref(false);

async function handleRegister() {
    if (password.value !== confirmPassword.value) {
        toast.error('Las contraseñas no coinciden.');
        return;
    }

    try {
        // const response = await api.post('/auth/register', {
        //     nombre: nombre.value,
        //     apellido: apellido.value,
        //     telefono: telefono.value,
        //     email: email.value,
        //     password: password.value,
        // });

        // const { access_token, user } = response.data;

        // localStorage.setItem('access_token', access_token);
        // localStorage.setItem('user', JSON.stringify(user));

        router.push('/home');
    } catch (error) {
        console.error('Registro fallido:', error.response?.data || error.message);
        toast.error('Hubo un error al crear la cuenta. Intenta más tarde.');
    }
}

</script>

<style scoped>
.card-body {
    background-color: white;
    padding: 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 500px;
    margin: auto;
    border: 1px solid #ddd;
}

h2 {
    font-size: 1.9rem;
    font-weight: 700;
    color: #111;
    margin-bottom: 0.5rem;
    text-align: left;
}

p {
    font-size: 0.95rem;
    color: #555;
    margin-bottom: 1.5rem;
    text-align: left;
}

form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

form label {
    text-align: left;
}

h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.25rem;
    text-align: left;
}

.grid {
    display: grid;
    gap: 1rem;
}

.grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
}

label {
    display: block;
    font-size: 0.9rem;
    font-weight: 500;
    margin-bottom: 0.3rem;
    color: #333;
}

.relative {
    position: relative;
}

.relative i {
    position: absolute;
    top: 50%;
    left: 0.75rem;
    transform: translateY(-50%);
    color: #888;
}

input[type="text"],
input[type="email"],
input[type="password"] {
    width: 100%;
    padding: 0.6rem 0.75rem 0.6rem 2.5rem;
    border: 1px solid #ccc;
    border-radius: 0.375rem;
    font-size: 0.95rem;
    outline: none;
    background: white;
    color: #333;
}

input:focus {
    border-color: #a4161a;
}

.terms {
    display: flex;
    align-items: center;
    font-size: 0.9rem;
    color: #333;
    gap: 0.4rem;
}

.terms a {
    color: #a4161a;
    text-decoration: none;
    font-weight: 500;
}

.terms a:hover {
    text-decoration: underline;
    color: #8e1216;
}

.password-rules {
    background-color: #f0f8ff;
    border: 1px solid #bcd;
    color: #003366;
    font-size: 0.85rem;
    border-radius: 0.375rem;
    padding: 0.75rem 1rem;
    text-align: left;
}

.password-rules p {
    margin-bottom: 0.4rem;
    font-weight: 600;
    color: #003366;
}

.password-rules ul {
    padding-left: 1rem;
}

.password-rules li {
    margin-bottom: 0.25rem;
}

.create-account-button {
    background-color: #a4161a;
    color: white;
    padding: 0.6rem;
    border: none;
    border-radius: 0.375rem;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.create-account-button:hover {
    background-color: #8e1216;
    transform: scale(1.05);
}

.divider {
    text-align: center;
    color: #999;
    font-size: 0.85rem;
    margin: 1.5rem 0 1rem;
    position: relative;
}

.divider::before,
.divider::after {
    content: '';
    height: 1px;
    background: #ddd;
    width: 38%;
    position: absolute;
    top: 50%;
}

.divider::before {
    left: 0;
}

.divider::after {
    right: 0;
}

.social-buttons {
    display: flex;
    gap: 1rem;
}

.social-button {
    flex: 1;
    padding: 0.6rem;
    border: 1px solid #ccc;
    border-radius: 0.375rem;
    background: white;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    color: #333;
}

.social-button:hover {
    background-color: #f0f0f0;
    border-color: #a4161a;
    transform: scale(1.05);
}

.google i {
    color: #db4437;
}

.facebook i {
    color: #1877f2;
}

@media (max-width: 768px) {
    .grid-cols-2 {
        grid-template-columns: 1fr;
    }
}

.have-account {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: #333;
}

.have-account p {
    margin: 0;
}

.have-account .forgot-link {
    color: #a4161a;
    text-decoration: none;
    font-weight: 500;
    font-size: 0.85rem;
    transition: all 0.3s ease;
}

.have-account .forgot-link:hover {
    color: #8e1216;
    transform: scale(1.1);
}
</style>
