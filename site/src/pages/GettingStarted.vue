<template>
  <div class="doc-page">
    <div class="doc-body">

      <span class="badge">Getting Started</span>
      <h1>Getting Started</h1>
      <p class="lead">
        Install the SDK, initialize the client with your credentials, and make your first
        API call in under five minutes.
      </p>

      <!-- Installation -->
      <span id="install" class="section-anchor"></span>
      <h2>Installation</h2>
      <p>Install via your package manager. The SDK has no required runtime dependencies beyond <code>requests</code> (Python) or the native <code>fetch</code> API (JavaScript).</p>

      <CodeBlock :terminal="installTerminal" />

      <hr class="divider" />

      <!-- Prerequisites -->
      <span id="prerequisites" class="section-anchor"></span>
      <h2>Prerequisites</h2>
      <p>Before making your first call you'll need three values from your DECICORE account:</p>

      <table class="param-table">
        <thead>
          <tr><th>Credential</th><th>Format</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr>
            <td class="pn">token</td>
            <td class="pt">string</td>
            <td>Your bearer token. Obtained by calling <code>client.users.login()</code> or through the dashboard.</td>
          </tr>
          <tr>
            <td class="pn">projectId</td>
            <td class="pt">PROJ0000001</td>
            <td>The project scope for all requests. Found in your DECICORE project settings.</td>
          </tr>
          <tr>
            <td class="pn">tenantId</td>
            <td class="pt">TENANT0000001</td>
            <td>The tenant scope for all requests. Found alongside your project ID.</td>
          </tr>
        </tbody>
      </table>

      <div class="callout tip">
        <div class="callout-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div>
          <strong>Store credentials in environment variables</strong>
          Never hardcode tokens in source code. Use <code>.env</code> files locally and your deployment platform's secrets in production.
        </div>
      </div>

      <hr class="divider" />

      <!-- Initialize -->
      <span id="init" class="section-anchor"></span>
      <h2>Initialize the client</h2>
      <p>Create one client instance and reuse it throughout your application. The SDK is stateless — you can safely create multiple instances with different credentials.</p>

      <CodeBlock :js="initJs" :python="initPy" />

      <hr class="divider" />

      <!-- Environment config -->
      <span id="env-config" class="section-anchor"></span>
      <h2>Environment configuration</h2>
      <p>Use the <code>baseUrl</code> option to target a different server. DECICORE_ENV is read automatically from the environment:</p>

      <table class="param-table">
        <thead><tr><th>DECICORE_ENV</th><th>Target URL</th><th>Use for</th></tr></thead>
        <tbody>
          <tr><td class="pn">local</td><td class="pt">http://localhost:5000</td><td>Local development</td></tr>
          <tr><td class="pn">test</td><td class="pt">https://test-api.decicore.dev</td><td>Staging / QA</td></tr>
          <tr><td class="pn">prod</td><td class="pt">https://api.decicore.dev</td><td>Production (default)</td></tr>
        </tbody>
      </table>

      <CodeBlock :terminal="envTerminal" />

      <hr class="divider" />

      <!-- First request -->
      <span id="first-request" class="section-anchor"></span>
      <h2>Your first request</h2>
      <p>List records from any collection. The response always includes <code>records</code>, <code>total</code>, <code>page</code>, and <code>page_size</code>.</p>

      <CodeBlock :js="firstJs" :python="firstPy" />

      <hr class="divider" />

      <!-- Error handling -->
      <span id="errors" class="section-anchor"></span>
      <h2>Error handling</h2>
      <p>All SDK methods throw <code>DecicoreError</code> on non-2xx responses. Inspect the <code>status</code> property for the HTTP status code.</p>

      <div class="callout info">
        <div class="callout-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
        </div>
        <div>
          <strong>Common status codes</strong>
          <code>401</code> invalid or expired token · <code>403</code> insufficient permissions · <code>404</code> record not found · <code>429</code> rate limited
        </div>
      </div>

      <CodeBlock :js="errJs" :python="errPy" />

      <!-- Doc nav -->
      <div class="doc-nav">
        <router-link to="/docs/introduction" class="doc-nav-link">
          <span class="doc-nav-label">Previous</span>
          <span class="doc-nav-title">Introduction</span>
        </router-link>
        <router-link to="/docs/crud" class="doc-nav-link next">
          <span class="doc-nav-label">Next</span>
          <span class="doc-nav-title">CRUD Operations</span>
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
  { id: 'install',       label: 'Installation' },
  { id: 'prerequisites', label: 'Prerequisites' },
  { id: 'init',          label: 'Initialize client' },
  { id: 'env-config',    label: 'Environment config' },
  { id: 'first-request', label: 'First request' },
  { id: 'errors',        label: 'Error handling' },
]

const installTerminal = `# JavaScript / TypeScript
npm install decicore-sdk

# Python
pip install decicore-sdk`

const initJs = `import { DeciCore } from 'decicore-sdk'

const client = new DeciCore({
  token:     process.env.DECICORE_TOKEN!,
  projectId: process.env.DECICORE_PROJECT_ID!,
  tenantId:  process.env.DECICORE_TENANT_ID!,
  // baseUrl is optional — defaults to https://api.decicore.dev
})`

const initPy = `import os
from decicore_sdk import DeciCore

client = DeciCore(
    token=os.environ["DECICORE_TOKEN"],
    project_id=os.environ["DECICORE_PROJECT_ID"],
    tenant_id=os.environ["DECICORE_TENANT_ID"],
    # base_url is optional — defaults to https://api.decicore.dev
)`

const envTerminal = `# .env (local development)
DECICORE_TOKEN=your-bearer-token
DECICORE_PROJECT_ID=PROJ0000001
DECICORE_TENANT_ID=TENANT0000001
DECICORE_ENV=local

# DECICORE_ENV=local → http://localhost:5000
# DECICORE_ENV=test  → https://test-api.decicore.dev
# DECICORE_ENV=prod  → https://api.decicore.dev  (default)`

const firstJs = `const result = await client.list('Products', {
  filters:   { status: 'active' },
  sortBy:    'price',
  sortOrder: 'asc',
  pageSize:  25,
})

console.log(\`Found \${result.total} products\`)
result.records.forEach(p => console.log(p.name, p.price))`

const firstPy = `result = client.list(
    "Products",
    filters={"status": "active"},
    sort_by="price",
    sort_order="asc",
    page_size=25,
)

print(f"Found {result['total']} products")
for p in result["records"]:
    print(p["name"], p["price"])`

const errJs = `import { DeciCore, DecicoreError } from 'decicore-sdk'

try {
  const record = await client.get('Products', 'INVALID_ID')
} catch (err) {
  if (err instanceof DecicoreError) {
    console.error(\`API error \${err.status}: \${err.message}\`)
    // err.status === 404 → not found
    // err.status === 401 → invalid or expired token
    // err.status === 403 → insufficient permissions
  }
}`

const errPy = `from decicore_sdk import DeciCore, DecicoreError

try:
    record = client.get("Products", "INVALID_ID")
except DecicoreError as e:
    print(f"API error {e.status_code}: {e}")
    # e.status_code == 404 → not found
    # e.status_code == 401 → invalid or expired token
    # e.status_code == 403 → insufficient permissions`
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
  gap: 0.75rem;
}

.doc-body h1 { margin-top: 0.5rem; margin-bottom: 0.25rem; }
.doc-body h2 { margin-top: 1.75rem; margin-bottom: 0.4rem; }

.lead {
  font-size: 1.05rem;
  color: var(--muted);
  line-height: 1.75;
  max-width: 580px;
  margin: 0 0 0.5rem;
}
</style>
