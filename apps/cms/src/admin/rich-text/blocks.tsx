import type { ReactNode } from "react"
import type { Editor } from "@tiptap/core"
import {
  BulletList,
  GridNine,
  HeadingFour,
  HeadingThree,
  HeadingTwo,
  Image,
  NumberList,
  Paragraph,
  Play,
  Quotes,
} from "@strapi/icons"

import type { RichTextContext } from "./context"
import { Divider } from "./icons"

export type Block = {
  id: string
  title: string
  hint: string
  keywords: string
  icon: ReactNode
  group: "Text" | "Media"
  run: (editor: Editor, ctx: RichTextContext) => void
}

/**
 * Everything that can be added to an article, for the "/" menu and the
 * Insert button. Only what the website knows how to show is here.
 */
export const BLOCKS: Block[] = [
  {
    id: "text",
    title: "Text",
    hint: "A plain paragraph",
    keywords: "paragraph body p",
    icon: <Paragraph />,
    group: "Text",
    run: (e) => e.chain().focus().setParagraph().run(),
  },
  {
    id: "h2",
    title: "Section heading",
    hint: "Starts a new section",
    keywords: "heading h2 title large",
    icon: <HeadingTwo />,
    group: "Text",
    run: (e) => e.chain().focus().setHeading({ level: 2 }).run(),
  },
  {
    id: "h3",
    title: "Sub-heading",
    hint: "Divides a section",
    keywords: "heading h3 subtitle medium",
    icon: <HeadingThree />,
    group: "Text",
    run: (e) => e.chain().focus().setHeading({ level: 3 }).run(),
  },
  {
    id: "h4",
    title: "Minor heading",
    hint: "Small label heading",
    keywords: "heading h4 small",
    icon: <HeadingFour />,
    group: "Text",
    run: (e) => e.chain().focus().setHeading({ level: 4 }).run(),
  },
  {
    id: "bullets",
    title: "Bulleted list",
    hint: "A simple list",
    keywords: "list bullet unordered ul",
    icon: <BulletList />,
    group: "Text",
    run: (e) => e.chain().focus().toggleBulletList().run(),
  },
  {
    id: "numbers",
    title: "Numbered list",
    hint: "Steps in order",
    keywords: "list numbered ordered ol steps",
    icon: <NumberList />,
    group: "Text",
    run: (e) => e.chain().focus().toggleOrderedList().run(),
  },
  {
    id: "quote",
    title: "Quote",
    hint: "Pull quote or citation",
    keywords: "quote blockquote citation",
    icon: <Quotes />,
    group: "Text",
    run: (e) => e.chain().focus().setBlockquote().run(),
  },
  {
    id: "divider",
    title: "Divider",
    hint: "A line between sections",
    keywords: "divider line hr separator rule",
    icon: <Divider />,
    group: "Text",
    run: (e) => e.chain().focus().setHorizontalRule().run(),
  },
  {
    id: "image",
    title: "Image",
    hint: "From the media library",
    keywords: "image picture photo media upload",
    icon: <Image />,
    group: "Media",
    run: (e, ctx) =>
      ctx.pickImage((attrs) => e.chain().focus().insertImage(attrs).run()),
  },
  {
    id: "table",
    title: "Table",
    hint: "Rows and columns, with a header row",
    keywords: "table grid rows columns data",
    icon: <GridNine />,
    group: "Media",
    run: (e) =>
      e
        .chain()
        .focus()
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run(),
  },
  {
    id: "video",
    title: "Video",
    hint: "YouTube or Vimeo",
    keywords: "video youtube vimeo embed media",
    icon: <Play />,
    group: "Media",
    run: (e) => e.chain().focus().insertVideo(null).run(),
  },
]

export function filterBlocks(query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return BLOCKS
  return BLOCKS.filter((block) =>
    `${block.title} ${block.keywords}`.toLowerCase().includes(q)
  )
}

/**
 * Opens the "/" menu on an empty line: the current one if it's empty,
 * otherwise a new line after the block at `pos` (default: the cursor's).
 */
export function openBlockMenu(editor: Editor, pos?: number) {
  const { state } = editor
  const $pos = state.doc.resolve(pos ?? state.selection.from)
  const block = $pos.depth ? $pos.node(1) : state.doc.nodeAt($pos.pos)
  const at = $pos.depth ? $pos.before(1) : $pos.pos

  if (block?.type.name === "paragraph" && !block.content.size) {
    return editor
      .chain()
      .focus()
      .setTextSelection(at + 1)
      .insertContent("/")
      .run()
  }
  const after = at + (block?.nodeSize ?? 0)
  return editor
    .chain()
    .focus()
    .insertContentAt(after, { type: "paragraph" })
    .setTextSelection(after + 1)
    .insertContent("/")
    .run()
}
