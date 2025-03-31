<template>
  <div class="word-creation">
    <h1>Word Creation</h1>

    <div class="word-form">
      <input v-model="kazakhWord" placeholder="Enter Kazakh word" />
      <input v-model="englishWord" placeholder="Enter English translation" />
      <button @click="addWord">Add Word</button>
    </div>

    <div class="word-list">
      <div class="word-item" v-for="(word, index) in words" :key="index">
        <div class="kazakh">{{ word.kazakh }}</div>
        <div class="english">{{ word.english }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      kazakhWord: "",
      englishWord: "",
      words: JSON.parse(localStorage.getItem("words")) || []
    };
  },
  methods: {
    addWord() {
      if (this.kazakhWord && this.englishWord) {
        this.words.push({ kazakh: this.kazakhWord, english: this.englishWord });
        localStorage.setItem("words", JSON.stringify(this.words)); // Store in local storage
        this.kazakhWord = "";
        this.englishWord = "";
      }
    }
  }
};
</script>

<style scoped>
.word-creation {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.word-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.word-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.word-item {
  display: flex;
  justify-content: space-between;
  width: 200px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.kazakh {
  font-weight: bold;
  color: #007bff;
}

.english {
  font-style: italic;
  color: #555;
}
</style>
