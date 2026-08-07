<template>
  <nav class="toc">
    <p class="toc-label">On This Page</p>
    <ul class="toc-list">
      <li v-for="item in items" :key="item.id">
        <a
          :href="`#${item.id}`"
          :class="['toc-link', { active: active === item.id }]"
          @click.prevent="scrollTo(item.id)"
        >{{ item.label }}</a>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

defineProps<{
  items: Array<{ id: string; label: string }>
}>()

const active = ref('')

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function onScroll() {
  const headings = document.querySelectorAll<HTMLElement>('[id]')
  let current = ''
  headings.forEach(el => {
    const rect = el.getBoundingClientRect()
    if (rect.top <= 110) current = el.id
  })
  active.value = current
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
.toc {
  position: sticky;
  top: 90px;
  width: 180px;
  flex-shrink: 0;
  align-self: flex-start;
  padding-left: 1.5rem;
}

.toc-label {
  font-size: 0.62rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--subtle);
  font-family: 'IBM Plex Mono', monospace;
  margin-bottom: 0.65rem;
}

.toc-list {
  list-style: none;
}

.toc-link {
  display: block;
  font-size: 0.78rem;
  color: var(--subtle);
  padding: 0.28rem 0;
  padding-left: 0.8rem;
  border-left: 2px solid transparent;
  margin-left: -2px;
  text-decoration: none;
  transition: color 0.15s, border-color 0.15s;
  line-height: 1.4;
}

.toc-link:hover {
  color: var(--muted);
}

.toc-link.active {
  color: var(--primary-bright);
  border-left-color: var(--primary-bright);
}
</style>
