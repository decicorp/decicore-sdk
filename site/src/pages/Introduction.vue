<template>
  <div class="doc-page">
    <div class="doc-body">

      <span class="badge">Official SDK</span>
      <h1>Introduction</h1>
      <p class="lead">
        DECICORE is a multi-tenant backend platform with a unified API for data, AI inference,
        user auth, and billing. Two official SDKs — JavaScript and Python — so you spend time
        building, not wiring.
      </p>

      <!-- Overview -->
      <span id="overview" class="section-anchor"></span>
      <h2>Overview</h2>
      <p>The SDK covers four core areas, each mapping to a production-ready backend service:</p>

      <div class="feature-chips">
        <div class="chip">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
          CRUD Operations
        </div>
        <div class="chip">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          AI Inference
        </div>
        <div class="chip">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          User Management
        </div>
        <div class="chip">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          Plans & Billing
        </div>
      </div>

      <!-- Quick start -->
      <span id="quickstart" class="section-anchor"></span>
      <h2>Quick start</h2>
      <p>Install the package, create a client, and make your first call — all in under a minute.</p>

      <CodeBlock :js="quickJs" :python="quickPy" />

      <!-- How it works -->
      <span id="how-it-works" class="section-anchor"></span>
      <h2>How it works</h2>
      <p>Every SDK call maps directly to a DECICORE backend endpoint. The SDK handles auth headers, serialization, error normalization, and response typing — you just call methods.</p>

      <div class="steps">
        <div class="step">
          <div class="step-num">1</div>
          <div class="step-body">
            <strong>Install</strong>
            <span><code>npm install decicore-sdk</code> or <code>pip install decicore-sdk</code> — no other dependencies required.</span>
          </div>
        </div>
        <div class="step">
          <div class="step-num">2</div>
          <div class="step-body">
            <strong>Initialize</strong>
            <span>Pass your <code>token</code>, <code>projectId</code>, and <code>tenantId</code> once. The SDK attaches them to every request automatically.</span>
          </div>
        </div>
        <div class="step">
          <div class="step-num">3</div>
          <div class="step-body">
            <strong>Call methods</strong>
            <span>Use <code>client.list()</code>, <code>client.create()</code>, <code>client.infer()</code>, and more. Errors throw <code>DecicoreError</code> with HTTP status code and message.</span>
          </div>
        </div>
      </div>

      <div class="callout info">
        <div class="callout-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
        </div>
        <div>
          <strong>Multi-tenant by design</strong>
          All requests are scoped to a specific Project and Tenant. Tenant isolation is enforced server-side via the <code>Core-Project-ID</code> and <code>Core-Tenant-ID</code> headers the SDK sends automatically.
        </div>
      </div>

      <!-- Doc nav -->
      <div class="doc-nav">
        <router-link to="/docs/getting-started" class="doc-nav-link next">
          <span class="doc-nav-label">Next</span>
          <span class="doc-nav-title">Getting Started</span>
        </router-link>
      </div>

    </div>

    <OnThisPage :items="toc" />
  </div>
</template>

<script setup lang="ts">
import CodeBlock from '../components/CodeBlock.vue'
import OnThisPage from '../components/OnThisPage.vue'

const toc = [
  { id: 'overview',     label: 'Overview' },
  { id: 'quickstart',   label: 'Quick start' },
  { id: 'how-it-works', label: 'How it works' },
]

const quickJs = `import { DeciCore } from 'decicore-sdk'

const client = new DeciCore({
  token:     process.env.DECICORE_TOKEN!,
  projectId: process.env.DECICORE_PROJECT_ID!,
  tenantId:  process.env.DECICORE_TENANT_ID!,
})

// Fetch open support tickets
const { records } = await client.list('SupportTickets', {
  filters:  { status: 'open' },
  fields:   ['ID', 'subject', 'description'],
  pageSize: 20,
})

// Tag them with AI
const tagged = await client.infer({
  instructions:   'Classify each ticket: billing, technical, shipping, or other.',
  userContent:    { tickets: records },
  responseFormat: { tickets: [{ id: 'string', category: 'string' }] },
})

// Write results back
await Promise.all(
  tagged.tickets.map(t =>
    client.update('SupportTickets', t.id, { category: t.category })
  )
)`

const quickPy = `import os
from decicore_sdk import DeciCore

client = DeciCore(
    token=os.environ["DECICORE_TOKEN"],
    project_id=os.environ["DECICORE_PROJECT_ID"],
    tenant_id=os.environ["DECICORE_TENANT_ID"],
)

# Fetch open support tickets
result = client.list(
    "SupportTickets",
    filters={"status": "open"},
    fields=["ID", "subject", "description"],
    page_size=20,
)

# Tag them with AI
tagged = client.infer(
    instructions="Classify each ticket: billing, technical, shipping, or other.",
    user_content={"tickets": result["records"]},
    response_format={"tickets": [{"id": "string", "category": "string"}]},
)

# Write results back
for t in tagged["tickets"]:
    client.update("SupportTickets", t["id"], {"category": t["category"]})`
</script>

<style scoped>
.doc-page {
  display: flex;
  gap: 3rem;
  align-items: flex-start;
}

.doc-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.doc-body h1 { margin-top: 0.5rem; margin-bottom: 0.25rem; }
.doc-body h2 { margin-top: 1.75rem; margin-bottom: 0.4rem; }

.lead {
  font-size: 1.05rem;
  color: var(--muted);
  line-height: 1.75;
  max-width: 600px;
  margin: 0 0 0.5rem;
}

/* Feature chips */
.feature-chips {
  display: flex;
  gap: 0.65rem;
  flex-wrap: wrap;
  margin: 0.25rem 0 0.5rem;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.76rem;
  font-weight: 600;
  font-family: 'IBM Plex Mono', monospace;
  padding: 0.35rem 0.85rem;
  border-radius: var(--radius-sm);
  background: var(--bg-card);
  color: var(--muted);
  border: 1px solid var(--border-hi);
}

/* Steps */
.steps {
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  margin: 0.5rem 0;
}

.step {
  display: flex;
  gap: 1.25rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border);
  align-items: flex-start;
}

.step:last-child { border-bottom: none; }

.step-num {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--bg-recessed);
  border: 1px solid var(--border-hi);
  color: var(--primary-bright);
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.step-body {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.step-body strong { font-size: 0.95rem; color: var(--text); }
.step-body span   { font-size: 0.875rem; color: var(--muted); }
</style>
