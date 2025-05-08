<template>
  <div class="progress-bar">
    <div class="progress" :style="{ width: progressPercentage + '%' }"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      progressPercentage: 0, // Update this value based on user progress
    };
  },
};
</script>

<style scoped>
.progress-bar {
  width: 100%;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
}

.progress {
  height: 20px;
  background-color: #4caf50;
  transition: width 0.3s ease;
}
</style>