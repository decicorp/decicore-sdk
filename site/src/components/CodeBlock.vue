<template>
  <div class="code-block">
    <!-- Tab bar -->
    <div class="code-tabs">
      <div class="tabs-left">
        <button
          v-if="js"
          :class="['tab', { active: activeLang === 'js' }]"
          @click="activeLang = 'js'"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <rect x="2" y="2" width="20" height="20" rx="3"/>
            <path d="M14.5 16.5c.5.8 1.2 1.5 2.5 1.5s2-.7 2-1.7c0-2.5-4.5-1.5-4.5-4.8 0-1.5 1-2.5 2.7-2.5 1.2 0 2 .5 2.5 1.5l-1 .8c-.3-.7-.8-1.2-1.5-1.2s-1.2.5-1.2 1.2c0 2 4.5 1.2 4.5 4.8 0 1.8-1.2 3-3.2 3-1.7 0-2.8-.8-3.5-2l1-.8zm-6.5 3c.8.7 1.7 1 2.7 1 2.5 0 3.5-1.5 3.5-3.5V9h-1.5v8c0 1.2-.5 2-2 2-.8 0-1.5-.3-2-.8l-.7 1.3z" fill="white"/>
          </svg>
          JavaScript
        </button>
        <button
          v-if="python"
          :class="['tab', { active: activeLang === 'python' }]"
          @click="activeLang = 'python'"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.9 2C6.9 2 7.2 4.2 7.2 4.2l.01 2.1h4.8v.6H5.5S2 6.6 2 11.6s3.1 4.8 3.1 4.8h1.8v-2.3s-.1-3.1 3-3.1h5.3s2.9.05 2.9-2.8V4.5S18.6 2 11.9 2zm-3 1.7c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9z" fill="#3776AB"/>
            <path d="M12.1 22c5 0 4.7-2.2 4.7-2.2l-.01-2.1h-4.8v-.6h6.51s3.5.3 3.5-4.7-3.1-4.8-3.1-4.8h-1.8v2.3s.1 3.1-3 3.1H8.8S5.9 12.95 5.9 15.8v4.5S5.4 22 12.1 22zm3-1.7c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9z" fill="#FFD43B"/>
          </svg>
          Python
        </button>
        <button
          v-if="terminal"
          :class="['tab', { active: activeLang === 'terminal' }]"
          @click="activeLang = 'terminal'"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <polyline points="4 17 10 11 4 5"/>
            <line x1="12" y1="19" x2="20" y2="19"/>
          </svg>
          Terminal
        </button>
        <button
          v-if="json"
          :class="['tab', { active: activeLang === 'json' }]"
          @click="activeLang = 'json'"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
          </svg>
          JSON
        </button>
      </div>
      <div class="tabs-right">
        <span class="lang-label">{{ langLabel }}</span>
        <button class="copy-btn" :class="{ copied }" @click="doCopy">
          <svg v-if="!copied" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2"/>
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
          </svg>
          <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          {{ copied ? 'Copied!' : 'Copy' }}
        </button>
      </div>
    </div>

    <!-- Code body -->
    <div class="code-body">
      <pre><code v-html="highlighted"></code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps({
  js:       { type: String, default: '' },
  python:   { type: String, default: '' },
  terminal: { type: String, default: '' },
  json:     { type: String, default: '' },
})

type Lang = 'js' | 'python' | 'terminal' | 'json'

const activeLang = ref<Lang>(
  props.js       ? 'js'
  : props.python   ? 'python'
  : props.terminal ? 'terminal'
  : 'json'
)

const copied = ref(false)

const activeCode = computed(() => {
  if (activeLang.value === 'js')       return props.js
  if (activeLang.value === 'python')   return props.python
  if (activeLang.value === 'terminal') return props.terminal
  return props.json
})

const langLabel = computed(() => {
  const map: Record<Lang, string> = {
    js:       'JavaScript',
    python:   'Python',
    terminal: 'Shell',
    json:     'JSON',
  }
  return map[activeLang.value]
})

