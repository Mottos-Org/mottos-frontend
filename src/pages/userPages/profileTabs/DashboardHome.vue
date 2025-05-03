<template>
    <div style="padding: 25px">
        <div class="row g-4 mb-5">
            <div class="col-md-4" v-for="card in cards" :key="card.title">
                <div class="card shadow-sm h-100">
                    <div :class="['card-header text-white', card.bgGradient]"
                        style="border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem;">
                        <h6 class="mb-0 fw-bold">{{ card.title }}</h6>
                    </div>
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="icon-circle" :style="{ backgroundColor: card.iconBgColor }">
                                <i :class="card.icon" class="fs-4"></i>
                            </div>
                            <div class="text-center flex-grow-1">
                                <h3 class="fw-bold mb-0">{{ card.value }}</h3>
                                <small class="text-muted">{{ card.subtitle }}</small>
                            </div>
                            <div class="icon-circle" :style="{ backgroundColor: card.percentBgColor }">
                                <small class="fw-bold" :class="card.percentTextColor">{{ card.percentage }}</small>
                            </div>
                        </div>
                        <a href="#" :class="['fw-bold text-decoration-none', card.linkColor]">
                            {{ card.linkText }} <i class="bi bi-arrow-right ms-1"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <h5 class="fw-bold mb-4" style="text-align: left">Mis favoritos</h5>
        <div class="row g-4">
            <div class="col-md-6">
                <div class="card shadow-sm h-100">
                    <div class="card-body p-3 d-flex flex-column">
                        <div class="d-flex justify-content-between">
                            <span class="badge bg-danger">Premium</span>
                            <i class="bi bi-heart-fill text-danger"></i>
                        </div>
                        <div class="flex-grow-1 d-flex align-items-center justify-content-center">
                            <div class="placeholder-image"></div>
                        </div>
                        <div class="mt-3">
                            <h6 class="fw-bold mb-1">BMW Concept 101</h6>
                            <small class="text-muted">2022 • Usado • 1,000 Mi</small>
                            <div class="d-flex align-items-center mt-2">
                                <i class="bi bi-star-fill text-warning me-1"></i>
                                <small class="text-muted">4.0 (12 reseñas)</small>
                            </div>
                            <p class="fw-bold fs-5 mt-2">US $180,001.00</p>
                            <div class="d-flex gap-2">
                                <button class="btn btn-outline-dark btn-sm w-50">Contactar vendedor</button>
                                <button class="btn btn-danger btn-sm w-50">Ver detalles</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card shadow-sm h-100 d-flex align-items-center justify-content-center text-center p-4">
                    <div>
                        <i class="bi bi-heart fs-1 text-danger mb-3"></i>
                        <h6 class="fw-bold mb-2">Encuentra más motos</h6>
                        <p class="text-muted">Explora nuestro catálogo para descubrir más motos que te encantarán</p>
                        <button class="btn btn-danger btn-sm mt-2">
                            Explorar catálogo <i class="bi bi-arrow-right ms-1"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const cards = [
    {
        title: 'Motos Publicadas',
        value: '3 / 5',
        subtitle: 'Publicaciones activas',
        percentage: '60%',
        icon: 'bi bi-bicycle',
        iconBgColor: '#fee2e2',
        percentBgColor: '#fee2e2',
        percentTextColor: 'text-danger',
        linkText: 'Ver publicaciones',
        linkColor: 'text-danger',
        bgGradient: 'bg-gradient-red',
    },
    {
        title: 'Accesorios / Piezas',
        value: '2',
        subtitle: 'Accesorios publicados',
        percentage: '2',
        icon: 'bi bi-droplet-half',
        iconBgColor: '#dbeafe',
        percentBgColor: '#dbeafe',
        percentTextColor: 'text-primary',
        linkText: 'Ver accesorios',
        linkColor: 'text-primary',
        bgGradient: 'bg-gradient-blue',
    },
    {
        title: 'Vistas Totales',
        value: '377',
        subtitle: 'Vistas este mes',
        percentage: '+12%',
        icon: 'bi bi-eye',
        iconBgColor: '#dcfce7',
        percentBgColor: '#dcfce7',
        percentTextColor: 'text-success',
        linkText: 'Ver estadísticas',
        linkColor: 'text-success',
        bgGradient: 'bg-gradient-green',
    },
];
</script>

<style scoped>
.placeholder-image {
    width: 100%;
    height: 150px;
    background-color: #f8f9fa;
    border-radius: 0.5rem;
    background-image: url('/placeholder.svg');
    background-size: cover;
    background-position: center;
}

.icon-circle {
    width: 45px;
    height: 45px;
    border-radius: 9999px;
    display: flex;
    justify-content: center;
    align-items: center;
}

/* Custom Gradients */
.bg-gradient-red {
    background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
}

.bg-gradient-blue {
    background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
}

.bg-gradient-green {
    background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%);
}

.card-header {
    padding: 1rem;
}
</style>