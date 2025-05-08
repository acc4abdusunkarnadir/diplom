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
      <template v-if="isAuthenticated">
        <div class="user-info">
          <span class="username">👤 {{ username }}</span>
          <button class="btn logout" @click="logout">Шығу</button>
        </div>
      </template>
      <template v-else>
        <button class="btn login" @click="router.push('/signin')">
          Тіркелу
        </button>
        <button class="btn signup" @click="router.push('/signup')">Кіру</button>
      </template>
    </div>
  </header>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isAuthenticated = ref(false);
const username = ref("");

const checkAuth = () => {
  isAuthenticated.value = localStorage.getItem("isAuthenticated") === "true";
  username.value = localStorage.getItem("username") || "";
};

watchEffect(() => {
  checkAuth();
});

const logout = () => {
  localStorage.removeItem("isAuthenticated");
  localStorage.removeItem("username");
  isAuthenticated.value = false;
  username.value = "";
  router.push("/signin");
};

const links = ref([
  { name: "Нәтиже", path: "/" },
  { name: "Квиз", path: "/courses" },
  { name: "сөздік қорлар", path: "/about" },
  { name: "хабарласу", path: "/contact" },
  { name: "Listening", path: "/listening" },
  { name: "Adventure", path: "/adventure" },
]);
</script>

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
  gap: 10px;
}

/* Profile & Logout */
.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.username {
  font-size: 1rem;
  font-weight: bold;
  color: #333;
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
  background: #28a745;
}

.signup:hover {
  background: #218838;
}

.logout {
  background: #e57373;
}

.logout:hover {
  background: #d32f2f;
}
</style>