// ── Simple regex syntax highlighter ──────────────────────────────────────
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function highlight(code: string, lang: Lang): string {
  let s = escapeHtml(code)

  if (lang === 'terminal') {
    // Comments out to a placeholder first — otherwise the string regex below
    // would re-match the quoted "tok-comment" inside the span it just inserted.
    const comments: string[] = []
    s = s.replace(/(#.*$)/gm, (m) => {
      comments.push(m)
      return `\x00CMT${comments.length - 1}\x00`
    })
    s = s.replace(/((?:`[^`]*`)|(?:"[^"]*")|(?:'[^']*'))/g, '<span class="tok-string">$1</span>')
    s = s.replace(/\b(npm|pip|pip3|node|python|python3|export|source|echo|cd|ls|cat)\b/g, '<span class="tok-fn">$1</span>')
    comments.forEach((str, i) => {
      s = s.replace(`\x00CMT${i}\x00`, `<span class="tok-comment">${str}</span>`)
    })
    return s
  }

  if (lang === 'json') {
    // JSON: keys, strings, numbers, booleans, null
    s = s.replace(/("(?:[^"\\]|\\.)*")\s*:/g, '<span class="tok-attr">$1</span>:')
    s = s.replace(/:\s*("(?:[^"\\]|\\.)*")/g, ': <span class="tok-string">$1</span>')
    s = s.replace(/\b(true|false|null)\b/g, '<span class="tok-kw">$1</span>')
    s = s.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="tok-num">$1</span>')
    return s
  }

  if (lang === 'python') {
    // Pull strings AND comments out to placeholders before keyword matching —
    // otherwise a keyword like "class" appearing inside an already-inserted
    // <span class="tok-comment"> tag gets re-matched and corrupts the markup.
    const strings: string[] = []
    s = s.replace(/("""[\s\S]*?"""|'''[\s\S]*?'''|"[^"]*"|'[^']*')/g, (m) => {
      strings.push(m)
      return `\x00STR${strings.length - 1}\x00`
    })
    const comments: string[] = []
    s = s.replace(/(#.*$)/gm, (m) => {
      comments.push(m)
      return `\x00CMT${comments.length - 1}\x00`
    })
    s = s.replace(/\b(def|class|import|from|return|if|elif|else|for|while|in|not|and|or|is|True|False|None|async|await|with|as|try|except|raise|pass|print|break|continue|lambda|global|nonlocal)\b/g, '<span class="tok-kw">$1</span>')
    s = s.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="tok-num">$1</span>')
    s = s.replace(/\b([a-zA-Z_]\w*)\s*(?=\()/g, '<span class="tok-fn">$1</span>')
    comments.forEach((str, i) => {
      s = s.replace(`\x00CMT${i}\x00`, `<span class="tok-comment">${str}</span>`)
    })
    strings.forEach((str, i) => {
      s = s.replace(`\x00STR${i}\x00`, `<span class="tok-string">${str}</span>`)
    })
    return s
  }

  // JS / default — same placeholder approach as Python, same reason.
  const strings: string[] = []
  s = s.replace(/((?:`[^`]*`)|(?:"[^"]*")|(?:'[^']*'))/g, (m) => {
    strings.push(m)
    return `\x00STR${strings.length - 1}\x00`
  })
  const comments: string[] = []
  s = s.replace(/(\/\/.*$)/gm, (m) => {
    comments.push(m)
    return `\x00CMT${comments.length - 1}\x00`
  })
  s = s.replace(/\b(const|let|var|function|async|await|return|if|else|for|while|new|import|export|from|default|class|extends|of|in|typeof|true|false|null|undefined|try|catch|throw|break|continue)\b/g, '<span class="tok-kw">$1</span>')
  s = s.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="tok-num">$1</span>')
  s = s.replace(/\b([a-zA-Z_]\w*)\s*(?=\()/g, '<span class="tok-fn">$1</span>')
  comments.forEach((str, i) => {
    s = s.replace(`\x00CMT${i}\x00`, `<span class="tok-comment">${str}</span>`)
  })
  strings.forEach((str, i) => {
    s = s.replace(`\x00STR${i}\x00`, `<span class="tok-string">${str}</span>`)
  })
  return s
}

const highlighted = computed(() =>
  highlight(activeCode.value.trim(), activeLang.value)
)

async function doCopy() {
  try {
    await navigator.clipboard.writeText(activeCode.value.trim())
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // clipboard not available
  }
}
</script>

<style scoped>
.code-block {
  background: var(--bg-recessed);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  margin: 1.25rem 0;
  box-shadow: 0 1px 0 rgba(0,0,0,0.4) inset;
}

.code-tabs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.75rem;
  border-bottom: 1px solid var(--border);
  background: var(--bg-raised);
  gap: 0.5rem;
}

.tabs-left {
  display: flex;
  gap: 0;
}

.tabs-right {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.tab {
  display: inline-flex;
  align-items: center;
  gap: 0.38rem;
  padding: 0.55rem 0.7rem;
  font-size: 0.72rem;
  font-weight: 600;
  font-family: 'IBM Plex Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--subtle);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  margin-bottom: -1px;
  white-space: nowrap;
}

.tab:hover { color: var(--muted); }

.tab.active {
  color: var(--primary-bright);
  border-bottom-color: var(--primary-bright);
}

.lang-label {
  font-size: 0.68rem;
  font-family: 'IBM Plex Mono', monospace;
  color: var(--subtle);
  text-transform: uppercase;
  letter-spacing: 0.07em;
}

.copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.32rem;
  padding: 0.25rem 0.6rem;
  font-size: 0.68rem;
  font-weight: 500;
  font-family: 'IBM Plex Mono', monospace;
  color: var(--subtle);
  background: none;
  border: 1px solid var(--border);
  border-radius: 4px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s, background 0.15s;
  white-space: nowrap;
}

.copy-btn:hover {
  color: var(--muted);
  border-color: var(--border-hi);
  background: var(--bg-card);
}

.copy-btn.copied {
  color: var(--good);
  border-color: rgba(111, 220, 140, 0.3);
}

.code-body {
  overflow-x: auto;
  position: relative;
}

.code-body::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 1px, transparent 1px, transparent 3px);
  opacity: 0.35;
}

pre {
  margin: 0;
  padding: 1.2rem 1.4rem;
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-size: 0.82rem;
  line-height: 1.65;
  color: #d8cbb0;
}

pre code {
  font-family: inherit;
  font-size: inherit;
  padding: 0;
  background: none;
  border: none;
  color: inherit;
}
</style>

<style>
/* Token colors — not scoped so they apply inside v-html */
.tok-string  { color: var(--good, #34d399); }
.tok-comment { color: #55507a; font-style: italic; }
.tok-kw      { color: var(--primary-bright, #a78bfa); font-weight: 700; }
.tok-num     { color: var(--warn, #fbbf24); }
.tok-fn      { color: #60a5fa; }
.tok-attr    { color: #8fd6e8; }
</style>
