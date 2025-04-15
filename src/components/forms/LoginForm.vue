<template>
    <div class="card-body">
        <h2 class="login-title">Acceso</h2>
        <p class="login-subtitle">
            ¡Bienvenido de nuevo! Por favor ingrese su nombre de usuario y contraseña para iniciar sesión.
        </p>
        
        <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-group">
                <label for="email">Correo Electrónico</label>
                <input id="email" type="email" placeholder="Ingresa tu correo..." v-model="email" required />
            </div>
            
            <div class="form-group">
                <label for="password">
                    <span>Contraseña</span>
                    <router-link to="#" class="forgot-link">¿Olvidaste tu Contraseña?</router-link>
                </label>
                <input id="password" type="password" placeholder="Ingresa tu contraseña..." v-model="password" required />
            </div>
            
            <div class="form-remember">
                <input type="checkbox" id="rememberMe" v-model="rememberMe" />
                <label for="rememberMe">Recordarme</label>
            </div>
            
            <button type="submit" class="submit-button">ACCESO</button>
            <span class="have-account">
                <p>¿No tienes cuenta?</p>
                <router-link to="/auth/register" class="forgot-link">Regístrate</router-link>
            </span>
        </form>
        
        <div class="divider">
            <span>INICIA SESIÓN CON</span>
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
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../../stores/authStore';
import { showValidationErrors } from '../../utils/formatUtils';

const baseUrl = import.meta.env.VITE_API_URL;
const auth = useAuthStore();
const router = useRouter();
const toast = useToast();
const email = ref('');
const password = ref('');
const rememberMe = ref(false);

async function handleLogin() {
    try {
        const response = await axios.post(`${baseUrl}/api/login`, {
            email: email.value,
            password: password.value,
        });

        auth.setAuth(response.data);
        toast.success('¡Has iniciado sesión exitosamente!');
        router.push('/auth/mi-cuenta');

    } catch (error) {
        console.error('Login error:', error);
        const responseData = error.response?.data || {};
        showValidationErrors(toast, responseData);
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

.login-title {
    font-family: 'Cabin', sans-serif !important;
    font-size: 1.9rem;
    margin-bottom: 0.5rem;
    font-weight: 700;
    color: #111;
    text-align: left;
}

.login-subtitle {
    font-size: 0.95rem;
    color: #555;
    margin-bottom: 1.5rem;
    text-align: left;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-group label {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
    font-weight: 500;
    margin-bottom: 0.3rem;
    color: #333;
}

.form-group input {
    width: 100%;
    padding: 0.6rem 0.75rem;
    border: 1px solid #ccc;
    border-radius: 0.375rem;
    font-size: 0.95rem;
    outline: none;
    background: white;
    color: #333;
}

.form-group input:focus {
    border-color: #a4161a;
}

.forgot-link {
    color: #a4161a;
    text-decoration: none;
    font-weight: 500;
    font-size: 0.85rem;
    transition: all 0.3s ease;
}

.forgot-link:hover {
    color: #8e1216;
    transform: scale(1.1);
}

.form-remember {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.9rem;
    color: #333;
}

.form-remember input {
    background: white;
}

.submit-button {
    background-color: #a4161a;
    color: white;
    padding: 0.6rem;
    border: none;
    border-radius: 0.375rem;
    font-weight: 600;
    cursor: pointer;
    font-size: 0.95rem;
    transition: all 0.3s ease;
}

.submit-button:hover {
    background-color: #8e1216;
    transform: scale(1.05);
}

.divider {
    text-align: center;
    color: #999;
    font-size: 0.85rem;
    margin: 1rem 0;
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