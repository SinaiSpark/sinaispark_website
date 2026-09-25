import { useEffect } from "react"

/**
 * The editor's look. Colours come from the admin theme (set as --rt-* on the
 * root by RichTextInput), so light and dark mode both work. The writing area
 * uses the website's fonts and rhythm, so an article looks here much as it
 * will on the site. Everything is under .ss-rt* so nothing else is touched.
 */
const CSS = `
.ss-rt {
  position: relative;
  border: 1px solid var(--rt-line);
  border-radius: 10px;
  background: var(--rt-bg);
  transition: border-color .15s, box-shadow .15s;
}
.ss-rt:focus-within { border-color: var(--rt-line-strong); box-shadow: 0 0 0 3px var(--rt-primary-soft); }
.ss-rt.has-error { border-color: var(--rt-danger); }
.ss-rt.is-disabled .ss-rt-bar { opacity: .55; pointer-events: none; }

.ss-rt button { font-family: inherit; cursor: pointer; }
.ss-rt button:disabled { cursor: default; }
.ss-rt svg { flex: none; }

/* ---- Top bar ---- */
.ss-rt-bar {
  position: sticky; top: 0; z-index: 3;
  display: flex; align-items: center; gap: 2px;
  padding: 6px 8px;
  background: var(--rt-bg);
  border-bottom: 1px solid var(--rt-line);
  border-radius: 10px 10px 0 0;
}
.ss-rt-insert {
  display: inline-flex; align-items: center; gap: 6px;
  height: 30px; padding: 0 12px 0 10px;
  border: 0; border-radius: 7px;
  background: var(--rt-primary-soft); color: var(--rt-primary-strong);
  font-size: 13px; font-weight: 600;
}
.ss-rt-insert:hover:not(:disabled) { background: var(--rt-primary); color: #fff; }
.ss-rt-insert svg { width: 12px; height: 12px; }
.ss-rt-btn {
  display: inline-flex; align-items: center; justify-content: center;
  width: 30px; height: 30px; padding: 0;
  border: 0; border-radius: 7px; background: none;
  color: var(--rt-muted);
}
.ss-rt-btn svg { width: 15px; height: 15px; }
.ss-rt-btn:hover:not(:disabled) { background: var(--rt-surface); color: var(--rt-text); }
.ss-rt-btn.is-active { background: var(--rt-primary-soft); color: var(--rt-primary-strong); }
.ss-rt-btn.is-danger:hover { color: var(--rt-danger); }
.ss-rt-btn:disabled { opacity: .35; }
.ss-rt-sep { width: 1px; height: 18px; margin: 0 5px; background: var(--rt-line); flex: none; }
.ss-rt-status {
  flex: 1; min-width: 0; margin-left: 8px;
  font-size: 12px; color: var(--rt-muted);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.ss-rt-count { font-size: 12px; color: var(--rt-subtle); font-variant-numeric: tabular-nums; margin-right: 8px; white-space: nowrap; }
.ss-rt-chip {
  height: 26px; padding: 0 10px; margin-right: 2px;
  border: 1px solid var(--rt-line); border-radius: 999px; background: none;
  color: var(--rt-muted); font-size: 12px; font-weight: 600;
}
.ss-rt-chip:hover { color: var(--rt-text); border-color: var(--rt-line-strong); }
.ss-rt-chip[aria-pressed="true"] { background: var(--rt-text); border-color: var(--rt-text); color: var(--rt-bg); }

/* ---- Focus mode ---- */
.ss-rt.is-focus {
  position: fixed; inset: 0; z-index: 200;
  display: flex; flex-direction: column;
  border: 0; border-radius: 0; box-shadow: none;
}
.ss-rt.is-focus .ss-rt-bar { border-radius: 0; padding: 10px 20px; }
.ss-rt.is-focus .ss-rt-scroll { flex: 1; overflow: auto; }
.ss-rt.is-focus .ss-rt-content { padding-top: 72px; padding-bottom: 160px; }

/* ---- Writing area ---- */
.ss-rt-content { position: relative; padding: 44px 72px 72px; }
.ss-rt-prose {
  max-width: 720px; margin: 0 auto; min-height: 380px;
  outline: none;
  font-family: "Manrope Variable", "Manrope", "Segoe UI", system-ui, sans-serif;
  font-size: 17px; line-height: 1.75; color: var(--rt-text);
  overflow-wrap: break-word;
}
.ss-rt-prose > * + * { margin-top: .9em; }
.ss-rt-prose h2, .ss-rt-prose h3, .ss-rt-prose h4 {
  font-family: "Schibsted Grotesk Variable", "Schibsted Grotesk", "Helvetica Neue", Arial, sans-serif;
  font-weight: 700; letter-spacing: -.02em; line-height: 1.2; color: var(--rt-text);
  margin-top: 1.7em;
}
.ss-rt-prose > :first-child { margin-top: 0; }
.ss-rt-prose h2 { font-size: 30px; }
.ss-rt-prose h3 { font-size: 23px; }
.ss-rt-prose h4 { font-size: 18px; font-weight: 650; letter-spacing: -.01em; }
.ss-rt-prose h2 + *, .ss-rt-prose h3 + *, .ss-rt-prose h4 + * { margin-top: .45em; }
.ss-rt-prose strong, .ss-rt-prose b { font-weight: 700; }
.ss-rt-prose em, .ss-rt-prose i { font-style: italic; }
.ss-rt-prose u { text-decoration: underline; }
.ss-rt-prose s { text-decoration: line-through; }
.ss-rt-prose sub, .ss-rt-prose sup { font-size: .72em; line-height: 0; }
.ss-rt-prose a { color: var(--rt-primary); text-decoration: underline; text-underline-offset: 3px; cursor: text; }
.ss-rt-prose code {
  font-family: "IBM Plex Mono", ui-monospace, Consolas, monospace; font-size: .86em;
  background: var(--rt-surface); border: 1px solid var(--rt-line); border-radius: 5px; padding: .1em .35em;
}
.ss-rt-prose ul, .ss-rt-prose ol { padding-left: 1.4em; }
.ss-rt-prose ul { list-style: disc; }
.ss-rt-prose ol { list-style: decimal; }
.ss-rt-prose li::marker { color: var(--rt-primary); }
.ss-rt-prose li + li { margin-top: .35em; }
.ss-rt-prose li > p { margin: 0; }
.ss-rt-prose blockquote {
  border-left: 3px solid var(--rt-primary);
  padding: .1em 0 .1em 20px;
  font-size: 19px; color: var(--rt-muted);
}
.ss-rt-prose blockquote > * + * { margin-top: .6em; }
.ss-rt-prose hr { border: 0; border-top: 1px solid var(--rt-line-strong); margin: 2.2em 0; }
.ss-rt-prose hr.ProseMirror-selectednode { border-top-color: var(--rt-primary); box-shadow: 0 0 0 4px var(--rt-primary-soft); }
.ss-rt-prose ::selection { background: var(--rt-primary-soft); }
.ss-rt-prose [data-text-align="center"], .ss-rt-prose [style*="text-align: center"] { text-align: center; }

.ss-rt-prose .is-empty::before {
  content: attr(data-placeholder);
  float: left; height: 0; pointer-events: none;
  color: var(--rt-subtle);
}
.ss-rt-prose h2.is-empty::before, .ss-rt-prose h3.is-empty::before, .ss-rt-prose h4.is-empty::before { opacity: .6; }
.ss-rt-dropcursor { background: var(--rt-primary) !important; border-radius: 2px; }

/* The suggestion text while the "/" menu is open. */
.ss-rt-prose .suggestion, .ss-rt-prose [data-decoration-id] { color: var(--rt-primary); }

/* ---- Tables ---- */
.ss-rt-prose .tableWrapper { overflow-x: auto; margin: 1.4em 0; }
.ss-rt-prose table { width: 100%; border-collapse: collapse; table-layout: auto; font-size: 15px; line-height: 1.5; }
.ss-rt-prose th, .ss-rt-prose td {
  position: relative; min-width: 80px;
  border: 1px solid var(--rt-line); padding: 9px 12px;
  text-align: left; vertical-align: top;
}
.ss-rt-prose th { background: var(--rt-surface); font-weight: 650; font-size: 13px; letter-spacing: .02em; }
.ss-rt-prose th p, .ss-rt-prose td p { margin: 0; }
.ss-rt-prose .selectedCell::after {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background: var(--rt-primary-soft); opacity: .6;
}
.ss-rt-table-caption { margin-top: 8px; font-size: 13px; color: var(--rt-muted); }

/* ---- Images ---- */
.ss-rt-image { position: relative; margin: 1.6em 0; }
.ss-rt-image--side { float: right; width: min(45%, 320px); margin: .3em 0 1em 1.6em; }
.ss-rt-image--left { width: min(60%, 420px); margin-right: auto; }
.ss-rt-image--right { width: min(60%, 420px); margin-left: auto; }
.ss-rt-prose::after { content: ""; display: table; clear: both; }
.ss-rt-image-frame { position: relative; border-radius: 12px; }
.ss-rt-image-frame img { display: block; width: 100%; height: auto; border-radius: 12px; }
.ss-rt-image.is-selected .ss-rt-image-frame { outline: 2px solid var(--rt-primary); outline-offset: 3px; }
.ss-rt-empty {
  display: grid; place-items: center; height: 160px; border-radius: 12px;
  background: var(--rt-surface); color: var(--rt-subtle); font-size: 13px;
}
.ss-rt-badge {
  position: absolute; top: 10px; left: 10px;
  padding: 3px 9px; border-radius: 999px;
  background: var(--rt-warn-soft); color: var(--rt-warn);
  font-size: 11px; font-weight: 700; letter-spacing: .02em;
}
.ss-rt-caption {
  display: block; width: 100%; margin-top: 8px; padding: 2px 0;
  border: 0; outline: none; background: none;
  text-align: center; font: inherit; font-size: 13px; line-height: 1.5; color: var(--rt-muted);
}
.ss-rt-caption::placeholder { color: var(--rt-subtle); }
.ss-rt-field { display: flex; align-items: center; gap: 10px; margin-top: 10px; font-size: 12px; color: var(--rt-muted); }
.ss-rt-field span { font-weight: 600; white-space: nowrap; }
.ss-rt-field input, .ss-rt-video-input input {
  flex: 1; min-width: 0; height: 34px; padding: 0 12px;
  border: 1px solid var(--rt-line); border-radius: 8px; outline: none;
  background: var(--rt-bg); color: var(--rt-text); font: inherit; font-size: 13px;
}
.ss-rt-field input:focus, .ss-rt-video-input input:focus { border-color: var(--rt-primary); box-shadow: 0 0 0 3px var(--rt-primary-soft); }

/* ---- Video ---- */
.ss-rt-video { position: relative; margin: 1.6em 0; }
.ss-rt-video-frame { position: relative; aspect-ratio: 16 / 9; border-radius: 12px; overflow: hidden; background: #0b1a1f; }
.ss-rt-video-frame iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
.ss-rt-video-shield { position: absolute; inset: 0; cursor: pointer; }
.ss-rt-video.is-selected .ss-rt-video-frame { outline: 2px solid var(--rt-primary); outline-offset: 3px; }
.ss-rt-video-input { margin: 1.6em 0; }
.ss-rt-video-input > div {
  display: flex; align-items: center; gap: 8px; padding: 12px;
  border: 1px dashed var(--rt-line-strong); border-radius: 12px; background: var(--rt-surface);
}
.ss-rt-video-input.is-selected > div { border-color: var(--rt-primary); }
.ss-rt-video-icon {
  display: grid; place-items: center; width: 34px; height: 34px; flex: none;
  border-radius: 8px; background: var(--rt-bg); color: var(--rt-primary);
}
.ss-rt-video-input button { height: 34px; padding: 0 12px; border: 0; border-radius: 8px; background: none; color: var(--rt-muted); font-size: 13px; font-weight: 600; }
.ss-rt-video-input button:hover { color: var(--rt-text); }
.ss-rt-error { margin: 6px 0 0; font-size: 13px; color: var(--rt-danger); }

/* ---- Floating tools (on images and video) and bubbles ---- */
.ss-rt-float, .ss-rt-bubble {
  display: flex; align-items: center; gap: 2px; padding: 4px;
  background: var(--rt-bg); border: 1px solid var(--rt-line); border-radius: 11px;
  box-shadow: 0 12px 32px -10px rgba(15, 23, 42, .28), 0 2px 6px rgba(15, 23, 42, .08);
  font-family: "Manrope Variable", "Manrope", system-ui, sans-serif;
  white-space: nowrap;
}
.ss-rt-float { position: absolute; z-index: 4; bottom: 100%; left: 50%; transform: translate(-50%, -10px); width: max-content; }
.ss-rt-float button { white-space: nowrap; }
.ss-rt-bubble { z-index: 250; }
.ss-rt-float button, .ss-rt-bubble-row--text > button, .ss-rt-linkbar > button:not(.ss-rt-btn) {
  display: inline-flex; align-items: center; gap: 6px;
  height: 30px; padding: 0 10px;
  border: 0; border-radius: 7px; background: none;
  color: var(--rt-text); font-size: 12.5px; font-weight: 550;
}
.ss-rt-float button svg { width: 13px; height: 13px; }
.ss-rt-float button:hover, .ss-rt-bubble-row--text > button:hover { background: var(--rt-surface); }
.ss-rt-float button[aria-pressed="true"] { background: var(--rt-primary-soft); color: var(--rt-primary-strong); }
.ss-rt-float button.is-warn { color: var(--rt-warn); }
.ss-rt-float button.is-danger:hover { color: var(--rt-danger); }
.ss-rt-float-sep { width: 1px; height: 18px; margin: 0 4px; background: var(--rt-line); }
.ss-rt-seg { display: flex; gap: 2px; }
.ss-rt button.is-primary, .ss-rt-bubble button.is-primary {
  height: 30px; padding: 0 14px; border: 0; border-radius: 7px;
  background: var(--rt-primary); color: #fff; font-size: 12.5px; font-weight: 650;
}
.ss-rt button.is-primary:hover, .ss-rt-bubble button.is-primary:hover { background: var(--rt-primary-strong); color: #fff; }
.ss-rt-video-input button.is-primary { height: 34px; }

.ss-rt-bubble-row { display: flex; align-items: center; gap: 1px; }
.ss-rt-types { position: relative; }
.ss-rt-types-btn {
  display: inline-flex; align-items: center; gap: 6px;
  height: 30px; padding: 0 8px 0 10px;
  border: 0; border-radius: 7px; background: none;
  color: var(--rt-text); font-size: 13px; font-weight: 650;
}
.ss-rt-types-btn:hover { background: var(--rt-surface); }
.ss-rt-types-list {
  position: absolute; top: calc(100% + 8px); left: -4px; min-width: 190px;
  display: flex; flex-direction: column; padding: 4px;
  background: var(--rt-bg); border: 1px solid var(--rt-line); border-radius: 10px;
  box-shadow: 0 12px 32px -10px rgba(15, 23, 42, .28);
}
.ss-rt-types-list button {
  padding: 8px 10px; border: 0; border-radius: 7px; background: none;
  text-align: left; color: var(--rt-text); font-size: 13px;
}
.ss-rt-types-list button:hover { background: var(--rt-surface); }
.ss-rt-types-list button[aria-pressed="true"] { color: var(--rt-primary-strong); font-weight: 650; }
.ss-rt-linkbar { display: flex; align-items: center; gap: 6px; padding: 0 2px 0 8px; color: var(--rt-muted); }
.ss-rt-linkbar > svg { width: 14px; height: 14px; }
.ss-rt-linkbar input {
  width: 340px; height: 30px; border: 0; outline: none; background: none;
  color: var(--rt-text); font: inherit; font-size: 13px;
}

/* ---- Block handle ---- */
.ss-rt-handle { position: absolute; z-index: 2; display: flex; gap: 1px; }
.ss-rt-handle[hidden] { display: none; }
.ss-rt-handle button {
  display: grid; place-items: center; width: 24px; height: 24px; padding: 0;
  border: 0; border-radius: 6px; background: none; color: var(--rt-subtle);
}
.ss-rt-handle button:hover { background: var(--rt-surface); color: var(--rt-text); }
.ss-rt-handle-grip { cursor: grab !important; }
.ss-rt-prose .ProseMirror-selectednode:not(.ss-rt-image):not(.ss-rt-video):not(hr) {
  border-radius: 6px; box-shadow: 0 0 0 2px var(--rt-primary-soft);
}

/* ---- HTML view ---- */
.ss-rt-source {
  display: block; width: 100%; min-height: 520px; padding: 28px 32px;
  border: 0; outline: none; resize: vertical;
  background: var(--rt-surface); color: var(--rt-text);
  font-family: "IBM Plex Mono", ui-monospace, Consolas, monospace; font-size: 13px; line-height: 1.65;
  border-radius: 0 0 10px 10px;
}

/* ---- "/" menu ---- */
.ss-rt-layer { position: fixed; top: 0; left: 0; z-index: 250; }
.ss-rt-menu {
  width: 310px; max-height: 380px; overflow-y: auto; padding: 6px;
  background: var(--rt-bg); border: 1px solid var(--rt-line); border-radius: 12px;
  box-shadow: 0 18px 40px -12px rgba(15, 23, 42, .32), 0 2px 6px rgba(15, 23, 42, .08);
  font-family: "Manrope Variable", "Manrope", system-ui, sans-serif;
}
.ss-rt-menu-group {
  margin: 0; padding: 8px 10px 4px;
  font-size: 10.5px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase;
  color: var(--rt-subtle);
}
.ss-rt-menu-item {
  display: flex; align-items: center; gap: 12px; width: 100%;
  padding: 6px 8px; border: 0; border-radius: 8px; background: none;
  text-align: left; color: var(--rt-text); cursor: pointer; font-family: inherit;
}
.ss-rt-menu-item[aria-selected="true"] { background: var(--rt-surface); }
.ss-rt-menu-icon {
  display: grid; place-items: center; width: 38px; height: 38px; flex: none;
  border: 1px solid var(--rt-line); border-radius: 9px; background: var(--rt-bg); color: var(--rt-muted);
}
.ss-rt-menu-icon svg { width: 17px; height: 17px; }
.ss-rt-menu-item[aria-selected="true"] .ss-rt-menu-icon { border-color: var(--rt-primary); color: var(--rt-primary); }
.ss-rt-menu-item strong { display: block; font-size: 13.5px; font-weight: 650; }
.ss-rt-menu-item small { display: block; font-size: 12px; color: var(--rt-subtle); }
.ss-rt-menu-empty { margin: 0; padding: 12px; font-size: 13px; color: var(--rt-subtle); }

@media (max-width: 900px) {
  .ss-rt-content { padding: 28px 20px 48px 52px; }
  .ss-rt-count { display: none; }
}
`

/** Adds the editor's stylesheet to the page once. */
export function useEditorStyles() {
  useEffect(() => {
    if (document.getElementById("ss-rt-styles")) return
    const style = document.createElement("style")
    style.id = "ss-rt-styles"
    style.textContent = CSS
    document.head.appendChild(style)
  }, [])
}
