import { useEffect, useRef, useState, type ReactNode } from "react"
import type { Editor } from "@tiptap/core"
import { NodeSelection } from "@tiptap/pm/state"
import { CellSelection } from "@tiptap/pm/tables"
import { useEditorState } from "@tiptap/react"
import { BubbleMenu } from "@tiptap/react/menus"
import {
  Bold,
  Code,
  Cross,
  Italic,
  Link,
  StrikeThrough,
  Trash,
  Underline,
} from "@strapi/icons"

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ClearFormat,
  Subscript,
  Superscript,
} from "./icons"

export const Btn = ({
  label,
  active,
  onClick,
  children,
  className,
  disabled,
}: {
  label: string
  active?: boolean
  onClick: () => void
  children: ReactNode
  className?: string
  disabled?: boolean
}) => (
  <button
    type="button"
    title={label}
    aria-label={label}
    aria-pressed={active}
    disabled={disabled}
    className={`ss-rt-btn${active ? " is-active" : ""}${className ? ` ${className}` : ""}`}
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
  >
    {children}
  </button>
)

const BLOCK_TYPES = [
  { id: "p", label: "Text" },
  { id: "h2", label: "Section heading" },
  { id: "h3", label: "Sub-heading" },
  { id: "h4", label: "Minor heading" },
  { id: "quote", label: "Quote" },
] as const

type BlockType = (typeof BLOCK_TYPES)[number]["id"]

function setBlockType(editor: Editor, id: BlockType) {
  const chain = editor.chain().focus()
  if (editor.isActive("blockquote") && id !== "quote") chain.lift("blockquote")
  if (id === "p") return chain.setParagraph().run()
  if (id === "quote") return chain.setParagraph().setBlockquote().run()
  return chain.setHeading({ level: Number(id[1]) as 2 | 3 | 4 }).run()
}

/** The toolbar over selected text. */
export const TextMenu = ({ editor }: { editor: Editor }) => {
  const [linking, setLinking] = useState(false)
  const [href, setHref] = useState("")
  const [typesOpen, setTypesOpen] = useState(false)
  const input = useRef<HTMLInputElement>(null)

  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      underline: e.isActive("underline"),
      strike: e.isActive("strike"),
      code: e.isActive("code"),
      sub: e.isActive("subscript"),
      sup: e.isActive("superscript"),
      link: e.isActive("link"),
      href: (e.getAttributes("link").href as string | undefined) ?? "",
      left:
        !e.isActive({ textAlign: "center" }) &&
        !e.isActive({ textAlign: "right" }),
      center: e.isActive({ textAlign: "center" }),
      right: e.isActive({ textAlign: "right" }),
      type: (e.isActive("blockquote")
        ? "quote"
        : e.isActive("heading", { level: 2 })
          ? "h2"
          : e.isActive("heading", { level: 3 })
            ? "h3"
            : e.isActive("heading", { level: 4 })
              ? "h4"
              : "p") as BlockType,
    }),
  })

  useEffect(() => {
    if (linking) input.current?.focus()
  }, [linking])

  const applyLink = () => {
    const url = href.trim()
    const chain = editor.chain().focus().extendMarkRange("link")
    if (!url) chain.unsetLink().run()
    else {
      const full = /^(https?:|mailto:|tel:|\/|#)/i.test(url)
        ? url
        : `https://${url}`
      chain
        .setLink({
          href: full,
          target: /^https?:/i.test(full) ? "_blank" : null,
        })
        .run()
    }
    setLinking(false)
  }

  return (
    <BubbleMenu
      editor={editor}
      pluginKey="textMenu"
      className="ss-rt-bubble"
      options={{ placement: "top-start", offset: 8, flip: true }}
      shouldShow={({ editor: e, state: s }) => {
        const { selection } = s
        if (!e.isEditable || selection.empty) return false
        if (selection instanceof NodeSelection) return false
        if (selection instanceof CellSelection) return false
        return !e.isActive("figureImage") && !e.isActive("video")
      }}
    >
      {linking ? (
        <div className="ss-rt-linkbar">
          <Link />
          <input
            ref={input}
            value={href}
            placeholder="Paste a link, or /services/... for a page on the site"
            onChange={(e) => setHref(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                applyLink()
              }
              if (e.key === "Escape") setLinking(false)
            }}
          />
          <button type="button" className="is-primary" onClick={applyLink}>
            Apply
          </button>
          {state.link && (
            <Btn
              label="Remove link"
              onClick={() => {
                editor.chain().focus().extendMarkRange("link").unsetLink().run()
                setLinking(false)
              }}
            >
              <Trash />
            </Btn>
          )}
          <Btn label="Cancel" onClick={() => setLinking(false)}>
            <Cross />
          </Btn>
        </div>
      ) : (
        <div className="ss-rt-bubble-row">
          <div className="ss-rt-types">
            <button
              type="button"
              className="ss-rt-types-btn"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setTypesOpen((open) => !open)}
            >
              {BLOCK_TYPES.find((t) => t.id === state.type)?.label}
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
                <path
                  d="M2 4l3 3 3-3"
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="1.5"
                />
              </svg>
            </button>
            {typesOpen && (
              <div className="ss-rt-types-list">
                {BLOCK_TYPES.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    aria-pressed={state.type === type.id}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setBlockType(editor, type.id)
                      setTypesOpen(false)
                    }}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <span className="ss-rt-sep" />
          <Btn
            label="Bold (Ctrl+B)"
            active={state.bold}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold />
          </Btn>
          <Btn
            label="Italic (Ctrl+I)"
            active={state.italic}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic />
          </Btn>
          <Btn
            label="Underline (Ctrl+U)"
            active={state.underline}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <Underline />
          </Btn>
          <Btn
            label="Strikethrough"
            active={state.strike}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <StrikeThrough />
          </Btn>
          <Btn
            label="Code"
            active={state.code}
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            <Code />
          </Btn>
          <Btn
            label="Link"
            active={state.link}
            onClick={() => {
              setHref(state.href)
              setLinking(true)
            }}
          >
            <Link />
          </Btn>
          <span className="ss-rt-sep" />
          <Btn
            label="Subscript"
            active={state.sub}
            onClick={() => editor.chain().focus().toggleSubscript().run()}
          >
            <Subscript />
          </Btn>
          <Btn
            label="Superscript"
            active={state.sup}
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
          >
            <Superscript />
          </Btn>
          <span className="ss-rt-sep" />
          <Btn
            label="Align left"
            active={state.left}
            onClick={() => editor.chain().focus().unsetTextAlign().run()}
          >
            <AlignLeft />
          </Btn>
          <Btn
            label="Centre"
            active={state.center}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          >
            <AlignCenter />
          </Btn>
          <Btn
            label="Align right"
            active={state.right}
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          >
            <AlignRight />
          </Btn>
          <span className="ss-rt-sep" />
          <Btn
            label="Clear formatting"
            onClick={() =>
              editor.chain().focus().unsetAllMarks().unsetTextAlign().run()
            }
          >
            <ClearFormat />
          </Btn>
        </div>
      )}
    </BubbleMenu>
  )
}

