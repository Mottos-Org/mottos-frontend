<template>
  <div class="layout">
    <Navbar />

    <div class="content">
      <RouteTransition />
    </div>

    <Footer />
  </div>
</template>

<script setup>
import Navbar from './components/ui/Navbar.vue'
import Footer from './components/ui/Footer.vue'
import RouteTransition from './components/RouteTransition.vue'
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
