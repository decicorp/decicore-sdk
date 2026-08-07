<template>
  <div class="home">

    <!-- ── Hero ─────────────────────────────────────────────────── -->
    <section class="hero">
      <div class="hero-inner">
        <span class="badge hero-badge">DECICORE SDK · v1.0</span>

        <h1 class="hero-h1">
          One client.<br />
          <span class="grad">Every system.</span>
        </h1>

        <p class="hero-sub">
          DECICORE wires your data layer, AI inference, user auth, and billing through a
          single typed client — same shape in JavaScript and Python. Below are four real
          calls against four real systems. Watch it work.
        </p>

        <div class="hero-cta">
          <router-link to="/docs/introduction" class="btn btn-primary">
            Get Started
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </router-link>
          <a href="https://github.com/deciphai" target="_blank" rel="noopener" class="btn btn-ghost">View source</a>
        </div>

        <div class="hero-demo">
          <LiveDemo />
        </div>
      </div>
    </section>

    <!-- ── Compare: one client vs four ─────────────────────────────── -->
    <section class="compare">
      <div class="section-header reveal">
        <h4>The usual way</h4>
        <h2>Four systems.<br />Usually four SDKs.</h2>
      </div>

      <div class="compare-grid">
        <div class="compare-col without-col reveal-group">
          <p class="compare-col-label">Without DECICORE</p>
          <div class="without-card reveal-item">
            <span class="without-name">Database client</span>
            <code class="without-install">npm install pg</code>
          </div>
          <div class="without-card reveal-item">
            <span class="without-name">AI provider SDK</span>
            <code class="without-install">npm install openai</code>
          </div>
          <div class="without-card reveal-item">
            <span class="without-name">Auth service</span>
            <code class="without-install">npm install auth0</code>
          </div>
          <div class="without-card reveal-item">
            <span class="without-name">Payments API</span>
            <code class="without-install">npm install stripe</code>
          </div>
        </div>

        <div class="compare-connector">
          <span class="compare-connector-line"></span>
          <span class="compare-connector-label">becomes</span>
          <span class="compare-connector-line"></span>
        </div>

        <div class="compare-col with-col">
          <p class="compare-col-label">With DECICORE</p>
          <div class="with-card module reveal reveal-right">
            <span class="with-name">decicore-sdk</span>
            <code class="with-install">npm install decicore-sdk</code>
            <div class="with-pills">
              <span class="with-pill">DATA</span>
              <span class="with-pill">AI</span>
              <span class="with-pill">AUTH</span>
              <span class="with-pill">BILLING</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Features ──────────────────────────────────────────────── -->
    <section class="features">
        <div class="section-header reveal">
          <h4>Why DECICORE</h4>
          <h2>Everything you need,<br />nothing you don't</h2>
        </div>

        <div class="features-grid reveal-group">
          <div class="module feature-card reveal-item">
            <div class="feat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <ellipse cx="12" cy="5" rx="9" ry="3"/>
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
              </svg>
            </div>
            <h3>Full CRUD</h3>
            <p>List, get, create, update, delete in any collection. Consistent API across every data type.</p>
          </div>

          <div class="module feature-card reveal-item">
            <div class="feat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h3>AI Inference</h3>
            <p>Structured output from any input. Define the schema, the engine fills it in.</p>
          </div>

          <div class="module feature-card reveal-item">
            <div class="feat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h3>User Auth</h3>
            <p>Create users, authenticate, manage sessions. Token-based, multi-tenant by design.</p>
          </div>

          <div class="module feature-card reveal-item">
            <div class="feat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <rect x="1" y="4" width="22" height="16" rx="2"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
            </div>
            <h3>Plans &amp; Billing</h3>
            <p>Stripe subscriptions, 3D Secure, plan management. No direct Stripe calls on your end.</p>
          </div>
        </div>
    </section>

    <!-- ── Code showcase ─────────────────────────────────────────── -->
    <section class="showcase">
        <div class="showcase-grid">
          <div class="showcase-text reveal reveal-left">
            <span class="badge">Quick example</span>
            <h2>From install to first<br />request in 60 seconds</h2>
            <ul class="showcase-bullets">
              <li>
                <span class="led on"></span>
                Zero configuration — one object, three keys
              </li>
              <li>
                <span class="led on"></span>
                Works in Node, Deno, edge runtimes, and Python 3.9+
              </li>
              <li>
                <span class="led on"></span>
                Fully typed with TypeScript and Python type hints
              </li>
            </ul>
          </div>

          <div class="showcase-code reveal reveal-right">
            <CodeBlock :js="showcaseJs" :python="showcasePy" />
          </div>
        </div>
    </section>

    <!-- ── Stats ─────────────────────────────────────────────────── -->
    <section class="stats">
        <h4 class="stats-label">By the numbers</h4>
        <div class="stats-grid reveal-group">
          <div class="stat-card card reveal-item">
            <span class="stat-value">02</span>
            <span class="stat-desc">SDKs — JS &amp; Python</span>
          </div>
          <div class="stat-card card reveal-item">
            <span class="stat-value">06</span>
            <span class="stat-desc">APIs included</span>
          </div>
          <div class="stat-card card reveal-item">
            <span class="stat-value">v1.0</span>
            <span class="stat-desc">Stable release</span>
          </div>
        </div>
    </section>

    <!-- ── CTA ───────────────────────────────────────────────────── -->
    <section class="cta-section">
        <div class="cta-card module reveal">
          <div class="cta-glow"></div>
          <div class="cta-inner">
            <span class="badge">Start building</span>
            <h2>Ready to build?</h2>
            <p>Start with our Getting Started guide or jump straight into the API reference.</p>
            <div class="cta-buttons">
              <router-link to="/docs/getting-started" class="btn btn-primary">
                Get Started
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </router-link>
              <router-link to="/docs/introduction" class="btn btn-ghost">Browse Docs</router-link>
            </div>
          </div>
        </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import CodeBlock from '../components/CodeBlock.vue'
