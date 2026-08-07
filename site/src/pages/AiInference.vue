<template>
  <div class="doc-page">
    <div class="doc-body">

      <span class="badge">SDK Reference</span>
      <h1>AI Inference</h1>
      <p class="lead">
        Turn any data into structured output. Define the shape of the response — the AI fills it in.
        No prompt engineering, no JSON parsing, no unpredictable output.
      </p>

      <!-- Overview -->
      <span id="overview" class="section-anchor"></span>
      <h2>client.infer()</h2>
      <p>Sends a structured inference request to the DECICORE AI engine. The engine always returns valid JSON matching the schema you define in <code>responseFormat</code>.</p>

      <div class="method-sig">
        <span class="method-badge post">POST</span>
        <span class="method-path">/api/chatgpt/run-ai-action/AIA000042</span>
      </div>

      <table class="param-table">
        <thead><tr><th>Parameter</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td class="pn">instructions</td><td class="pt">string</td><td class="pr">required</td><td>System prompt — describe the task, rules, and output behavior for the AI</td></tr>
          <tr><td class="pn">userContent</td><td class="pt">string | object | array</td><td class="pr">required</td><td>The input data. Can be free text, a record object, or an array of records</td></tr>
          <tr><td class="pn">responseFormat</td><td class="pt">object</td><td class="pr">required</td><td>JSON schema of the expected output. The AI always returns this exact structure</td></tr>
        </tbody>
      </table>

      <div class="callout info">
        <div class="callout-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
        </div>
        <div>
          <strong>Guaranteed JSON output</strong>
          Define your <code>responseFormat</code> schema and the engine will always return parseable JSON — even if the input is ambiguous. No need to catch <code>JSON.parse</code> errors.
        </div>
      </div>

      <hr class="divider" />

      <!-- Classify -->
      <span id="classify" class="section-anchor"></span>
      <h2>Example: Classify records</h2>
      <p>Tag records with categories, sentiment, priority, or any label. Pass an array and get an array back with the same IDs.</p>

      <CodeBlock :js="classifyJs" :python="classifyPy" />

      <hr class="divider" />

      <!-- Extract -->
      <span id="extract" class="section-anchor"></span>
      <h2>Example: Extract structured data</h2>
      <p>Convert unstructured text (emails, notes, messages) into clean fields. The AI infers values even from informal or ambiguous language.</p>

      <CodeBlock :js="extractJs" :python="extractPy" />

      <hr class="divider" />

      <!-- Generate -->
      <span id="generate" class="section-anchor"></span>
      <h2>Example: Generate content fields</h2>
      <p>Enrich records with AI-generated content — descriptions, SEO keywords, translations, summaries — and write them back in one pipeline.</p>

      <CodeBlock :js="generateJs" :python="generatePy" />

      <hr class="divider" />

      <!-- Pipeline -->
      <span id="pipeline" class="section-anchor"></span>
      <h2>Example: Full data pipeline</h2>
      <p>The most powerful pattern: fetch records, run AI inference, then write results back. Enrich entire collections in a single script.</p>

      <CodeBlock :js="pipelineJs" :python="pipelinePy" />

      <div class="callout tip">
        <div class="callout-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div>
          <strong>Batch for efficiency</strong>
          Pass up to 50 records per call for best results. For larger collections, paginate and call <code>infer()</code> per page.
        </div>
      </div>

      <!-- Doc nav -->
      <div class="doc-nav">
        <router-link to="/docs/crud" class="doc-nav-link">
          <span class="doc-nav-label">Previous</span>
          <span class="doc-nav-title">CRUD Operations</span>
        </router-link>
        <router-link to="/docs/users" class="doc-nav-link next">
          <span class="doc-nav-label">Next</span>
          <span class="doc-nav-title">User Management</span>
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
  { id: 'overview',  label: 'client.infer()' },
  { id: 'classify',  label: 'Classify records' },
  { id: 'extract',   label: 'Extract structured data' },
  { id: 'generate',  label: 'Generate content fields' },
  { id: 'pipeline',  label: 'Full data pipeline' },
]

const classifyJs = `const { records } = await client.list('SupportTickets', {
  filters:  { status: 'open' },
  fields:   ['ID', 'subject', 'description'],
  pageSize: 50,
})

const tagged = await client.infer({
  instructions: \`
    You are a support ticket router.
    Classify each ticket into exactly one category:
    - billing   → payment, invoice, subscription issues
    - technical → bugs, errors, integrations
    - shipping  → delivery, tracking, returns
    - other     → anything else
  \`,
  userContent:    { tickets: records },
  responseFormat: {
    tickets: [{ id: 'string', category: 'string', confidence: 'number' }],
  },
})

// Write categories back to the database
await Promise.all(
  tagged.tickets.map(t =>
    client.update('SupportTickets', t.id, {
      category:      t.category,
      ai_confidence: t.confidence,
    })
  )
)`

