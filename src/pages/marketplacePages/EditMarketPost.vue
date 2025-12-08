<template>
    <div class="edit-market-post-page">
        <CreateMarketplacePost 
            :is-editing="true"
            :post-id="route.params.id"
        />
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import CreateMarketplacePost from '../../components/forms/marketplace/CreateMarketplacePost.vue';

const route = useRoute();

document.title = 'Editar Producto - Mottos.com.do';
</script>

<style scoped>
.edit-market-post-page {
    min-height: 100vh;
}
</style>