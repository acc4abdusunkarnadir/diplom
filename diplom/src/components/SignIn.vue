<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>Sign In</h2>
      <form @submit.prevent="signIn">
        <input
          type="text"
          v-model="user.username"
          placeholder="Username"
          required
        />
        <input
          type="password"
          v-model="user.password"
          placeholder="Password"
          required
        />
        <button type="submit">Sign In</button>
      </form>
      <p>
        Don't have an account? <router-link to="/signup">Sign Up</router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: { username: "", password: "" },
    };
  },
  methods: {
    async signIn() {
      try {
        const response = await fetch("http://localhost:3000/api/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.user),
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          const username = data.user.username;
          const level = data.user.level;

          // Clear any existing data first
          localStorage.clear();

          // Initialize new session with consistent data structure
          localStorage.setItem("username", username);
          localStorage.setItem("userLevel", level);
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("learnedWords", "[]");
          localStorage.setItem(
            `last_login_${username}`,
            new Date().toISOString()
          );

          window.dispatchEvent(new Event("storage")); // Trigger storage event for WebHeader
          this.$router.push("/learning");
        } else {
          const errorData = await response.json();
          alert(errorData.error || "Invalid username or password.");
        }
      } catch (error) {
        console.error("Error signing in:", error);
        if (error.message.includes("Failed to fetch")) {
          alert(
            "Cannot connect to server. Please make sure the server is running."
          );
        } else {
          alert("Error signing in.");
        }
      }
    },
  },
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f4f4;
}

.auth-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 350px;
  width: 100%;
}

h2 {
  margin-bottom: 1rem;
}

input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  width: 100%;
  padding: 10px;
  border: none;
  background: #007acc;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background: #005a9e;
}

p {
  margin-top: 10px;
}
</style>
