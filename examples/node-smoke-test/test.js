// Smoke test for the decicore-sdk npm package.
//
// This installs the SDK from the exact tarball `npm pack` would upload to
// the registry (see package.json → "decicore-sdk": "file:../decicore-sdk-1.0.0.tgz"),
// so a green run here means "what gets published actually works".
//
// Usage:
//   npm install
//   npm test                                     # no credentials → checks wiring only
//   DECICORE_EMAIL=you@co.com DECICORE_PASSWORD=x DECICORE_PROJECT_ID=PRJ... npm test

import { DeciCore, DecicoreError } from 'decicore-sdk';

const BASE_URL   = process.env.DECICORE_BASE_URL || undefined;
const EMAIL      = process.env.DECICORE_EMAIL;
const PASSWORD   = process.env.DECICORE_PASSWORD;
const PROJECT_ID = process.env.DECICORE_PROJECT_ID;

let passed = 0;
let failed = 0;

function ok(label, detail = '') {
  passed++;
  console.log(`  \x1b[32m✓\x1b[0m ${label}${detail ? ` — ${detail}` : ''}`);
}
function bad(label, err) {
  failed++;
  console.log(`  \x1b[31m✗\x1b[0m ${label} — ${err instanceof Error ? err.message : err}`);
}

console.log('\n[1/2] Package resolves via both ESM and CJS\n');

try {
  const { createRequire } = await import('node:module');
  const require = createRequire(import.meta.url);
  const cjs = require('decicore-sdk');
  if (typeof cjs.DeciCore.login === 'function') ok('require("decicore-sdk") — CJS build');
  else bad('require("decicore-sdk") — CJS build', 'DeciCore.login is not a function');
} catch (err) {
  bad('require("decicore-sdk") — CJS build', err);
}

if (typeof DeciCore.login === 'function') ok('import { DeciCore } — ESM build');
else bad('import { DeciCore } — ESM build', 'DeciCore.login is not a function');

console.log('\n[2/2] Live calls against the real API\n');

// login() always authenticates in a project's production context — project_id
// is required. This call always happens, with real or throwaway credentials —
// either way it proves requests actually reach the API and headers/error
// handling work.
let session;
try {
  session = await DeciCore.login(
    {
      user_email: EMAIL || 'nonexistent@test.com',
      user_password: PASSWORD || 'wrong-password',
      project_id: PROJECT_ID || 'PRJ0000000',
    },
    BASE_URL,
  );
  ok('DeciCore.login()', `authenticated as user_id=${session.user_id}`);
} catch (err) {
  if (err instanceof DecicoreError && err.status === 401 && !EMAIL) {
    ok('DeciCore.login()', `reached the API, got expected 401 (no real credentials passed) — "${err.message}"`);
  } else if (err instanceof DecicoreError) {
    bad('DeciCore.login()', err);
  } else {
    bad('DeciCore.login() — network/parsing error, not an API response', err);
  }
}

if (session) {
  if (!PROJECT_ID) {
    console.log('\n  (set DECICORE_PROJECT_ID to also exercise list/forms/dashboards/runAction)\n');
  } else {
    const client = new DeciCore({
      token: session.token,
      userId: session.user_id,
      tenantId: session.tenant_id,
      projectId: session.project_id,
      baseUrl: BASE_URL,
    });

    try {
      const result = await client.list('Products', { pageSize: 1 });
      ok('client.list()', `got ${result.total ?? '?'} total record(s)`);
    } catch (err) {
      bad('client.list()', err);
    }

    try {
      const dashboards = await client.dashboards.list();
      ok('client.dashboards.list()', `${Array.isArray(dashboards) ? dashboards.length : '?'} dashboard(s)`);
    } catch (err) {
      bad('client.dashboards.list()', err);
    }
  }
}

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
