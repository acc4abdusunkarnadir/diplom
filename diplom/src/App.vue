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

<style>
/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  background-color: #f5f5f5;
}

/* App container styles */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1 0 auto;
  width: 100%;
  padding-top: 70px; /* Height of the header */
  padding-bottom: 2rem; /* Space before footer */
}
</style>
