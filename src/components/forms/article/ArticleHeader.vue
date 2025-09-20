<template>
    <div class="page-header">
        <div class="header-content">
            <h1>
                <i class="bi bi-plus-circle"></i>
                {{ title }}
            </h1>
            <p>{{ subtitle }}</p>
        </div>
        <div class="header-actions">
            <router-link :to="backRoute" class="btn btn-outline-secondary">
                <i class="bi bi-arrow-left"></i>
                Volver a Noticias
            </router-link>
        </div>
    </div>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        required: true  
    },
    backRoute: {
        type: String,
        default: '/noticias'
    }
});
</script>

<style scoped>
.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3rem;
    padding: 2rem;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.header-content h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
}

.header-content h1 i {
    color: #dc3545;
}

.header-content p {
    color: #6c757d;
    margin: 0;
    font-size: 1.1rem;
}

.btn {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

@media (max-width: 768px) {
    .page-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }
    
    .header-content h1 {
        font-size: 2rem;
    }
}
</style>