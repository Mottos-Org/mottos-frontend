<template>
    <div>
        <div class="row mb-4">
            <div class="col-md-4" v-for="card in cards" :key="card.title">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h6 class="text-muted">{{ card.title }}</h6>
                        <h2 class="fw-bold">{{ card.value }}</h2>
                        <a href="#" class="text-danger fw-bold text-decoration-none">
                            {{ card.linkText }} <i class="bi bi-arrow-right ms-1"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <h5 class="fw-bold">Mis favoritos</h5>
        <div class="row">
            <div class="col-md-6">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h6 class="fw-bold mb-1">BMW Concept 101</h6>
                        <small class="text-muted">2022 - Condición: Usado - 1,000 Mi</small>
                        <p class="mb-1"><strong>US $180,001.00</strong></p>
                        <button class="btn btn-danger btn-sm">Ver</button>
                    </div>
                </div>
            </div>

            <div
                class="col-md-6 d-flex align-items-center justify-content-center border border-secondary-subtle rounded py-5 text-center text-muted">
                <div>
                    <i class="bi bi-heart fs-1 mb-2"></i>
                    <p>Encuentra más motos</p>
                    <button class="btn btn-outline-dark btn-sm">Explorar catálogo</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const cards = [
    { title: 'Motos Publicadas', value: '3 / 5', linkText: 'Ver publicaciones' },
    { title: 'Accesorios / Piezas', value: '2', linkText: 'Ver accesorios' },
    { title: 'Vistas Totales', value: '377', linkText: 'Ver estadísticas' },
];
</script>