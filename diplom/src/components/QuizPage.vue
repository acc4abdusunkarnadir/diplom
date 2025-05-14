<template>
  <div class="quiz-container" v-if="currentIndex < words.length">
    <div class="progress-circle">
      <svg class="progress-ring" width="260" height="260">
        <circle class="bg-ring" cx="130" cy="130" r="120"></circle>
        <circle
          class="fg-ring"
          cx="130"
          cy="130"
          r="120"
          :style="{ strokeDashoffset: progressOffset }"
        ></circle>
      </svg>
      <div class="quiz-content">
        <div class="top-right">
          <p class="score-title">{{ score }}</p>
          <p class="score-subtitle">ұпай</p>
        </div>

        <div class="flip-card" :class="{ 'is-flipped': isFlipped }">
          <div class="flip-card-inner">
            <div class="flip-card-front">
              <h2 class="word-main">{{ words[currentIndex].kazakh }}</h2>
              <div class="answer-input-container">
                <input
                  v-model="userAnswer"
                  placeholder="Enter translation"
                  class="answer-input"
                  @keyup.enter="handleEnter"
                  ref="answerInput"
                />
              </div>
              <div class="button-group">
                <button
                  @click="checkAnswer"
                  class="correct-btn"
                  :disabled="!userAnswer.trim()"
                >
                  Check Answer
                </button>
              </div>
            </div>
            <div class="flip-card-back">
              <h2 class="word-main">{{ words[currentIndex].kazakh }}</h2>
              <h3 class="translation">{{ words[currentIndex].english }}</h3>
              <div class="button-group">
                <button @click="nextQuestion" class="correct-btn">Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="result-container">
    <h2>Quiz Finished!</h2>
    <p>Total Score: {{ score }} / {{ words.length * 10 }}</p>
    <p>Correct Answers: {{ correctAnswers.length }}</p>
    <p>Wrong Answers: {{ wrongAnswers.length }}</p>
    <div class="review-section" v-if="wrongAnswers.length > 0">
      <h3>Review Wrong Answers:</h3>
      <div class="review-cards">
        <div
          v-for="(word, index) in wrongAnswers"
          :key="index"
          class="review-card"
        >
          <div class="review-card-front">
            <h4>{{ word.kazakh }}</h4>
          </div>
          <div class="review-card-back">
            <h4>{{ word.english }}</h4>
          </div>
        </div>
      </div>
    </div>
    <button @click="restartQuiz" class="restart-btn">Restart Quiz</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import dataset from "../dataset.json";

const router = useRouter();
const words = ref([]);
const currentIndex = ref(0);
const userAnswer = ref("");
const score = ref(0);
const wrongAnswers = ref([]);
const correctAnswers = ref([]);
const isFlipped = ref(false);
const answerInput = ref(null);
const userProgress = ref({});

// Calculate progress for the ring
const progressOffset = computed(() => {
  if (words.value.length === 0) return 750;
  const progress = (currentIndex.value / words.value.length) * 750;
  return 750 - progress;
});

// Load words from learned words in localStorage
function loadWords() {
  const learnedWords = new Set(
    JSON.parse(localStorage.getItem("learnedWords") || "[]")
  );

  // Get all words from dataset
  const allWords = dataset.map((word, index) => ({
    ...word,
    id: index.toString(),
  }));

  // Filter only learned words
  words.value = allWords.filter((word) => learnedWords.has(word.id));

  // If no words are learned, show a message and redirect
  if (words.value.length === 0) {
    alert("Please learn some words first in the Learning System!");
    router.push("/learning");
    return;
  }

  // Shuffle the words
  words.value.sort(() => Math.random() - 0.5);

  // Load user's previous progress if exists
  const username = localStorage.getItem("username");
  if (username) {
    const savedProgress = localStorage.getItem(`quiz_progress_${username}`);
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      score.value = progress.score || 0;
      correctAnswers.value = progress.correctAnswers || [];
      wrongAnswers.value = progress.wrongAnswers || [];
    }
  }
}

function checkAnswer() {
  if (!userAnswer.value.trim()) return;

  const currentWord = words.value[currentIndex.value];
  if (
    userAnswer.value.trim().toLowerCase() === currentWord.english.toLowerCase()
  ) {
    score.value += 10;
    correctAnswers.value.push(currentWord);
  } else {
    wrongAnswers.value.push(currentWord);
  }

  isFlipped.value = true;
  saveUserProgress();
}

