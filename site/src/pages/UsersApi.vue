<template>
  <div class="doc-page">
    <div class="doc-body">

      <span class="badge">Users & Auth</span>
      <h1>User Management</h1>
      <p class="lead">
        Create users, authenticate them, and manage sessions. The SDK wraps user creation
        and login into two simple methods that handle everything server-side.
      </p>

      <!-- Create user -->
      <span id="create-user" class="section-anchor"></span>
      <h2>client.users.create()</h2>
      <p>Create a new user within the tenant. Requires an <strong>Admin</strong> token. The response includes the new user's <code>ID</code> and metadata.</p>

      <div class="method-sig">
        <span class="method-badge post">POST</span>
        <span class="method-path">/api/users/create-user</span>
      </div>

      <table class="param-table">
        <thead><tr><th>Parameter</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td class="pn">user_name</td><td class="pt">string</td><td class="pr">required</td><td>Full display name of the user</td></tr>
          <tr><td class="pn">user_email</td><td class="pt">string</td><td class="pr">required</td><td>Unique email address. Used as the login identifier</td></tr>
          <tr><td class="pn">user_password</td><td class="pt">string</td><td class="pr">required</td><td>Initial password. Stored hashed. Must be at least 8 characters</td></tr>
          <tr><td class="pn">user_role</td><td class="pt">"Admin" | "User"</td><td class="pr">required</td><td><code>Admin</code>: can create users, full access. <code>User</code>: standard access</td></tr>
        </tbody>
      </table>

      <CodeBlock :js="createJs" :python="createPy" />

      <hr class="divider" />

      <!-- Login -->
      <span id="login" class="section-anchor"></span>
      <h2>client.users.login()</h2>
      <p>Authenticate a user and receive a bearer token. Use the returned token to initialize a new <code>DeciCore</code> client scoped to that user's session.</p>

      <div class="method-sig">
        <span class="method-badge post">POST</span>
        <span class="method-path">/api/users/login</span>
      </div>

      <div class="callout warning">
        <div class="callout-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </div>
        <div>
          <strong>Rate limited</strong>
          Login is rate-limited to 5 attempts per minute per email. Exceeding this returns <code>429 Too Many Requests</code>.
        </div>
      </div>

      <table class="param-table">
        <thead><tr><th>Parameter</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td class="pn">user_email</td><td class="pt">string</td><td class="pr">required</td><td>The user's email address</td></tr>
          <tr><td class="pn">user_password</td><td class="pt">string</td><td class="pr">required</td><td>The user's password</td></tr>
        </tbody>
      </table>

      <CodeBlock :js="loginJs" :python="loginPy" />

      <hr class="divider" />

      <!-- Auth flow -->
      <span id="auth-flow" class="section-anchor"></span>
      <h2>Full authentication flow</h2>
      <p>A common pattern: your backend logs in with admin credentials, creates a user, then the user logs in with their own credentials and receives a scoped token.</p>

      <CodeBlock :js="flowJs" :python="flowPy" />

      <hr class="divider" />

      <!-- Tokens -->
      <span id="tokens" class="section-anchor"></span>
      <h2>Token management</h2>
      <p>Tokens are long-lived JWTs. Store them securely and pass them to <code>DeciCore</code> on initialization. Never expose tokens in client-side code.</p>

      <div class="token-tips">
        <div class="card tip-card">
          <div class="tip-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
          </div>
          <strong>Server-side only</strong>
          <p>Keep your admin token on the backend. Your frontend should only hold user-level tokens returned from <code>login()</code>.</p>
        </div>
        <div class="card tip-card">
          <div class="tip-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <strong>Scope by role</strong>
          <p>Create <code>User</code>-role accounts for end users. Reserve <code>Admin</code> tokens for backend services that need to manage other users.</p>
        </div>
        <div class="card tip-card">
          <div class="tip-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <strong>Handle expiry</strong>
          <p>When you receive a <code>401 Unauthorized</code>, call <code>login()</code> again to refresh. Store the new token and retry the failed request.</p>
        </div>
      </div>

      <!-- Doc nav -->
      <div class="doc-nav">
        <router-link to="/docs/ai-inference" class="doc-nav-link">
          <span class="doc-nav-label">Previous</span>
          <span class="doc-nav-title">AI Inference</span>
        </router-link>
        <router-link to="/docs/billing" class="doc-nav-link next">
          <span class="doc-nav-label">Next</span>
          <span class="doc-nav-title">Plans & Billing</span>
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
  { id: 'create-user', label: 'client.users.create()' },
  { id: 'login',       label: 'client.users.login()' },
  { id: 'auth-flow',   label: 'Full auth flow' },
  { id: 'tokens',      label: 'Token management' },
]

