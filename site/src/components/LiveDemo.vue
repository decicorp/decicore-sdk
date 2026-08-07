<template>
  <div class="live-demo" @mouseenter="pauseTimer" @mouseleave="() => startTimer(progress[active])">

    <div class="ld-tabs" role="tablist" aria-label="DECICORE API pillars">
      <button
        v-for="(p, i) in pillars"
        :key="p.key"
        role="tab"
        :aria-selected="i === active"
        :class="['ld-tab', { active: i === active }]"
        @click="select(i)"
      >
        <span class="ld-tab-top">
          <span class="ld-tab-dot" :style="{ background: p.dot }"></span>
          {{ p.label }}
        </span>
        <span class="ld-tab-bar"><span class="ld-tab-fill" :style="{ width: progress[i] + '%' }"></span></span>
      </button>
    </div>

    <div class="ld-body">
      <div class="ld-pane ld-pane-request">
        <div class="ld-pane-head">
          <span class="ld-dot-row"><span class="wdot w1"></span><span class="wdot w2"></span><span class="wdot w3"></span></span>
          <span class="ld-method-path">
            <span class="ld-method">{{ current.method }}</span>{{ current.path }}
          </span>
        </div>
        <pre class="ld-code"><code v-html="current.requestHtml"></code></pre>
      </div>

      <div class="ld-pane ld-pane-response">
        <div class="ld-pane-head">
          <span class="ld-resp-label">Response</span>
          <span class="ld-status" :class="{ ready }" aria-live="polite">
            <template v-if="ready">
              <span class="led on-good"></span>200 OK · {{ current.latency }}ms
            </template>
            <template v-else>
              <span class="ld-spinner"></span>waiting
            </template>
          </span>
        </div>
        <Transition name="ld-fade" mode="out-in">
          <pre v-if="ready" :key="active" class="ld-code"><code v-html="current.responseHtml"></code></pre>
          <div v-else class="ld-skeleton" :key="'skeleton-' + active">
            <span></span><span></span><span></span>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, onUnmounted } from 'vue'

type Pillar = {
  key: string
  label: string
  dot: string
  method: string
  path: string
  latency: number
  requestHtml: string
  responseHtml: string
}

