<script setup>
import { ref } from "vue";

const footerLinks = ref([
{ name: "басты бет", path: "/" },
  { name: "сабактар", path: "/courses" },
  { name: "Біз туралы", path: "/about" },
  { name: "хабарласу", path: "/contact" },
]);

const socialLinks = ref([
  { name: "Facebook", icon: "🌐", link: "https://facebook.com" },
  { name: "Twitter", icon: "🐦", link: "https://twitter.com" },
  { name: "LinkedIn", icon: "🔗", link: "https://linkedin.com" },
]);
</script>

<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-logo">🌐 KazakhWeb</div>
      <nav>
        <ul class="footer-links">
          <li v-for="link in footerLinks" :key="link.path">
            <router-link :to="link.path">{{ link.name }}</router-link>
          </li>
        </ul>
      </nav>
      <div class="social-links">
        <a
          v-for="social in socialLinks"
          :key="social.name"
          :href="social.link"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ social.icon }}
        </a>
      </div>
    </div>
    <div class="footer-bottom">
      © 2024 KazakhWeb. All rights reserved.
    </div>
  </footer>
</template>
<style scoped>
.footer {
    border:black;
  width: 100%; /* Ensure it spans the full width */
  background: #e5e6e7;
  color: black;
  padding: 2rem;
  text-align: center;
  position: absolute;
  bottom: 0;
  left: 0;
}

.footer-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%; /* Ensure full width */
  max-width: 100%; /* Remove max-width limitation */
  margin: 0 auto;
}

.footer-logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.footer-links {
  list-style: none;
  display: flex;
  gap: 1rem;
  padding: 0;
  margin: 0;
}

.footer-links a {
  color: black;
  text-decoration: none;
}

.footer-links a:hover {
  text-decoration: underline;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-links a {
  font-size: 1.5rem;
  text-decoration: none;
  color: black;
}

.footer-bottom {
  margin-top: 1rem;
  font-size: 0.9rem;
  opacity: 0.8;
  width: 100%;
}
</style>


