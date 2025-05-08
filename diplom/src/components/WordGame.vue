<template>
  <div class="game-container">
    <h1>Word Learning Game</h1>
    <div v-if="currentWordIndex < words.length" class="game-section">
      <p class="word-display">{{ words[currentWordIndex].kazakh }}</p>
      <input v-model="userInput" placeholder="Type the translation" class="word-input" />
      <button @click="checkWord" class="submit-button">Submit</button>
    </div>
    <div v-else class="game-over">
      <h2>Game Over!</h2>
      <p>Your Score: {{ score }}</p>
      <button @click="restartGame" class="restart-button">Play Again</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      words: [
        { kazakh: 'Сәлем', english: 'Hello' },
        { kazakh: 'Кітап', english: 'Book' },
        // Add more words as needed
      ],
      currentWordIndex: 0,
      userInput: '',
      score: 0,
    };
  },
  methods: {
    checkWord() {
      const currentWord = this.words[this.currentWordIndex];
      if (this.userInput.trim().toLowerCase() === currentWord.english.toLowerCase()) {
        this.score += 10;
      }
      this.userInput = '';
      this.currentWordIndex++;
    },
    restartGame() {
      this.currentWordIndex = 0;
      this.score = 0;
    },
  },
};
</script>

<style scoped>
.game-container {
  text-align: center;
  padding: 20px;
  background-color: #f0f0f0;
  font-family: 'Press Start 2P', cursive; /* Use a pixelated font */
}

.game-section {
  margin-top: 20px;
}

.word-display {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.word-input {
  margin-top: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 200px;
  font-family: 'Press Start 2P', cursive; /* Use a pixelated font */
}

.submit-button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Press Start 2P', cursive; /* Use a pixelated font */
}

.submit-button:hover {
  background-color: #388E3C;
}

.game-over {
  margin-top: 20px;
}

.restart-button {
  padding: 10px 20px;
  background-color: #007ACC;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Press Start 2P', cursive; /* Use a pixelated font */
}

.restart-button:hover {
  background-color: #005F99;
}
</style>