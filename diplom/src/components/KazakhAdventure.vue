<template>
  <div class="quiz-container">
    <h1>Kazakh Quick Quiz</h1>
    <div v-if="!quizFinished && currentQuestion">
      <div class="question-section">
        <h2>What is the English meaning of:</h2>
        <div class="kazakh-word">{{ currentQuestion.kazakh }}</div>
      </div>
      <div class="options-section">
        <button
          v-for="(option, idx) in currentQuestion.options"
          :key="idx"
          class="option-btn"
          :class="{
            selected: selectedOption === option,
            correct: showAnswer && option === currentQuestion.english,
            wrong:
              showAnswer &&
              selectedOption === option &&
              option !== currentQuestion.english,
          }"
          :disabled="showAnswer"
          @click="selectOption(option)"
        >
          {{ option }}
        </button>
      </div>
      <div class="quiz-controls">
        <button
          v-if="showAnswer && !quizFinished"
          @click="nextQuestion"
          class="next-btn"
        >
          Next
        </button>
      </div>
      <div class="score-info">
        Question {{ currentIndex + 1 }} / {{ questions.length }}
      </div>
    </div>
    <div v-else-if="quizFinished" class="result-section">
      <h2>Quiz Finished!</h2>
      <p>Your score: {{ score }} / {{ questions.length }}</p>
      <button @click="restartQuiz" class="restart-btn">Restart</button>
    </div>
    <div v-else class="loading-section">
      <p>Loading quiz...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import dataset from "../dataset.json";

const router = useRouter();
const isAuthenticated = ref(false);
const questions = ref([]);
const currentIndex = ref(0);
const score = ref(0);
const selectedOption = ref(null);
const showAnswer = ref(false);
const quizFinished = ref(false);
const isLoading = ref(true);

const currentQuestion = computed(() => {
  if (!questions.value.length || currentIndex.value >= questions.value.length) {
    return null;
  }
  return questions.value[currentIndex.value];
});

function generateQuestions(learnedWords) {
  // Get all words from dataset
  const allWords = dataset.map((word, index) => ({
    ...word,
    id: index.toString(),
  }));

  // Filter only learned words
  const learnedWordsList = allWords.filter((word) => learnedWords.has(word.id));

  // If no learned words, return empty array
  if (learnedWordsList.length === 0) {
    return [];
  }

  // Generate questions with options
  return learnedWordsList.map((word) => {
    // Get 3 random wrong options from other learned words
    const wrongOptions = learnedWordsList
      .filter((w) => w.id !== word.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((w) => w.english);

    // Combine correct and wrong options, then shuffle
    const options = [...wrongOptions, word.english].sort(
      () => Math.random() - 0.5
    );

    return {
      kazakh: word.kazakh,
      english: word.english,
      options: options,
    };
  });
}

function getUserProgress() {
  const username = localStorage.getItem("username");
  if (!username) return null;

  const progress = localStorage.getItem(`adventure_progress_${username}`);
  return progress ? JSON.parse(progress) : null;
}

function saveUserProgress() {
  const username = localStorage.getItem("username");
  if (!username) return;

  const progress = {
    currentIndex: currentIndex.value,
    score: score.value,
    quizFinished: quizFinished.value,
    lastQuizDate: new Date().toISOString(),
  };

  localStorage.setItem(
    `adventure_progress_${username}`,
    JSON.stringify(progress)
  );
}

function loadUserProgress() {
  const username = localStorage.getItem("username");
  if (!username) {
    router.push("/signin");
    return;
  }

  // Check if this is a new session
  const lastLoginTime = localStorage.getItem(`last_login_${username}`);
  const currentTime = new Date().toISOString();

  // If no last login time or it's a new session, reset everything
  if (!lastLoginTime) {
    // Clear all progress for this user
    localStorage.removeItem(`adventure_progress_${username}`);
    localStorage.removeItem(`competitive_progress_${username}`);

    // Set new login time
    localStorage.setItem(`last_login_${username}`, currentTime);

    // Reset all state
    currentIndex.value = 0;
    score.value = 0;
    quizFinished.value = false;
    selectedOption.value = null;
    showAnswer.value = false;
  }
}

function selectOption(option) {
  if (showAnswer.value) return;
  selectedOption.value = option;
  showAnswer.value = true;
  if (option === currentQuestion.value.english) {
    score.value++;
  }
  // If last question, finish quiz
  if (currentIndex.value === questions.value.length - 1) {
    setTimeout(() => {
      quizFinished.value = true;
      saveUserProgress();
    }, 700);
  }
}

function nextQuestion() {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++;
    selectedOption.value = null;
    showAnswer.value = false;
    saveUserProgress();
  }
}

function restartQuiz() {
  currentIndex.value = 0;
  score.value = 0;
  selectedOption.value = null;
  showAnswer.value = false;
  quizFinished.value = false;
  saveUserProgress();
}

// Initialize component
onMounted(async () => {
  try {
    isAuthenticated.value = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated.value) {
      router.push("/signin");
      return;
    }

    // Get learned words from localStorage
    const learnedWords = new Set(
      JSON.parse(localStorage.getItem("learnedWords") || "[]")
    );

    // Generate questions from learned words
    questions.value = generateQuestions(learnedWords);

    // If no questions were generated, show a message
    if (questions.value.length === 0) {
      alert("Please learn some words first in the Learning System!");
      router.push("/learning");
      return;
    }

    // Load user progress (this will reset for new sessions)
    loadUserProgress();
  } catch (error) {
    console.error("Error initializing quiz:", error);
    alert("Error loading quiz. Please try again.");
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.quiz-container {
  max-width: 420px;
  margin: 40px auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(60, 60, 60, 0.1);
  padding: 2.5rem 2rem 2rem 2rem;
  text-align: center;
}
.quiz-container h1 {
  color: #4f46e5;
  margin-bottom: 1.5rem;
}
.question-section {
  margin-bottom: 1.5rem;
}
.kazakh-word {
  font-size: 2.2rem;
  font-weight: 700;
  color: #18181b;
  margin: 1rem 0 0.5rem 0;
}
.options-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.option-btn {
  padding: 0.9rem 1.2rem;
  border-radius: 12px;
  border: 2px solid #e0e7ff;
  background: #f8fafc;
  color: #3730a3;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s;
}
.option-btn.selected {
  background: #ede9fe;
  border-color: #a5b4fc;
}
.option-btn.correct {
  background: #bbf7d0;
  border-color: #22c55e;
  color: #166534;
}
.option-btn.wrong {
  background: #fecaca;
  border-color: #ef4444;
  color: #991b1b;
}
.option-btn:disabled {
  cursor: not-allowed;
  opacity: 0.85;
}
.quiz-controls {
  margin-bottom: 1.2rem;
}
.next-btn,
.restart-btn {
  padding: 0.7rem 1.5rem;
  border-radius: 24px;
  border: none;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(60, 60, 60, 0.08);
  transition: background 0.2s;
}
.next-btn:hover,
.restart-btn:hover {
  background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%);
}
.score-info {
  color: #64748b;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}
.result-section h2 {
  color: #22c55e;
  margin-bottom: 0.7rem;
}
.result-section p {
  font-size: 1.2rem;
  color: #18181b;
  margin-bottom: 1.5rem;
}
.loading-section {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-size: 1.2rem;
}
</style>
