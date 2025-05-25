<template>
  <div class="level-selection">
    <h2>Select Your Level</h2>
    <div class="level-description">
      <p>Please select your current Kazakh language proficiency level:</p>
      <ul>
        <li>
          <strong>A1:</strong> Beginner - Can understand and use familiar
          everyday expressions
        </li>
        <li>
          <strong>A2:</strong> Elementary - Can communicate in simple and
          routine tasks
        </li>
        <li>
          <strong>B1:</strong> Intermediate - Can handle most situations while
          traveling
        </li>
        <li>
          <strong>B2:</strong> Upper Intermediate - Can interact with native
          speakers fluently
        </li>
        <li>
          <strong>C1:</strong> Advanced - Can express ideas fluently and
          spontaneously
        </li>
        <li>
          <strong>C2:</strong> Mastery - Can understand virtually everything
          with ease
        </li>
      </ul>
    </div>
    <div class="level-options">
      <button
        v-for="level in levels"
        :key="level"
        :class="['level-btn', { selected: selectedLevel === level }]"
        @click="selectLevel(level)"
      >
        {{ level }}
      </button>
    </div>
    <div class="actions">
      <button
        class="confirm-btn"
        :disabled="!selectedLevel"
        @click="confirmLevel"
      >
        Confirm Level
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
const selectedLevel = ref("");

function selectLevel(level) {
  selectedLevel.value = level;
}

async function confirmLevel() {
  if (!selectedLevel.value) return;

  const username = localStorage.getItem("username");
  if (!username) {
    router.push("/signin");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/user/${username}/level`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ level: selectedLevel.value }),
      }
    );

    if (response.ok) {
      localStorage.setItem("userLevel", selectedLevel.value);
      router.push("/learning");
    } else {
      alert("Failed to update level. Please try again.");
    }
  } catch (error) {
    console.error("Error updating level:", error);
    alert("An error occurred. Please try again.");
  }
}
</script>

<style scoped>
.level-selection {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
}

.level-description {
  margin-bottom: 2rem;
  color: #666;
}

.level-description ul {
  list-style-type: none;
  padding: 0;
  margin: 1rem 0;
}

.level-description li {
  margin: 0.5rem 0;
  padding: 0.5rem;
  background-color: #f8f9fa;
  border-radius: 5px;
}

.level-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.level-btn {
  padding: 1.5rem;
  font-size: 1.2rem;
  font-weight: bold;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.level-btn:hover {
  border-color: #2196f3;
  background-color: #f5f9ff;
}

.level-btn.selected {
  border-color: #2196f3;
  background-color: #2196f3;
  color: white;
}

.actions {
  text-align: center;
}

.confirm-btn {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.confirm-btn:hover:not(:disabled) {
  background-color: #45a049;
}

.confirm-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>
