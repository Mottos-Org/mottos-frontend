<template>
    <div class="register-page">
        <div class="register-col">
            <motion.div class="register-card" :initial="{ opacity: 0, y: 30 }" :animate="{ opacity: 1, y: 0 }"
                :exit="{ opacity: 0, y: 30 }" :transition="{ duration: 0.5 }">
                <RegisterForm />
            </motion.div>
        </div>
        <div class="register-col">
            adds
        </div>
    </div>
</template>

<script setup>
import RegisterForm from '../../components/forms/RegisterForm.vue'
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { onMounted } from 'vue';
import { useAuthStore } from '../../stores/authStore';

const router = useRouter();
const toast = useToast();
const auth = useAuthStore();

onMounted(async () => {
    const isAuth = auth.isLoggedIn;
    if (isAuth) {
        toast.info('¡Ya estás autenticado! Cierra sesión para registrarte con otro usuario.');
        router.push('/auth/mi-cuenta');
    }
});
</script>

<style scoped>
.register-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    flex-wrap: wrap;
    padding: 20px;
    margin-bottom: 150px;
}

.register-col {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 300px;
}

.add-card {
    background-color: #1f2937;
    color: white;
    padding: 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 24rem;
}
</style>