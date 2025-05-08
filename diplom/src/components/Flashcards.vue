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
      currentAnswer: 'Сәлем',
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