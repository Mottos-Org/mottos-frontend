<template>
    <div class="mb-3">
        <p class="text-muted">
            {{ pagination.total }} publicaciones encontradas
        </p>
    </div>
</template>

<script setup>
// Props
defineProps({
    pagination: {
        type: Object,
        required: true
    }
});
</script>