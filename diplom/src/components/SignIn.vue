<template>
    <div class="auth-container">
      <div class="auth-card">
        <h2>Sign In</h2>
        <form @submit.prevent="signIn">
          <input type="text" v-model="user.username" placeholder="Username" required />
          <input type="password" v-model="user.password" placeholder="Password" required />
          <button type="submit">Sign In</button>
        </form>
        <p>Don't have an account? <router-link to="/signup">Sign Up</router-link></p>
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
      signIn() {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser && storedUser.username === this.user.username && storedUser.password === this.user.password) {
          localStorage.setItem("isAuthenticated", "true");
          this.$router.push("/courses");
        } else {
          alert("Invalid credentials!");
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
  