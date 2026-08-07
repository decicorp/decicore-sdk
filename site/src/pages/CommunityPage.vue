<template>
  <div class="community-page">
    <div class="container">

      <!-- Hero -->
      <div class="comm-hero">
        <span class="badge">Community</span>
        <h1>Join the DECICORE<br /><span class="accent-text">community</span></h1>
        <p class="comm-sub">
          Ask questions, share what you're building, and connect with developers using DECICORE.
          We're here to help you ship faster.
        </p>
      </div>

      <!-- 3 channel cards -->
      <div class="channel-grid">

        <div class="module channel-card">
          <div class="channel-icon channel-icon-discord">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.055a19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </div>
          <h3>Discord Server</h3>
          <p>Chat with other developers, ask questions, share your builds. Real-time help from the community and the DECICORE team.</p>
          <a href="https://discord.gg/deciphai" target="_blank" rel="noopener" class="btn btn-primary btn-sm channel-btn">
            Join Discord
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M7 17L17 7M17 7H7M17 7v10"/>
            </svg>
          </a>
        </div>

        <div class="module channel-card">
          <div class="channel-icon channel-icon-github">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
          </div>
          <h3>GitHub</h3>
          <p>Browse the source, open issues, and submit pull requests. The SDK is open source and welcomes contributions of any size.</p>
          <a href="https://github.com/deciphai" target="_blank" rel="noopener" class="btn btn-ghost btn-sm channel-btn">
            View on GitHub
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M7 17L17 7M17 7H7M17 7v10"/>
            </svg>
          </a>
        </div>

        <div class="module channel-card">
          <div class="channel-icon channel-icon-discuss">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
          </div>
          <h3>Discussions</h3>
          <p>Longer-form questions, proposals, and community announcements. Find archived answers and deep-dive threads.</p>
          <a href="https://github.com/deciphai/discussions" target="_blank" rel="noopener" class="btn btn-ghost btn-sm channel-btn">
            Open Discussions
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M7 17L17 7M17 7H7M17 7v10"/>
            </svg>
          </a>
        </div>

      </div>

      <!-- Stay updated -->
      <div class="module updates-card">
        <div class="updates-inner">
          <div class="updates-text">
            <h3>Stay updated</h3>
            <p>
              Subscribe to release notes, examples, and community highlights.
              Follow us on GitHub to get notified of new SDK releases, changelogs, and example projects.
            </p>
            <div class="updates-links">
              <a href="https://github.com/deciphai" target="_blank" rel="noopener" class="updates-link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                Star on GitHub
              </a>
            </div>
          </div>
          <div class="updates-subscribe">
            <p class="subscribe-label">Get release notifications</p>
            <div class="subscribe-input-row">
              <input type="email" placeholder="you@example.com" class="subscribe-input" />
              <button class="btn btn-primary btn-sm">Subscribe</button>
            </div>
            <p class="subscribe-fine">Release notes only. No spam, ever.</p>
          </div>
        </div>
      </div>

      <!-- Community Guidelines -->
      <div class="guidelines">
        <h2>Community Guidelines</h2>
        <p class="guidelines-sub">We keep things simple. Three rules, that's it.</p>
        <div class="guidelines-grid">
          <div class="card guideline-card">
            <div class="guideline-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
              </svg>
            </div>
            <h3>Be Helpful</h3>
            <p>Share knowledge freely. If you know the answer, take a moment to explain it. Everyone started somewhere.</p>
          </div>
          <div class="card guideline-card">
            <div class="guideline-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
            </div>
            <h3>Be Respectful</h3>
            <p>Treat everyone with kindness. Disagreement is fine; disrespect is not. Inclusive and welcoming is the goal.</p>
          </div>
          <div class="card guideline-card">
            <div class="guideline-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h3>Stay On Topic</h3>
            <p>Keep discussions relevant to DECICORE, SDKs, and the developer ecosystem. Off-topic content may be removed.</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.community-page {
  padding-top: calc(var(--nav-h) + 4rem);
  padding-bottom: 6rem;
}

/* Hero */
.comm-hero {
  max-width: 640px;
  margin-bottom: 4rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.comm-hero h1 {
  font-size: clamp(2.4rem, 5vw, 3.5rem);
}

.accent-text { color: var(--primary-bright); }

.comm-sub {
  font-size: 1.05rem;
  color: var(--muted);
  line-height: 1.7;
  max-width: 520px;
  margin: 0;
}

/* Channels */
.channel-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.channel-card {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.channel-card h3 {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text);
}

.channel-card p {
  font-size: 0.875rem;
  color: var(--muted);
  line-height: 1.65;
  flex: 1;
  margin: 0;
}

.channel-btn {
  align-self: flex-start;
  margin-top: 0.5rem;
}

.channel-icon {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-recessed);
  border: 1px solid var(--border);
  color: var(--muted);
}

.channel-card:hover .channel-icon { color: var(--primary-bright); border-color: rgba(124,58,237,0.4); }

/* Updates card */
.updates-card {
  padding: 2.5rem;
  margin-bottom: 4rem;
}

.updates-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
}

.updates-text h3 {
  font-size: 1.2rem;
  margin-bottom: 0.6rem;
}

.updates-text p {
  font-size: 0.875rem;
  color: var(--muted);
  line-height: 1.7;
  margin: 0 0 1rem;
}

.updates-links {
  display: flex;
  gap: 1rem;
}

.updates-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.82rem;
  color: var(--muted);
  text-decoration: none;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 0.4rem 0.85rem;
  transition: color 0.15s, border-color 0.15s;
}

.updates-link:hover {
  color: var(--text);
  border-color: var(--border-hi);
}

.subscribe-label {
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--subtle);
  margin-bottom: 0.65rem;
}

.subscribe-input-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.subscribe-input {
  flex: 1;
  background: var(--bg-recessed);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 0.45rem 0.85rem;
  font-size: 0.85rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: var(--text);
  outline: none;
  transition: border-color 0.15s;
}

.subscribe-input::placeholder { color: var(--subtle); }
.subscribe-input:focus { border-color: var(--primary); }

.subscribe-fine {
  font-size: 0.72rem;
  color: var(--subtle);
  margin: 0;
}

/* Guidelines */
.guidelines h2 {
  margin-bottom: 0.5rem;
}

.guidelines-sub {
  color: var(--muted);
  margin-bottom: 2rem;
  font-size: 0.95rem;
}

.guidelines-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

.guideline-card {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.guideline-icon {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: var(--bg-recessed);
  border: 1px solid var(--border);
  color: var(--primary-bright);
}

.guideline-card h3 {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text);
}

.guideline-card p {
  font-size: 0.855rem;
  color: var(--muted);
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 900px) {
  .channel-grid   { grid-template-columns: 1fr; }
  .guidelines-grid { grid-template-columns: 1fr; }
  .updates-inner  { grid-template-columns: 1fr; }
}
</style>