import LiveDemo from '../components/LiveDemo.vue'

// Scroll reveals: a plain IntersectionObserver toggling a CSS class.
// (Previously GSAP ScrollTrigger — its trigger positions are calculated
// once at mount and go stale when the web fonts finish loading and shift
// the layout afterward, which left whole sections stuck at opacity:0.
// IntersectionObserver re-checks real element position on every scroll,
// so it can't go stale the same way. A timeout fallback below also
// guarantees nothing stays permanently invisible.)
let observer: IntersectionObserver | undefined
let fallbackTimer: ReturnType<typeof setTimeout> | undefined

onMounted(() => {
  const targets = document.querySelectorAll('.reveal, .reveal-group')

  if (!('IntersectionObserver' in window) || targets.length === 0) {
    targets.forEach(el => el.classList.add('in-view'))
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view')
          observer?.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -80px 0px' }
  )

  targets.forEach(el => observer!.observe(el))

  fallbackTimer = setTimeout(() => {
    document.querySelectorAll('.reveal:not(.in-view), .reveal-group:not(.in-view)')
      .forEach(el => el.classList.add('in-view'))
  }, 2500)
})

onUnmounted(() => {
  observer?.disconnect()
  clearTimeout(fallbackTimer)
})

const showcaseJs = `import { DeciCore } from 'decicore-sdk'

const client = new DeciCore({
  token:     process.env.DECICORE_TOKEN!,
  projectId: process.env.DECICORE_PROJECT_ID!,
  tenantId:  process.env.DECICORE_TENANT_ID!,
})

// List active products
const { records } = await client.list('Products', {
  filters:  { status: 'active' },
  sortBy:   'price',
  pageSize: 25,
})

// Create a new product
const product = await client.create('Products', {
  name:   'Studio Monitor XL',
  price:  499.99,
  status: 'active',
})

console.log(product.ID)  // "PROD0000123"`

const showcasePy = `import os
from decicore_sdk import DeciCore

client = DeciCore(
    token=os.environ["DECICORE_TOKEN"],
    project_id=os.environ["DECICORE_PROJECT_ID"],
    tenant_id=os.environ["DECICORE_TENANT_ID"],
)

# List active products
result = client.list(
    "Products",
    filters={"status": "active"},
    sort_by="price",
    page_size=25,
)

# Create a new product
product = client.create("Products", {
    "name":   "Studio Monitor XL",
    "price":  499.99,
    "status": "active",
})

print(product["ID"])  # "PROD0000123"`
</script>

<style scoped>
.home {
  overflow-x: hidden;
}

/* ── Hero ──────────────────────────────────────────────────────── */
.hero {
  padding: calc(var(--nav-h) + 4.5rem) 2.5rem 5rem;
}

.hero-inner {
  max-width: 1120px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.4rem;
}

.hero-h1 { max-width: 720px; }

.hero-sub {
  font-size: 1.08rem;
  color: var(--muted);
  line-height: 1.7;
  max-width: 600px;
  margin: 0;
}

.hero-cta {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.hero-demo {
  width: 100%;
  max-width: 900px;
  margin-top: 1.5rem;
  text-align: left;
}

/* Hero entrance: plain CSS so above-the-fold content is never gated on JS */
.hero-badge, .hero-h1, .hero-sub, .hero-cta, .hero-demo {
  animation: hero-in 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
}
.hero-badge  { animation-delay: 0s; }
.hero-h1     { animation-delay: 0.08s; }
.hero-sub    { animation-delay: 0.16s; }
.hero-cta    { animation-delay: 0.24s; }
.hero-demo   { animation-delay: 0.32s; }

@keyframes hero-in {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .hero-badge, .hero-h1, .hero-sub, .hero-cta, .hero-demo { animation: none; }
}

/* ── Scroll reveals ───────────────────────────────────────────────
   Default state is the CSS resting state below; JS only adds
   .in-view (see script). If JS never runs, content is still visible
   because opacity here is a transition target, not an inline style. */
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1);
}
.reveal.in-view { opacity: 1; transform: translateY(0); }

.reveal-left  { transform: translateX(-32px); }
.reveal-left.in-view  { transform: translateX(0); }
.reveal-right { transform: translateX(32px); }
.reveal-right.in-view { transform: translateX(0); }