const pillars: Pillar[] = [
  {
    key: 'data',
    label: 'DATA',
    dot: '#a78bfa',
    method: 'POST',
    path: '/v1/collections/Products/list',
    latency: 84,
    requestHtml: `<span class="tok-kw">const</span> { records, total } = <span class="tok-kw">await</span> client.<span class="tok-fn">list</span>(<span class="tok-string">'Products'</span>, {
  filters:  { status: <span class="tok-string">'active'</span> },
  sortBy:   <span class="tok-string">'price'</span>,
  pageSize: <span class="tok-num">3</span>,
})`,
    responseHtml: `{
  <span class="tok-attr">"total"</span>: <span class="tok-num">128</span>,
  <span class="tok-attr">"records"</span>: [
    { <span class="tok-attr">"ID"</span>: <span class="tok-string">"PROD0000123"</span>, <span class="tok-attr">"name"</span>: <span class="tok-string">"Studio Monitor XL"</span>, <span class="tok-attr">"price"</span>: <span class="tok-num">499.99</span> },
    { <span class="tok-attr">"ID"</span>: <span class="tok-string">"PROD0000124"</span>, <span class="tok-attr">"name"</span>: <span class="tok-string">"XLR Cable 3m"</span>, <span class="tok-attr">"price"</span>: <span class="tok-num">14.50</span> }
  ]
}`,
  },
  {
    key: 'ai',
    label: 'AI',
    dot: '#818cf8',
    method: 'POST',
    path: '/v1/infer',
    latency: 612,
    requestHtml: `<span class="tok-kw">const</span> result = <span class="tok-kw">await</span> client.<span class="tok-fn">infer</span>({
  instructions:   <span class="tok-string">'Classify ticket: billing, technical, or shipping.'</span>,
  userContent:    { subject: <span class="tok-string">'Card declined on renewal'</span> },
  responseFormat: { category: <span class="tok-string">'string'</span>, confidence: <span class="tok-string">'number'</span> },
})`,
    responseHtml: `{
  <span class="tok-attr">"category"</span>: <span class="tok-string">"billing"</span>,
  <span class="tok-attr">"confidence"</span>: <span class="tok-num">0.97</span>
}`,
  },
  {
    key: 'auth',
    label: 'AUTH',
    dot: '#38bdf8',
    method: 'POST',
    path: '/v1/auth/login',
    latency: 121,
    requestHtml: `<span class="tok-kw">const</span> session = <span class="tok-kw">await</span> client.users.<span class="tok-fn">login</span>({
  email:    <span class="tok-string">'erick@studio.dev'</span>,
  password: <span class="tok-string">'••••••••••'</span>,
})`,
    responseHtml: `{
  <span class="tok-attr">"token"</span>: <span class="tok-string">"eyJhbGciOi..."</span>,
  <span class="tok-attr">"expiresIn"</span>: <span class="tok-num">3600</span>,
  <span class="tok-attr">"user"</span>: { <span class="tok-attr">"ID"</span>: <span class="tok-string">"USR0000042"</span>, <span class="tok-attr">"role"</span>: <span class="tok-string">"admin"</span> }
}`,
  },
  {
    key: 'billing',
    label: 'BILLING',
    dot: '#c4b5fd',
    method: 'POST',
    path: '/v1/billing/subscriptions',
    latency: 203,
    requestHtml: `<span class="tok-kw">const</span> sub = <span class="tok-kw">await</span> client.billing.<span class="tok-fn">subscribe</span>({
  planId:          <span class="tok-string">'PLAN_PRO_MONTHLY'</span>,
  paymentMethodId: <span class="tok-string">'pm_1N3xQ2...'</span>,
})`,
    responseHtml: `{
  <span class="tok-attr">"subscriptionId"</span>: <span class="tok-string">"SUB0000391"</span>,
  <span class="tok-attr">"status"</span>: <span class="tok-string">"active"</span>,
  <span class="tok-attr">"currentPeriodEnd"</span>: <span class="tok-string">"2026-09-05"</span>
}`,
  },
]

const DURATION = 5200
const STEP = 60

const active = ref(0)
const ready = ref(false)
const progress = reactive(pillars.map(() => 0))
const current = computed(() => pillars[active.value])

let intervalId: ReturnType<typeof setInterval> | undefined
let revealTimer: ReturnType<typeof setTimeout> | undefined
const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function showResponse() {
  ready.value = false
  clearTimeout(revealTimer)
  if (reduceMotion) { ready.value = true; return }
  const delay = Math.max(320, Math.min(current.value.latency, 900))
  revealTimer = setTimeout(() => { ready.value = true }, delay)
}

function startTimer(fromPct = 0) {
  if (reduceMotion) return
  clearInterval(intervalId)
  let pct = fromPct
  intervalId = setInterval(() => {
    pct += (STEP / DURATION) * 100
    if (pct >= 100) {
      progress[active.value] = 100
      goNext()
    } else {
      progress[active.value] = pct
    }
  }, STEP)
}

function pauseTimer() {
  clearInterval(intervalId)
}

function goNext() {
  const nextIndex = (active.value + 1) % pillars.length
  if (nextIndex === 0) pillars.forEach((_, i) => (progress[i] = 0))
  active.value = nextIndex
  showResponse()
  startTimer(0)
}

function select(i: number) {
  if (i === active.value) return
  active.value = i
  progress[i] = 0
  showResponse()
  startTimer(0)
}

onMounted(() => {
  showResponse()
  startTimer(0)
})

onUnmounted(() => {
  clearInterval(intervalId)
  clearTimeout(revealTimer)
})
</script>

