<template>
  <div class="doc-page">
    <div class="doc-body">

      <span class="badge">Plans & Billing</span>
      <h1>Plans & Billing</h1>
      <p class="lead">
        Expose your Stripe plans to users, collect payments, and create subscriptions — all through
        the DECICORE SDK. No direct Stripe API calls needed on your server.
      </p>

      <!-- List plans -->
      <span id="list-plans" class="section-anchor"></span>
      <h2>client.plans.list()</h2>
      <p>Fetch all active subscription plans configured for this tenant's Stripe account. Each plan includes prices with a <code>platform_price_id</code> you'll use at checkout.</p>

      <div class="method-sig">
        <span class="method-badge get">GET</span>
        <span class="method-path">/api/stripe_plans/</span>
      </div>

      <CodeBlock :js="plansJs" :python="plansPy" />

      <div class="response-block">
        <p class="response-label">Response shape</p>
        <CodeBlock :json="plansResponseJson" />
      </div>

      <hr class="divider" />

      <!-- Subscribe -->
      <span id="subscribe" class="section-anchor"></span>
      <h2>client.billing.subscribe()</h2>
      <p>Create a Stripe subscription for a customer. The API handles finding or creating the Stripe Customer by email, attaching the payment method, and creating the Subscription object.</p>

      <div class="method-sig">
        <span class="method-badge post">POST</span>
        <span class="method-path">/api/stripe/create-tenant-subscription</span>
      </div>

      <table class="param-table">
        <thead><tr><th>Parameter</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td class="pn">stripe_account_id</td><td class="pt">string</td><td class="pr">required</td><td>Connected Stripe account ID. Format: <code>acct_...</code></td></tr>
          <tr><td class="pn">customer_email</td><td class="pt">string</td><td class="pr">required</td><td>Customer's email. Reuses existing Stripe Customer if found</td></tr>
          <tr><td class="pn">price_id</td><td class="pt">string</td><td class="pr">required</td><td>Stripe Price ID. Use <code>platform_price_id</code> from <code>plans.list()</code></td></tr>
          <tr><td class="pn">payment_method_id</td><td class="pt">string</td><td class="po">optional</td><td>Stripe Payment Method ID from Stripe Elements. Format: <code>pm_...</code></td></tr>
        </tbody>
      </table>

      <CodeBlock :js="subscribeJs" :python="subscribePy" />

      <hr class="divider" />

      <!-- 3DS -->
      <span id="3ds" class="section-anchor"></span>
      <h2>Handling 3D Secure</h2>
      <p>Some cards require additional authentication (3D Secure). Check the <code>payment_intent.status</code> field in the response and confirm on the client if needed.</p>

      <div class="callout warning">
        <div class="callout-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </div>
        <div>
          <strong>Always handle requires_action</strong>
          If you skip this check, subscriptions for 3DS cards will be created in an incomplete state and the first payment may fail silently.
        </div>
      </div>

      <CodeBlock :js="threeDsJs" :python="threeDsPy" />

      <hr class="divider" />

      <!-- Checkout flow -->
      <span id="checkout-flow" class="section-anchor"></span>
      <h2>Full checkout flow</h2>
      <p>A complete end-to-end checkout: show plans, collect a payment method with Stripe Elements, and create the subscription.</p>

      <CodeBlock :js="checkoutJs" :python="checkoutPy" />

      <div class="callout info">
        <div class="callout-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
        </div>
        <div>
          <strong>Stripe Elements handles card collection</strong>
          Never collect raw card numbers yourself. Use Stripe Elements or Stripe.js on the frontend to tokenize the card into a <code>pm_...</code> Payment Method ID, then pass it to <code>billing.subscribe()</code>.
        </div>
      </div>

      <!-- Doc nav -->
      <div class="doc-nav">
        <router-link to="/docs/users" class="doc-nav-link">
          <span class="doc-nav-label">Previous</span>
          <span class="doc-nav-title">User Management</span>
        </router-link>
        <router-link to="/docs/introduction" class="doc-nav-link next">
          <span class="doc-nav-label">Start over</span>
          <span class="doc-nav-title">Introduction</span>
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
  { id: 'list-plans',    label: 'client.plans.list()' },
  { id: 'subscribe',     label: 'client.billing.subscribe()' },
  { id: '3ds',           label: '3D Secure' },
  { id: 'checkout-flow', label: 'Full checkout flow' },
]

const plansJs = `const plans = await client.plans.list()

plans.forEach(plan => {
  console.log(plan.name, plan.description)
  plan.prices.forEach(price => {
    const amount = (price.unit_amount / 100).toFixed(2)
    console.log(\`  \${price.currency.toUpperCase()} \${amount}/\${price.recurring.interval}\`)
    console.log(\`  Price ID: \${price.platform_price_id}\`)
  })
})`

const plansPy = `plans = client.plans.list()

for plan in plans:
    print(plan["name"], plan["description"])
    for price in plan["prices"]:
        amount = price["unit_amount"] / 100
        currency = price["currency"].upper()
        interval = price["recurring"]["interval"]
        print(f"  {currency} {amount:.2f}/{interval}")
        print(f"  Price ID: {price['platform_price_id']}")`

