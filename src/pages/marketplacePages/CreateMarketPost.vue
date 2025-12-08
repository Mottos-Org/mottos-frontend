<template>
    <div class="create-market-post-page">
        <CreateMarketplacePost />
    </div>
</template>

<script setup>
import CreateMarketplacePost from '../../components/forms/marketplace/CreateMarketplacePost.vue';

document.title = 'Publicar en el Mercado - Mottos.com.do';
</script>

<style scoped>
.create-market-post-page {
    min-height: 100vh;
}
</style>