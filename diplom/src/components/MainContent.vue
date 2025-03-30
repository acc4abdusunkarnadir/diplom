<template>
    <div class="main-content">
      <div class="progress-section">
        <div class="progress-card">
          <div class="progress-img"></div>
          <h2 class="progress-title">тарихын</h2>
          <p class="progress-subtitle">жақсы жұмыс істедің</p>
          <div class="progress-info">
            <div class="points">
              <span class="big">240</span>
              <p>ұпай</p>
            </div>
            <div class="words">
              <span class="big">40/30</span>
              <p>сөз</p>
            </div>
          </div>
          <button class="retry">қайтадан ойнау</button>
          <button class="notebook">дәптеріме бару</button>
        </div>
      </div>
      
      <div class="words-section">
        <div class="words-card">
          <h3 class="word-title">сөздікқор <span class="badge blue">15 words</span></h3>
          <ul class="word-list">
            <li>Жалғыздық</li>
            <li>танымалы <span class="icon">🎵</span></li>
            <li>ауыл</li>
            <li>маңызды</li>
            <li>маңызды</li>
          </ul>
        </div>
       
        <div class="words-card">
          <h3 class="word-title">білмейтін сөздер <span class="badge red">15 words</span></h3>
          <ul class="word-list">
            <li>Жалғыздық</li>
            <li>танымалы <span class="icon">🎵</span></li>
            <li>ауыл</li>
            <li>маңызды</li>
            <li>маңызды</li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  /* Centering the entire content */
  .main-content {
  width: 100%;  /* Ensures it takes full width */
  display: flex;
  flex-direction: row;
 /* Spreads content evenly */
  align-items: center;
  height: 100%;
  min-height: 80vh;
  gap: 2rem;
  padding: 10px 5rem; /* Add some padding for spacing */
  margin-left: 300px; /* Remove margin-right */
}

.progress-card, 
.words-card {
  width: 100%;  /* Makes them take full width */
  max-width: 500px; /* Adjust as needed */
}

  
  /* Card styles */
  .progress-card, 
  .words-card {
 
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    max-width: 400px;
    width: 100%;
  }
  .words-card {
 
display: flex;
flex-direction: column;
gap: 20px;
}
  /* Title styles */
  .progress-title {
    font-size: 1.5rem;
    font-weight: bold;
  }
  
  /* Progress info */
  .progress-info {
    display: flex;
    justify-content: space-around;
    margin: 1rem 0;
  }
  
  /* Large numbers */
  .big {
    font-size: 2rem;
    font-weight: bold;
  }
  
  /* Button styles */
  button {
    margin-top: 0.5rem;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
  }
  
  .retry {
    background: #f4f4f4;
  }
  
  .notebook {
    background: #007acc;
    color: white;
  }
  
  /* Word section styles */
  .word-title {
    font-weight: bold;
    display: flex;
    justify-content: space-between;
  }
  
  .badge {
    padding: 0.2rem 0.5rem;
    border-radius: 5px;
    font-size: 0.8rem;
  }
  
  .blue {
    background: #dceefb;
    color: #007acc;
  }
  
  .red {
    background: #fbd4d4;
    color: #d9534f;
  }
  
  /* Word list */
  .word-list {
    display: flex;
    flex-direction: column;
    gap:10px;
    list-style: none;
    padding: 0;
  }
  
  .icon {
    margin-left: 5px;
  }
  .words-section{
    display: flex;
    flex-direction: column;
    gap:20px;
  }
  </style>
  