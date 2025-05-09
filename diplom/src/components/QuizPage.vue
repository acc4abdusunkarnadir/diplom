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

        <div
          class="flip-card"
          :class="{ 'is-flipped': isFlipped }"
          @click="toggleFlip"
        >
          <div class="flip-card-inner">
            <div class="flip-card-front">
              <h2 class="word-main">{{ words[currentIndex].kazakh }}</h2>
              <div class="answer-input-container">
                <input
                  v-model="userAnswer"
                  placeholder="Enter translation"
                  class="answer-input"
                  @keyup.enter="handleEnter"
                />
              </div>
              <div class="button-group">
                <button @click="toggleFlip" class="correct-btn">
                  Check Answer
                </button>
              </div>
            </div>
            <div class="flip-card-back">
              <h2 class="word-main">{{ words[currentIndex].kazakh }}</h2>
              <h3 class="translation">{{ words[currentIndex].english }}</h3>
              <div class="button-group">
                <button @click="checkAnswer" class="correct-btn">Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="result-container">
    <h2>Quiz Finished!</h2>
    <p>Total Wrong Answers: {{ wrongAnswers.length }}</p>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      words: [],
      currentIndex: 0,
      userAnswer: "",
      score: 0,
      wrongAnswers: [],
      correctAnswers: [],
      isFlipped: false,
    };
  },
  created() {
    this.fetchWords();
  },
  methods: {
    handleEnter() {
      if (this.userAnswer.trim()) {
        this.toggleFlip();
      }
    },
    toggleFlip() {
      this.isFlipped = !this.isFlipped;
    },
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
      this.isFlipped = false;

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

/* Flip Card Styles */
.flip-card {
  background-color: transparent;
  width: 300px;
  height: 200px;
  perspective: 1000px;
  cursor: pointer;
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
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.hint-text {
  font-size: 14px;
  color: #666;
  margin-top: 10px;
}

.answer-input-container {
  margin: 20px 0;
}

.answer-input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 200px;
  text-align: center;
  font-size: 16px;
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

/* Result Container Styles */
.result-container {
  text-align: center;
  padding: 20px;
}

.review-section {
  margin-top: 30px;
}

.review-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin-top: 20px;
}

.review-card {
  width: 150px;
  height: 100px;
  perspective: 1000px;
  cursor: pointer;
}

.review-card-front,
.review-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.6s;
}

.review-card-front {
  background-color: #ffffff;
}

.review-card-back {
  background-color: #f8f9fa;
  transform: rotateY(180deg);
}

.review-card:hover .review-card-front {
  transform: rotateY(180deg);
}

.review-card:hover .review-card-back {
  transform: rotateY(0);
}

.translation {
  font-size: 20px;
  color: #2a7ab0;
  margin: 10px 0;
}
</style>