const classifyPy = `result = client.list(
    "SupportTickets",
    filters={"status": "open"},
    fields=["ID", "subject", "description"],
    page_size=50,
)

tagged = client.infer(
    instructions="""
        You are a support ticket router.
        Classify each ticket into exactly one category:
        - billing   → payment, invoice, subscription issues
        - technical → bugs, errors, integrations
        - shipping  → delivery, tracking, returns
        - other     → anything else
    """,
    user_content={"tickets": result["records"]},
    response_format={
        "tickets": [{"id": "string", "category": "string", "confidence": "number"}]
    },
)

# Write categories back to the database
for t in tagged["tickets"]:
    client.update("SupportTickets", t["id"], {
        "category":      t["category"],
        "ai_confidence": t["confidence"],
    })`

const extractJs = `// Extract order details from a freeform customer email
const email = \`
  Hi, I placed order #4821 on June 3rd.
  It was 2 blue studio chairs at $189 each.
  My shipping address is 123 Main St, Austin TX 78701.
  Can I change the color to black?
\`

const extracted = await client.infer({
  instructions:   'Extract all structured order data. Set missing fields to null.',
  userContent:    email,
  responseFormat: {
    order_number:     'string',
    order_date:       'string',
    quantity:         'number',
    unit_price:       'number',
    product:          'string',
    requested_change: 'string',
    shipping_address: {
      street: 'string',
      city:   'string',
      state:  'string',
      zip:    'string',
    },
  },
})

// extracted.order_number → "4821"
// extracted.quantity     → 2
// extracted.unit_price   → 189`

const extractPy = `email = """
  Hi, I placed order #4821 on June 3rd.
  It was 2 blue studio chairs at $189 each.
  My shipping address is 123 Main St, Austin TX 78701.
  Can I change the color to black?
"""

extracted = client.infer(
    instructions="Extract all structured order data. Set missing fields to null.",
    user_content=email,
    response_format={
        "order_number":     "string",
        "order_date":       "string",
        "quantity":         "number",
        "unit_price":       "number",
        "product":          "string",
        "requested_change": "string",
        "shipping_address": {
            "street": "string",
            "city":   "string",
            "state":  "string",
            "zip":    "string",
        },
    },
)

# extracted["order_number"] → "4821"
# extracted["quantity"]     → 2
# extracted["unit_price"]   → 189`

const generateJs = `const product = await client.get('Products', 'PROD0000001')

const generated = await client.infer({
  instructions: \`
    You are a professional e-commerce copywriter.
    Write a compelling 2-sentence marketing description.
    Generate 5 SEO keywords relevant to the product.
    Write one short meta description (under 160 chars) for Google.
    Tone: professional, benefit-focused, no hype.
  \`,
  userContent:    product,
  responseFormat: {
    description:      'string',
    meta_description: 'string',
    seo_keywords:     ['string'],
  },
})

await client.update('Products', product.ID, {
  description:      generated.description,
  meta_description: generated.meta_description,
  seo_keywords:     generated.seo_keywords,
})`

const generatePy = `product = client.get("Products", "PROD0000001")

generated = client.infer(
    instructions="""
        You are a professional e-commerce copywriter.
        Write a compelling 2-sentence marketing description.
        Generate 5 SEO keywords relevant to the product.
        Write one short meta description (under 160 chars) for Google.
        Tone: professional, benefit-focused, no hype.
    """,
    user_content=product,
    response_format={
        "description":      "string",
        "meta_description": "string",
        "seo_keywords":     ["string"],
    },
)

client.update("Products", product["ID"], {
    "description":      generated["description"],
    "meta_description": generated["meta_description"],
    "seo_keywords":     generated["seo_keywords"],
})`

const pipelineJs = `async function enrichProducts() {
  let page = 1

  while (true) {
    const { records } = await client.list('Products', {
      filters:  { description: '' },  // only products missing descriptions
      fields:   ['ID', 'name', 'price', 'category', 'sku'],
      pageSize: 30,
      page,
    })

    if (!records.length) break

    const generated = await client.infer({
      instructions:   'Write a 2-sentence description and 3 SEO keywords for each product.',
      userContent:    { products: records },
      responseFormat: {
        products: [{ id: 'string', description: 'string', seo_keywords: ['string'] }],
      },
    })

    await Promise.all(
      generated.products.map(p =>
        client.update('Products', p.id, {
          description:  p.description,
          seo_keywords: p.seo_keywords,
        })
      )
    )

    console.log(\`Enriched page \${page} (\${records.length} products)\`)
    page++
  }

  console.log('Done.')
}

await enrichProducts()`

const pipelinePy = `def enrich_products():
    page = 1

    while True:
        result = client.list(
            "Products",
            filters={"description": ""},  # only products missing descriptions
            fields=["ID", "name", "price", "category", "sku"],
            page_size=30,
            page=page,
        )
        if not result["records"]:
            break

        generated = client.infer(
            instructions="Write a 2-sentence description and 3 SEO keywords for each product.",
            user_content={"products": result["records"]},
            response_format={
                "products": [
                    {"id": "string", "description": "string", "seo_keywords": ["string"]}
                ]
            },
        )

        for p in generated["products"]:
            client.update("Products", p["id"], {
                "description":  p["description"],
                "seo_keywords": p["seo_keywords"],
            })

        print(f"Enriched page {page} ({len(result['records'])} products)")
        page += 1

    print("Done.")

enrich_products()`
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
