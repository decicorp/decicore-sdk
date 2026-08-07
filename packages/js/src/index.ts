// ============================================================
// decicore-sdk  —  JavaScript / TypeScript
// ============================================================

// ── Types ────────────────────────────────────────────────────

export interface DeciCoreOptions {
  /**
   * The raw `token` from `DeciCore.login()`, sent as-is on the
   * `Authorization` header — DECICORE does not use the `Bearer ` prefix.
   */
  token: string;
  /** The authenticated user's ID from `DeciCore.login()`. Sent as Core-User-ID on every request. */
  userId: string;
  /** Sent as Core-Project-ID on every request. */
  projectId: string;
  /** Sent as Core-Tenant-ID on every request. */
  tenantId: string;
  /**
   * Override the default server URL.
   * Defaults to https://api.decicore.dev
   *
   * @example
   * // Point at a local dev server:
   * new DeciCore({ ..., baseUrl: 'http://localhost:5000' })
   */
  baseUrl?: string;
}

export interface ListOptions {
  /** Exact-match filters, e.g. { status: 'active' } */
  filters?: Record<string, unknown>;
  /** Full-text search term. */
  search?: string;
  /** Field to sort by. */
  sortBy?: string;
  /** 'asc' or 'desc'. Default: 'desc'. */
  sortOrder?: 'asc' | 'desc';
  /** 1-based page number. Default: 1. */
  page?: number;
  /** Records per page. Default: 25. Max: 200. */
  pageSize?: number;
  /** Only return these fields (projection). */
  fields?: string[];
}

export interface ListResult<T = Record<string, unknown>> {
  records: T[];
  total: number;
  page: number;
  page_size: number;
}

export interface SubscribeOptions {
  /** Connected Stripe account ID (acct_...). */
  stripe_account_id: string;
  /** Customer email. Reuses an existing Stripe customer if found. */
  customer_email: string;
  /** Stripe Price ID (price_...). Use platform_price_id from plans.list(). */
  price_id: string;
  /** Stripe Payment Method ID (pm_...) from Stripe Elements. */
  payment_method_id?: string;
}

export interface CreateUserOptions {
  user_name: string;
  user_email: string;
  user_password: string;
  user_role: 'Admin' | 'User';
  [key: string]: unknown;
}

export interface LoginOptions {
  user_email: string;
  user_password: string;
  /**
   * The project you're logging into. Required — `DeciCore.login()` always
   * authenticates in a published project's production context (the same
   * context as a `project_tenant.decicore.dev` URL). It never logs into the
   * tenant-level dev/Studio context (no project selected), which is for
   * DECICORE's own builder UI, not third-party integrations.
   */
  project_id: string;
  /** Required only if the account belongs to more than one tenant. */
  tenant_id?: string;
}

/** The credentials `DeciCore.login()` returns — feed these straight into `new DeciCore()`. */
export interface LoginResult {
  token: string;
  tenant_id: string;
  user_id: string;
  /** Echoes back the `project_id` you logged in with. */
  project_id: string;
  user_name?: string;
  user_role?: string;
  [key: string]: unknown;
}

export interface RunActionOptions {
  /** Extra free-text input appended to the action's saved instructions. */
  prompt?: string;
  /** Override the response schema saved on the action. */
  responseFormat?: Record<string, unknown>;
  /** Any other field the action expects (model, provider, temperature, timeout, ...). */
  [key: string]: unknown;
}

/**
 * Query filters forwarded as-is to a dashboard or widget.
 * Use the same field/key names your dashlet's pipeline was built against
 * (e.g. `status`, `region`), plus the built-in `time_range_days` window.
 */
export type DashboardFilters = Record<string, string | number | boolean>;

// ── Error ────────────────────────────────────────────────────

/** Thrown when the DECICORE API responds with a non-2xx status. */
export class DecicoreError extends Error {
  public readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'DecicoreError';
    this.status = status;
  }
}

// ── Internal helpers ─────────────────────────────────────────

const DEFAULT_BASE_URL = 'https://api.decicore.dev';

