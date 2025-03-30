<script setup>
import WebHeader from "./components/WebHeader.vue";
import WebFooter from "./components/WebFooter.vue";
import MainContent from "./components/MainContent.vue";
</script>

<template>
  <div class="app-container">
    <WebHeader />
    <main class="content">
     <MainContent />
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
  width: 100vw;
  flex-grow: 1; /* Ensure it takes up all available space */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

}
</style>
