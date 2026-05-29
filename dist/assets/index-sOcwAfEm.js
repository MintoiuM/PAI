(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=document.querySelector(`#app`);if(!e)throw Error(`Missing #app root`);var t=window.location.pathname;t===`/admin`?s(e):t===`/signin`?o(e):i(e);async function n(e,t){let n=await fetch(e,{method:`POST`,headers:{"Content-Type":`application/json`},credentials:`include`,body:JSON.stringify(t)}),r=await n.text(),i;try{i=r?JSON.parse(r):{}}catch{throw Error(r.trim()||`Server error (${n.status}).`)}if(!n.ok||i.ok===!1)throw Error(i.message||`Request failed.`);return i}async function r(){return(await(await fetch(`/api/auth/me`,{credentials:`include`})).json()).user??null}function i(e){e.innerHTML=`
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
`;let t=document.querySelector(`#systemPrompt`),n=document.querySelector(`#userPrompt`),r=document.querySelector(`#exportPreview`),i=document.querySelector(`#copyStatus`),o=document.querySelector(`#btnCopyAll`),s=document.querySelector(`#btnCopyUser`),c=document.querySelector(`#btnClear`),l=document.querySelector(`#geminiOutput`),u=document.querySelector(`#geminiStatus`),d=document.querySelector(`#btnRunGemini`);if(!t||!n||!r||!i||!o||!s||!c||!l||!u||!d)throw Error(`Playground elements are missing from the page`);let f=t,p=n,m=r,h=i,g=l,_=u,v=`prompt-playground-v1`,y=null;function b(e,t){_.textContent=e,y!==null&&window.clearTimeout(y),y=null,t!==void 0&&(y=window.setTimeout(()=>{_.textContent=``,y=null},t))}let x=null;function S(e){h.textContent=e,x!==null&&window.clearTimeout(x),x=window.setTimeout(()=>{h.textContent=``},2400)}function C(e,t){let n=e.trim(),r=t.trim();return!n&&!r?`Start writing in the fields above to see a preview.`:`System / developer instructions:
${n||`[none]`}

User prompt:
${r||`[none]`}`}function w(){m.textContent=C(f.value,p.value);let e={system:f.value,user:p.value};localStorage.setItem(v,JSON.stringify(e))}async function T(e,t){let n=await fetch(e,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(t)}),r=await n.json();if(!n.ok||r.ok===!1)throw Error(r.message||`Backend request failed.`);return r}async function E(e){return(await T(`/api/gemini`,e)).text}function D(){let e=localStorage.getItem(v);if(!e){w();return}try{let t=JSON.parse(e);f.value=t.system??``,p.value=t.user??``}catch{localStorage.removeItem(v)}w()}async function O(e,t){try{await navigator.clipboard.writeText(e),S(t)}catch{S(`Clipboard failed. You can copy manually from the preview.`)}}o.addEventListener(`click`,async()=>{await O(C(f.value,p.value),`Copied full prompt package.`)}),s.addEventListener(`click`,async()=>{await O(p.value.trim()||`[empty user prompt]`,`Copied user prompt.`)}),c.addEventListener(`click`,()=>{f.value=``,p.value=``,w(),S(`Cleared prompt fields.`)}),f.addEventListener(`input`,w),p.addEventListener(`input`,w),d.addEventListener(`click`,async()=>{g.value=``,_.textContent=`Sending…`,d.disabled=!0;try{g.value=await E({systemPrompt:f.value,userPrompt:p.value}),b(`Done.`,3200)}catch(e){_.textContent=e instanceof Error?e.message:`Request failed.`}finally{d.disabled=!1}}),D(),a()}async function a(){let e=document.querySelector(`#navSignIn`),t=document.querySelector(`#navUser`),i=document.querySelector(`#btnSignOut`);if(!(!e||!t||!i))try{let a=await r();if(!a)return;e.hidden=!0,t.hidden=!1,t.textContent=`Hi, ${a.username}`,i.hidden=!1,i.addEventListener(`click`,async()=>{await n(`/api/auth/logout`,{}),window.location.href=`/signin`})}catch{}}function o(e){e.innerHTML=`
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
  `;let t=document.querySelector(`#tabSignIn`),i=document.querySelector(`#tabRegister`),a=document.querySelector(`#signInForm`),o=document.querySelector(`#registerForm`),s=document.querySelector(`#signInStatus`),c=document.querySelector(`#registerStatus`);if(!t||!i||!a||!o||!s||!c)throw Error(`Sign-in elements missing.`);t.addEventListener(`click`,()=>{t.classList.add(`active`),i.classList.remove(`active`),t.setAttribute(`aria-selected`,`true`),i.setAttribute(`aria-selected`,`false`),a.hidden=!1,o.hidden=!0}),i.addEventListener(`click`,()=>{i.classList.add(`active`),t.classList.remove(`active`),i.setAttribute(`aria-selected`,`true`),t.setAttribute(`aria-selected`,`false`),o.hidden=!1,a.hidden=!0}),a.addEventListener(`submit`,async e=>{e.preventDefault(),s.textContent=`Signing in…`;try{await n(`/api/auth/login`,{username:(document.querySelector(`#loginUsername`)?.value??``).trim(),password:document.querySelector(`#loginPassword`)?.value??``}),s.textContent=`Success. Redirecting…`,window.location.href=`/`}catch(e){s.textContent=e instanceof Error?e.message:`Sign in failed.`}}),o.addEventListener(`submit`,async e=>{e.preventDefault(),c.textContent=`Creating account…`;try{await n(`/api/auth/register`,{username:(document.querySelector(`#regUsername`)?.value??``).trim(),email:(document.querySelector(`#regEmail`)?.value??``).trim(),password:document.querySelector(`#regPassword`)?.value??``}),c.textContent=`Account created. Redirecting…`,window.location.href=`/`}catch(e){c.textContent=e instanceof Error?e.message:`Registration failed.`}}),r().then(e=>{e&&(window.location.href=`/`)})}function s(e){e.innerHTML=`
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
  `;let t=document.querySelector(`#adminToken`),n=document.querySelector(`#sqlCommand`),r=document.querySelector(`#btnRunSql`),i=document.querySelector(`#sqlStatus`),a=document.querySelector(`#sqlResult`);if(!t||!n||!r||!i||!a)throw Error(`Admin elements missing.`);t.value=sessionStorage.getItem(`admin-token`)??``,t.addEventListener(`input`,()=>sessionStorage.setItem(`admin-token`,t.value)),r.addEventListener(`click`,async()=>{let e=t.value.trim(),o=n.value.trim();if(!e||!o){i.textContent=`Token and SQL are required.`;return}i.textContent=`Running...`,r.disabled=!0;try{let t=await fetch(`/api/admin/sql`,{method:`POST`,headers:{"Content-Type":`application/json`,"X-Admin-Token":e},body:JSON.stringify({sql:o})}),n=await t.text(),r;try{r=n?JSON.parse(n):{}}catch{throw Error(n.trim()||`Server error (${t.status}). Expected JSON from /api/admin/sql.`)}if(!t.ok||r.ok===!1)throw Error(r.message||`Query failed.`);if(i.textContent=`Success.`,r.type===`mutation`){a.innerHTML=`<p>Affected rows: <strong>${r.affectedRows??0}</strong></p>`;return}let s=r.columns??[],l=r.rows??[];if(s.length===0){a.textContent=`Query returned no columns.`;return}let u=s.map(e=>`<th>${c(e)}</th>`).join(``),d=l.map(e=>`<tr>${s.map(t=>`<td>${c(String(e[t]??``))}</td>`).join(``)}</tr>`).join(``);a.innerHTML=`
        <p class="muted">Rows: ${r.rowCount??l.length}</p>
        <div class="tableWrap">
          <table class="sqlTable">
            <thead><tr>${u}</tr></thead>
            <tbody>${d||`<tr><td colspan="`+s.length+`">No rows.</td></tr>`}</tbody>
          </table>
        </div>
      `}catch(e){i.textContent=e instanceof Error?e.message:`Query failed.`}finally{r.disabled=!1}})}function c(e){return e.replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#039;`)}