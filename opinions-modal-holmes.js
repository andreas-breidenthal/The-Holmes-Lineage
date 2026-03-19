/**
 * opinions-modal-holmes.js
 * ─────────────────────────────────────────────────────────────────────────────
 * BRIEFING — read this before modifying or deploying to a new page
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * WHAT IT IS:
 *   The Opinions? modal for The Holmes Chronicle repo. A lightly customised
 *   version of the canonical opinions-modal.js, with colour fallbacks matched
 *   to The Holmes Chronicle palette.
 *
 *   The Holmes Chronicle uses different CSS variable names from the main site,
 *   so this file hardcodes the correct fallback values rather than relying on
 *   the host page's :root variables matching the expected names.
 *
 * WHERE IT LIVES:
 *   Hosted at: https://andreas-breidenthal.github.io/The-Holmes-Lineage/opinions-modal-holmes.js
 *   Repo:      github.com/andreas-breidenthal/The-Holmes-Lineage
 *
 * PALETTE MAPPING (Holmes Chronicle → canonical modal variable):
 *   --parchment  (#f7f3ec)  → --paper   (modal background)
 *   --cream      (#ede8df)  → --aged    (input background / handle bar)
 *   --ink        (#1a1612)  → --ink     (main text)
 *   --ink-faint  (#7a6f68)  → --faded   (secondary text)
 *   --red        (#7a1f1f)  → --rust    (accent / buttons / hover)
 *   --gold       (#8b6914)  → --gold    (labels)
 *   --rule       (#c4b28a)  → --rule    (borders / dividers)
 *
 * FONTS:
 *   Always uses the main site fonts:
 *     - Libre Baskerville (body text)
 *     - Inconsolata (labels / links)
 *     - Cormorant Garamond (thank-you message)
 *   Loaded from Google Fonts if not already present.
 *
 * HOW IT IS LOADED:
 *   This file is loaded automatically by universal-nav.js when
 *   window.OPINIONS_MODAL_SRC is set to point to this file.
 *   Do not load it directly with a <script> tag — let universal-nav.js
 *   handle it.
 *
 * BEHAVIOUR:
 *   Identical to the canonical opinions-modal.js — see that file's briefing
 *   for full behaviour documentation.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ── CONFIG ── */
  const ENDPOINT = window.OPINIONS_ENDPOINT || 'https://formspree.io/f/xkoqyzdr';

  /* ── HOLMES PALETTE ── */
  const P = {
    ink:   '#1a1612',
    paper: '#f7f3ec',
    aged:  '#ede8df',
    rust:  '#7a1f1f',
    gold:  '#8b6914',
    faded: '#7a6f68',
    rule:  '#c4b28a',
  };

  /* ── FONTS — load if not already present ── */
  function ensureFonts() {
    const id = 'opinions-modal-fonts';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id   = id;
    link.rel  = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inconsolata:wght@300;400;500&display=swap';
    document.head.appendChild(link);
  }

  /* ── INJECT CSS ── */
  function injectStyles() {
    if (document.getElementById('opinions-modal-styles')) return;
    const style = document.createElement('style');
    style.id = 'opinions-modal-styles';
    style.textContent = `
      .opinions-modal {
        position: fixed;
        z-index: 9999;
        background-color: ${P.paper};
        border: 1px solid ${P.rule};
        box-shadow: 4px 8px 32px rgba(26,22,18,0.25);
        border-radius: 4px;
        width: 360px;
        min-width: 260px;
        max-width: 90vw;
        display: none;
        flex-direction: column;
        overflow: hidden;
        font-family: 'Libre Baskerville', Georgia, serif;
      }
      .opinions-modal.open { display: flex; }

      @media (max-width: 640px) {
        .opinions-modal { width: 92vw !important; }
      }

      .modal-handle {
        background-color: ${P.aged};
        border-bottom: 1px solid ${P.rule};
        padding: 0.55rem 0.9rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: grab;
        user-select: none;
        gap: 0.75rem;
      }
      .modal-handle:active { cursor: grabbing; }

      .modal-grip {
        display: flex;
        gap: 3px;
        align-items: center;
        flex-shrink: 0;
      }
      .modal-grip span {
        display: block;
        width: 16px;
        height: 2px;
        background: ${P.rule};
        border-radius: 2px;
        position: relative;
      }
      .modal-grip span::before,
      .modal-grip span::after {
        content: '';
        position: absolute;
        left: 0; right: 0;
        height: 2px;
        background: ${P.rule};
        border-radius: 2px;
      }
      .modal-grip span::before { top: -4px; }
      .modal-grip span::after  { top:  4px; }

      .modal-close {
        background: none;
        border: none;
        font-size: 1rem;
        color: ${P.faded};
        cursor: pointer;
        padding: 0 0.2rem;
        line-height: 1;
        transition: color 0.2s;
        flex-shrink: 0;
      }
      .modal-close:hover { color: ${P.rust}; }

      .modal-body {
        padding: 1.4rem 1.6rem 1.6rem;
        overflow-y: auto;
        flex: 1;
      }

      .modal-intro {
        font-size: 0.82rem;
        color: ${P.faded};
        line-height: 1.7;
        margin-bottom: 1.4rem;
      }
      @media (max-width: 640px) {
        .modal-intro { font-size: 0.75rem; }
      }

      .modal-form label {
        display: block;
        font-family: 'Inconsolata', monospace;
        font-size: 0.66rem;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: ${P.gold};
        margin-bottom: 0.3rem;
        margin-top: 0.9rem;
      }
      .modal-form label:first-child { margin-top: 0; }

      .modal-form input,
      .modal-form textarea {
        width: 100%;
        background: ${P.aged};
        border: 1px solid ${P.rule};
        border-radius: 3px;
        padding: 0.5rem 0.7rem;
        font-family: 'Libre Baskerville', Georgia, serif;
        font-size: 0.84rem;
        color: ${P.ink};
        outline: none;
        transition: border-color 0.2s;
        box-sizing: border-box;
      }
      .modal-form input:focus,
      .modal-form textarea:focus {
        border-color: ${P.gold};
      }
      .modal-form textarea {
        resize: vertical;
        min-height: 90px;
        line-height: 1.6;
      }
      @media (max-width: 640px) {
        .modal-form input,
        .modal-form textarea { font-size: 0.78rem; padding: 0.4rem 0.6rem; }
        .modal-form textarea  { min-height: 80px; }
      }

      .message-label-row {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        margin-bottom: 0.3rem;
      }
      .message-label-row label:first-child {
        margin-top: 0;
        margin-bottom: 0;
      }

      .reply-check-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-family: 'Inconsolata', monospace;
        font-size: 0.62rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: ${P.faded};
        cursor: pointer;
        margin-top: 0;
      }
      .reply-check-label input[type="checkbox"] {
        width: auto;
        margin: 0;
        accent-color: ${P.rust};
        cursor: pointer;
      }

      .modal-form .field-secondary {
        margin-top: 1rem;
        padding-top: 0.8rem;
        border-top: 1px solid ${P.aged};
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .modal-form .field-secondary input {
        font-size: 0.8rem;
        padding: 0.4rem 0.6rem;
        background: ${P.paper};
      }

      .modal-submit {
        margin-top: 1.2rem;
        width: 100%;
        background: none;
        border: 1px solid ${P.rust};
        color: ${P.rust};
        font-family: 'Inconsolata', monospace;
        font-size: 0.72rem;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        padding: 0.65rem 1rem;
        cursor: pointer;
        border-radius: 3px;
        transition: background 0.2s, color 0.2s;
      }
      .modal-submit:hover {
        background: ${P.rust};
        color: ${P.paper};
      }
      @media (max-width: 640px) {
        .modal-submit { font-size: 0.66rem; padding: 0.55rem; }
      }

      .modal-thankyou {
        display: none;
        text-align: center;
        padding: 2rem 0 1rem;
      }
      .modal-thankyou p {
        font-family: 'Cormorant Garamond', serif;
        font-size: 1.3rem;
        font-weight: 300;
        color: ${P.ink};
        margin-bottom: 0.6rem;
      }
      .modal-thankyou small {
        font-family: 'Inconsolata', monospace;
        font-size: 0.68rem;
        letter-spacing: 0.12em;
        color: ${P.faded};
        text-transform: uppercase;
      }
    `;
    document.head.appendChild(style);
  }

  /* ── INJECT HTML ── */
  function injectHTML() {
    if (document.getElementById('opinions-modal')) return;
    const div = document.createElement('div');
    div.innerHTML = `
      <div class="opinions-modal" id="opinions-modal" role="dialog" aria-modal="true" aria-label="Share your opinions">
        <div class="modal-handle" id="modal-handle">
          <div class="modal-grip"><span></span></div>
          <button class="modal-close" id="modal-close" aria-label="Close">✕</button>
        </div>
        <div class="modal-body">
          <p class="modal-intro">Everyone has an opinion. What's yours? Feel free to ask a question, share a suggestion or give some constructive criticism. I wouldn't say no to a good debate, even!</p>
          <form class="modal-form" id="opinions-form" action="${ENDPOINT}" method="POST">
            <div class="message-label-row">
              <label>Message</label>
              <label class="reply-check-label">
                <input type="checkbox" id="reply-checkbox" name="_reply_requested"> <small>I'd like a reply</small>
              </label>
            </div>
            <textarea name="message" placeholder="Say what's on your mind…" required></textarea>
            <div class="field-secondary">
              <input type="text" name="name" placeholder="Name (optional)" autocomplete="name">
              <div id="email-field">
                <input type="email" name="email" id="email-input" placeholder="Email (optional)" autocomplete="email">
              </div>
            </div>
            <button type="submit" class="modal-submit">Hit Me With It!</button>
          </form>
          <div class="modal-thankyou" id="modal-thankyou">
            <p>Thank you — message received.</p>
            <small>I'll be in touch if you left an email.</small>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(div.firstElementChild);
  }

  /* ── INIT LOGIC ── */
  function init() {
    ensureFonts();
    injectStyles();
    injectHTML();

    const modal         = document.getElementById('opinions-modal');
    const closeBtn      = document.getElementById('modal-close');
    const handle        = document.getElementById('modal-handle');
    const form          = document.getElementById('opinions-form');
    const thankyou      = document.getElementById('modal-thankyou');
    const replyCheckbox = document.getElementById('reply-checkbox');
    const emailInput    = document.getElementById('email-input');
    const triggerNav    = document.getElementById('opinions-trigger');
    const triggerFooter = document.getElementById('opinions-trigger-footer');

    /* ── OPEN / CLOSE ── */
    function openModal(nearX, nearY) {
      form.style.display     = '';
      thankyou.style.display = 'none';
      form.reset();
      emailInput.required    = false;
      emailInput.placeholder = 'Email (optional)';

      modal.style.display = 'flex';
      modal.classList.add('open');

      const mw = modal.offsetWidth  || 360;
      const mh = modal.offsetHeight || 300;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let left, top;

      if (vw <= 640) {
        left = (vw - mw) / 2;
        top  = vh * 0.12;
      } else {
        left = nearX + 12;
        top  = nearY + 12;
        if (left + mw > vw - 16) left = nearX - mw - 12;
        if (top  + mh > vh - 16) top  = nearY - mh - 12;
        left = Math.max(8, left);
        top  = Math.max(8, top);
      }
      modal.style.left   = left + 'px';
      modal.style.top    = top  + 'px';
      modal.style.right  = 'auto';
      modal.style.bottom = 'auto';
    }

    function closeModal() {
      modal.classList.remove('open');
      modal.style.display = 'none';
    }

    closeBtn.addEventListener('click', closeModal);

    if (triggerNav) {
      triggerNav.addEventListener('click', () => {
        const r = triggerNav.getBoundingClientRect();
        openModal(r.left, r.bottom);
      });
    }
    if (triggerFooter) {
      triggerFooter.addEventListener('click', () => {
        const r = triggerFooter.getBoundingClientRect();
        openModal(r.left, r.top);
      });
    }

    /* ── DRAG ── */
    let dragging = false, dragOffX = 0, dragOffY = 0;

    handle.addEventListener('mousedown', (e) => {
      dragging = true;
      const rect = modal.getBoundingClientRect();
      dragOffX = e.clientX - rect.left;
      dragOffY = e.clientY - rect.top;
      modal.style.right  = 'auto';
      modal.style.bottom = 'auto';
      e.preventDefault();
    });
    document.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      let l = e.clientX - dragOffX;
      let t = e.clientY - dragOffY;
      l = Math.max(0, Math.min(l, window.innerWidth  - modal.offsetWidth));
      t = Math.max(0, Math.min(t, window.innerHeight - modal.offsetHeight));
      modal.style.left = l + 'px';
      modal.style.top  = t + 'px';
    });
    document.addEventListener('mouseup', () => { dragging = false; });

    handle.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      dragging = true;
      const rect = modal.getBoundingClientRect();
      dragOffX = touch.clientX - rect.left;
      dragOffY = touch.clientY - rect.top;
      modal.style.right  = 'auto';
      modal.style.bottom = 'auto';
    }, { passive: true });
    document.addEventListener('touchmove', (e) => {
      if (!dragging) return;
      const touch = e.touches[0];
      let l  = touch.clientX - dragOffX;
      let tv = touch.clientY - dragOffY;
      l  = Math.max(0, Math.min(l,  window.innerWidth  - modal.offsetWidth));
      tv = Math.max(0, Math.min(tv, window.innerHeight - modal.offsetHeight));
      modal.style.left = l  + 'px';
      modal.style.top  = tv + 'px';
    }, { passive: true });
    document.addEventListener('touchend', () => { dragging = false; });

    /* ── REPLY CHECKBOX ── */
    replyCheckbox.addEventListener('change', () => {
      const checked = replyCheckbox.checked;
      emailInput.required    = checked;
      emailInput.placeholder = checked ? 'Email (required)' : 'Email (optional)';
      if (!checked) emailInput.value = '';
    });

    /* ── FORM SUBMIT ── */
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = new FormData(form);
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          form.style.display     = 'none';
          thankyou.style.display = 'block';
        } else {
          alert('Something went wrong — please try again.');
        }
      } catch {
        alert('Could not send — please check your connection.');
      }
    });
  }

  /* ── WAIT FOR DOM ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
