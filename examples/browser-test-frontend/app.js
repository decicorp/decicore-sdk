import { DeciCore, DecicoreError } from 'decicore-sdk';

let session = null; // { token, user_id, tenant_id, ... } from DeciCore.login()

const $ = (id) => document.getElementById(id);

function showOutput(el, ok, data) {
  el.classList.remove('ok', 'err');
  el.classList.add('show', ok ? 'ok' : 'err');
  el.textContent = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
}

function parseJsonField(el) {
  const raw = el.value.trim();
  if (!raw) return undefined;
  return JSON.parse(raw); // caller catches
}

/** Wraps a button+output pair: disables the button, runs fn(), renders the result or error. */
function wire(buttonId, outputId, fn) {
  const btn = $(buttonId);
  const out = $(outputId);
  btn.addEventListener('click', async () => {
    btn.disabled = true;
    try {
      const result = await fn();
      showOutput(out, true, result);
    } catch (err) {
      if (err instanceof DecicoreError) {
        showOutput(out, false, `HTTP ${err.status}: ${err.message}`);
      } else if (err instanceof SyntaxError) {
        showOutput(out, false, `Invalid JSON in one of the fields: ${err.message}`);
      } else {
        showOutput(out, false, `${err.name || 'Error'}: ${err.message}`);
      }
    } finally {
      btn.disabled = false;
    }
  });
}

function currentClient() {
  if (!session) throw new Error('Log in first.');
  return new DeciCore({
    token: session.token,
    userId: session.user_id,
    tenantId: session.tenant_id,
    projectId: session.project_id,
    baseUrl: $('base-url').value.trim() || undefined,
  });
}

function setLoggedIn(result) {
  session = result;
  $('session-bar').classList.add('show');
  $('session-info').textContent = `user_id=${result.user_id} tenant_id=${result.tenant_id} project_id=${result.project_id}`;
  document.querySelectorAll('[data-needs-session]').forEach((el) => el.classList.remove('locked'));
}

function setLoggedOut() {
  session = null;
  $('session-bar').classList.remove('show');
  document.querySelectorAll('[data-needs-session]').forEach((el) => el.classList.add('locked'));
}

$('base-url').addEventListener('input', () => {
  $('base-url-label').textContent = $('base-url').value.trim() || 'https://api.decicore.dev';
});

$('logout-btn').addEventListener('click', setLoggedOut);

// ── 1. Login ────────────────────────────────────────────────────
wire('login-btn', 'out-login', async () => {
  const result = await DeciCore.login(
    {
      user_email: $('login-email').value.trim(),
      user_password: $('login-password').value,
      project_id: $('login-project').value.trim(),
      tenant_id: $('login-tenant').value.trim() || undefined,
    },
    $('base-url').value.trim() || undefined,
  );
  setLoggedIn(result);
  return result;
});

// ── CRUD ────────────────────────────────────────────────────────
wire('list-btn', 'out-list', () =>
  currentClient().list($('list-collection').value.trim(), {
    filters: parseJsonField($('list-filters')),
  }));

wire('get-btn', 'out-get', () =>
  currentClient().get($('get-collection').value.trim(), $('get-id').value.trim()));

wire('create-btn', 'out-create', () =>
  currentClient().create($('create-collection').value.trim(), parseJsonField($('create-data')) || {}));

wire('update-btn', 'out-update', () =>
  currentClient().update(
    $('update-collection').value.trim(),
    $('update-id').value.trim(),
    parseJsonField($('update-data')) || {},
  ));

wire('delete-btn', 'out-delete', () =>
  currentClient().delete($('delete-collection').value.trim(), $('delete-id').value.trim()));

// ── AI / Forms / Dashboards ─────────────────────────────────────
wire('action-btn', 'out-action', () => {
  const prompt = $('action-prompt').value.trim();
  return currentClient().runAction($('action-id').value.trim(), prompt ? { prompt } : {});
});

wire('form-btn', 'out-form', () =>
  currentClient().forms.get($('form-id').value.trim()));

wire('dashboard-btn', 'out-dashboard', () => {
  const id = $('dashboard-id').value.trim();
  const filters = parseJsonField($('dashboard-filters'));
  const client = currentClient();
  return id ? client.dashboards.get(id, filters) : client.dashboards.list();
});
