import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('Missing #app root')

const pagePath = window.location.pathname

if (pagePath === '/admin') {
  renderAdminPage(app)
} else if (pagePath === '/signin') {
  renderSignInPage(app)
} else {
  renderMainPage(app)
}

type AuthUser = { id: number; username: string; email: string }

async function postJsonAuth<T>(url: string, payload: Record<string, unknown>): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })
  const raw = await response.text()
  let json: { ok?: boolean; message?: string } & T
  try {
    json = raw ? (JSON.parse(raw) as typeof json) : ({} as typeof json)
  } catch {
    throw new Error(raw.trim() || `Server error (${response.status}).`)
  }
  if (!response.ok || json.ok === false) throw new Error(json.message || 'Request failed.')
  return json
}

async function fetchCurrentUser(): Promise<AuthUser | null> {
  const response = await fetch('/api/auth/me', { credentials: 'include' })
  const json = (await response.json()) as { ok?: boolean; user?: AuthUser | null }
  return json.user ?? null
}

function renderMainPage(root: HTMLDivElement): void {
  root.innerHTML = `
  <a class="skipLink" href="#main">Skip to content</a>

  <header class="siteHeader" id="top">
    <div class="container headerInner">
      <div class="brand" aria-label="Site name">
        <span class="brandMark" aria-hidden="true">▦</span>
        <span class="brandText">Prompting for AI Agents</span>
      </div>
      <nav class="topNav" aria-label="Primary">
        <a href="#how">How to prompt</a>
        <a href="#avoid">What to avoid</a>
        <a href="#checklist">Checklist</a>
        <a class="navCta" href="#playground">Playground</a>
        <a href="/signin" id="navSignIn">Sign in</a>
        <span class="navUser muted" id="navUser" hidden></span>
        <button class="navLinkButton" id="btnSignOut" type="button" hidden>Sign out</button>
        <a href="/admin">Admin</a>
      </nav>
    </div>
  </header>

  <main id="main">
    <section class="heroSection">
      <div class="container heroGrid">
        <div class="heroCopy">
          <p class="eyebrow">Simple, practical guidance</p>
          <h1>Write prompts that make agents reliable.</h1>
          <p class="lead">
            Agents do best when your prompt defines the goal, constraints, and what “done” looks like.
            This page gives you patterns that work, anti-patterns to avoid, and a playground to draft prompts.
          </p>
          <div class="heroActions">
            <a class="button primary" href="#playground">Open playground</a>
            <a class="button" href="#how">Learn the structure</a>
          </div>
          <p class="finePrint">
            The playground composes prompts, sends them through the backend, and exports text for other tools.
          </p>
        </div>

        <div class="heroCard" role="region" aria-label="Prompt structure summary">
          <h2 class="cardTitle">A strong agent prompt usually includes</h2>
          <ol class="summaryList">
            <li><strong>Goal</strong>: what success is</li>
            <li><strong>Context</strong>: what the agent should know</li>
            <li><strong>Constraints</strong>: boundaries, rules, tone</li>
            <li><strong>Process</strong>: steps or strategy (only if needed)</li>
            <li><strong>Output format</strong>: exact shape to return</li>
            <li><strong>Definition of done</strong>: checks to pass</li>
          </ol>
        </div>
      </div>
    </section>

    <section id="how" class="section">
      <div class="container">
        <div class="sectionHeader">
          <h2>How to write a good prompt for an agent</h2>
          <p class="muted">
            Think of your prompt as a small spec. You’re not just asking a question—you’re setting up a workflow.
          </p>
        </div>

        <div class="grid2">
          <article class="card">
            <h3>Use a consistent structure</h3>
            <p>
              When prompts are repeatable, agents become predictable. Start with the goal, then provide only the context
              needed to act, then constraints and output format.
            </p>
            <div class="callout">
              <p class="calloutTitle">Template</p>
              <pre class="code"><code>Goal:
Context:
Constraints:
Tools/Assumptions:
Output format:
Definition of done:</code></pre>
            </div>
          </article>

          <article class="card">
            <h3>Make “done” testable</h3>
            <p>
              “Make it good” is hard to satisfy. “Return 5 options with pros/cons and a final recommendation” is easy.
              Add checks like length limits, required fields, or acceptance criteria.
            </p>
            <ul class="bullets">
              <li><strong>Good</strong>: “Return JSON with keys: summary, risks, next_steps.”</li>
              <li><strong>Good</strong>: “If any required info is missing, list questions first.”</li>
              <li><strong>Good</strong>: “Cite sources or clearly label assumptions.”</li>
            </ul>
          </article>
        </div>

        <div class="grid2">
          <article class="card">
            <h3>Use examples when behavior must be stable</h3>
            <p>
              If you need a particular tone/format, include one short example of the desired output.
              Keep it small so it doesn’t drown the actual task.
            </p>
          </article>

          <article class="card">
            <h3>Constrain tools and authority</h3>
            <p>
              Agents will try to help. Tell them what they may and may not do (e.g., “do not invent citations”, “don’t delete files”,
              “ask before making irreversible changes”).
            </p>
          </article>
        </div>
      </div>
    </section>

    <section id="avoid" class="section alt">
      <div class="container">
        <div class="sectionHeader">
          <h2>What not to do</h2>
          <p class="muted">Common prompt mistakes that make agents unreliable or unsafe.</p>
        </div>

        <div class="badBetter">
          <div class="pair">
            <div class="card bad">
              <h3>Too vague</h3>
              <pre class="code"><code>Make my app better.</code></pre>
            </div>
            <div class="card better">
              <h3>Specific + testable</h3>
              <pre class="code"><code>Goal: Improve performance on the dashboard page.
Context: React app; slow list render.
Constraints: No design changes; keep behavior identical.
Output format: 1) suspected causes, 2) prioritized fixes, 3) code snippets.</code></pre>
            </div>
          </div>

          <div class="pair">
            <div class="card bad">
              <h3>Conflicting instructions</h3>
              <pre class="code"><code>Be extremely detailed but keep it very short.</code></pre>
            </div>
            <div class="card better">
              <h3>Clarify priority</h3>
              <pre class="code"><code>Keep it short by default (≤200 words).
If you need more space, ask 1 clarifying question first.</code></pre>
            </div>
          </div>

          <div class="pair">
            <div class="card bad">
              <h3>Unbounded authority</h3>
              <pre class="code"><code>Do whatever you think is best.</code></pre>
            </div>
            <div class="card better">
              <h3>Guardrails</h3>
              <pre class="code"><code>Do not make irreversible changes.
If a decision affects architecture or security, propose options with trade-offs first.</code></pre>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="checklist" class="section">
      <div class="container">
        <div class="sectionHeader">
          <h2>Quick checklist before you hit “send”</h2>
          <p class="muted">A fast scan to prevent the most common failures.</p>
        </div>

        <div class="checklist">
          <label class="check"><input type="checkbox" /> <span><strong>Goal</strong> is one sentence and measurable.</span></label>
          <label class="check"><input type="checkbox" /> <span><strong>Context</strong> includes only what matters to the task.</span></label>
          <label class="check"><input type="checkbox" /> <span><strong>Constraints</strong> specify boundaries (time, scope, safety, style).</span></label>
          <label class="check"><input type="checkbox" /> <span><strong>Output format</strong> is explicit (bullets, JSON, table, files).</span></label>
          <label class="check"><input type="checkbox" /> <span><strong>Definition of done</strong> lists acceptance criteria.</span></label>
          <label class="check"><input type="checkbox" /> <span><strong>Missing info behavior</strong>: ask questions before guessing.</span></label>
        </div>
      </div>
    </section>

    <section id="playground" class="section alt">
      <div class="container">
        <div class="sectionHeader">
          <h2>Prompt playground</h2>
          <p class="muted">
            Draft prompts, send them to Gemini 2.5 Flash (<code class="inlineCode">VITE_GEMINI_API_KEY</code> in <code class="inlineCode">.env</code>),
            then copy the reply or export the full package.
          </p>
        </div>

        <div class="playground">
          <div class="field">
            <label for="systemPrompt">System / developer instructions (optional)</label>
            <textarea id="systemPrompt" rows="6" placeholder="Example: You are a careful coding agent. Ask clarifying questions when requirements are ambiguous. Do not make irreversible changes without confirmation."></textarea>
            <p class="hint">Tip: keep this stable across tasks; change the user prompt per task.</p>
          </div>

          <div class="field">
            <label for="userPrompt">User prompt</label>
            <textarea id="userPrompt" rows="10" placeholder="Write your task prompt here..."></textarea>
            <p class="hint">Add goal, constraints, output format, and definition of done.</p>
          </div>

          <div class="toolbar playgroundToolbar" role="group" aria-label="Playground actions">
            <button class="button primary" id="btnRunGemini" type="button">Send to Gemini</button>
            <button class="button" id="btnCopyAll" type="button">Copy all</button>
            <button class="button" id="btnCopyUser" type="button">Copy user prompt</button>
            <button class="button danger" id="btnClear" type="button">Clear</button>
            <div class="toolbarEnd" aria-live="polite">
              <span class="status" id="geminiStatus" role="status"></span>
              <span class="status" id="copyStatus" role="status"></span>
            </div>
          </div>

          <p class="hint playgroundGeminiHint">
            Gemini 2.5 Flash runs through the backend service.
          </p>

          <div class="field">
            <label for="geminiOutput">Model reply</label>
            <textarea id="geminiOutput" rows="12" readonly placeholder="Response appears here after you send."></textarea>
          </div>

          <div class="export">
            <div class="exportHeader">
              <h3>Export preview</h3>
              <p class="muted">This is what “Copy all” will copy.</p>
            </div>
            <pre class="code"><code id="exportPreview"></code></pre>
            <div class="links">
              <span class="muted">Test it in:</span>
              <a href="https://chat.openai.com/" target="_blank" rel="noreferrer">ChatGPT</a>
              <a href="https://claude.ai/" target="_blank" rel="noreferrer">Claude</a>
              <a href="https://gemini.google.com/" target="_blank" rel="noreferrer">Gemini</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="siteFooter">
    <div class="container footerInner">
      <p class="muted">Production-ready prompt playground with backend proxy.</p>
      <a href="#top" class="toTop" aria-label="Back to top">Back to top</a>
    </div>
  </footer>
`

  const systemPromptEl = document.querySelector<HTMLTextAreaElement>('#systemPrompt')
  const userPromptEl = document.querySelector<HTMLTextAreaElement>('#userPrompt')
  const exportPreviewEl = document.querySelector<HTMLElement>('#exportPreview')
  const copyStatusEl = document.querySelector<HTMLElement>('#copyStatus')
  const btnCopyAll = document.querySelector<HTMLButtonElement>('#btnCopyAll')
  const btnCopyUser = document.querySelector<HTMLButtonElement>('#btnCopyUser')
  const btnClear = document.querySelector<HTMLButtonElement>('#btnClear')
  const geminiOutputEl = document.querySelector<HTMLTextAreaElement>('#geminiOutput')
  const geminiStatusEl = document.querySelector<HTMLElement>('#geminiStatus')
  const btnRunGemini = document.querySelector<HTMLButtonElement>('#btnRunGemini')

  if (
    !systemPromptEl ||
    !userPromptEl ||
    !exportPreviewEl ||
    !copyStatusEl ||
    !btnCopyAll ||
    !btnCopyUser ||
    !btnClear ||
    !geminiOutputEl ||
    !geminiStatusEl ||
    !btnRunGemini
  ) {
    throw new Error('Playground elements are missing from the page')
  }

  const systemPrompt = systemPromptEl
  const userPrompt = userPromptEl
  const exportPreview = exportPreviewEl
  const copyStatus = copyStatusEl
  const geminiOutput = geminiOutputEl
  const geminiStatus = geminiStatusEl

  const STORAGE_KEY = 'prompt-playground-v1'

  let geminiStatusTimeout: number | null = null

  function setGeminiStatus(message: string, clearAfterMs?: number): void {
    geminiStatus.textContent = message
    if (geminiStatusTimeout !== null) window.clearTimeout(geminiStatusTimeout)
    geminiStatusTimeout = null
    if (clearAfterMs === undefined) return
    geminiStatusTimeout = window.setTimeout(() => {
      geminiStatus.textContent = ''
      geminiStatusTimeout = null
    }, clearAfterMs)
  }

  let statusTimeout: number | null = null

  function setStatus(message: string): void {
    copyStatus.textContent = message
    if (statusTimeout !== null) window.clearTimeout(statusTimeout)
    statusTimeout = window.setTimeout(() => {
      copyStatus.textContent = ''
    }, 2400)
  }

  function buildExportText(systemText: string, userText: string): string {
    const cleanSystem = systemText.trim()
    const cleanUser = userText.trim()

    if (!cleanSystem && !cleanUser) return 'Start writing in the fields above to see a preview.'

    return `System / developer instructions:
${cleanSystem || '[none]'}

User prompt:
${cleanUser || '[none]'}`
  }

  function updatePreviewAndSave(): void {
    const exportText = buildExportText(systemPrompt.value, userPrompt.value)
    exportPreview.textContent = exportText

    const payload = {
      system: systemPrompt.value,
      user: userPrompt.value,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  }

  async function postJson<T>(url: string, payload: Record<string, unknown>): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json = (await response.json()) as { ok?: boolean; message?: string } & T
    if (!response.ok || json.ok === false) throw new Error(json.message || 'Backend request failed.')
    return json
  }

  async function runGeminiPrompt(options: { systemPrompt: string; userPrompt: string }): Promise<string> {
    const json = await postJson<{ text: string }>('/api/gemini', options)
    return json.text
  }

  function loadSavedDraft(): void {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      updatePreviewAndSave()
      return
    }

    try {
      const parsed = JSON.parse(raw) as { system?: string; user?: string }
      systemPrompt.value = parsed.system ?? ''
      userPrompt.value = parsed.user ?? ''
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }

    updatePreviewAndSave()
  }

  async function copyText(value: string, successMessage: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(value)
      setStatus(successMessage)
    } catch {
      setStatus('Clipboard failed. You can copy manually from the preview.')
    }
  }

  btnCopyAll.addEventListener('click', async () => {
    const text = buildExportText(systemPrompt.value, userPrompt.value)
    await copyText(text, 'Copied full prompt package.')
  })

  btnCopyUser.addEventListener('click', async () => {
    const userOnly = userPrompt.value.trim()
    await copyText(userOnly || '[empty user prompt]', 'Copied user prompt.')
  })

  btnClear.addEventListener('click', () => {
    systemPrompt.value = ''
    userPrompt.value = ''
    updatePreviewAndSave()
    setStatus('Cleared prompt fields.')
  })

  systemPrompt.addEventListener('input', updatePreviewAndSave)
  userPrompt.addEventListener('input', updatePreviewAndSave)

  btnRunGemini.addEventListener('click', async () => {
    geminiOutput.value = ''
    geminiStatus.textContent = 'Sending…'
    btnRunGemini.disabled = true

    try {
      const reply = await runGeminiPrompt({
        systemPrompt: systemPrompt.value,
        userPrompt: userPrompt.value,
      })
      geminiOutput.value = reply
      setGeminiStatus('Done.', 3200)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Request failed.'
      geminiStatus.textContent = message
    } finally {
      btnRunGemini.disabled = false
    }
  })

  loadSavedDraft()
  void initNavAuth()
}

