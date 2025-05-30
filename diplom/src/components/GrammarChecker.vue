<template>
  <div class="grammar-checker-container">
    <h1>Kazakh Grammar Checker</h1>
    <div class="input-section">
      <textarea
        v-model="inputText"
        placeholder="Enter Kazakh text here..."
        rows="10"
        :class="{ error: error }"
      ></textarea>
      <div v-if="error" class="error-message">{{ error }}</div>
      <button @click="checkGrammar" :disabled="isLoading">
        {{ isLoading ? "Checking..." : "Check Grammar" }}
      </button>
    </div>

    <div v-if="results" class="results-section">
      <h2>Results</h2>
      <div class="text-display">
        <div
          v-for="(correction, index) in results.corrections"
          :key="index"
          class="correction"
        >
          <div class="correction-info">
            <span class="original">Original: {{ correction.original }}</span>
            <span class="suggestion"
              >Suggestion: {{ correction.suggestion }}</span
            >
          </div>
          <div class="correction-context">
            {{ getContext(correction) }}
          </div>
        </div>
        <div v-if="results.corrections.length === 0" class="no-corrections">
          No grammar errors found!
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const inputText = ref("");
const results = ref(null);
const error = ref("");
const isLoading = ref(false);

async function checkGrammar() {
  if (!inputText.value.trim()) {
    error.value = "Please enter some text to check.";
    return;
  }

  error.value = "";
  isLoading.value = true;
  results.value = null;

  try {
    const response = await fetch("http://localhost:3000/api/grammar-check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: inputText.value }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to check grammar");
    }

    results.value = data;
  } catch (err) {
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
}

function getContext(correction) {
  const start = Math.max(0, correction.start - 20);
  const end = Math.min(inputText.value.length, correction.end + 20);
  let context = inputText.value.slice(start, end);

  if (start > 0) context = "..." + context;
  if (end < inputText.value.length) context += "...";

  return context;
}
</script>

<style scoped>
.grammar-checker-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
}

.input-section {
  margin-bottom: 2rem;
}

textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  margin-bottom: 1rem;
  resize: vertical;
  font-family: inherit;
}

textarea.error {
  border-color: #ff4444;
}

.error-message {
  color: #ff4444;
  margin-bottom: 1rem;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover:not(:disabled) {
  background-color: #1976d2;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.results-section {
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.results-section h2 {
  margin-top: 0;
  color: #333;
  margin-bottom: 1rem;
}

.correction {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.correction-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.original {
  color: #ff4444;
}

.suggestion {
  color: #4caf50;
}

.correction-context {
  font-family: monospace;
  background-color: #f5f5f5;
  padding: 0.5rem;
  border-radius: 3px;
  font-size: 0.9rem;
}

.no-corrections {
  text-align: center;
  color: #4caf50;
  font-weight: bold;
  padding: 1rem;
}
</style>
