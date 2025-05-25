<template>
  <div class="learning-system">
    <div class="progress-container">
      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: `${(learnedWordsCount / totalWords) * 100}%` }"
        ></div>
      </div>
      <div class="progress-text">
        {{ learnedWordsCount }} / {{ totalWords }} words learned
      </div>
    </div>

    <div class="controls">
      <button @click="showLearned = !showLearned" class="control-btn">
        {{ showLearned ? "Show All Words" : "Show Learned Words" }}
      </button>
    </div>

    <div v-if="!allWords.length" class="no-words">Loading words...</div>

    <template v-else>
      <div class="word-cards-container">
        <div class="word-cards">
          <div
            v-for="(word, index) in currentWords"
            :key="word.id"
            class="word-card"
            :class="{ learned: learnedWords.has(word.id) }"
          >
            <div
              class="card-inner"
              :class="{ 'is-flipped': isFlipped === index }"
              @click="toggleFlip(index)"
            >
              <div class="card-front">
                <h3>{{ word.kazakh }}</h3>
              </div>
              <div class="card-back">
                <h3>{{ word.english }}</h3>
              </div>
            </div>
            <button
              class="mark-learned-btn"
              @click.stop="toggleLearned(word.id)"
              :class="{ learned: learnedWords.has(word.id) }"
            >
              {{ learnedWords.has(word.id) ? "Learned" : "Mark as Learned" }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="totalPages > 1" class="pagination">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="pagination-btn"
        >
          Previous
        </button>
        <span class="page-info"
          >Page {{ currentPage }} of {{ totalPages }}</span
        >
        <button
          @click="currentPage++"
          :disabled="currentPage >= totalPages"
          class="pagination-btn"
        >
          Next
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isAuthenticated = ref(false);
const allWords = ref([]);
const currentWordIndex = ref(0);
const isFlipped = ref(false);
const wordsPerBatch = ref(10);
const totalWords = ref(0);
const learnedWords = ref(new Set());
const showLearned = ref(false);
const currentPage = ref(1);
const wordsPerPage = ref(10);
const userLevel = ref(localStorage.getItem("userLevel") || "A1");

// Initialize computed properties
const learnedWordsCount = computed(() => learnedWords.value.size);
const totalPages = computed(() =>
  Math.ceil(totalWords.value / wordsPerPage.value)
);

const currentWords = computed(() => {
  console.log("Computing currentWords");
  console.log("allWords.value:", allWords.value);
  console.log("currentPage:", currentPage.value);
  console.log("wordsPerPage:", wordsPerPage.value);

  const start = (currentPage.value - 1) * wordsPerPage.value;
  const end = start + wordsPerPage.value;
  let words = allWords.value.slice(start, end);

  console.log("Sliced words:", words);

  if (showLearned.value) {
    words = words.filter((word) => learnedWords.value.has(word.id));
  }

  console.log("Final currentWords:", words);
  return words;
});

// Check authentication and initialize data
onMounted(async () => {
  console.log("Component mounted");
  isAuthenticated.value = localStorage.getItem("isAuthenticated") === "true";
  console.log("Is authenticated:", isAuthenticated.value);

  if (!isAuthenticated.value) {
    router.push("/signin");
    return;
  }

  console.log("User level:", userLevel.value);
  await fetchWords();
  loadProgress();

  // Reset currentPage if it's out of bounds after loading words and progress
  if (currentPage.value > totalPages.value) {
    console.log(
      `currentPage (${currentPage.value}) is out of bounds for totalPages (${totalPages.value}). Resetting to 1.`
    );
    currentPage.value = 1;
  }
  console.log("Initial currentPage after checks:", currentPage.value);
});

async function fetchWords() {
  try {
    console.log("Starting fetchWords");
    console.log("Dataset type:", typeof dataset);
    console.log("Dataset length:", dataset.length);
    console.log("User level:", userLevel.value);

    if (!Array.isArray(dataset)) {
      console.error("Dataset is not an array");
      return;
    }

    // For A1/A2 levels, take first 100 words
    // For other levels, take more words
    const maxWords = getWordCount(userLevel.value);
    console.log("Max words for level:", maxWords);

    // Ensure we don't try to slice more words than available
    const actualMaxWords = Math.min(maxWords, dataset.length);
    console.log(
      "Actual max words (considering dataset length):",
      actualMaxWords
    );

    const words = dataset.slice(0, actualMaxWords).map((word, index) => ({
      ...word,
      id: index.toString(),
      level: userLevel.value,
    }));

    console.log("Processed words count:", words.length);
    console.log("First few words:", words.slice(0, 3));

    allWords.value = [...words]; // Create a new array to ensure reactivity
    totalWords.value = words.length;

    console.log("allWords.value length:", allWords.value.length);
    console.log("totalWords:", totalWords.value);
    // We don't log currentWords here as it depends on currentPage, which might be adjusted next.
  } catch (error) {
    console.error("Error in fetchWords:", error);
  }
}

function toggleFlip(index) {
  isFlipped.value = isFlipped.value === index ? false : index;
}

function toggleLearned(wordId) {
  if (learnedWords.value.has(wordId)) {
    learnedWords.value.delete(wordId);
  } else {
    learnedWords.value.add(wordId);
  }
  saveProgress();
}

function saveProgress() {
  localStorage.setItem(
    "learnedWords",
    JSON.stringify(Array.from(learnedWords.value))
  );
  localStorage.setItem("currentPage", currentPage.value.toString());
}

function loadProgress() {
  const savedLearnedWords = localStorage.getItem("learnedWords");
  const savedPage = localStorage.getItem("currentPage");

  console.log("Loading progress...");
  console.log("Saved learned words:", savedLearnedWords);
  console.log("Saved page:", savedPage);

  if (savedLearnedWords) {
    learnedWords.value = new Set(JSON.parse(savedLearnedWords));
  }
  if (savedPage) {
    // Ensure savedPage is a valid number before parsing
    const parsedPage = parseInt(savedPage);
    if (!isNaN(parsedPage) && parsedPage >= 1) {
      currentPage.value = parsedPage;
    } else {
      console.warn("Invalid saved page value:", savedPage);
      currentPage.value = 1; // Default to first page
    }
  } else {
    currentPage.value = 1; // Default to first page if no saved page
  }
  console.log("currentPage after loading:", currentPage.value);
}
</script>

<style scoped>
.learning-system {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100%;
}

.progress-container {
  margin-bottom: 2rem;
  background-color: white;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.progress-bar {
  width: 100%;
  height: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #4caf50;
  transition: width 0.3s ease;
}

.progress-text {
  text-align: center;
  margin-top: 0.5rem;
  font-size: 1.1rem;
  color: #666;
}

.controls {
  margin-bottom: 2rem;
  text-align: center;
}

.control-btn {
  padding: 0.5rem 1rem;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}

.control-btn:hover {
  background-color: #1976d2;
}

.word-cards-container {
  overflow-y: auto;
  max-height: calc(
    100vh - 400px
  ); /* Adjusted for header, footer, and other elements */
  padding: 1rem;
  margin: -1rem;
}

.word-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.word-card {
  perspective: 1000px;
  height: 200px;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  cursor: pointer;
}

.card-inner.is-flipped {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-back {
  transform: rotateY(180deg);
}

.word-card h3 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.mark-learned-btn {
  width: 100%;
  padding: 0.5rem;
  margin-top: 1rem;
  background-color: #f0f0f0;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.mark-learned-btn:hover {
  background-color: #e0e0e0;
}

.mark-learned-btn.learned {
  background-color: #4caf50;
  color: white;
}

.word-card.learned {
  opacity: 0.7;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  background-color: white;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  bottom: 0;
  z-index: 10;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.pagination-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.page-info {
  font-size: 1.1rem;
  color: #666;
}

/* Add smooth scrolling */
.word-cards-container {
  scroll-behavior: smooth;
}

/* Add custom scrollbar */
.word-cards-container::-webkit-scrollbar {
  width: 8px;
}

.word-cards-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.word-cards-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.word-cards-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 70px;
  background: #e5e6e7;
  z-index: 1000;
  /* ...other styles... */
}

.no-words {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin: 2rem 0;
}
</style>
