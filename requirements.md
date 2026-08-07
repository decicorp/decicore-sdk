# DeciCore Documentation Website Requirements

## Objective

Create a modern API documentation website inspired by Mintlify's design and user experience.

The documentation must be generated as a single HTML application (SPA) that can be hosted on any static hosting provider such as Vercel, Netlify, GitHub Pages, S3, or a simple web server.

The visual style should be heavily inspired by Mintlify:

* Modern SaaS design
* Clean typography
* Responsive layout
* Dark and light mode support
* Left navigation sidebar
* Search functionality
* Code blocks with copy button
* API endpoint examples
* SDK examples
* Interactive API testing section

---

# Technology Requirements

Use:

* HTML
* CSS
* TypeScript
* Vite

Generate a static build that outputs:

```text
dist/
└── index.html
```

The final application should run entirely from static files.

---

# Environment Configuration

The application must support multiple API environments.

Create a `.env` file:

```env
VITE_API_ENV=local

VITE_API_LOCAL=http://localhost:5000
VITE_API_TEST=https://test-api.decicore.com
VITE_API_PROD=https://api.decicore.com
```

Create a configuration layer that automatically selects the correct API URL based on `VITE_API_ENV`.

Example:

```typescript
const API_URLS = {
  local: import.meta.env.VITE_API_LOCAL,
  test: import.meta.env.VITE_API_TEST,
  prod: import.meta.env.VITE_API_PROD,
};

export const API_BASE_URL =
  API_URLS[import.meta.env.VITE_API_ENV];
```

---

# Environment Switcher

Add an environment selector in the top navigation bar.

Example:

```text
Environment

[ Local ▼ ]
[ Test ▼ ]
[ Production ▼ ]
```

When the environment changes:

* All API examples must automatically update.
* All request URLs must update.
* The displayed Base URL must update.

Example:

```text
Base URL:
http://localhost:5000
```

or

```text
Base URL:
https://api.decicore.com
```

---

# Documentation Structure

## Introduction

Explain what DeciCore is.

Describe:

* Multi-tenant architecture
* Dynamic applications
* AI-powered workflows
* API-first platform

---

## Authentication

Explain authentication flow.

Examples:

```http
Authorization: Bearer YOUR_TOKEN
```

Example request:

```bash
curl -X GET \
  "{{BASE_URL}}/api/v1/me" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Quick Start

### TypeScript

Installation:

```bash
npm install @decicore/sdk
```

Initialization:

```typescript
import { DeciCoreClient } from "@decicore/sdk";

const client = new DeciCoreClient({
  apiKey: "YOUR_API_KEY",
  baseUrl: "{{BASE_URL}}"
});
```

---

### Python

Installation:

```bash
pip install decicore-sdk
```

Initialization:

```python
from decicore_sdk import DeciCoreClient

client = DeciCoreClient(
    api_key="YOUR_API_KEY",
    base_url="{{BASE_URL}}"
)
```

---

# API Reference

Each endpoint must contain:

* Description
* Method
* URL
* Headers
* Request Body
* Response Body
* TypeScript Example
* Python Example
* cURL Example

Example:

```http
POST /api/v1/tenants
```

---

# Interactive API Explorer

Create an API Explorer section.

Requirements:

* User can enter a token.
* User can click "Try It".
* Requests are sent to the currently selected environment.
* Response is displayed on screen.
* Request details are displayed.
* Errors are formatted nicely.

---

# Search

Implement client-side search.

Search must find:

* Endpoints
* SDK methods
* Documentation pages
* Examples

Results should update while typing.

---

# SDK Documentation

Create dedicated sections for:

## TypeScript SDK

Examples:

* Create client
* Authenticate
* CRUD operations
* File uploads
* AI operations

---

## Python SDK

Examples:

* Create client
* Authenticate
* CRUD operations
* File uploads
* AI operations

---

# Responsive Design

The documentation must work on:

* Desktop
* Tablet
* Mobile

Sidebar should collapse automatically on smaller screens.

---

# Theme

Create:

* Dark mode
* Light mode

Remember the selected theme in Local Storage.

---

# Performance

Requirements:

* Fast loading
* Static generation
* Lazy-loaded sections when possible
* Optimized assets

---

# Deployment

Provide scripts:

```bash
npm install
npm run dev
npm run build
npm run preview
```

The generated application must be deployable without any backend dependency.

All API URLs must come from environment variables and never be hardcoded.
