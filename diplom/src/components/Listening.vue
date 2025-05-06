<template>
  <div class="listening-component">
    <h1>Kazakh Language Listening Quiz</h1>
    <div v-if="currentQuestion" class="question-section">
      <audio :src="currentQuestion.audio" controls></audio>
      <div class="options">
        <label v-for="(option, index) in currentQuestion.options" :key="index" class="option-label">
          <input type="radio" :value="option" v-model="userAnswer" />
          {{ option }}
        </label>
      </div>
      <button @click="checkAnswer" class="submit-button">Submit</button>
    </div>
    <div v-else class="result-section">
      <p>Quiz completed! Your score: {{ score }}/{{ questions.length }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      questions: [
        {
          audio: 'path/to/audio1.mp3',
          options: ['Option 1', 'Option 2', 'Option 3'],
          correctAnswer: 'Option 1',
        },
        // Add more questions as needed
      ],
      currentQuestionIndex: 0,
      userAnswer: null,
      score: 0,
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex];
    },
  },
  methods: {
    checkAnswer() {
      if (this.userAnswer === this.currentQuestion.correctAnswer) {
        this.score++;
      }
      this.userAnswer = null;
      this.currentQuestionIndex++;
    },
  },
};
</script>

<style scoped>
.listening-component {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.question-section {
  margin-bottom: 20px;
}

.options {
  margin-top: 10px;
}

.option-label {
  display: block;
  margin: 5px 0;
}

.submit-button {
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #45a049;
}

.result-section {
  font-size: 18px;
  color: #333;
}
</style>