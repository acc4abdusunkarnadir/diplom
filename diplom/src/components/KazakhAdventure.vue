<template>
  <div class="game-container">
    <div class="game-header">
      <h1>Kazakh Word Adventure</h1>
      <div class="stats">
        <span>Score: {{ score }}</span>
        <span>Level: {{ currentLevel }}</span>
        <span>Keys: {{ keys }}</span>
      </div>
    </div>

    <div class="game-world">
      <canvas ref="gameCanvas" width="800" height="600"></canvas>
    </div>

    <div v-if="showQuestion" class="question-modal">
      <div class="question-content">
        <h3>{{ currentQuestion.question }}</h3>
        <div v-if="currentQuestion.type === 'listening'" class="audio-player">
          <audio :src="currentQuestion.audio" controls></audio>
        </div>
        <div class="options">
          <button
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            @click="checkAnswer(option)"
            class="option-button"
          >
            {{ option }}
          </button>
        </div>
      </div>
    </div>

    <div class="controls">
      <button @click="movePlayer('up')" class="control-button">↑</button>
      <div class="horizontal-controls">
        <button @click="movePlayer('left')" class="control-button">←</button>
        <button @click="movePlayer('right')" class="control-button">→</button>
      </div>
      <button @click="movePlayer('down')" class="control-button">↓</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "KazakhAdventure",
  data() {
    return {
      score: 0,
      currentLevel: 1,
      keys: 0,
      playerPosition: { x: 100, y: 100 },
      showQuestion: false,
      currentQuestion: null,
      gameMap: null,
      playerSprite: null,
      gameObjects: [],
      questions: [
        {
          type: "vocabulary",
          question: 'What is the Kazakh word for "Hello"?',
          options: ["Сәлем", "Қош келдіңіз", "Рақмет", "Сау болыңыз"],
          correctAnswer: "Сәлем",
          difficulty: 1,
        },
        {
          type: "listening",
          question: "Listen and choose the correct meaning",
          audio: "/audio/hello.mp3",
          options: ["Hello", "Goodbye", "Thank you", "Please"],
          correctAnswer: "Hello",
          difficulty: 1,
        },
        {
          type: "vocabulary",
          question: 'What is the Kazakh word for "Thank you"?',
          options: ["Сәлем", "Қош келдіңіз", "Рақмет", "Сау болыңыз"],
          correctAnswer: "Рақмет",
          difficulty: 1,
        },
        {
          type: "vocabulary",
          question: 'What is the Kazakh word for "Goodbye"?',
          options: ["Сәлем", "Қош келдіңіз", "Рақмет", "Сау болыңыз"],
          correctAnswer: "Сау болыңыз",
          difficulty: 1,
        },
      ],
      reviewQuestions: [],
    };
  },
  mounted() {
    this.initGame();
    window.addEventListener("keydown", this.handleKeyPress);
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.handleKeyPress);
  },
  methods: {
    initGame() {
      const canvas = this.$refs.gameCanvas;
      const ctx = canvas.getContext("2d");

      this.loadAssets().then(() => {
        this.gameLoop(ctx);
      });
    },
    async loadAssets() {
      // Load player sprite
      this.playerSprite = new Image();
      this.playerSprite.src = "/sprites/player.png";

      // Load game map
      this.gameMap = new Image();
      this.gameMap.src = "/maps/level1.png";

      // Initialize game objects
      this.gameObjects = [
        { type: "door", x: 300, y: 200, locked: true },
        { type: "chest", x: 400, y: 300, opened: false },
        { type: "npc", x: 500, y: 400, question: this.getRandomQuestion() },
      ];

      // Wait for all assets to load
      return Promise.all([
        new Promise((resolve) => {
          this.playerSprite.onload = resolve;
        }),
        new Promise((resolve) => {
          this.gameMap.onload = resolve;
        }),
      ]);
    },
    gameLoop(ctx) {
      // Clear canvas
      ctx.clearRect(0, 0, 800, 600);

      // Draw map
      ctx.drawImage(this.gameMap, 0, 0);

      // Draw game objects
      this.gameObjects.forEach((obj) => {
        switch (obj.type) {
          case "door":
            ctx.fillStyle = obj.locked ? "#8B4513" : "#228B22";
            ctx.fillRect(obj.x, obj.y, 40, 60);
            break;
          case "chest":
            ctx.fillStyle = obj.opened ? "#CD853F" : "#DAA520";
            ctx.fillRect(obj.x, obj.y, 30, 30);
            break;
          case "npc":
            ctx.fillStyle = "#4169E1";
            ctx.fillRect(obj.x, obj.y, 30, 50);
            break;
        }
      });

      // Draw player
      if (this.playerSprite) {
        ctx.drawImage(
          this.playerSprite,
          this.playerPosition.x,
          this.playerPosition.y,
          32,
          32
        );
      }

      // Continue game loop
      requestAnimationFrame(() => this.gameLoop(ctx));
    },
    handleKeyPress(event) {
      switch (event.key) {
        case "ArrowUp":
          this.movePlayer("up");
          break;
        case "ArrowDown":
          this.movePlayer("down");
          break;
        case "ArrowLeft":
          this.movePlayer("left");
          break;
        case "ArrowRight":
          this.movePlayer("right");
          break;
      }
    },
    movePlayer(direction) {
      const step = 20;
      const newPosition = { ...this.playerPosition };

      switch (direction) {
        case "up":
          newPosition.y -= step;
          break;
        case "down":
          newPosition.y += step;
          break;
        case "left":
          newPosition.x -= step;
          break;
        case "right":
          newPosition.x += step;
          break;
      }

      // Check boundaries
      if (
        newPosition.x >= 0 &&
        newPosition.x <= 768 &&
        newPosition.y >= 0 &&
        newPosition.y <= 568
      ) {
        this.playerPosition = newPosition;
        this.checkCollision();
      }
    },
    checkCollision() {
      this.gameObjects.forEach((obj) => {
        const distance = Math.sqrt(
          Math.pow(this.playerPosition.x - obj.x, 2) +
            Math.pow(this.playerPosition.y - obj.y, 2)
        );

        if (distance < 50) {
          switch (obj.type) {
            case "door":
              if (obj.locked && this.keys > 0) {
                this.keys--;
                obj.locked = false;
              } else if (obj.locked) {
                this.showQuestion = true;
                this.currentQuestion = this.getRandomQuestion();
              }
              break;
            case "chest":
              if (!obj.opened) {
                this.showQuestion = true;
                this.currentQuestion = this.getRandomQuestion();
              }
              break;
            case "npc":
              this.showQuestion = true;
              this.currentQuestion = obj.question;
              break;
          }
        }
      });
    },
    getRandomQuestion() {
      const levelQuestions = this.questions.filter(
        (q) => q.difficulty === this.currentLevel
      );
      return levelQuestions[Math.floor(Math.random() * levelQuestions.length)];
    },
    checkAnswer(selectedAnswer) {
      if (selectedAnswer === this.currentQuestion.correctAnswer) {
        this.score += 10;
        this.keys++;
        this.showQuestion = false;

        // Update game objects
        this.gameObjects.forEach((obj) => {
          if (obj.type === "chest" && !obj.opened) {
            obj.opened = true;
          }
        });
      } else {
        this.reviewQuestions.push(this.currentQuestion);
        this.showQuestion = false;
      }
    },
  },
};
</script>

<style scoped>
.game-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.game-header {
  text-align: center;
  margin-bottom: 20px;
}

.stats {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
  font-size: 1.2rem;
  font-weight: bold;
}

.game-world {
  position: relative;
  margin: 0 auto;
  border: 2px solid #333;
  overflow: hidden;
}

canvas {
  background-color: #87ceeb;
}

.controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.horizontal-controls {
  display: flex;
  gap: 20px;
  margin: 10px 0;
}

.control-button {
  width: 50px;
  height: 50px;
  font-size: 24px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.control-button:hover {
  background-color: #45a049;
}

.question-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.question-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
}

.audio-player {
  margin: 20px 0;
}

.option-button {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1rem;
}

.option-button:hover {
  background-color: #45a049;
}
</style>
