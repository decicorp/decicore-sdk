<template>
  <nav :class="['navbar', { scrolled }]">
    <div class="nav-inner">
      <!-- Logo -->
      <router-link to="/" class="logo">
        <svg class="logo-mark" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 1L23 12L12 23L1 12L12 1Z" fill="url(#nav-diamond)"/>
          <path d="M12 8.2L16.4 12L12 15.8L7.6 12L12 8.2Z" fill="#07070d"/>
          <defs>
            <linearGradient id="nav-diamond" x1="1" y1="1" x2="23" y2="23">
              <stop offset="0%" stop-color="#a78bfa"/>
              <stop offset="100%" stop-color="#7c3aed"/>
            </linearGradient>
          </defs>
        </svg>
        <span class="logo-text">DECICORE</span>
      </router-link>

      <!-- Center links -->
      <div class="nav-links">
        <router-link to="/" class="nav-link" exact-active-class="nav-link--active">Home</router-link>
        <router-link to="/docs/introduction" class="nav-link" active-class="nav-link--active">Docs</router-link>
        <router-link to="/community" class="nav-link" active-class="nav-link--active">Community</router-link>
        <a href="https://github.com/deciphai" target="_blank" rel="noopener" class="nav-link ext">
          GitHub
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M7 17L17 7M17 7H7M17 7v10"/>
          </svg>
        </a>
      </div>

      <!-- Right side -->
      <div class="nav-right">
        <a href="https://www.npmjs.com/package/decicore-sdk" target="_blank" rel="noopener" class="plate plate-npm">npm</a>
        <a href="https://pypi.org/project/decicore-sdk" target="_blank" rel="noopener" class="plate plate-pip">pip</a>
        <router-link to="/docs/getting-started" class="btn btn-primary btn-sm">Get Started</router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const scrolled = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 24
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: var(--nav-h);
  display: flex;
  align-items: center;
  transition: background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease;
  background: transparent;
  border-bottom: 1px solid transparent;
}

.navbar.scrolled {
  background: rgba(7, 7, 13, 0.86);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom-color: var(--border);
}

.nav-inner {
  width: 100%;
  padding: 0 2.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  text-decoration: none;
  flex-shrink: 0;
}

.logo-mark {
  flex-shrink: 0;
  filter: drop-shadow(0 0 8px rgba(124,58,237,0.5));
}

.logo-text {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: var(--text);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 0.15rem;
}

.nav-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--muted);
  padding: 0.4rem 0.78rem;
  border-radius: var(--radius-sm);
  transition: color 0.15s, background 0.15s;
  text-decoration: none;
}

.nav-link:hover {
  color: var(--text);
  background: var(--bg-card);
}

.nav-link--active {
  color: var(--text) !important;
}

.nav-link--active::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 0.78rem;
  right: 0.78rem;
  height: 2px;
  background: var(--primary-bright);
  box-shadow: 0 0 5px rgba(167,139,250,0.6);
}

.nav-link.ext {
  color: var(--subtle);
  font-size: 0.82rem;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  flex-shrink: 0;
}

.plate {
  display: inline-flex;
  align-items: center;
  font-size: 0.66rem;
  font-weight: 600;
  font-family: 'IBM Plex Mono', monospace;
  padding: 0.28rem 0.6rem;
  border-radius: 3px;
  letter-spacing: 0.06em;
  text-decoration: none;
  background: var(--bg-card);
  border: 1px solid var(--border-hi);
  color: var(--muted);
  transition: color 0.15s, border-color 0.15s;
}

.plate:hover { color: var(--text); border-color: var(--primary-bright); }

@media (max-width: 900px) {
  .nav-links { display: none; }
}

@media (max-width: 640px) {
  .plate { display: none; }
}
</style>
