<script setup>
import WebHeader from "./components/WebHeader.vue";
import WebFooter from "./components/WebFooter.vue";
import Listening from "./components/Listening.vue"; // Import the Listening component
</script>

<template>
  <div class="app-container">
    <WebHeader />
    <main class="content">
      <router-view />
    </main>
    <WebFooter />
  </div>
</template>

<style scoped>
/* does not talk with screen, only with parent */
.app-container {
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