async function request<T>(
  baseUrl: string,
  headers: Record<string, string>,
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const json = await res.json() as T;

  if (!res.ok) {
    const msg = (json as { error?: string; message?: string }).error
      ?? (json as { error?: string; message?: string }).message
      ?? `HTTP ${res.status}`;
    throw new DecicoreError(msg, res.status);
  }

  return json;
}

// ── Sub-clients ───────────────────────────────────────────────

export class PlansClient {
  constructor(
    private readonly baseUrl: string,
    private readonly headers: Record<string, string>,
  ) {}

  /**
   * List all active subscription plans for the tenant's Stripe account.
   * Each plan includes prices with `platform_price_id` for checkout.
   *
   * @example
   * const plans = await client.plans.list();
   * const priceId = plans[0].prices[0].id;
   */
  list<T = unknown[]>(): Promise<T> {
    return request<T>(this.baseUrl, this.headers, 'GET', '/api/stripe_plans/');
  }
}

export class UsersClient {
  constructor(
    private readonly baseUrl: string,
    private readonly headers: Record<string, string>,
  ) {}

  /**
   * Create a new user in the tenant. Requires an Admin token.
   *
   * @example
   * const user = await client.users.create({
   *   user_name:     'Jane Doe',
   *   user_email:    'jane@acme.com',
   *   user_password: 'Temp1234!',
   *   user_role:     'User',
   * });
   */
  create<T = Record<string, unknown>>(data: CreateUserOptions): Promise<T> {
    return request<T>(this.baseUrl, this.headers, 'POST', '/api/users/create-user', data);
  }
}

export class FormsClient {
  constructor(
    private readonly baseUrl: string,
    private readonly headers: Record<string, string>,
  ) {}

  /**
   * Get a form's schema — its fields (name, type, label, required, FK links)
   * and any linked dialogs. Useful for rendering a custom UI around a
   * DECICORE-defined form, or validating data before calling `client.create()`.
   *
   * @example
   * const schema = await client.forms.get('FRM0000001');
   * console.log(schema.collection_name, schema.data); // fields
   */
  get<T = Record<string, unknown>>(formId: string): Promise<T> {
    return request<T>(this.baseUrl, this.headers, 'GET', `/api/form/${formId}/data`);
  }
}

export class DashboardsClient {
  constructor(
    private readonly baseUrl: string,
    private readonly headers: Record<string, string>,
  ) {}

  private withFilters(path: string, filters?: DashboardFilters): string {
    if (!filters || Object.keys(filters).length === 0) return path;
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(filters)) p.set(k, String(v));
    return `${path}?${p.toString()}`;
  }

  /** List dashboards visible to the caller's project. */
  list<T = unknown[]>(): Promise<T> {
    return request<T>(this.baseUrl, this.headers, 'GET', '/api/liquid-dashboards/list');
  }

  /** Get a dashboard's widget layout (which widgets, in what order/size). */
  structure<T = Record<string, unknown>>(dashboardId: string): Promise<T> {
    return request<T>(this.baseUrl, this.headers, 'GET', `/api/liquid-dashboards/structure/${dashboardId}`);
  }

  /**
   * Get a dashboard's live widget data, keyed by widget instance ID.
   *
   * @example
   * const data = await client.dashboards.get('DSH0000001', {
   *   time_range_days: 30,
   *   status: 'active',
   * });
   */
  get<T = Record<string, unknown>>(dashboardId: string, filters?: DashboardFilters): Promise<T> {
    return request<T>(this.baseUrl, this.headers, 'GET', this.withFilters(`/api/liquid-dashboards/${dashboardId}`, filters));
  }

  /**
   * Get a single widget's data by its widget definition ID — useful for
   * embedding one chart/table without loading a whole dashboard.
   *
   * @example
   * const widget = await client.dashboards.widget('WDG0000001', { time_range_days: 7 });
   */
  widget<T = Record<string, unknown>>(widgetDefinitionId: string, filters?: DashboardFilters): Promise<T> {
    return request<T>(this.baseUrl, this.headers, 'GET', this.withFilters(`/api/liquid-dashboards/widgets/${widgetDefinitionId}`, filters));
  }
}

export class BillingClient {
  constructor(
    private readonly baseUrl: string,
    private readonly headers: Record<string, string>,
  ) {}

