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

    <div class="pagination">
      <button
        @click="currentPage--"
        :disabled="currentPage === 1"
        class="pagination-btn"
      >
        Previous
      </button>
      <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        @click="currentPage++"
        :disabled="currentPage >= totalPages"
        class="pagination-btn"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
import dataset from "../dataset.json";

export default {
  name: "LearningSystem",
  data() {
    return {
      allWords: [],
      currentWordIndex: 0,
      isFlipped: false,
      wordsPerBatch: 10,
      totalWords: 0,
      learnedWords: new Set(),
      showLearned: false,
      currentPage: 1,
      wordsPerPage: 10,
    };
  },
  computed: {
    learnedWordsCount() {
      return this.learnedWords.size;
    },
    totalPages() {
      return Math.ceil(this.totalWords / this.wordsPerPage);
    },
    currentWords() {
      const start = (this.currentPage - 1) * this.wordsPerPage;
      const end = start + this.wordsPerPage;
      let words = this.allWords.slice(start, end);
      if (this.showLearned) {
        words = words.filter((word) => this.learnedWords.has(word.id));
      }
      return words;
    },
  },
  methods: {
    async fetchWords() {
      try {
        const response = dataset;
        if (Array.isArray(response)) {
          this.allWords = response.map((word, index) => ({
            ...word,
            id: index.toString(),
          }));
          this.totalWords = this.allWords.length;
        }
      } catch (error) {
        console.error("Error loading words:", error);
      }
    },
    toggleFlip(index) {
      this.isFlipped = this.isFlipped === index ? false : index;
    },
    toggleLearned(wordId) {
      if (this.learnedWords.has(wordId)) {
        this.learnedWords.delete(wordId);
      } else {
        this.learnedWords.add(wordId);
      }
      this.saveProgress();
    },
    saveProgress() {
      localStorage.setItem(
        "learnedWords",
        JSON.stringify(Array.from(this.learnedWords))
      );
      localStorage.setItem("currentPage", this.currentPage.toString());
    },
    loadProgress() {
      const savedLearnedWords = localStorage.getItem("learnedWords");
      const savedPage = localStorage.getItem("currentPage");

      if (savedLearnedWords) {
        this.learnedWords = new Set(JSON.parse(savedLearnedWords));
      }
      if (savedPage) {
        this.currentPage = parseInt(savedPage);
      }
    },
  },
  mounted() {
    this.fetchWords();
    this.loadProgress();
  },
};
</script>

<style scoped>
.learning-system {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.progress-container {
  margin-bottom: 2rem;
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
</style>