async function initNavAuth(): Promise<void> {
  const signInLink = document.querySelector<HTMLAnchorElement>('#navSignIn')
  const navUser = document.querySelector<HTMLElement>('#navUser')
  const signOutBtn = document.querySelector<HTMLButtonElement>('#btnSignOut')
  if (!signInLink || !navUser || !signOutBtn) return

  try {
    const user = await fetchCurrentUser()
    if (!user) return

    signInLink.hidden = true
    navUser.hidden = false
    navUser.textContent = `Hi, ${user.username}`
    signOutBtn.hidden = false

    signOutBtn.addEventListener('click', async () => {
      await postJsonAuth('/api/auth/logout', {})
      window.location.href = '/signin'
    })
  } catch {
    // Not signed in.
  }
}

function renderSignInPage(root: HTMLDivElement): void {
  root.innerHTML = `
  <header class="siteHeader">
    <div class="container headerInner">
      <div class="brand"><span class="brandMark" aria-hidden="true">▦</span><span class="brandText">Sign in</span></div>
      <nav class="topNav"><a href="/">Main site</a></nav>
    </div>
  </header>
  <main class="section" id="main">
    <div class="container authWrap">
      <div class="sectionHeader">
        <h2>Account</h2>
        <p class="muted">Passwords are stored with simple letter-to-number encoding in MySQL (demo only, not secure).</p>
      </div>
      <div class="card authCard">
        <div class="authTabs" role="tablist">
          <button class="authTab active" id="tabSignIn" type="button" role="tab" aria-selected="true">Sign in</button>
          <button class="authTab" id="tabRegister" type="button" role="tab" aria-selected="false">Register</button>
        </div>
        <form class="authForm" id="signInForm">
          <div class="field">
            <label for="loginUsername">Username</label>
            <input class="adminInput" id="loginUsername" name="username" autocomplete="username" required />
          </div>
          <div class="field">
            <label for="loginPassword">Password</label>
            <input class="adminInput" id="loginPassword" name="password" type="password" autocomplete="current-password" required />
          </div>
          <div class="toolbar">
            <button class="button primary" type="submit">Sign in</button>
            <span class="status" id="signInStatus"></span>
          </div>
        </form>
        <form class="authForm" id="registerForm" hidden>
          <div class="field">
            <label for="regUsername">Username</label>
            <input class="adminInput" id="regUsername" name="username" autocomplete="username" required />
          </div>
          <div class="field">
            <label for="regEmail">Email</label>
            <input class="adminInput" id="regEmail" name="email" type="email" autocomplete="email" required />
          </div>
          <div class="field">
            <label for="regPassword">Password</label>
            <input class="adminInput" id="regPassword" name="password" type="password" autocomplete="new-password" required />
          </div>
          <div class="toolbar">
            <button class="button primary" type="submit">Create account</button>
            <span class="status" id="registerStatus"></span>
          </div>
        </form>
      </div>
    </div>
  </main>
  `

  const tabSignIn = document.querySelector<HTMLButtonElement>('#tabSignIn')
  const tabRegister = document.querySelector<HTMLButtonElement>('#tabRegister')
  const signInForm = document.querySelector<HTMLFormElement>('#signInForm')
  const registerForm = document.querySelector<HTMLFormElement>('#registerForm')
  const signInStatus = document.querySelector<HTMLElement>('#signInStatus')
  const registerStatus = document.querySelector<HTMLElement>('#registerStatus')

  if (!tabSignIn || !tabRegister || !signInForm || !registerForm || !signInStatus || !registerStatus) {
    throw new Error('Sign-in elements missing.')
  }

  const showSignIn = (): void => {
    tabSignIn.classList.add('active')
    tabRegister.classList.remove('active')
    tabSignIn.setAttribute('aria-selected', 'true')
    tabRegister.setAttribute('aria-selected', 'false')
    signInForm.hidden = false
    registerForm.hidden = true
  }

  const showRegister = (): void => {
    tabRegister.classList.add('active')
    tabSignIn.classList.remove('active')
    tabRegister.setAttribute('aria-selected', 'true')
    tabSignIn.setAttribute('aria-selected', 'false')
    registerForm.hidden = false
    signInForm.hidden = true
  }

  tabSignIn.addEventListener('click', showSignIn)
  tabRegister.addEventListener('click', showRegister)

  signInForm.addEventListener('submit', async (event) => {
    event.preventDefault()
    signInStatus.textContent = 'Signing in…'
    try {
      await postJsonAuth('/api/auth/login', {
        username: (document.querySelector<HTMLInputElement>('#loginUsername')?.value ?? '').trim(),
        password: document.querySelector<HTMLInputElement>('#loginPassword')?.value ?? '',
      })
      signInStatus.textContent = 'Success. Redirecting…'
      window.location.href = '/'
    } catch (err) {
      signInStatus.textContent = err instanceof Error ? err.message : 'Sign in failed.'
    }
  })

  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault()
    registerStatus.textContent = 'Creating account…'
    try {
      await postJsonAuth('/api/auth/register', {
        username: (document.querySelector<HTMLInputElement>('#regUsername')?.value ?? '').trim(),
        email: (document.querySelector<HTMLInputElement>('#regEmail')?.value ?? '').trim(),
        password: document.querySelector<HTMLInputElement>('#regPassword')?.value ?? '',
      })
      registerStatus.textContent = 'Account created. Redirecting…'
      window.location.href = '/'
    } catch (err) {
      registerStatus.textContent = err instanceof Error ? err.message : 'Registration failed.'
    }
  })

  void fetchCurrentUser().then((user) => {
    if (user) window.location.href = '/'
  })
}

