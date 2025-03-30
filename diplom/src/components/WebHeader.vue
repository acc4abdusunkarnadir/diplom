<script setup>
import { ref } from "vue";

const links = ref([
  { name: "басты бет", path: "/" },
  { name: "сабактар", path: "/courses" },
  { name: "Біз туралы", path: "/about" },
  { name: "хабарласу", path: "/contact" },
]);
</script>

<template>
  <header class="header">
    <div class="logo">🌐 KazakhWeb</div>
    <nav class="nav">
      <ul>
        <li v-for="link in links" :key="link.path">
          <router-link :to="link.path">{{ link.name }}</router-link>
        </li>
      </ul>
    </nav>
    <div class="header-right-part">
      <img class="profile-pic" src="https://via.placeholder.com/50" alt="Profile" />
      <button class="btn login">тіркелу</button>
      <button class="btn signup">кіру</button>
    </div>
  </header>
</template>

<style scoped>
/* Header Styling */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  background: #e5e6e7;
  padding: 1rem 2rem;
  z-index: 1000;
}

/* Logo */
.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

/* Navigation */
.nav ul {
  list-style: none;
  display: flex;
  gap: 1rem;
  padding: 0;
  margin: 0;
}

.nav a {
  color: black;
  text-decoration: none;
  font-size: 1.1rem;
}

.nav a:hover {
  text-decoration: underline;
}

/* Right Section */
.header-right-part {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 13%;
  height: 100%;
}

/* Profile Picture */
.profile-pic {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
}

/* Buttons */
.btn {
  background: #007acc;
  color: white;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 1rem;
}

.btn:hover {
  background: #005f99;
}

.signup {
  margin-left: 10px;
  background: #28a745;
}

.signup:hover {
  background: #218838;
}
</style>
