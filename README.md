# DECICORE SDK

Official JavaScript and Python SDKs for the DECICORE multi-tenant backend platform.

**Base URL:** `https://api.decicore.dev`

---

## Repository structure

```
DECICORE-Library/
├── packages/
│   ├── js/                   # npm package: decicore-sdk
│   │   ├── src/index.ts      # Full TypeScript SDK
│   │   ├── decicore.config.ts
│   │   ├── package.json
│   │   ├── tsconfig.json     # type-checking only (see typecheck script)
│   │   └── tsup.config.ts    # build → dist/ (CJS + ESM + .d.ts)
│   └── python/               # pip package: decicore-sdk
│       ├── decicore_sdk/__init__.py  # Full Python SDK
│       ├── decicore.config.py
│       ├── pyproject.toml
│       └── README.md         # shown on the PyPI project page
└── site/                     # Vue 3 documentation website
    ├── src/
    │   ├── pages/            # One Vue page per documentation section
    │   ├── components/       # NavBar, Sidebar, CodeBlock, OnThisPage
    │   └── main.ts
    ├── package.json
    └── vite.config.ts
```

---

## Installation

**JavaScript / TypeScript**
```bash
npm install decicore-sdk
```

**Python**
```bash
pip install decicore-sdk
# or from source:
pip install ./packages/python
```

---

## Quick start

