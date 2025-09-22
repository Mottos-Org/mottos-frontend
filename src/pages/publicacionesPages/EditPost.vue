<template>
    <div class="edit-post-page">
        <CreatePublicacion 
            :is-editing="true"
            :post-id="route.params.id"
        />
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import CreatePublicacion from '../../components/ui/posts/CreatePublicacion.vue';

const route = useRoute();
</script>

<style scoped>
.edit-post-page {
    min-height: 100vh;
}
</style>