<template>
  <div class="flashcard">
    <div class="question">{{ currentQuestion }}</div>
    <button @click="showAnswer">Show Answer</button>
    <div v-if="answerVisible" class="answer">{{ currentAnswer }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentQuestion: 'What is the Kazakh word for "Hello"?',
      currentAnswer: "Сәлем",
      answerVisible: false,
    };
  },
  methods: {
    showAnswer() {
      this.answerVisible = true;
    },
  },
};
</script>

<style>
.header,
.footer {
  box-shadow: 0 2px 8px rgba(60, 60, 60, 0.04);
  border-bottom: 1px solid #e0e0e0;
}
.footer {
  border-top: 1px solid #e0e0e0;
  border-bottom: none;
}
</style>
