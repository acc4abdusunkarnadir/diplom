<template>
  <div class="signup-container">
    <h2>Sign Up</h2>
    <form @submit.prevent="handleSignUp" class="signup-form">
      <div class="form-group">
        <label for="username">Username:</label>
        <input
          type="text"
          id="username"
          v-model="username"
          required
          placeholder="Enter your username"
        />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input
          type="password"
          id="password"
          v-model="password"
          required
          placeholder="Enter your password"
        />
      </div>
      <div class="form-group">
        <label for="level">Select Your Level:</label>
        <select id="level" v-model="level" required>
          <option value="">Select a level</option>
          <option value="A1">A1 - Beginner</option>
          <option value="A2">A2 - Elementary</option>
          <option value="B1">B1 - Intermediate</option>
          <option value="B2">B2 - Upper Intermediate</option>
          <option value="C1">C1 - Advanced</option>
          <option value="C2">C2 - Mastery</option>
        </select>
      </div>
      <button type="submit" class="signup-btn">Sign Up</button>
    </form>
    <p class="login-link">
      Already have an account? <router-link to="/signin">Sign In</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const username = ref("");
const password = ref("");
const level = ref("");

async function handleSignUp() {
  try {
    const response = await fetch("http://localhost:3000/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
        level: level.value,
      }),
      credentials: "include",
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Failed to sign up");
    }

    const data = await response.json();
    localStorage.setItem("username", username.value);
    localStorage.setItem("userLevel", level.value);
    localStorage.setItem("isAuthenticated", "true");
    router.push("/learning");
  } catch (error) {
    console.error("Signup error:", error);
    if (error.message.includes("Failed to fetch")) {
      alert(
        "Cannot connect to server. Please make sure the server is running."
      );
    } else {
      alert(error.message || "An error occurred during sign up");
    }
  }
}
</script>

<style scoped>
.signup-container {
  max-width: 400px;
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

.signup-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  color: #666;
  font-weight: 500;
}

input,
select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

input:focus,
select:focus {
  outline: none;
  border-color: #2196f3;
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
}

.signup-btn {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.signup-btn:hover {
  background-color: #1976d2;
}

.login-link {
  text-align: center;
  margin-top: 1rem;
  color: #666;
}

.login-link a {
  color: #2196f3;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