Every operation except `DeciCore.login()` requires an authenticated user — log in first, then build the client from the result. See [Authentication patterns](#authentication-patterns) below for the two ways to do this depending on your app's shape.

### JavaScript

```typescript
import { DeciCore } from 'decicore-sdk'

const session = await DeciCore.login({
  user_email:    process.env.DECICORE_EMAIL!,
  user_password: process.env.DECICORE_PASSWORD!,
  project_id:    process.env.DECICORE_PROJECT_ID!,
})

const client = new DeciCore({
  token:     session.token,
  userId:    session.user_id,
  tenantId:  session.tenant_id,
  projectId: session.project_id,
})

// CRUD
const { records } = await client.list('Products', { filters: { status: 'active' } })
const product      = await client.get('Products', 'PROD0000001')
const created      = await client.create('Products', { name: 'Monitor', price: 299 })
await client.update('Products', 'PROD0000001', { price: 249 })
await client.delete('Products', 'PROD0000001')

// AI — run a saved Action (built in DECICORE Studio)
const tagged = await client.runAction('AIA0000123', {
  prompt: 'Classify each product by category.',
})

// Forms & dashboards
const schema    = await client.forms.get('FRM0000001')
const dashboard = await client.dashboards.get('DSH0000001', { time_range_days: 30 })

// Users (requires an Admin token)
await client.users.create({ user_name: 'Jane', user_email: 'jane@co.com', user_password: 'x', user_role: 'User' })

// Billing
const plans = await client.plans.list()
await client.billing.subscribe({ stripe_account_id: 'acct_...', customer_email: 'jane@co.com', price_id: plans[0].prices[0].id })
```

### Python

```python
import os
from decicore_sdk import DeciCore

session = DeciCore.login(
    user_email=os.environ["DECICORE_EMAIL"],
    user_password=os.environ["DECICORE_PASSWORD"],
    project_id=os.environ["DECICORE_PROJECT_ID"],
)

client = DeciCore(
    token=session["token"],
    user_id=session["user_id"],
    tenant_id=session["tenant_id"],
    project_id=session["project_id"],
)

# CRUD
result  = client.list("Products", filters={"status": "active"})
product = client.get("Products", "PROD0000001")
created = client.create("Products", {"name": "Monitor", "price": 299})
client.update("Products", "PROD0000001", {"price": 249})
client.delete("Products", "PROD0000001")

# AI — run a saved Action (built in DECICORE Studio)
tagged = client.run_action("AIA0000123", prompt="Classify each product by category.")

# Forms & dashboards
schema    = client.forms.get("FRM0000001")
dashboard = client.dashboards.get("DSH0000001", filters={"time_range_days": 30})

# Users (requires an Admin token)
client.users.create({"user_name": "Jane", "user_email": "jane@co.com", "user_password": "x", "user_role": "User"})

# Billing
plans = client.plans.list()
client.billing.subscribe(stripe_account_id="acct_...", customer_email="jane@co.com", price_id=plans[0]["prices"][0]["id"])
```

---

## Authentication patterns

`DeciCore.login()` is the only call that works before you're authenticated — it needs an email/password, a `project_id` (login always authenticates in that project's production context, never DECICORE's tenant-level dev/Studio context), and `tenant_id` if that account belongs to more than one tenant. Every other method needs a `token` + `userId` + `tenantId` + `projectId`, built from `login()`'s result. Which login you call depends on **who** is actually using your integration.

### Option A — Single login (service account)

Good for: internal tools, backend jobs, scripts, or any app where *your app itself* is the actor — not its individual end-users. Log in once with one DECICORE account (e.g. an Admin user created just for this integration) and reuse that session for every call your app makes, no matter how many people use your app.

```typescript
// once, at startup — env vars, never hardcoded
const session = await DeciCore.login({
  user_email:    process.env.DECICORE_EMAIL!,
  user_password: process.env.DECICORE_PASSWORD!,
  project_id:    process.env.DECICORE_PROJECT_ID!,
})
const client = new DeciCore({
  token: session.token, userId: session.user_id, tenantId: session.tenant_id,
  projectId: session.project_id,
})
```

### Option B — Per-user login (multi-user apps)

Good for: apps where each of *your* end-users has (or should have) their own DECICORE identity — e.g. you want DECICORE's roles/permissions and audit trail to reflect your real users, not one shared account.

1. When someone logs into **your** app, call `DeciCore.login()` with **their** DECICORE credentials and the project they should land in (a constant if your app is single-project, or looked up per-user first if it isn't).
2. Store the result (`token`, `user_id`, `tenant_id`, `project_id` — never the password) in your app's own session or database, keyed by your user.
3. Build a fresh `DeciCore` client from that stored session on every request. Constructing it is cheap (it only sets headers) — don't try to share or pool instances across users.

```typescript
// your app's login route
const session = await DeciCore.login({ user_email: email, user_password: password, project_id: PROJECT_ID })
req.session.decicore = {
  token: session.token, userId: session.user_id, tenantId: session.tenant_id, projectId: session.project_id,
}

// any authenticated route
const client = new DeciCore({
  token:     req.session.decicore.token,
  userId:    req.session.decicore.userId,
  tenantId:  req.session.decicore.tenantId,
  projectId: req.session.decicore.projectId,
})
```

### Token lifetime (both patterns)

Tokens last 3 hours and auto-renew on active use, up to a 24-hour cap since the original login. If a call ever comes back `401`, re-run `DeciCore.login()` for that session (service account or end-user) and replace the stored token.

---

## Environment configuration

Set `DECICORE_ENV` before starting your app to switch servers:

| `DECICORE_ENV` | Target URL |
|---|---|
| `local` | `http://localhost:5000` |
| `test` | `https://test-api.decicore.dev` |
| `prod` _(default)_ | `https://api.decicore.dev` |

```bash
# Local development
DECICORE_ENV=local node app.js
DECICORE_ENV=local python app.py
```

---

## Testing locally (before publishing)

### JavaScript

```bash
cd packages/js
npm install
npm run build        # tsup → dist/index.js (CJS), dist/index.mjs (ESM), dist/index.d.ts
npm run typecheck     # tsc --noEmit, catches type errors the build itself won't
```

Smoke-test the built output directly — no publishing needed:

```bash
node -e "
const { DeciCore, DecicoreError } = require('./dist/index.js');
DeciCore.login({ user_email: 'a@b.com', user_password: 'wrong', project_id: 'PRJ0000001' })
  .catch(err => console.log(err instanceof DecicoreError, err.status, err.message));
"
```

To test it exactly as an external project would consume it (`npm install decicore-sdk`), use `npm link` — this registers your local build globally, then a second project can pull it in without touching the real registry:

```bash
cd packages/js && npm link          # registers this package globally
cd ../../my-test-app && npm link decicore-sdk   # symlinks it into that project's node_modules
```

Now `require('decicore-sdk')` / `import ... from 'decicore-sdk'` in `my-test-app` resolves to your local build. Run `npm unlink decicore-sdk` (in the test app) and `npm unlink -g decicore-sdk` (in `packages/js`) when done.

### Python

```bash
cd packages/python
pip install -e .     # editable install — code changes are picked up immediately, no reinstall
python -c "
from decicore_sdk import DeciCore, DecicoreError
try:
    DeciCore.login('a@b.com', 'wrong', project_id='PRJ0000001')
except DecicoreError as e:
    print(e.status_code, e)
"
```

To test the real distributable artifact (what `pip install decicore-sdk` would actually install), build it and install the wheel into a throwaway virtualenv:

```bash
pip install build
python -m build                                  # → dist/decicore_sdk-*.whl
python -m venv /tmp/sdk-test && /tmp/sdk-test/Scripts/pip install dist/decicore_sdk-*-py3-none-any.whl
/tmp/sdk-test/Scripts/python -c "from decicore_sdk import DeciCore; print(DeciCore)"
```

Either test above hits the real `https://api.decicore.dev` (a bad login returns a real `401` with a real error message) — that's intentional, it's the cheapest way to confirm headers/auth wiring are correct without needing valid credentials.

---

## Publishing

### npm

```bash
cd packages/js
npm run build          # always rebuild dist/ right before publishing
npm version patch      # or minor / major — bumps package.json and tags
npm login              # one-time, needs an npmjs.com account
npm publish            # "decicore-sdk" is unscoped → public by default
```

### PyPI

```bash
cd packages/python
pip install build twine
python -m build                      # → dist/*.whl and dist/*.tar.gz
twine upload --repository testpypi dist/*   # optional dry run: https://test.pypi.org
twine upload dist/*                  # real upload — needs a PyPI API token, not a password
```

For `twine`, create an API token on pypi.org (Account settings → API tokens) and use it as the password with username `__token__`, either at the prompt or via `TWINE_USERNAME=__token__` / `TWINE_PASSWORD=pypi-...` env vars.

---

## Running the documentation site

```bash
cd site
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → site/dist/
npm run preview  # preview production build
```

---

## Required headers

Every request sends these headers automatically (`DeciCore.login()` is the one exception — it sends none of these, since you don't have a session yet):

| Header | Value |
|---|---|
| `Authorization` | `{token}` (raw token — DECICORE does not use a `Bearer ` prefix) |
| `Core-User-ID` | The authenticated user's ID |
| `Core-Project-ID` | Your Project ID |
| `Core-Tenant-ID` | Your Tenant ID |
| `Content-Type` | `application/json` |
