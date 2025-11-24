<template>
  <div class="content" style="padding: 25px">
    <div class="mb-4" style="width: 100%; display: flex; flex-direction: column; align-items: baseline;">
      <h4>Direcciones del Usuario</h4>
      <p class="text-muted" style="margin-top: -7.5px">Administra las direcciones con las cuales publicás tus anuncios</p>
    </div>

    <UserAddressesManager />
  </div>
</template>

<script setup>
import UserAddressesManager from '@/components/forms/user/UserAddressesManager.vue';
</script>

<style scoped>
.content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.content h4 {
    font-weight: 850;
}
</style>