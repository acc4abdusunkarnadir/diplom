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
        <button class="btn login" @click="router.push('/signin')">Кіру</button>
        <button class="btn signup" @click="router.push('/signup')">
          Тіркелу
        </button>
      </template>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isAuthenticated = ref(false);
const username = ref("");
const userLevel = ref("");

const checkAuth = () => {
  isAuthenticated.value = localStorage.getItem("isAuthenticated") === "true";
  username.value = localStorage.getItem("username") || "";
  userLevel.value = localStorage.getItem("userLevel") || "";
};

onMounted(() => {
  checkAuth();
  window.addEventListener("storage", checkAuth);
});

const logout = () => {
  const storedUsername = localStorage.getItem("username");

  // Clear all progress-related items
  if (storedUsername) {
    localStorage.removeItem(`adventure_progress_${storedUsername}`);
    localStorage.removeItem(`competitive_progress_${storedUsername}`);
    localStorage.removeItem(`quiz_progress_${storedUsername}`);
    localStorage.removeItem(`last_login_${storedUsername}`);
    localStorage.removeItem(`learnedWords`);
  }

  // Clear authentication data
  localStorage.removeItem("isAuthenticated");
  localStorage.removeItem("username");
  localStorage.removeItem("userLevel");

  isAuthenticated.value = false;
  username.value = "";
  userLevel.value = "";
  router.push("/signin");
};

const links = computed(() => {
  const allLinks = [
    { name: "Нәтиже", path: "/" },
    { name: "Квиз", path: "/courses" },
    { name: "сөздік қорлар", path: "/about", minLevel: "B1" },
    { name: "хабарласу", path: "/contact", minLevel: "B1" },
    { name: "Listening", path: "/listening", minLevel: "B1" },
    { name: "Adventure", path: "/adventure", minLevel: "B1" },
    { name: "Learning System", path: "/learning" },
    { name: "Competitive", path: "/competitive", minLevel: "B1" },
  ];

  if (!isAuthenticated.value) return [];

  const levelHierarchy = {
    A1: 1,
    A2: 2,
    B1: 3,
    B2: 4,
    C1: 5,
    C2: 6,
  };

  const userLevelValue = levelHierarchy[userLevel.value] || 0;

  return allLinks.filter((link) => {
    if (!link.minLevel) return true;
    return levelHierarchy[link.minLevel] <= userLevelValue;
  });
});
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
