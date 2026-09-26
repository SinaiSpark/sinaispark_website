import { createHash } from "node:crypto"

import { parseDocument } from "htmlparser2"

type ChildNode = ReturnType<typeof parseDocument>["children"][number]
type Element = Extract<ChildNode, { attribs: Record<string, string> }>

/**
 * Turns content into passages for the search index: rendered pages are split
 * at their sections, long text at paragraphs, each passage kept small enough
 * that four of them fit a lean prompt.
 */

export interface Passage {
  title: string
  heading: string | null
  content: string
}

/** About 250 tokens; four of these keep a prompt near 2.5k tokens. */
const MAX_CHARS = 1100

export const hashOf = (text: string) =>
  createHash("sha256").update(text).digest("hex").slice(0, 32)

/** Non-breaking spaces, which the design uses to keep words together. */
const NBSP = String.fromCharCode(160)

const clean = (text: string) =>
  text
    .replaceAll(NBSP, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()

/**
 * Splits text into passages of at most MAX_CHARS, breaking between
 * paragraphs (then lines, then sentences) and never mid-word.
 */
export function splitText(text: string, max = MAX_CHARS): string[] {
  const body = clean(text)
  if (body.length <= max) return body ? [body] : []

  const parts: string[] = []
  let current = ""
  const push = () => {
    if (current.trim()) parts.push(current.trim())
    current = ""
  }
  for (const unit of body.split(/\n+/)) {
    const pieces =
      unit.length > max ? (unit.match(/[^.!?]+[.!?]*\s*/g) ?? [unit]) : [unit]
    for (const piece of pieces) {
      if (current && current.length + piece.length + 1 > max) push()
      current += (current ? "\n" : "") + piece.trim()
      while (current.length > max) {
        const cut = current.lastIndexOf(" ", max)
        const at = cut > max / 2 ? cut : max
        parts.push(current.slice(0, at).trim())
        current = current.slice(at).trim()
      }
    }
  }
  push()
  return parts
}

/**
 * Starts each passage with the end of the one before (about `chars`
 * characters, from a word boundary), so text cut at a passage boundary still
 * appears whole in one of them. For documents, whose line breaks are layout,
 * not paragraphs.
 */
export function withOverlap(parts: string[], chars = 150): string[] {
  return parts.map((part, i) => {
    if (!i) return part
    const prev = parts[i - 1]!
    const tail = prev.slice(-chars)
    const start = tail.indexOf(" ")
    return `${start >= 0 ? tail.slice(start + 1) : tail} ${part}`
  })
}

/** Page chrome and boilerplate that would only add noise to the index. */
const SKIP_TAGS = new Set([
  "script",
  "style",
  "noscript",
  "svg",
  "canvas",
  "video",
  "form",
  "nav",
  "button",
  "select",
  "template",
])
/**
 * Sections whose text is on every page (calls to action, "up next"), the
 * consultation form, and FAQ blocks (FAQs are indexed from the CMS directly).
 */
const SKIP_SECTION = /\b(cta|upnext|consult|faq|dfaq|newsletter|loader)\b/

const BLOCKS = new Set([
  "p",
  "li",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "td",
  "th",
  "dt",
  "dd",
  "blockquote",
  "figcaption",
  "summary",
])

const isElement = (node: ChildNode): node is Element =>
  node.type === "tag" || node.type === "script" || node.type === "style"

function textOf(node: ChildNode): string {
  if (node.type === "text") return node.data
  if (!isElement(node) || SKIP_TAGS.has(node.name)) return ""
  if (node.attribs["aria-hidden"] === "true") return ""
  return node.children.map(textOf).join("")
}

/** The text blocks under `node`, outermost block elements only. */
function blocksOf(node: ChildNode, out: string[]) {
  if (!isElement(node) || SKIP_TAGS.has(node.name)) return
  if (node.attribs["aria-hidden"] === "true") return
  if (BLOCKS.has(node.name)) {
    const text = clean(textOf(node))
    if (text) out.push(text)
    return
  }
  for (const child of node.children) blocksOf(child, out)
}

function find(node: ChildNode, test: (el: Element) => boolean): Element | null {
  if (!isElement(node)) return null
  if (test(node)) return node
  for (const child of node.children) {
    const hit = find(child, test)
    if (hit) return hit
  }
  return null
}

function findAll(
  node: ChildNode,
  test: (el: Element) => boolean,
  out: Element[]
) {
  if (!isElement(node)) return out
  if (test(node)) {
    out.push(node)
    return out
  }
  for (const child of node.children) findAll(child, test, out)
  return out
}

/**
 * The readable content of a rendered page, one passage group per <section>,
 * headed by the section's first heading. Returns the page title too.
 */
export function passagesFromHtml(html: string): {
  title: string
  passages: Passage[]
} {
  const doc = parseDocument(html)
  const root = doc.children.find(isElement)
  const titleEl = root ? find(root, (el) => el.name === "title") : null
  const main = root ? find(root, (el) => el.name === "main") : null
  const h1 = main ? find(main, (el) => el.name === "h1") : null
  const title = clean(
    (h1 ? textOf(h1) : titleEl ? textOf(titleEl).split("|")[0] : "") ?? ""
  )
  if (!main) return { title, passages: [] }

  const sections = findAll(main, (el) => el.name === "section", [])
  const passages: Passage[] = []
  for (const section of sections) {
    if (SKIP_SECTION.test(section.attribs.class ?? "")) continue
    if (SKIP_SECTION.test(section.attribs.id ?? "")) continue
    const headingEl = find(section, (el) => /^h[1-3]$/.test(el.name))
    const heading = headingEl ? clean(textOf(headingEl)) : null
    const blocks: string[] = []
    blocksOf(section, blocks)
    // The heading is carried separately; don't repeat it in the text.
    const body = blocks.filter((block) => block !== heading)
    for (const content of splitText(body.join("\n"))) {
      passages.push({ title, heading, content })
    }
  }
  return { title, passages }
}

/** The text a passage is embedded and shown to the model as. */
export const passageText = (p: Passage) =>
  [
    p.heading && p.heading !== p.title ? `${p.title} — ${p.heading}` : p.title,
    p.content,
  ]
    .filter(Boolean)
    .join("\n")