function nextQuestion() {
  userAnswer.value = "";
  currentIndex.value++;
  isFlipped.value = false;

  // Focus the input field for the next question
  if (currentIndex.value < words.value.length) {
    setTimeout(() => {
      answerInput.value?.focus();
    }, 100);
  } else {
    // Save final results when quiz is finished
    saveUserProgress();
  }
}

function handleEnter() {
  if (userAnswer.value.trim() && !isFlipped.value) {
    checkAnswer();
  } else if (isFlipped.value) {
    nextQuestion();
  }
}

function restartQuiz() {
  currentIndex.value = 0;
  score.value = 0;
  userAnswer.value = "";
  wrongAnswers.value = [];
  correctAnswers.value = [];
  isFlipped.value = false;
  loadWords();
}

// Save user progress to localStorage
function saveUserProgress() {
  const username = localStorage.getItem("username");
  if (!username) return;

  const progress = {
    score: score.value,
    correctAnswers: correctAnswers.value,
    wrongAnswers: wrongAnswers.value,
    lastQuizDate: new Date().toISOString(),
    words: words.value.map((word) => word.id), // Save the word IDs for reference
  };

  localStorage.setItem(`quiz_progress_${username}`, JSON.stringify(progress));
}

// Watch for changes in learned words
watch(
  () => localStorage.getItem("learnedWords"),
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      loadWords();
    }
  },
  { deep: true }
);

onMounted(() => {
  loadWords();
  // Focus the input field when component mounts
  setTimeout(() => {
    answerInput.value?.focus();
  }, 100);
});
</script>

<style scoped>
.quiz-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
}

.progress-circle {
  position: relative;
  width: 230px;
  height: 260px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.progress-ring {
  position: absolute;
  top: 0;
  left: 0;
  transform: rotate(-90deg);
}

.bg-ring {
  fill: none;
  stroke: #e0e0e0;
  stroke-width: 10;
}

.fg-ring {
  fill: none;
  stroke: #2a7ab0;
  stroke-width: 10;
  stroke-dasharray: 750;
  transition: stroke-dashoffset 0.6s ease-in-out;
}

.quiz-content {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.top-right {
  position: absolute;
  top: 10%;
  right: 15%;
  text-align: center;
}

.score-title {
  font-size: 18px;
  font-weight: bold;
}

.score-subtitle {
  font-size: 12px;
  color: gray;
}

.flip-card {
  background-color: transparent;
  width: 300px;
  height: 200px;
  perspective: 1000px;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.flip-card.is-flipped .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}

.flip-card-front {
  background-color: #ffffff;
  color: #333;
}

.flip-card-back {
  background-color: #f8f9fa;
  color: #333;
  transform: rotateY(180deg);
}

.word-main {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.translation {
  font-size: 1.2rem;
  color: #2a7ab0;
}

.answer-input-container {
  width: 100%;
  margin: 1rem 0;
}

.answer-input {
  width: 80%;
  padding: 0.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 5px;
  font-size: 1rem;
  text-align: center;
}

.answer-input:focus {
  outline: none;
  border-color: #2a7ab0;
}

.button-group {
  margin-top: 1rem;
}

.correct-btn {
  padding: 0.5rem 1rem;
  background-color: #2a7ab0;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.correct-btn:hover {
  background-color: #1e5c8a;
}

.correct-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.result-container {
  text-align: center;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.result-container h2 {
  color: #2a7ab0;
  margin-bottom: 1.5rem;
}

.result-container p {
  font-size: 1.2rem;
  margin: 0.5rem 0;
  color: #333;
}

.review-section {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 10px;
}

.review-section h3 {
  color: #2a7ab0;
  margin-bottom: 1rem;
}

.review-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.review-card {
  background-color: white;
  padding: 1rem;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.review-card:hover {
  transform: translateY(-2px);
}

.review-card h4 {
  margin: 0;
  color: #333;
}

.restart-btn {
  margin-top: 2rem;
  padding: 0.75rem 1.5rem;
  background-color: #2a7ab0;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.restart-btn:hover {
  background-color: #1e5c8a;
}
</style>
