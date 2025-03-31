<template>
  <div class="main-content">
    <div class="progress-section">
      <div class="progress-card">
        <h2 class="progress-title">Quiz Summary</h2>
        <p class="progress-subtitle">Good job!</p>
        <div class="progress-info">
          <div class="points">
            <span class="big">{{ score }}</span>
            <p>ұпай</p>
          </div>
          <div class="words">
            <span class="big">{{ correctAnswers.length }}/{{ totalWords }}</span>
            <p>Correct Words</p>
          </div>
        </div>
        <button @click="retryQuiz" class="retry">Retry</button>
      </div>
    </div>

    <div class="words-section">
      <div class="words-card">
        <h3 class="word-title">Incorrect Answers <span class="badge red">{{ wrongAnswers.length }}</span></h3>
        <table class="word-table">
          <thead>
            <tr>
              <th>Kazakh</th>
              <th>Your Answer</th>
              <th>Correct Answer</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(word, index) in wrongAnswers" :key="index">
              <td>{{ word.kazakh }}</td>
              <td class="wrong">{{ word.userAnswer }}</td>
              <td class="correct">{{ word.english }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      wrongAnswers: JSON.parse(localStorage.getItem("wrongAnswers")) || [],
      correctAnswers: JSON.parse(localStorage.getItem("correctAnswers")) || [],
      totalWords: JSON.parse(localStorage.getItem("words"))?.length || 0,
      score: 30 + (JSON.parse(localStorage.getItem("correctAnswers"))?.length || 0) * 10
    };
  },
  methods: {
    retryQuiz() {
      this.$router.push("/quiz"); // Restart quiz
    }
  }
};
</script>

<style scoped>
.main-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2rem;
  padding: 20px;
}

.progress-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.progress-info {
  display: flex;
  justify-content: space-around;
  margin: 1rem 0;
}

.big {
  font-size: 2rem;
  font-weight: bold;
}

button {
  margin-top: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
}

.retry {
  background: #f4f4f4;
}

.words-section {
  flex-grow: 1;
}

.words-card {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.word-title {
  font-weight: bold;
  display: flex;
  justify-content: space-between;
}

.badge {
  padding: 0.2rem 0.5rem;
  border-radius: 5px;
  font-size: 0.8rem;
}

.red {
  background: #fbd4d4;
  color: #d9534f;
}

.word-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.word-table th, .word-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

.word-table th {
  background: #f4f4f4;
}

.wrong {
  color: red;
  font-weight: bold;
}

.correct {
  color: green;
  font-weight: bold;
}
</style>
