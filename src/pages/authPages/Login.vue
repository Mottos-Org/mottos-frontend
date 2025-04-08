<template>
    <div class="login-page">
        <div class="login-col">
            <motion.div class="login-card" :initial="{ opacity: 0, y: 30 }" :animate="{ opacity: 1, y: 0 }"
                :exit="{ opacity: 0, y: 30 }" :transition="{ duration: 0.5 }">
                <LoginForm />
            </motion.div>
        </div>
        <div class="login-col">
            adds
        </div>
    </div>
</template>

<script setup>
import { motion } from 'motion-v'
import LoginForm from '../../components/forms/LoginForm.vue';

</script>

<style scoped>
.login-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 800px;
    flex-wrap: wrap;
    /* padding: 20px; */
}

.login-col {
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