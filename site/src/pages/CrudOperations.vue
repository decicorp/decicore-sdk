<template>
  <div class="doc-page">
    <div class="doc-body">

      <span class="badge">SDK Reference</span>
      <h1>CRUD Operations</h1>
      <p class="lead">
        A single unified endpoint for every collection in your project. Five methods cover
        everything — list, get, create, update, and delete.
      </p>

      <!-- list -->
      <span id="list" class="section-anchor"></span>
      <h2>client.list()</h2>
      <p>Fetch records from any collection. Supports filtering, full-text search, sorting, pagination, and field projection.</p>

      <div class="method-sig">
        <span class="method-badge get">GET</span>
        <span class="method-path">/api/{collection}?page=1&amp;page_size=25</span>
      </div>

      <table class="param-table">
        <thead><tr><th>Parameter</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td class="pn">collection</td><td class="pt">string</td><td class="pr">required</td><td>Collection name, e.g. <code>"Products"</code></td></tr>
          <tr><td class="pn">filters</td><td class="pt">object</td><td class="po">optional</td><td>Exact-match filters. <code>{ status: 'active' }</code></td></tr>
          <tr><td class="pn">fields</td><td class="pt">string[]</td><td class="po">optional</td><td>Return only specified fields (projection)</td></tr>
          <tr><td class="pn">pageSize</td><td class="pt">number</td><td class="po">optional</td><td>Records per page. Default <code>25</code>. Max <code>200</code></td></tr>
          <tr><td class="pn">page</td><td class="pt">number</td><td class="po">optional</td><td>1-based page number. Default <code>1</code></td></tr>
          <tr><td class="pn">sortBy</td><td class="pt">string</td><td class="po">optional</td><td>Field name to sort by</td></tr>
          <tr><td class="pn">sortOrder</td><td class="pt">"asc" | "desc"</td><td class="po">optional</td><td>Sort direction. Default <code>"desc"</code></td></tr>
        </tbody>
      </table>

      <CodeBlock :js="listJs" :python="listPy" />

      <hr class="divider" />

      <!-- get -->
      <span id="get" class="section-anchor"></span>
      <h2>client.get()</h2>
      <p>Fetch a single record by its system-generated ID.</p>

      <div class="method-sig">
        <span class="method-badge get">GET</span>
        <span class="method-path">/api/{collection}/{id}</span>
      </div>

      <CodeBlock :js="getJs" :python="getPy" />

      <hr class="divider" />

      <!-- create -->
      <span id="create" class="section-anchor"></span>
      <h2>client.create()</h2>
      <p>Create a new record. The server auto-generates the <code>ID</code> field. Provide only the fields your collection schema requires.</p>

      <div class="method-sig">
        <span class="method-badge post">POST</span>
        <span class="method-path">/api/{collection}</span>
      </div>

      <CodeBlock :js="createJs" :python="createPy" />

      <hr class="divider" />

      <!-- update -->
      <span id="update" class="section-anchor"></span>
      <h2>client.update()</h2>
      <p>Partially update a record. Only the fields you pass are modified — existing fields not included are preserved.</p>

      <div class="method-sig">
        <span class="method-badge put">PUT</span>
        <span class="method-path">/api/{collection}/{id}</span>
      </div>

      <CodeBlock :js="updateJs" :python="updatePy" />

      <hr class="divider" />

      <!-- delete -->
      <span id="delete" class="section-anchor"></span>
      <h2>client.delete()</h2>
      <p>Permanently delete a record. This action cannot be undone. Returns a confirmation message.</p>

      <div class="method-sig">
        <span class="method-badge del">DELETE</span>
        <span class="method-path">/api/{collection}/{id}</span>
      </div>

      <CodeBlock :js="deleteJs" :python="deletePy" />

      <hr class="divider" />

      <!-- Pagination -->
      <span id="pagination" class="section-anchor"></span>
      <h2>Pagination pattern</h2>
      <p>Iterate through all records in a collection by incrementing the <code>page</code> parameter until <code>records.length === 0</code>.</p>

      <CodeBlock :js="paginateJs" :python="paginatePy" />

      <!-- Doc nav -->
      <div class="doc-nav">
        <router-link to="/docs/getting-started" class="doc-nav-link">
          <span class="doc-nav-label">Previous</span>
          <span class="doc-nav-title">Getting Started</span>
        </router-link>
        <router-link to="/docs/ai-inference" class="doc-nav-link next">
          <span class="doc-nav-label">Next</span>
          <span class="doc-nav-title">AI Inference</span>
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
  { id: 'list',       label: 'client.list()' },
  { id: 'get',        label: 'client.get()' },
  { id: 'create',     label: 'client.create()' },
  { id: 'update',     label: 'client.update()' },
  { id: 'delete',     label: 'client.delete()' },
  { id: 'pagination', label: 'Pagination pattern' },
]

