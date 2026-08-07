<template>
  <footer class="footer">
    <div class="container footer-inner">

      <!-- 3-column grid -->
      <div class="footer-grid">

        <!-- Brand column -->
        <div class="footer-col brand-col">
          <div class="footer-logo">
            <svg class="footer-logo-mark" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 1L23 12L12 23L1 12L12 1Z" fill="url(#ft-diamond)"/>
              <path d="M12 8.2L16.4 12L12 15.8L7.6 12L12 8.2Z" fill="#07070d"/>
              <defs>
                <linearGradient id="ft-diamond" x1="1" y1="1" x2="23" y2="23">
                  <stop offset="0%" stop-color="#a78bfa"/>
                  <stop offset="100%" stop-color="#7c3aed"/>
                </linearGradient>
              </defs>
            </svg>
            <span class="footer-logo-text">DECICORE</span>
          </div>
          <p class="footer-tagline">One client. Every system.</p>
          <p class="footer-desc">
            DECICORE is a multi-tenant backend platform that wires data, AI inference, user auth, and Stripe billing through a single SDK. Available in JavaScript and Python.
          </p>
        </div>

        <!-- SDK column -->
        <div class="footer-col">
          <p class="footer-col-label">SDK</p>
          <ul class="footer-links">
            <li><a href="https://www.npmjs.com/package/decicore-sdk" target="_blank" rel="noopener" class="footer-link">npm package</a></li>
            <li><a href="https://pypi.org/project/decicore-sdk" target="_blank" rel="noopener" class="footer-link">pip package</a></li>
            <li><a href="https://github.com/deciphai" target="_blank" rel="noopener" class="footer-link">GitHub</a></li>
            <li><router-link to="/changelog" class="footer-link">Changelog</router-link></li>
          </ul>
        </div>

        <!-- Resources column -->
        <div class="footer-col">
          <p class="footer-col-label">Resources</p>
          <ul class="footer-links">
            <li><router-link to="/docs/introduction" class="footer-link">Documentation</router-link></li>
            <li><router-link to="/community" class="footer-link">Community</router-link></li>
            <li><router-link to="/docs/getting-started" class="footer-link">Getting Started</router-link></li>
            <li><router-link to="/docs/ai-inference" class="footer-link">API Reference</router-link></li>
          </ul>
        </div>

      </div>

      <!-- Bottom row -->
      <div class="footer-bottom">
        <span class="footer-copy">© 2025 Deciphai Inc.</span>
        <span class="footer-credit"><span class="led on-good"></span> All systems nominal</span>
      </div>

    </div>
  </footer>
</template>

<script setup lang="ts">
</script>

<style scoped>
.footer {
  background: var(--bg-raised);
  border-top: 1px solid var(--border);
  padding: 4rem 0;
}

.footer-inner {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr;
  gap: 3rem;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  margin-bottom: 0.75rem;
}

.footer-logo-mark {
  flex-shrink: 0;
  filter: drop-shadow(0 0 6px rgba(124,58,237,0.45));
}

.footer-logo-text {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 0.95rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: var(--text);
}

.footer-tagline {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 0.65rem;
}

.footer-desc {
  font-size: 0.83rem;
  color: var(--subtle);
  line-height: 1.65;
  max-width: 320px;
  margin: 0;
}

.footer-col-label {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--subtle);
  margin-bottom: 0.9rem;
}

.footer-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-link {
  font-size: 0.865rem;
  color: var(--muted);
  text-decoration: none;
  transition: color 0.15s;
}

.footer-link:hover {
  color: var(--text);
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
}

.footer-copy {
  font-size: 0.78rem;
  color: var(--subtle);
}

.footer-credit {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.72rem;
  color: var(--subtle);
  font-family: 'IBM Plex Mono', monospace;
}

@media (max-width: 768px) {
  .footer-grid { grid-template-columns: 1fr 1fr; }
  .brand-col   { grid-column: 1 / -1; }
}

@media (max-width: 480px) {
  .footer-grid { grid-template-columns: 1fr; }
}
</style>
