<template>
  <aside class="sidebar">
    <div class="sidebar-inner">

      <!-- Version readout -->
      <div class="version-row">
        <span class="led on-good"></span>
        <span class="version-label">v1.0.0</span>
        <span class="version-tag">stable</span>
      </div>

      <!-- Navigation groups -->
      <div v-for="group in nav" :key="group.label" class="nav-group">
        <p class="group-label">{{ group.label }}</p>
        <ul class="nav-list">
          <li v-for="item in group.items" :key="item.to">
            <router-link :to="item.to" class="nav-item" active-class="nav-item--active">
              <span class="nav-icon" v-html="item.icon"></span>
              {{ item.label }}
              <span class="nav-item-led"></span>
            </router-link>
          </li>
        </ul>
      </div>

    </div>
  </aside>
</template>

<script setup lang="ts">
const iconIntro = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>`
const iconStart = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`
const iconCrud  = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`
const iconAi    = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`
const iconUsers = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
const iconBill  = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`

const nav = [
  {
    label: 'OVERVIEW',
    items: [
      { to: '/docs/introduction',    label: 'Introduction',    icon: iconIntro },
      { to: '/docs/getting-started', label: 'Getting Started', icon: iconStart },
    ],
  },
  {
    label: 'SDK REFERENCE',
    items: [
      { to: '/docs/crud',         label: 'CRUD Operations', icon: iconCrud },
      { to: '/docs/ai-inference', label: 'AI Inference',    icon: iconAi   },
    ],
  },
  {
    label: 'USERS & BILLING',
    items: [
      { to: '/docs/users',   label: 'User Management', icon: iconUsers },
      { to: '/docs/billing', label: 'Plans & Billing',  icon: iconBill  },
    ],
  },
]
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: var(--nav-h);
  left: 0;
  bottom: 0;
  width: var(--sidebar-w);
  background: var(--bg-raised);
  border-right: 1px solid var(--border);
  overflow-y: auto;
  z-index: 50;
}

.sidebar-inner {
  padding: 1.5rem 0.75rem 2rem;
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.version-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem 1.25rem;
  border-bottom: 1px solid var(--border);
  margin-bottom: 1.25rem;
}

.version-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--muted);
}

.version-tag {
  font-size: 0.6rem;
  font-weight: 600;
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
  background: var(--bg-recessed);
  color: var(--good);
  border: 1px solid var(--border-hi);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-family: 'IBM Plex Mono', monospace;
}

.nav-group {
  margin-bottom: 1.5rem;
}

.group-label {
  font-size: 0.64rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--subtle);
  padding: 0 0.75rem;
  margin-bottom: 0.3rem;
}

.nav-list {
  list-style: none;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.48rem 0.75rem 0.48rem calc(0.75rem - 2px);
  border-radius: var(--radius-sm);
  border-left: 2px solid transparent;
  font-size: 0.865rem;
  font-weight: 500;
  color: var(--muted);
  text-decoration: none;
  transition: color 0.15s, background 0.15s, border-color 0.15s;
  margin-bottom: 1px;
}

.nav-item:hover {
  color: var(--text);
  background: var(--bg-card);
}

.nav-item--active {
  color: var(--primary-bright) !important;
  background: var(--bg-card) !important;
  border-left-color: var(--primary-bright);
  font-weight: 600;
}

.nav-icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  opacity: 0.6;
  color: currentColor;
}

.nav-item--active .nav-icon {
  opacity: 1;
  color: var(--primary-bright);
}

.nav-item-led {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: transparent;
  margin-left: auto;
  flex-shrink: 0;
}

.nav-item--active .nav-item-led {
  background: var(--primary-bright);
  box-shadow: 0 0 5px rgba(167,139,250,0.7);
}
</style>
