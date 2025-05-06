<template>
  <div class="quiz-container" v-if="currentIndex < words.length">
    <div class="progress-circle">
      <svg class="progress-ring" width="260" height="260">
        <circle class="bg-ring" cx="130" cy="130" r="120"></circle>
        <circle class="fg-ring" cx="130" cy="130" r="120"></circle>
      </svg>
      <div class="quiz-content">
        <div class="top-right">
          <p class="score-title">{{ score }}</p>
          <p class="score-subtitle">ұпай</p>
        </div>
        <div class="word-content">
          <h2 class="word-main">{{ words[currentIndex].kazakh }}</h2>
          <input
            v-model="userAnswer"
            placeholder="Enter translation"
            class="answer-input"
          />
        </div>
        <div class="button-group">
          <button @click="checkAnswer" class="correct-btn">Submit</button>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="result-container">
    <h2>Quiz Finished!</h2>
    <p>Total Wrong Answers: {{ wrongAnswers.length }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      words: [], // Initialize as an empty array
      currentIndex: 0,
      userAnswer: "",
      score: 0,
      wrongAnswers: [],
      correctAnswers: [],
    };
  },
  created() {
    this.fetchWords();
  },
  methods: {
    async fetchWords() {
      try {
        const response = await fetch("http://localhost:3000/api/words");
        if (response.ok) {
          this.words = await response.json();
        } else {
          console.error("Failed to fetch words");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    },
    checkAnswer() {
      let currentWord = this.words[this.currentIndex];
      if (
        this.userAnswer.trim().toLowerCase() ===
        currentWord.english.toLowerCase()
      ) {
        this.score += 10;
        this.correctAnswers.push(currentWord);
      } else {
        this.wrongAnswers.push(currentWord);
      }
      this.userAnswer = "";
      this.currentIndex++;

      if (this.currentIndex >= this.words.length) {
        localStorage.setItem("wrongAnswers", JSON.stringify(this.wrongAnswers));
        localStorage.setItem(
          "correctAnswers",
          JSON.stringify(this.correctAnswers)
        );
        setTimeout(() => {
          this.$router.push("/");
        }, 2000);
      }
    },
  },
};
</script>

<style scoped>
.quiz-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
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
  stroke-dashoffset: 250;
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

.top-left,
.top-right {
  position: absolute;
  top: 10%;
  text-align: center;
}

.top-left {
  left: 15%;
}

.top-right {
  right: 15%;
}

.score-title {
  font-size: 18px;
  font-weight: bold;
}

.score-subtitle {
  font-size: 12px;
  color: gray;
}

.word-content {
  text-align: center;
}

.word-main {
  font-size: 24px;
  font-weight: bold;
}

.answer-input {
  margin-top: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 180px;
  text-align: center;
}

.button-group {
  margin-top: 10px;
}

.correct-btn {
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.correct-btn:hover {
  background-color: #388e3c;
}

.result-container {
  text-align: center;
  padding: 20px;
}
</style>