<style scoped>
.live-demo {
  background: var(--bg-recessed);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 30px 80px -30px rgba(124,58,237,0.35);
}

/* ── Tabs ─────────────────────────────────────────────────── */
.ld-tabs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  background: var(--bg-raised);
  border-bottom: 1px solid var(--border);
}

.ld-tab {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.85rem 1rem 0.75rem;
  background: none;
  border: none;
  border-right: 1px solid var(--border);
  cursor: pointer;
  text-align: left;
}

.ld-tab:last-child { border-right: none; }

.ld-tab-top {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--subtle);
  transition: color 0.2s;
}

.ld-tab.active .ld-tab-top { color: var(--text); }

.ld-tab-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  opacity: 0.4;
  transition: opacity 0.2s, box-shadow 0.2s;
}

.ld-tab.active .ld-tab-dot {
  opacity: 1;
  box-shadow: 0 0 6px 1px currentColor;
}

.ld-tab-bar {
  display: block;
  height: 2px;
  background: rgba(167,139,250,0.12);
  border-radius: 2px;
  overflow: hidden;
}

.ld-tab-fill {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--primary), var(--primary-bright));
  transition: width 0.1s linear;
}

/* ── Body ─────────────────────────────────────────────────── */
.ld-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.ld-pane {
  min-width: 0;
}

.ld-pane-request { border-right: 1px solid var(--border); }

.ld-pane-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
  padding: 0.65rem 1.1rem;
  border-bottom: 1px solid var(--border);
}

.ld-dot-row { display: flex; gap: 0.35rem; }
.wdot { width: 7px; height: 7px; border-radius: 50%; background: var(--border-hi); }
.w1 { background: #f87171; }
.w2 { background: #fbbf24; }
.w3 { background: #34d399; }

.ld-method-path {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.72rem;
  color: var(--subtle);
}

.ld-method {
  font-weight: 700;
  color: var(--primary-bright);
}

.ld-resp-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--subtle);
}

.ld-status {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.7rem;
  color: var(--subtle);
}

.ld-status.ready { color: var(--good); }

.ld-spinner {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1.5px solid var(--border-hi);
  border-top-color: var(--primary-bright);
  animation: ld-spin 0.7s linear infinite;
}

@keyframes ld-spin { to { transform: rotate(360deg); } }

.ld-code {
  margin: 0;
  padding: 1.1rem 1.2rem;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.78rem;
  line-height: 1.7;
  color: #d9d3f0;
  overflow-x: auto;
  min-height: 148px;
}

.ld-code code { font-family: inherit; }

.ld-skeleton {
  padding: 1.2rem 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  min-height: 148px;
}

.ld-skeleton span {
  display: block;
  height: 10px;
  border-radius: 3px;
  background: linear-gradient(90deg, rgba(167,139,250,0.08), rgba(167,139,250,0.16), rgba(167,139,250,0.08));
  background-size: 200% 100%;
  animation: ld-shimmer 1.3s ease-in-out infinite;
}

.ld-skeleton span:nth-child(1) { width: 55%; }
.ld-skeleton span:nth-child(2) { width: 80%; }
.ld-skeleton span:nth-child(3) { width: 40%; }

@keyframes ld-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.ld-fade-enter-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.ld-fade-leave-active { transition: opacity 0.15s ease; }
.ld-fade-enter-from { opacity: 0; transform: translateY(4px); }
.ld-fade-leave-to { opacity: 0; }

@media (max-width: 720px) {
  .ld-tabs { grid-template-columns: repeat(2, 1fr); }
  .ld-body { grid-template-columns: 1fr; }
  .ld-pane-request { border-right: none; border-bottom: 1px solid var(--border); }
}

@media (prefers-reduced-motion: reduce) {
  .ld-spinner { animation: none; }
  .ld-skeleton span { animation: none; }
}
</style>
