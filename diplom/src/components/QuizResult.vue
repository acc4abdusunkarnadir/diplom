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
            <span class="big"
              >{{ correctAnswers.length }}/{{ totalWords }}</span
            >
            <p>Correct Words</p>
          </div>
        </div>
        <div class="progress-stats">
          <div class="stat-item">
            <span class="stat-label">Accuracy</span>
            <span class="stat-value">{{ accuracy }}%</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Words Learned</span>
            <span class="stat-value">{{ learnedWordsCount }}</span>
          </div>
        </div>
        <div class="button-group">
          <button @click="retryQuiz" class="retry">Retry Quiz</button>
          <button @click="goToLearning" class="learn-more">
            Learn More Words
          </button>
        </div>
      </div>
    </div>

    <div class="words-section">
      <div class="words-card">
        <h3 class="word-title">
          Incorrect Answers
          <span class="badge red">{{ wrongAnswers.length }}</span>
        </h3>
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

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const wrongAnswers = ref([]);
const correctAnswers = ref([]);
const totalWords = ref(0);
const score = ref(0);
const learnedWordsCount = ref(0);

// Calculate accuracy percentage
const accuracy = computed(() => {
  if (totalWords.value === 0) return 0;
  return Math.round((correctAnswers.value.length / totalWords.value) * 100);
});

// Load quiz results and user progress
function loadResults() {
  const username = localStorage.getItem("username");
  if (!username) {
    router.push("/signin");
    return;
  }

  // Load quiz progress
  const savedProgress = localStorage.getItem(`quiz_progress_${username}`);
  if (savedProgress) {
    const progress = JSON.parse(savedProgress);
    score.value = progress.score || 0;
    correctAnswers.value = progress.correctAnswers || [];
    wrongAnswers.value = progress.wrongAnswers || [];
    totalWords.value = progress.words?.length || 0;
  }

  // Load learned words count
  const learnedWords = JSON.parse(localStorage.getItem("learnedWords") || "[]");
  learnedWordsCount.value = learnedWords.length;
}

function retryQuiz() {
  router.push("/quiz");
}

function goToLearning() {
  router.push("/learning");
}

onMounted(() => {
  loadResults();
});
</script>

<style scoped>
.main-content {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 2rem;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
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
  margin: 1.5rem 0;
}

.big {
  font-size: 2rem;
  font-weight: bold;
  color: #2a7ab0;
}

.progress-stats {
  margin: 1.5rem 0;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  margin: 0.5rem 0;
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-label {
  color: #666;
}

.stat-value {
  font-weight: bold;
  color: #2a7ab0;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s;
}

.retry {
  background: #2a7ab0;
  color: white;
}

.retry:hover {
  background: #1e5c8a;
}

.learn-more {
  background: #f8f9fa;
  color: #2a7ab0;
  border: 2px solid #2a7ab0;
}

.learn-more:hover {
  background: #e9ecef;
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
  align-items: center;
  margin-bottom: 1rem;
  color: #333;
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
  margin-top: 1rem;
}

.word-table th,
.word-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: center;
}

.word-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.wrong {
  color: #d9534f;
  font-weight: bold;
}

.correct {
  color: #5cb85c;
  font-weight: bold;
}

@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }

  .progress-card {
    max-width: 100%;
  }
}
</style>