const createJs = `// Requires an Admin token
const user = await client.users.create({
  user_name:     'Jane Doe',
  user_email:    'jane@acme.com',
  user_password: 'Temp1234!',
  user_role:     'User',
})

console.log(user.ID)          // "USER0000042"
console.log(user.user_email)  // "jane@acme.com"
console.log(user.user_role)   // "User"`

const createPy = `# Requires an Admin token
user = client.users.create({
    "user_name":     "Jane Doe",
    "user_email":    "jane@acme.com",
    "user_password": "Temp1234!",
    "user_role":     "User",
})

print(user["ID"])          # "USER0000042"
print(user["user_email"])  # "jane@acme.com"
print(user["user_role"])   # "User"`

const loginJs = `const session = await client.users.login({
  user_email:    'jane@acme.com',
  user_password: 'Temp1234!',
})

// session.token → the bearer token for this user
// Use it to create a user-scoped client:
const userClient = new DeciCore({
  token:     session.token,
  projectId: process.env.DECICORE_PROJECT_ID!,
  tenantId:  process.env.DECICORE_TENANT_ID!,
})`

const loginPy = `session = client.users.login(
    user_email="jane@acme.com",
    user_password="Temp1234!",
)

# session["token"] → the bearer token for this user
# Use it to create a user-scoped client:
import os
from decicore_sdk import DeciCore

user_client = DeciCore(
    token=session["token"],
    project_id=os.environ["DECICORE_PROJECT_ID"],
    tenant_id=os.environ["DECICORE_TENANT_ID"],
)`

const flowJs = `import { DeciCore, DecicoreError } from 'decicore-sdk'

// 1. Admin client (server-side only)
const admin = new DeciCore({
  token:     process.env.DECICORE_ADMIN_TOKEN!,
  projectId: process.env.DECICORE_PROJECT_ID!,
  tenantId:  process.env.DECICORE_TENANT_ID!,
})

// 2. Create the new user account
const newUser = await admin.users.create({
  user_name:     'Jane Doe',
  user_email:    'jane@acme.com',
  user_password: 'Temp1234!',
  user_role:     'User',
})

// 3. Jane logs in with her own credentials
const session = await admin.users.login({
  user_email:    'jane@acme.com',
  user_password: 'Temp1234!',
})

// 4. Jane's scoped client — limited to her own data
const janeClient = new DeciCore({
  token:     session.token,
  projectId: process.env.DECICORE_PROJECT_ID!,
  tenantId:  process.env.DECICORE_TENANT_ID!,
})`

const flowPy = `import os
from decicore_sdk import DeciCore, DecicoreError

# 1. Admin client (server-side only)
admin = DeciCore(
    token=os.environ["DECICORE_ADMIN_TOKEN"],
    project_id=os.environ["DECICORE_PROJECT_ID"],
    tenant_id=os.environ["DECICORE_TENANT_ID"],
)

# 2. Create the new user account
new_user = admin.users.create({
    "user_name":     "Jane Doe",
    "user_email":    "jane@acme.com",
    "user_password": "Temp1234!",
    "user_role":     "User",
})

# 3. Jane logs in with her own credentials
session = admin.users.login(
    user_email="jane@acme.com",
    user_password="Temp1234!",
)

# 4. Jane's scoped client — limited to her own data
jane_client = DeciCore(
    token=session["token"],
    project_id=os.environ["DECICORE_PROJECT_ID"],
    tenant_id=os.environ["DECICORE_TENANT_ID"],
)`
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

.token-tips {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin: 0.5rem 0;
}

.tip-card {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tip-icon {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-recessed);
  border: 1px solid var(--border);
  color: var(--primary-bright);
}

.tip-card strong {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text);
}

.tip-card p {
  font-size: 0.82rem;
  color: var(--muted);
  margin: 0;
  line-height: 1.6;
}

@media (max-width: 700px) {
  .token-tips { grid-template-columns: 1fr; }
}
</style>
