<template>
  <div class="docs-layout">
    <Sidebar />
    <main class="docs-main">
      <div class="docs-content">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '../components/Sidebar.vue'
</script>

<style scoped>
.docs-layout {
  display: flex;
  min-height: 100vh;
}

.docs-main {
  flex: 1;
  margin-left: var(--sidebar-w);
  padding-top: var(--nav-h);
  min-width: 0;
  overflow-x: hidden;
}

.docs-content {
  padding: 3.5rem 5rem 6rem 4rem;
  max-width: 1100px;
}

@media (max-width: 1200px) {
  .docs-content { padding: 3rem 3rem 5rem 3.5rem; }
}
@media (max-width: 900px) {
  .docs-main    { margin-left: 0; }
  .docs-content { padding: 2rem 1.5rem 4rem; }
}
</style>
