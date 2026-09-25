import render from "dom-serializer"
import { parseDocument } from "htmlparser2"
import sanitizeHtml from "sanitize-html"

/**
 * Article bodies arrive from the CMS as HTML written by the admin's article
 * editor. Before any of it reaches a page it is cleaned: only what that editor
 * (apps/cms/src/admin/rich-text) can produce is kept, so a pasted <script>,
 * an onerror handler or a javascript: link never makes it through, even from
 * the editor's source view. Add a feature there, allow it here.
 */

/** Relative media URLs (local uploads) point at the CMS; R2 URLs are absolute. */
function media(url: string) {
  if (!url || /^(https?:)?\/\//.test(url)) return url
  const base = process.env.CMS_PUBLIC_URL ?? process.env.CMS_URL ?? ""
  return `${base.replace(/\/$/, "")}${url.startsWith("/") ? "" : "/"}${url}`
}

const VIDEO_HOSTS = [
  "www.youtube.com",
  "youtube.com",
  "www.youtube-nocookie.com",
  "player.vimeo.com",
]

const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "br",
    "h2",
    "h3",
    "h4",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "sub",
    "sup",
    "code",
    "a",
    "ul",
    "ol",
    "li",
    "blockquote",
    "hr",
    "figure",
    "figcaption",
    "img",
    "table",
    "thead",
    "tbody",
    "tfoot",
    "tr",
    "th",
    "td",
    "caption",
    "colgroup",
    "col",
    "div",
    "iframe",
    "span",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel", "title"],
    img: ["src", "srcset", "sizes", "alt", "width", "height", "loading"],
    th: ["colspan", "rowspan", "scope"],
    td: ["colspan", "rowspan"],
    ol: ["start"],
    iframe: ["src", "allow", "allowfullscreen", "title", "loading"],
    "*": ["style"],
  },
  allowedClasses: {
    figure: [
      "image",
      "image-style-side",
      "image-style-block-align-left",
      "image-style-block-align-right",
      "image-style-align-center",
      "image-inline",
      "table",
      "media",
    ],
  },
  // Only alignment survives; colours and sizes would fight the site's type.
  allowedStyles: {
    "*": { "text-align": [/^(left|center|right)$/] },
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: { img: ["http", "https"] },
  allowProtocolRelative: false,
  allowedIframeHostnames: VIDEO_HOSTS,
  allowIframeRelativeUrls: false,
  transformTags: {
    a: (tagName, attribs) => {
      const external = attribs.target === "_blank"
      return {
        tagName,
        attribs: external
          ? { ...attribs, rel: "noopener noreferrer" }
          : { ...attribs, rel: attribs.rel ?? "" },
      }
    },
    img: (tagName, attribs) => ({
      tagName,
      attribs: {
        ...attribs,
        src: media(attribs.src ?? ""),
        ...(attribs.srcset
          ? {
              srcset: attribs.srcset
                .split(",")
                .map((part) => {
                  const [url = "", size = ""] = part.trim().split(/\s+/)
                  return `${media(url)} ${size}`.trim()
                })
                .join(", "),
            }
          : {}),
        loading: "lazy",
      },
    }),
    iframe: (tagName, attribs) => ({
      tagName,
      attribs: { ...attribs, loading: "lazy", title: attribs.title ?? "Video" },
    }),
  },
  // The editor wraps players in inline-styled divs; drop the empty wrappers'
  // styles (above) and let the stylesheet size the player instead.
  exclusiveFilter: (frame) =>
    frame.tag === "p" && !frame.text.trim() && !frame.mediaChildren.length,
}

/** The body, cleaned and ready to render. */
export function cleanArticleHtml(html: string | null | undefined) {
  return sanitizeHtml(html ?? "", OPTIONS)
}

/**
 * The first `blocks` top-level blocks (paragraphs, headings, lists, tables,
 * figures...) of an already-cleaned body: what a gated article shows before
 * the email form. Everything after is never sent to the browser.
 */
export function previewHtml(clean: string, blocks: number) {
  const nodes = parseDocument(clean).children.filter(
    (node) => node.type !== "text" || ("data" in node && node.data.trim())
  )
  return render(nodes.slice(0, Math.max(1, blocks)))
}