const plansResponseJson = `[
  {
    "id": "prod_Abc123",
    "name": "Starter",
    "description": "For small teams",
    "prices": [
      {
        "id": "price_Xyz789",
        "platform_price_id": "price_Xyz789",
        "unit_amount": 2900,
        "currency": "usd",
        "recurring": { "interval": "month" }
      }
    ]
  },
  {
    "id": "prod_Def456",
    "name": "Pro",
    "description": "For growing teams",
    "prices": [
      {
        "id": "price_Uvw012",
        "platform_price_id": "price_Uvw012",
        "unit_amount": 9900,
        "currency": "usd",
        "recurring": { "interval": "month" }
      }
    ]
  }
]`

const subscribeJs = `const plans   = await client.plans.list()
const priceId = plans[0].prices[0].platform_price_id

const result = await client.billing.subscribe({
  stripe_account_id: 'acct_1AbCdEfGhIjKl',
  customer_email:    'jane@acme.com',
  price_id:          priceId,
  payment_method_id: 'pm_1PqRsTuVwXyZ',  // from Stripe Elements
})

console.log(result.subscription.id)      // "sub_..."
console.log(result.subscription.status)  // "active" or "incomplete"`

const subscribePy = `plans = client.plans.list()
price_id = plans[0]["prices"][0]["platform_price_id"]

result = client.billing.subscribe(
    stripe_account_id="acct_1AbCdEfGhIjKl",
    customer_email="jane@acme.com",
    price_id=price_id,
    payment_method_id="pm_1PqRsTuVwXyZ",  # from Stripe Elements
)

print(result["subscription"]["id"])      # "sub_..."
print(result["subscription"]["status"])  # "active" or "incomplete"`

const threeDsJs = `import { loadStripe } from '@stripe/stripe-js'

const stripe = await loadStripe(process.env.STRIPE_PUBLIC_KEY!)
const result = await client.billing.subscribe({ /* ... */ })

if (result.payment_intent?.status === 'requires_action') {
  // Prompt the user to authenticate with their bank
  const { error } = await stripe.confirmCardPayment(
    result.payment_intent.client_secret
  )

  if (error) {
    console.error('3DS authentication failed:', error.message)
  } else {
    console.log('Subscription confirmed — 3DS passed!')
  }
} else if (result.subscription.status === 'active') {
  console.log('Subscription active — no extra authentication required')
}`

const threeDsPy = `# Server-side: return client_secret to your frontend if 3DS is required
result = client.billing.subscribe(
    stripe_account_id="acct_...",
    customer_email="jane@acme.com",
    price_id=price_id,
    payment_method_id="pm_...",
)

payment_intent = result.get("payment_intent", {})

if payment_intent.get("status") == "requires_action":
    # Return client_secret to the frontend for Stripe.js to handle 3DS
    client_secret = payment_intent["client_secret"]
    return {"action_required": True, "client_secret": client_secret}

elif result["subscription"]["status"] == "active":
    return {
        "success": True,
        "subscription_id": result["subscription"]["id"],
    }`

const checkoutJs = `import { loadStripe } from '@stripe/stripe-js'
import { DeciCore } from 'decicore-sdk'

async function checkout(customerEmail: string, selectedPriceId: string) {
  const stripe = await loadStripe(process.env.STRIPE_PUBLIC_KEY!)
  const client = new DeciCore({
    token:     userToken,
    projectId: process.env.DECICORE_PROJECT_ID!,
    tenantId:  process.env.DECICORE_TENANT_ID!,
  })

  // 1. Create a payment method from Stripe Elements card element
  const { paymentMethod, error } = await stripe.createPaymentMethod({
    type: 'card',
    card: cardElement,  // your Stripe Elements <CardElement />
    billing_details: { email: customerEmail },
  })

  if (error || !paymentMethod) throw new Error(error?.message)

  // 2. Create the subscription
  const result = await client.billing.subscribe({
    stripe_account_id: process.env.STRIPE_ACCOUNT_ID!,
    customer_email:    customerEmail,
    price_id:          selectedPriceId,
    payment_method_id: paymentMethod.id,
  })

  // 3. Handle 3D Secure if the card requires it
  if (result.payment_intent?.status === 'requires_action') {
    const { error: confirmError } = await stripe.confirmCardPayment(
      result.payment_intent.client_secret
    )
    if (confirmError) throw new Error(confirmError.message)
  }

  return result.subscription
}`

const checkoutPy = `import os
from decicore_sdk import DeciCore

def create_subscription(
    customer_email: str,
    price_id: str,
    payment_method_id: str,
) -> dict:
    client = DeciCore(
        token=os.environ["DECICORE_TOKEN"],
        project_id=os.environ["DECICORE_PROJECT_ID"],
        tenant_id=os.environ["DECICORE_TENANT_ID"],
    )

    result = client.billing.subscribe(
        stripe_account_id=os.environ["STRIPE_ACCOUNT_ID"],
        customer_email=customer_email,
        price_id=price_id,
        payment_method_id=payment_method_id,
    )

    payment_intent = result.get("payment_intent", {})

    if payment_intent.get("status") == "requires_action":
        # Return client_secret to the frontend for Stripe.js 3DS flow
        return {
            "action_required": True,
            "client_secret":   payment_intent["client_secret"],
            "subscription_id": result["subscription"]["id"],
        }

    return {
        "action_required": False,
        "subscription_id": result["subscription"]["id"],
        "status":          result["subscription"]["status"],
    }`
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

.response-block { margin-top: -0.25rem; }

.response-label {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--subtle);
  margin-bottom: 0.25rem;
}
</style>