.reveal-group .reveal-item {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1);
}
.reveal-group.in-view .reveal-item { opacity: 1; transform: translateY(0); }
.reveal-group.in-view .reveal-item:nth-child(1) { transition-delay: 0s; }
.reveal-group.in-view .reveal-item:nth-child(2) { transition-delay: 0.08s; }
.reveal-group.in-view .reveal-item:nth-child(3) { transition-delay: 0.16s; }
.reveal-group.in-view .reveal-item:nth-child(4) { transition-delay: 0.24s; }

@media (prefers-reduced-motion: reduce) {
  .reveal, .reveal-group .reveal-item { transition: none; opacity: 1; transform: none; }
}

/* ── Compare ───────────────────────────────────────────────────── */
.compare {
  padding: 5rem 2.5rem 6rem;
  max-width: 1120px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
}

.compare-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 2rem;
  align-items: center;
}

.compare-col-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--subtle);
  margin-bottom: 1rem;
}

.without-col { display: flex; flex-direction: column; }

.without-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.9rem 1.1rem;
  background: transparent;
  border: 1px dashed var(--border-hi);
  border-radius: var(--radius-sm);
  margin-bottom: 0.6rem;
}

.without-name { font-size: 0.85rem; color: var(--muted); font-weight: 500; }
.without-install {
  font-size: 0.72rem;
  background: var(--bg-recessed);
  color: var(--subtle);
}

.compare-connector {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  height: 100%;
  justify-content: center;
}

.compare-connector-line {
  width: 1px;
  flex: 1;
  min-height: 24px;
  background: var(--border-hi);
}

.compare-connector-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--primary-bright);
  white-space: nowrap;
}

.with-card {
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-color: rgba(124,58,237,0.35);
}

.with-name {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--text);
}

.with-install {
  font-size: 0.78rem;
  background: var(--bg-recessed);
  color: var(--primary-bright);
  align-self: flex-start;
}

.with-pills {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.with-pill {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  padding: 0.32rem 0.65rem;
  border-radius: 100px;
  background: rgba(124,58,237,0.12);
  color: var(--primary-bright);
  border: 1px solid rgba(124,58,237,0.3);
}

/* ── Features ───────────────────────────────────────────────────── */
.features {
  padding: 2rem 2.5rem 6rem;
  max-width: 1200px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.feature-card {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.feature-card h3 {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text);
}

.feature-card p {
  font-size: 0.875rem;
  color: var(--muted);
  line-height: 1.65;
  margin: 0;
}

.feat-icon {
  width: 42px;
  height: 42px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-recessed);
  color: var(--muted);
  border: 1px solid var(--border);
  transition: color 0.2s, border-color 0.2s;
}

.feature-card:hover .feat-icon {
  color: var(--primary-bright);
  border-color: rgba(124,58,237,0.4);
}

/* ── Showcase ────────────────────────────────────────────────────── */
.showcase {
  padding: 5rem 2.5rem;
  background: var(--bg-raised);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.showcase-grid {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 4rem;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.showcase-text {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.showcase-text h2 {
  font-size: clamp(1.7rem, 2.6vw, 2.3rem);
}

.showcase-bullets {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.showcase-bullets li {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-size: 0.875rem;
  color: var(--muted);
  line-height: 1.5;
}

/* ── Stats ───────────────────────────────────────────────────────── */
.stats {
  padding: 4rem 2.5rem;
  text-align: center;
}

.stats-label { margin-bottom: 2rem; }

.stats-grid {
  display: flex;
  gap: 1.25rem;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
}

.stat-card {
  padding: 1.75rem 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  min-width: 200px;
  background: var(--bg-recessed);
}

.stat-value {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 1.9rem;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.01em;
}

.stat-desc {
  font-size: 0.7rem;
  color: var(--subtle);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-family: 'IBM Plex Mono', monospace;
}

/* ── CTA ────────────────────────────────────────────────────────── */
.cta-section {
  padding: 6rem 2.5rem;
}

.cta-card {
  padding: 4rem;
  max-width: 1200px;
  margin: 0 auto;
  overflow: hidden;
}

.cta-glow {
  position: absolute;
  top: -120px;
  left: 50%;
  transform: translateX(-50%);
  width: 460px;
  height: 300px;
  background: radial-gradient(ellipse, rgba(124,58,237,0.25) 0%, transparent 70%);
  pointer-events: none;
}

.cta-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.25rem;
}

.cta-inner h2 { font-size: clamp(1.9rem, 3.2vw, 2.6rem); }

.cta-inner p {
  font-size: 1rem;
  max-width: 460px;
  margin: 0;
}

.cta-buttons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 0.25rem;
}

@media (max-width: 900px) {
  .compare-grid { grid-template-columns: 1fr; }
  .compare-connector { flex-direction: row; padding: 0.5rem 0; }
  .compare-connector-line { width: auto; height: 1px; flex: 1; min-width: 24px; min-height: 0; }
}

@media (max-width: 768px) {
  .features-grid { grid-template-columns: 1fr; }
  .showcase-grid { grid-template-columns: 1fr; }
}
</style>