  /**
   * Subscribe a customer to a plan via Stripe.
   *
   * Creates a Stripe Customer (or reuses by email), attaches the payment method,
   * and creates a Subscription. The returned `payment_intent` must be confirmed
   * on the client if status is 'requires_action' (3D Secure).
   *
   * @example
   * const result = await client.billing.subscribe({
   *   stripe_account_id: 'acct_1AbCdEfGhIjKl',
   *   customer_email:    'jane@acme.com',
   *   price_id:          'price_Xyz789',    // from plans.list()
   *   payment_method_id: 'pm_...',          // from Stripe Elements
   * });
   *
   * if (result.payment_intent?.status === 'requires_action') {
   *   await stripe.confirmCardPayment(result.payment_intent.client_secret);
   * }
   */
  subscribe<T = Record<string, unknown>>(data: SubscribeOptions): Promise<T> {
    return request<T>(
      this.baseUrl,
      this.headers,
      'POST',
      '/api/stripe/create-tenant-subscription',
      data,
    );
  }
}

// ── Main client ───────────────────────────────────────────────

/**
 * DECICORE API client.
 *
 * Every operation except `DeciCore.login()` requires an authenticated user —
 * log in first, then construct the client from the result.
 *
 * @example
 * import { DeciCore } from 'decicore-sdk';
 *
 * const session = await DeciCore.login({
 *   user_email:    process.env.DECICORE_EMAIL!,
 *   user_password: process.env.DECICORE_PASSWORD!,
 *   project_id:    process.env.DECICORE_PROJECT_ID!,
 * });
 *
 * const client = new DeciCore({
 *   token:     session.token,
 *   userId:    session.user_id,
 *   tenantId:  session.tenant_id,
 *   projectId: session.project_id,
 * });
 */
export class DeciCore {
  private readonly baseUrl: string;
  private readonly headers: Record<string, string>;

  /** Subscription plan operations. */
  public readonly plans: PlansClient;
  /** User management operations. */
  public readonly users: UsersClient;
  /** Stripe billing operations. */
  public readonly billing: BillingClient;
  /** Form schema lookups. */
  public readonly forms: FormsClient;
  /** Dashboard and widget data. */
  public readonly dashboards: DashboardsClient;

  constructor(options: DeciCoreOptions) {
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, '');
    this.headers = {
      'Content-Type':    'application/json',
      'Authorization':   options.token,
      'Core-User-ID':    options.userId,
      'Core-Project-ID': options.projectId,
      'Core-Tenant-ID':  options.tenantId,
    };

