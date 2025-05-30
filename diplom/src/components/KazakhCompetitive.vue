<template>
  <div class="competitive-container">
    <h1>Kazakh Competitive Quiz</h1>
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
      <button @click="submitScore" class="submit-btn">Submit Score</button>
      <button @click="restartQuiz" class="restart-btn">Restart</button>
    </div>
    <div v-else class="loading-section">
      <p>Loading quiz...</p>
    </div>
    <div class="leaderboard-section">
      <h2>Leaderboard</h2>
      <ul>
        <li v-for="(entry, idx) in leaderboard" :key="idx">
          {{ entry.username }}: {{ entry.score }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import dataset from "../dataset.json";

const router = useRouter();
const questions = ref([]);
const currentIndex = ref(0);
const score = ref(0);
const selectedOption = ref(null);
const showAnswer = ref(false);
const quizFinished = ref(false);
const leaderboard = ref([]);
const isAuthenticated = ref(false);
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

  const progress = localStorage.getItem(`competitive_progress_${username}`);
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
    `competitive_progress_${username}`,
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

async function submitScore() {
  const username = localStorage.getItem("username");
  const userLevel = localStorage.getItem("userLevel");

  if (!username || !userLevel) {
    router.push("/signin");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/scores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        score: score.value,
        quizType: "competitive",
        level: userLevel,
        date: new Date().toISOString(),
      }),
    });

    if (response.ok) {
      alert("Score submitted successfully!");
      await loadLeaderboard(); // Reload leaderboard after submission
    } else {
      const errorData = await response.json();
      alert(errorData.error || "Failed to submit score. Please try again.");
    }
  } catch (error) {
    console.error("Error submitting score:", error);
    if (error.message.includes("Failed to fetch")) {
      alert(
        "Cannot connect to server. Please make sure the server is running."
      );
    } else {
      alert("Error submitting score. Please try again.");
    }
  }
}

async function loadLeaderboard() {
  const userLevel = localStorage.getItem("userLevel");
  if (!userLevel) return;

  try {
    const response = await fetch(
      `http://localhost:3000/api/leaderboard/${userLevel}`
    );
    if (response.ok) {
      const data = await response.json();
      leaderboard.value = data.sort((a, b) => b.score - a.score).slice(0, 10);
    } else {
      const errorData = await response.json();
      console.error("Error loading leaderboard:", errorData.error);
    }
  } catch (error) {
    console.error("Error loading leaderboard:", error);
  }
}

onMounted(async () => {
  try {
    isLoading.value = true;
    // Check authentication first
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

    // Load leaderboard
    await loadLeaderboard();
  } catch (error) {
    console.error("Error initializing quiz:", error);
    alert("Error loading quiz. Please try again.");
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.competitive-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.question-section {
  text-align: center;
  margin-bottom: 2rem;
}

.kazakh-word {
  font-size: 2rem;
  font-weight: bold;
  margin: 1rem 0;
  color: #2a7ab0;
}

.options-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.option-btn {
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1.1rem;
}

.option-btn:hover:not(:disabled) {
  border-color: #2a7ab0;
  background: #f8f9fa;
}

.option-btn.selected {
  border-color: #2a7ab0;
  background: #e3f2fd;
}

.option-btn.correct {
  border-color: #4caf50;
  background: #e8f5e9;
}

.option-btn.wrong {
  border-color: #f44336;
  background: #ffebee;
}

.option-btn:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.quiz-controls {
  text-align: center;
  margin: 1rem 0;
}

.next-btn {
  padding: 0.75rem 2rem;
  background: #2a7ab0;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: background 0.3s;
}

.next-btn:hover {
  background: #1e5c8a;
}

.score-info {
  text-align: center;
  color: #666;
  margin-top: 1rem;
}

.result-section {
  text-align: center;
  margin: 2rem 0;
}

.result-section h2 {
  color: #2a7ab0;
  margin-bottom: 1rem;
}

.submit-btn,
.restart-btn {
  padding: 0.75rem 1.5rem;
  margin: 0.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;
}

.submit-btn {
  background: #4caf50;
  color: white;
}

.submit-btn:hover {
  background: #388e3c;
}

.restart-btn {
  background: #f5f5f5;
  color: #333;
}

.restart-btn:hover {
  background: #e0e0e0;
}

.leaderboard-section {
  margin-top: 3rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 10px;
}

.leaderboard-section h2 {
  color: #2a7ab0;
  margin-bottom: 1rem;
  text-align: center;
}

.leaderboard-section ul {
  list-style: none;
  padding: 0;
}

.leaderboard-section li {
  padding: 0.75rem;
  margin: 0.5rem 0;
  background: white;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.loading-section {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-size: 1.2rem;
}

@media (max-width: 600px) {
  .options-section {
    grid-template-columns: 1fr;
  }

  .competitive-container {
    padding: 1rem;
  }
}
</style>
