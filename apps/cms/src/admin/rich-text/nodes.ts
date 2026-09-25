import { mergeAttributes, Node } from "@tiptap/core"
import type { Node as PMNode } from "@tiptap/pm/model"
import type { EditorView, ViewMutationRecord } from "@tiptap/pm/view"
import { Table, TableView } from "@tiptap/extension-table"
import { ReactNodeViewRenderer } from "@tiptap/react"

import { storedUrl, toEmbedUrl } from "./html"
import { ImageView } from "./views/ImageView"
import { VideoView } from "./views/VideoView"

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    figureImage: {
      insertImage: (attrs: Partial<ImageAttrs>) => ReturnType
    }
    video: {
      insertVideo: (src?: string | null) => ReturnType
    }
  }
}

export type ImageLayout = "block" | "side" | "left" | "right"

export type ImageAttrs = {
  src: string
  alt: string
  width: number | null
  height: number | null
  srcset: string | null
  caption: string
  layout: ImageLayout
}

/** The website's class for each placement (CKEditor's names, kept so older bodies still match). */
const LAYOUT_CLASS: Record<ImageLayout, string | null> = {
  block: null,
  side: "image-style-side",
  left: "image-style-block-align-left",
  right: "image-style-block-align-right",
}

const imgOf = (el: HTMLElement) =>
  el.tagName === "IMG" ? el : el.querySelector("img")

const numberAttr = (value: string | null | undefined) => {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? n : null
}

/**
 * An image with an optional caption and a placement. One block, edited in
 * place: the caption is typed under the picture, the rest is on its toolbar.
 */
export const FigureImage = Node.create({
  name: "figureImage",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      // CKEditor stored uploads with the CMS address in front; keep them
      // relative so they work on any host.
      src: {
        default: "",
        parseHTML: (el) => storedUrl(imgOf(el)?.getAttribute("src") ?? ""),
      },
      alt: {
        default: "",
        parseHTML: (el) => imgOf(el)?.getAttribute("alt") ?? "",
      },
      width: {
        default: null,
        parseHTML: (el) => numberAttr(imgOf(el)?.getAttribute("width")),
      },
      height: {
        default: null,
        parseHTML: (el) => numberAttr(imgOf(el)?.getAttribute("height")),
      },
      srcset: {
        default: null,
        parseHTML: (el) =>
          imgOf(el)
            ?.getAttribute("srcset")
            ?.split(",")
            .map((part) => {
              const [url = "", size = ""] = part.trim().split(/\s+/)
              return `${storedUrl(url)} ${size}`.trim()
            })
            .filter(Boolean)
            .join(", ") || null,
      },
      caption: {
        default: "",
        parseHTML: (el) =>
          el.tagName === "FIGURE"
            ? (el.querySelector("figcaption")?.textContent ?? "")
            : "",
      },
      layout: {
        default: "block",
        parseHTML: (el) => {
          const entry = Object.entries(LAYOUT_CLASS).find(
            ([, cls]) => cls && el.classList.contains(cls)
          )
          return (entry?.[0] as ImageLayout | undefined) ?? "block"
        },
      },
    }
  },

  parseHTML() {
    return [
      { tag: "figure.image", getAttrs: (el) => (imgOf(el) ? null : false) },
      { tag: "img[src]" },
    ]
  },

  renderHTML({ node }) {
    const { src, alt, width, height, srcset, caption, layout } =
      node.attrs as ImageAttrs
    const cls = ["image", LAYOUT_CLASS[layout]].filter(Boolean).join(" ")
    const img = [
      "img",
      Object.fromEntries(
        Object.entries({ src, alt, width, height, srcset }).filter(
          ([key, value]) => value != null && (value !== "" || key === "alt")
        )
      ),
    ] as const
    return caption
      ? ["figure", { class: cls }, img, ["figcaption", {}, caption]]
      : ["figure", { class: cls }, img]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageView)
  },

  addCommands() {
    return {
      insertImage:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs }),
    }
  },
})

const videoSrc = (el: HTMLElement) => {
  const frame = el.tagName === "IFRAME" ? el : el.querySelector("iframe")
  return (
    toEmbedUrl(frame?.getAttribute("src")) ??
    toEmbedUrl(
      el.querySelector("[data-oembed-url]")?.getAttribute("data-oembed-url")
    )
  )
}

/** A YouTube or Vimeo player. Empty until a link is pasted into it. */
export const Video = Node.create({
  name: "video",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return { src: { default: null, parseHTML: videoSrc } }
  },

  parseHTML() {
    return [
      { tag: "figure.media", getAttrs: (el) => (videoSrc(el) ? null : false) },
      { tag: "iframe[src]", getAttrs: (el) => (videoSrc(el) ? null : false) },
    ]
  },

  renderHTML({ node }) {
    if (!node.attrs.src) return ["figure", { class: "media" }]
    return [
      "figure",
      { class: "media" },
      [
        "div",
        {},
        [
          "iframe",
          {
            src: node.attrs.src,
            title: "Video",
            allow:
              "accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
            allowfullscreen: "true",
          },
        ],
      ],
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoView)
  },

  addCommands() {
    return {
      insertVideo:
        (src) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs: { src } }),
    }
  },
})

/** The table as the editor draws it, with its caption underneath. */
class CaptionedTableView extends TableView {
  caption: HTMLElement

  constructor(
    node: PMNode,
    cellMinWidth: number,
    view?: EditorView,
    attrs?: Record<string, unknown>
  ) {
    super(node, cellMinWidth, view, attrs)
    this.caption = document.createElement("div")
    this.caption.className = "ss-rt-table-caption"
    this.caption.contentEditable = "false"
    this.dom.appendChild(this.caption)
    this.syncCaption(node)
  }

  syncCaption(node: PMNode) {
    this.caption.textContent = node.attrs.caption || ""
    this.caption.hidden = !node.attrs.caption
  }

  update(node: PMNode) {
    if (!super.update(node)) return false
    this.syncCaption(node)
    return true
  }

  ignoreMutation(mutation: ViewMutationRecord) {
    if (this.caption.contains(mutation.target as globalThis.Node)) return true
    return super.ignoreMutation(mutation)
  }
}

/** Tables, stored as <figure class="table"> with an optional caption. */
export const CaptionedTable = Table.extend({
  addOptions() {
    return {
      ...this.parent!(),
      View: CaptionedTableView as unknown as typeof TableView,
    }
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      caption: {
        default: "",
        parseHTML: (el) =>
          el.tagName === "FIGURE"
            ? (el.querySelector("figcaption")?.textContent ?? "")
            : (el.querySelector(":scope > caption")?.textContent ?? ""),
        renderHTML: () => ({}),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: "figure.table",
        contentElement: "table",
        getAttrs: (el) => (el.querySelector("table") ? null : false),
      },
      { tag: "table" },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    const table = [
      "table",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      ["tbody", 0],
    ] as const
    return node.attrs.caption
      ? [
          "figure",
          { class: "table" },
          table,
          ["figcaption", {}, node.attrs.caption],
        ]
      : ["figure", { class: "table" }, table]
  },
})