function renderAdminPage(root: HTMLDivElement): void {
  root.innerHTML = `
  <header class="siteHeader" id="top">
    <div class="container headerInner">
      <div class="brand"><span class="brandMark" aria-hidden="true">▦</span><span class="brandText">SQL Admin Dashboard</span></div>
      <nav class="topNav"><a href="/">Main site</a></nav>
    </div>
  </header>
  <main class="section" id="main">
    <div class="container">
      <div class="sectionHeader">
        <h2>Database console</h2>
        <p class="muted">Run one SQL statement at a time against the configured database (<code class="inlineCode">pai_prompt_agents</code>).</p>
      </div>
      <div class="playground">
        <div class="field">
          <label for="adminToken">Admin token</label>
          <input id="adminToken" class="adminInput" type="password" placeholder="ADMIN_DASHBOARD_TOKEN" />
        </div>
        <div class="field">
          <label for="sqlCommand">SQL command</label>
          <textarea id="sqlCommand" rows="10" placeholder="SELECT * FROM PromptHistory LIMIT 20;"></textarea>
          <p class="hint">Run a single query per click (do not paste multiple statements like SHOW TABLES; and SELECT … together).</p>
        </div>
        <div class="toolbar">
          <button class="button primary" id="btnRunSql" type="button">Run SQL</button>
          <span class="status" id="sqlStatus"></span>
        </div>
        <div id="sqlResult" class="card sqlResult muted">No query executed yet.</div>
      </div>
    </div>
  </main>
  `

  const tokenEl = document.querySelector<HTMLInputElement>('#adminToken')
  const sqlEl = document.querySelector<HTMLTextAreaElement>('#sqlCommand')
  const runBtn = document.querySelector<HTMLButtonElement>('#btnRunSql')
  const statusEl = document.querySelector<HTMLElement>('#sqlStatus')
  const resultEl = document.querySelector<HTMLElement>('#sqlResult')

  if (!tokenEl || !sqlEl || !runBtn || !statusEl || !resultEl) {
    throw new Error('Admin elements missing.')
  }

  tokenEl.value = sessionStorage.getItem('admin-token') ?? ''
  tokenEl.addEventListener('input', () => sessionStorage.setItem('admin-token', tokenEl.value))

  runBtn.addEventListener('click', async () => {
    const token = tokenEl.value.trim()
    const sql = sqlEl.value.trim()
    if (!token || !sql) {
      statusEl.textContent = 'Token and SQL are required.'
      return
    }

    statusEl.textContent = 'Running...'
    runBtn.disabled = true

    try {
      const response = await fetch('/api/admin/sql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': token,
        },
        body: JSON.stringify({ sql }),
      })

      const raw = await response.text()
      let json: {
        ok?: boolean
        message?: string
        type?: 'select' | 'mutation'
        columns?: string[]
        rows?: Record<string, unknown>[]
        rowCount?: number
        affectedRows?: number
      }

      try {
        json = raw ? (JSON.parse(raw) as typeof json) : {}
      } catch {
        throw new Error(
          raw.trim() || `Server error (${response.status}). Expected JSON from /api/admin/sql.`,
        )
      }

      if (!response.ok || json.ok === false) throw new Error(json.message || 'Query failed.')

      statusEl.textContent = 'Success.'

      if (json.type === 'mutation') {
        resultEl.innerHTML = `<p>Affected rows: <strong>${json.affectedRows ?? 0}</strong></p>`
        return
      }

      const columns = json.columns ?? []
      const rows = json.rows ?? []
      if (columns.length === 0) {
        resultEl.textContent = 'Query returned no columns.'
        return
      }

      const head = columns.map((column) => `<th>${escapeHtml(column)}</th>`).join('')
      const body = rows
        .map((row) => {
          const cells = columns.map((column) => `<td>${escapeHtml(String(row[column] ?? ''))}</td>`).join('')
          return `<tr>${cells}</tr>`
        })
        .join('')

      resultEl.innerHTML = `
        <p class="muted">Rows: ${json.rowCount ?? rows.length}</p>
        <div class="tableWrap">
          <table class="sqlTable">
            <thead><tr>${head}</tr></thead>
            <tbody>${body || '<tr><td colspan="' + columns.length + '">No rows.</td></tr>'}</tbody>
          </table>
        </div>
      `
    } catch (err) {
      statusEl.textContent = err instanceof Error ? err.message : 'Query failed.'
    } finally {
      runBtn.disabled = false
    }
  })
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}
