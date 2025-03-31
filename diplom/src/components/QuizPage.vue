<template>
    <div class="quiz-container">
      <div class="progress-circle">
        <svg class="progress-ring" width="260" height="260">
          <circle class="bg-ring" cx="130" cy="130" r="120"></circle>
          <circle class="fg-ring" cx="130" cy="130" r="120"></circle>
        </svg>
        <div class="quiz-content">
          <div class="top-left">
            <p class="score-title">x2</p>
            <p class="score-subtitle">есе көбейту</p>
          </div>
          <div class="top-right">
            <p class="score-title">30</p>
            <p class="score-subtitle">ұпай</p>
          </div>
          <div class="word-content">
            <h2 class="word-main">Жалғыз</h2>
            <p class="word-sub">Alone</p>
          </div>
          <div class="button-group">
            <button @click="answer(true)" class="correct-btn">Дұрыс</button>
            <button @click="answer(false)" class="wrong-btn">Қате</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      answer(isCorrect) {
        if (isCorrect) {
          alert("Correct!");
        } else {
          alert("Incorrect!");
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .quiz-container {
    margin-right: 400px;
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
  
  .word-sub {
    font-size: 20px;
    color: #2a7ab0;
    font-weight: bold;
  }
  
  .button-group {
    margin-top: 10px;
    display: flex;
    gap: 10px;
  }
  
  .correct-btn,
  .wrong-btn {
    padding: 10px 20px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: bold;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .correct-btn {
    background-color: #4caf50;
    color: white;
  }
  
  .correct-btn:hover {
    background-color: #388e3c;
  }
  
  .wrong-btn {
    background-color: #e57373;
    color: white;
  }
  
  .wrong-btn:hover {
    background-color: #d32f2f;
  }
  </style>
  