    this.plans      = new PlansClient(this.baseUrl, this.headers);
    this.users      = new UsersClient(this.baseUrl, this.headers);
    this.billing    = new BillingClient(this.baseUrl, this.headers);
    this.forms      = new FormsClient(this.baseUrl, this.headers);
    this.dashboards = new DashboardsClient(this.baseUrl, this.headers);
  }

  /**
   * Authenticate a user and get back the credentials needed to construct a
   * `DeciCore` client. This is the only call that works without already
   * being authenticated — every other method requires a full client built
   * from its result. Rate limited to 5 attempts per minute.
   *
   * Always authenticates in the target project's production context —
   * `project_id` is required, and the tenant-level dev/Studio context
   * (no project selected) is never used.
   *
   * @example
   * const session = await DeciCore.login({
   *   user_email:    'jane@acme.com',
   *   user_password: 'Temp1234!',
   *   project_id:    'PROJ0000001',
   * });
   * const client = new DeciCore({
   *   token:     session.token,
   *   userId:    session.user_id,
   *   tenantId:  session.tenant_id,
   *   projectId: session.project_id,
   * });
   */
  static async login(data: LoginOptions, baseUrl: string = DEFAULT_BASE_URL): Promise<LoginResult> {
    const result = await request<LoginResult>(
      baseUrl.replace(/\/$/, ''),
      { 'Content-Type': 'application/json' },
      'POST',
      '/api/users/login',
      {
        user_email:    data.user_email,
        user_password: data.user_password,
        tenant_id:     data.tenant_id,
        project_id:    data.project_id,
        // The API only checks production-plan access (never blocks login on
        // failure) when this is true — the SDK always claims it since it
        // never operates in the tenant-level dev/Studio context.
        is_production_context: true,
      },
    );
    // The login response doesn't echo project_id back — attach it ourselves
    // so callers don't have to pass it twice.
    return { ...result, project_id: data.project_id };
  }

  // ── CRUD ─────────────────────────────────────────────────────

  /**
   * List records in a collection. Supports filtering, search, sorting,
   * pagination, and field projection.
   *
   * @example
   * const { records, total } = await client.list('Products', {
   *   filters:   { status: 'active' },
   *   sortBy:    'price',
   *   sortOrder: 'asc',
   *   pageSize:  50,
   * });
   */
  async list<T = Record<string, unknown>>(
    collection: string,
    options: ListOptions = {},
  ): Promise<ListResult<T>> {
    const p = new URLSearchParams();

    if (options.search)              p.set('search',     options.search);
    if (options.sortBy)              p.set('sort_by',    options.sortBy);
    if (options.sortOrder)           p.set('sort_order', options.sortOrder);
    if (options.page != null)        p.set('page',       String(options.page));
    if (options.pageSize != null)    p.set('page_size',  String(options.pageSize));
    if (options.fields?.length)      p.set('fields',     options.fields.join(','));

    if (options.filters) {
      for (const [k, v] of Object.entries(options.filters)) {
        p.set(k, Array.isArray(v) ? v.join(',') : String(v));
      }
    }

    const qs   = p.toString();
    const path = `/api/${collection}${qs ? `?${qs}` : ''}`;
    return request<ListResult<T>>(this.baseUrl, this.headers, 'GET', path);
  }

  /**
   * Get a single record by its ID.
   *
   * @example
   * const product = await client.get('Products', 'PROD0000001');
   * console.log(product.name);
   */
  get<T = Record<string, unknown>>(collection: string, id: string): Promise<T> {
    return request<T>(this.baseUrl, this.headers, 'GET', `/api/${collection}/${id}`);
  }

  /**
   * Create a new record. The ID is auto-generated by the server.
   *
   * @example
   * const product = await client.create('Products', {
   *   name:   'Studio Monitor',
   *   price:  299.99,
   *   status: 'active',
   * });
   * console.log(product.ID);
   */
  create<T = Record<string, unknown>>(
    collection: string,
    data: Record<string, unknown>,
  ): Promise<T> {
    return request<T>(this.baseUrl, this.headers, 'POST', `/api/${collection}`, data);
  }

  /**
   * Update an existing record. Only the fields you pass are modified.
   *
   * @example
   * await client.update('Products', 'PROD0000001', { price: 249.99 });
   */
  update<T = Record<string, unknown>>(
    collection: string,
    id: string,
    data: Record<string, unknown>,
  ): Promise<T> {
    return request<T>(this.baseUrl, this.headers, 'PUT', `/api/${collection}/${id}`, data);
  }

  /**
   * Permanently delete a record.
   *
   * @example
   * await client.delete('Products', 'PROD0000001');
   */
  delete(collection: string, id: string): Promise<unknown> {
    return request(this.baseUrl, this.headers, 'DELETE', `/api/${collection}/${id}`);
  }

  // ── AI Inference ──────────────────────────────────────────────

  /**
   * Run a pre-configured AI Action by its ID — one you (or a teammate) built
   * and saved in DECICORE Studio, with its own stored instructions and
   * response schema. Unlike `infer()`, which sends ad-hoc instructions on
   * every call, this runs the action as-is; `prompt` just appends extra
   * runtime input, and `responseFormat` optionally overrides the saved schema.
   *
   * @example
   * const result = await client.runAction('AIA0000123', {
   *   prompt: 'Focus on the last 30 days only.',
   * });
   */
  runAction<T = Record<string, unknown>>(actionId: string, options: RunActionOptions = {}): Promise<T> {
    const { responseFormat, ...rest } = options;
    const body: Record<string, unknown> = { ...rest };
    if (responseFormat) body.response_format = responseFormat;
    return request<T>(this.baseUrl, this.headers, 'POST', `/api/chatgpt/run-ai-action/${actionId}`, body);
  }
}

export default DeciCore;