const listJs = `// Basic — list all active products
const { records, total } = await client.list('Products', {
  filters: { status: 'active' },
})

// Advanced — paginated, sorted, projected
const page1 = await client.list('Orders', {
  filters:   { status: 'pending', region: 'US' },
  sortBy:    'created_at',
  sortOrder: 'desc',
  page:      1,
  pageSize:  50,
  fields:    ['ID', 'customer_name', 'total', 'status'],
})

console.log(\`Page 1 of \${Math.ceil(page1.total / 50)}\`)`

const listPy = `# Basic — list all active products
result = client.list("Products", filters={"status": "active"})
records, total = result["records"], result["total"]

# Advanced — paginated, sorted, projected
page1 = client.list(
    "Orders",
    filters={"status": "pending", "region": "US"},
    sort_by="created_at",
    sort_order="desc",
    page=1,
    page_size=50,
    fields=["ID", "customer_name", "total", "status"],
)

import math
print(f"Page 1 of {math.ceil(page1['total'] / 50)}")`

const getJs = `const product = await client.get('Products', 'PROD0000001')

console.log(product.name)   // "Studio Monitor"
console.log(product.price)  // 299.99
console.log(product.status) // "active"`

const getPy = `product = client.get("Products", "PROD0000001")

print(product["name"])   # "Studio Monitor"
print(product["price"])  # 299.99
print(product["status"]) # "active"`

const createJs = `const product = await client.create('Products', {
  name:     'Studio Monitor XL',
  price:    499.99,
  status:   'active',
  category: 'audio',
  sku:      'SM-XL-001',
  stock:    50,
})

console.log(product.ID)  // "PROD0000123"  — auto-generated`

const createPy = `product = client.create("Products", {
    "name":     "Studio Monitor XL",
    "price":    499.99,
    "status":   "active",
    "category": "audio",
    "sku":      "SM-XL-001",
    "stock":    50,
})

print(product["ID"])  # "PROD0000123"  — auto-generated`

const updateJs = `// Update only price and status — all other fields unchanged
await client.update('Products', 'PROD0000001', {
  price:  249.99,
  status: 'sale',
})

// Append to an array field
await client.update('Products', 'PROD0000001', {
  tags: ['featured', 'clearance'],
})`

const updatePy = `# Update only price and status — all other fields unchanged
client.update("Products", "PROD0000001", {
    "price":  249.99,
    "status": "sale",
})

# Append to an array field
client.update("Products", "PROD0000001", {
    "tags": ["featured", "clearance"],
})`

const deleteJs = `const result = await client.delete('Products', 'PROD0000001')
// result.message → "Record deleted successfully"`

const deletePy = `result = client.delete("Products", "PROD0000001")
# result["message"] → "Record deleted successfully"`

const paginateJs = `async function fetchAll(collection: string) {
  const all: any[] = []
  let page = 1

  while (true) {
    const { records } = await client.list(collection, {
      page,
      pageSize: 200,
    })
    if (!records.length) break
    all.push(...records)
    page++
  }

  return all
}

const allProducts = await fetchAll('Products')
console.log(\`Fetched \${allProducts.length} total records\`)`

const paginatePy = `def fetch_all(collection: str) -> list:
    all_records = []
    page = 1

    while True:
        result = client.list(collection, page=page, page_size=200)
        if not result["records"]:
            break
        all_records.extend(result["records"])
        page += 1

    return all_records

all_products = fetch_all("Products")
print(f"Fetched {len(all_products)} total records")`
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
