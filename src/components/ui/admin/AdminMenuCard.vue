<template>
    <router-link :to="to" class="admin-menu-card text-decoration-none">
        <div class="card-body d-flex flex-column align-items-center justify-content-center h-100">
            <div class="admin-menu-icon mb-3">
                <i :class="icon"></i>
            </div>
            <h5 class="fw-bold mb-2 text-center text-dark">{{ title }}</h5>
            <p class="text-muted text-center mb-0 small">{{ description }}</p>
        </div>
    </router-link>
</template>

<script setup>
defineProps({
    title: String,
    icon: String,
    description: String,
    to: String
});
</script>

<style scoped>
.admin-menu-card {
    display: block;
    background: #fff;
    border-radius: 1rem;
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
    transition: box-shadow 0.2s, transform 0.2s;
    min-height: 220px;
    padding: 1.5rem 1rem;
    cursor: pointer;
    border: none;
}

.admin-menu-card:hover {
    box-shadow: 0 6px 32px rgba(220, 54, 54, 0.13);
    transform: translateY(-4px) scale(1.03);
    text-decoration: none;
}

.admin-menu-icon {
    font-size: 2.5rem;
    color: #d63636;
    background: #f8d7da;
    border-radius: 50%;
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>