/** The table tools, above the table the cursor is in. */
export const TableMenu = ({ editor }: { editor: Editor }) => {
  const [captioning, setCaptioning] = useState(false)
  const caption = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      (e.getAttributes("table").caption as string | undefined) ?? "",
  })

  const tableDom = () => {
    const { $from } = editor.state.selection
    for (let d = $from.depth; d > 0; d--) {
      if ($from.node(d).type.name === "table") {
        const dom = editor.view.nodeDOM($from.before(d))
        return dom instanceof HTMLElement ? dom : null
      }
    }
    return null
  }

  const run = (
    fn: (c: ReturnType<Editor["chain"]>) => ReturnType<Editor["chain"]>
  ) => fn(editor.chain().focus()).run()

  return (
    <BubbleMenu
      editor={editor}
      pluginKey="tableMenu"
      className="ss-rt-bubble ss-rt-bubble--table"
      options={{ placement: "top-start", offset: 8, flip: false }}
      getReferencedVirtualElement={() => {
        const dom = tableDom()
        return dom
          ? { getBoundingClientRect: () => dom.getBoundingClientRect() }
          : null
      }}
      shouldShow={({ editor: e, state: s }) =>
        e.isEditable &&
        e.isActive("table") &&
        (s.selection.empty || s.selection instanceof CellSelection)
      }
    >
      {captioning ? (
        <div className="ss-rt-linkbar">
          <input
            autoFocus
            value={caption}
            placeholder="Table caption (optional)"
            onChange={(e) =>
              editor.commands.updateAttributes("table", {
                caption: e.target.value,
              })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "Escape") {
                e.preventDefault()
                setCaptioning(false)
                editor.commands.focus()
              }
            }}
          />
          <button
            type="button"
            className="is-primary"
            onClick={() => {
              setCaptioning(false)
              editor.commands.focus()
            }}
          >
            Done
          </button>
        </div>
      ) : (
        <div className="ss-rt-bubble-row ss-rt-bubble-row--text">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => run((c) => c.addRowBefore())}
          >
            + Row above
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => run((c) => c.addRowAfter())}
          >
            + Row below
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => run((c) => c.addColumnBefore())}
          >
            + Column left
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => run((c) => c.addColumnAfter())}
          >
            + Column right
          </button>
          <span className="ss-rt-sep" />
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => run((c) => c.deleteRow())}
          >
            − Row
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => run((c) => c.deleteColumn())}
          >
            − Column
          </button>
          <span className="ss-rt-sep" />
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => run((c) => c.mergeOrSplit())}
          >
            Merge / split
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => run((c) => c.toggleHeaderRow())}
          >
            Header row
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setCaptioning(true)}
          >
            {caption ? "Edit caption" : "Caption"}
          </button>
          <span className="ss-rt-sep" />
          <Btn
            label="Delete table"
            className="is-danger"
            onClick={() => run((c) => c.deleteTable())}
          >
            <Trash />
          </Btn>
        </div>
      )}
    </BubbleMenu>
  )
}
