/**
 * inject.js — The Holmes Chronicle
 * Drop one <script src="inject.js"></script> into each entry page (just before </body>).
 * No per-page configuration needed.
 *
 * Naming convention expected:
 *   index.html  — table of contents
 *   hc1.html    — entry 1
 *   hc2.html    — entry 2
 *   …
 *   hc132.html  — entry 132
 *
 * Navigation behaviour:
 *   hc1   → Prev greyed out,   Next = hc2
 *   hc7   → Prev = hc6,        Next = hc8
 *   hc132 → Prev = hc131,      Next greyed out
 *
 * Footer structure mirrors the existing .book-footer exactly:
 *   ✦ ✦ ✦  /  The Holmes Chronicle  /  ← Prev  Next →
 * Followed by universal-footer.js (CC0, Archives, GitHub, Opinions, ↑ Top).
 */

(function () {
  "use strict";
  /* ── Favicon ─────────────────────────────────────────────────── */
  const link = document.createElement("link");
  link.rel = "icon";
  link.href = "favicon.ico";
  document.head.appendChild(link);

  /* ── Configuration ─────────────────────────────────────────────────── */
  const INDEX_URL        = "index.html";
  const SITE_TITLE       = "The Holmes Chronicle";
  const LAST_ENTRY       = 132;   // update if the chronicle grows
  const UNIVERSAL_FOOTER = "https://andreas-breidenthal.github.io/andreas-breidenthal/universal-footer.js";

  /* ── Derive prev / next from the current filename ───────────────────── */
  const filename = window.location.pathname.split("/").pop();
  const match    = filename.match(/^hc(\d+)\.html$/i);

  let prevHref = "";
  let nextHref = "";

  if (match) {
    const n = parseInt(match[1], 10);
    prevHref = n > 1          ? "hc" + (n - 1) + ".html" : "";
    nextHref = n < LAST_ENTRY ? "hc" + (n + 1) + ".html" : "";
  }

  /* ── Inject: site header ────────────────────────────────────────────── */
  /*
   * Mirrors the existing structure exactly:
   *
   * <header class="site-header">
   *   <nav class="header-nav">
   *     <span class="header-nav">←  (or greyed span)</span>
   *     <span class="header-series"><a href="index.html">The Holmes Chronicle</a></span>
   *     <span class="header-nav">→  (or greyed span)</span>
   *   </nav>
   * </header>
   */
  function injectHeader() {
    const header = document.createElement("header");
    header.className = "site-header";

    const nav = document.createElement("nav");
    nav.className = "header-nav";

    // Left cell — Prev
    const leftSpan = document.createElement("span");
    leftSpan.className = "header-nav";
    if (prevHref) {
      const a = document.createElement("a");
      a.href = prevHref;
      a.textContent = "←";
      leftSpan.appendChild(a);
    } else {
      const s = document.createElement("span");
      s.className = "header-nav--disabled";
      s.setAttribute("aria-disabled", "true");
      s.textContent = "←";
      leftSpan.appendChild(s);
    }
    nav.appendChild(leftSpan);

    // Centre cell — series title
    const centreSpan = document.createElement("span");
    centreSpan.className = "header-series";
    const titleLink = document.createElement("a");
    titleLink.href = INDEX_URL;
    titleLink.textContent = SITE_TITLE;
    centreSpan.appendChild(titleLink);
    nav.appendChild(centreSpan);

    // Right cell — Next
    const rightSpan = document.createElement("span");
    rightSpan.className = "header-nav";
    if (nextHref) {
      const a = document.createElement("a");
      a.href = nextHref;
      a.textContent = "→";
      rightSpan.appendChild(a);
    } else {
      const s = document.createElement("span");
      s.className = "header-nav--disabled";
      s.setAttribute("aria-disabled", "true");
      s.textContent = "→";
      rightSpan.appendChild(s);
    }
    nav.appendChild(rightSpan);

    header.appendChild(nav);

    // Prepend inside .page-shell if present, else directly to body
    const shell = document.querySelector(".page-shell");
    const target = shell || document.body;
    target.insertBefore(header, target.firstChild);
  }

  /* ── Inject: book footer ────────────────────────────────────────────── */
  /*
   * Mirrors the existing structure exactly:
   *
   * <footer class="book-footer">
   *   <div class="footer-ornament">✦ ✦ ✦</div>
   *   <div class="footer-series"><a href="index.html">The Holmes Chronicle</a></div>
   *   <nav class="footer-nav">
   *     ← Prev (link or greyed)  |  Index  |  Next → (link or greyed)
   *   </nav>
   * </footer>
   */
  function injectFooter() {
    const footer = document.createElement("footer");
    footer.className = "book-footer";

    const ornament = document.createElement("div");
    ornament.className = "footer-ornament";
    ornament.textContent = "✦ ✦ ✦";
    footer.appendChild(ornament);

    const series = document.createElement("div");
    series.className = "footer-series";
    const seriesLink = document.createElement("a");
    seriesLink.href = INDEX_URL;
    seriesLink.textContent = SITE_TITLE;
    series.appendChild(seriesLink);
    footer.appendChild(series);

    const nav = document.createElement("nav");
    nav.className = "footer-nav";

    // Prev
    if (prevHref) {
      const a = document.createElement("a");
      a.href = prevHref;
      a.textContent = "← Prev";
      nav.appendChild(a);
    } else {
      const s = document.createElement("span");
      s.className = "footer-nav--disabled";
      s.setAttribute("aria-disabled", "true");
      s.textContent = "← Prev";
      nav.appendChild(s);
    }

    // Next
    if (nextHref) {
      const a = document.createElement("a");
      a.href = nextHref;
      a.textContent = "Next →";
      nav.appendChild(a);
    } else {
      const s = document.createElement("span");
      s.className = "footer-nav--disabled";
      s.setAttribute("aria-disabled", "true");
      s.textContent = "Next →";
      nav.appendChild(s);
    }

    footer.appendChild(nav);

    // Append inside .page-shell if present, else directly to body
    const shell = document.querySelector(".page-shell");
    const target = shell || document.body;
    target.appendChild(footer);
  }

  /* ── Load: universal footer ─────────────────────────────────────────── */
  function loadUniversalFooter() {
    const script = document.createElement("script");
    script.src = UNIVERSAL_FOOTER;
    document.body.appendChild(script);
  }

  /* ── Inject styles — disabled state only ────────────────────────────── */
  /*
   * All live link and footer styles already exist in site.css.
   * We only need to style the greyed-out disabled spans.
   */
  function injectStyles() {
    const style = document.createElement("style");
    style.textContent = `
.header-nav--disabled,
.footer-nav--disabled {
  opacity: 0.35;
  cursor: default;
  pointer-events: none;
  /* inherit font/colour from .site-header a and .footer-nav a respectively */
  font-family: 'Cinzel Decorative', serif;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gold-light);
}
.footer-nav--disabled {
  font-family: 'Cinzel', serif;
  color: var(--gold-light);
}

/* universal-footer sits outside .page-shell — no double border */
.universal-footer {
  border-top: none !important;
}
    `;
    document.head.appendChild(style);
  }

  /* ── Run ──────────────────────────────────────────────────────────────── */
  injectStyles();
  injectHeader();
  injectFooter();
  loadUniversalFooter();

})();
