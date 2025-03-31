<script setup>
import WebHeader from "./components/WebHeader.vue";
import WebFooter from "./components/WebFooter.vue";
</script>

<template>
  <div class="app-container">
    <WebHeader />
    <body class="content">
      <router-view /> 
  </body>
    <WebFooter />
  </div>
</template>

<style scoped>
.app-container {
  width: 100vw !important;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  width: 100vw;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
