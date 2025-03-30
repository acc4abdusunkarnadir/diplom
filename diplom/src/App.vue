<script setup>
import WebHeader from "./components/WebHeader.vue";
import WebFooter from "./components/WebFooter.vue";
</script>

<template>
  <div class="app-container">
    <WebHeader />
    <main class="content">
     
    </main>
    <WebFooter />
  </div>
</template>

<style scoped>

.app-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Ensure full viewport height */
}

.content {
  width: 100%;
  flex-grow: 1; /* Ensure it takes up all available space */
  display: flex;
  flex-direction: column;
}
</style>
