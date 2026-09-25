import { Extension, type Editor } from "@tiptap/core"
import { NodeSelection, Plugin, PluginKey } from "@tiptap/pm/state"
import type { EditorView } from "@tiptap/pm/view"
import { ReactRenderer } from "@tiptap/react"
import Suggestion from "@tiptap/suggestion"
import { computePosition, flip, offset, shift } from "@floating-ui/dom"

import { filterBlocks, openBlockMenu, type Block } from "./blocks"
import type { RichTextContext } from "./context"
import {
  SlashMenu,
  type SlashMenuHandle,
  type SlashMenuProps,
} from "./SlashMenu"

type SlashOptions = { getContext: () => RichTextContext }

/** "/" on a line opens the block menu; the typed text filters it. */
export const SlashCommand = Extension.create<SlashOptions>({
  name: "slashCommand",

  addOptions() {
    return { getContext: () => ({ pickImage: () => {} }) }
  },

  addProseMirrorPlugins() {
    const getContext = this.options.getContext
    return [
      Suggestion<Block, Block>({
        editor: this.editor,
        pluginKey: new PluginKey("slashCommand"),
        char: "/",
        allow: ({ state, range }) => {
          const $from = state.doc.resolve(range.from)
          if ($from.parent.type.name !== "paragraph") return false
          for (let d = $from.depth; d > 0; d--) {
            if ($from.node(d).type.spec.tableRole) return false
          }
          return true
        },
        items: ({ query }) => filterBlocks(query),
        command: ({ editor, range, props }) => {
          editor.chain().focus().deleteRange(range).run()
          props.run(editor, getContext())
        },
        render: () => {
          let renderer: ReactRenderer<SlashMenuHandle, SlashMenuProps> | null =
            null
          let rect: (() => DOMRect | null) | null | undefined

          const place = () => {
            const el = renderer?.element as HTMLElement | undefined
            const box = rect?.()
            if (!el || !box) return
            computePosition({ getBoundingClientRect: () => box }, el, {
              strategy: "fixed",
              placement: "bottom-start",
              middleware: [
                offset(6),
                flip({ padding: 8 }),
                shift({ padding: 8 }),
              ],
            }).then(({ x, y }) => {
              el.style.left = `${x}px`
              el.style.top = `${y}px`
            })
          }

          return {
            onStart: (props) => {
              renderer = new ReactRenderer(SlashMenu, {
                props,
                editor: props.editor,
              })
              const el = renderer.element as HTMLElement
              el.className = "ss-rt-layer"
              document.body.appendChild(el)
              rect = props.clientRect
              place()
            },
            onUpdate: (props) => {
              renderer?.updateProps(props)
              rect = props.clientRect
              place()
            },
            // Escape is handled by the suggestion plugin (it closes the menu).
            onKeyDown: ({ event }) => renderer?.ref?.onKeyDown(event) ?? false,
            onExit: () => {
              renderer?.element.remove()
              renderer?.destroy()
              renderer = null
            },
          }
        },
      }),
    ]
  },
})

const GRIP = `<svg width="12" height="16" viewBox="0 0 12 16" aria-hidden="true"><g fill="currentColor"><circle cx="3" cy="3" r="1.4"/><circle cx="9" cy="3" r="1.4"/><circle cx="3" cy="8" r="1.4"/><circle cx="9" cy="8" r="1.4"/><circle cx="3" cy="13" r="1.4"/><circle cx="9" cy="13" r="1.4"/></g></svg>`
const PLUS = `<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M7 1.5v11M1.5 7h11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`

/**
 * The "+" and grip that appear beside the block under the mouse: "+" adds a
 * block after it, dragging the grip moves it.
 */
class BlockHandleView {
  handle: HTMLDivElement
  host: HTMLElement
  current: { pos: number; dom: HTMLElement } | null = null
  frame = 0

  constructor(
    private view: EditorView,
    private editor: Editor
  ) {
    this.host = view.dom.parentElement as HTMLElement
    this.handle = document.createElement("div")
    this.handle.className = "ss-rt-handle"
    this.handle.hidden = true
    this.handle.innerHTML = `<button type="button" class="ss-rt-handle-add" title="Add a block below">${PLUS}</button><button type="button" class="ss-rt-handle-grip" draggable="true" title="Drag to move">${GRIP}</button>`
    this.host.appendChild(this.handle)

    this.host.addEventListener("mousemove", this.onMove)
    this.host.addEventListener("mouseleave", this.hide)
    view.dom.addEventListener("keydown", this.hide)
    const [add, grip] = Array.from(this.handle.children) as HTMLElement[]
    add.addEventListener("mousedown", (e) => e.preventDefault())
    add.addEventListener("click", this.onAdd)
    grip.addEventListener("dragstart", this.onDragStart)
    grip.addEventListener("dragend", this.hide)
    grip.addEventListener("click", this.onSelect)
  }

  hide = () => {
    this.handle.hidden = true
    this.current = null
  }

  onMove = (event: MouseEvent) => {
    if (!this.view.editable) return
    cancelAnimationFrame(this.frame)
    this.frame = requestAnimationFrame(() => this.track(event.clientY))
  }

  track(y: number) {
    let found: { pos: number; dom: HTMLElement } | null = null
    this.view.state.doc.forEach((_node, pos) => {
      if (found) return
      const dom = this.view.nodeDOM(pos)
      if (!(dom instanceof HTMLElement)) return
      const box = dom.getBoundingClientRect()
      if (y >= box.top - 6 && y <= box.bottom + 6) found = { pos, dom }
    })
    if (!found) return
    this.current = found
    const { dom } = found as { pos: number; dom: HTMLElement }
    const hostBox = this.host.getBoundingClientRect()
    const box = dom.getBoundingClientRect()
    const line = parseFloat(getComputedStyle(dom).lineHeight) || 24
    const top = box.top - hostBox.top + this.host.scrollTop
    this.handle.style.top = `${top + Math.min(line, box.height) / 2 - 12}px`
    this.handle.style.left = `${this.view.dom.getBoundingClientRect().left - hostBox.left - 56}px`
    this.handle.hidden = false
  }

  onAdd = () => {
    if (!this.current) return
    openBlockMenu(this.editor, this.current.pos + 1)
    this.hide()
  }

  onSelect = () => {
    if (!this.current) return
    const { view } = this
    view.dispatch(
      view.state.tr.setSelection(
        NodeSelection.create(view.state.doc, this.current.pos)
      )
    )
    view.focus()
  }

  onDragStart = (event: DragEvent) => {
    if (!this.current || !event.dataTransfer) return
    const { view } = this
    const selection = NodeSelection.create(view.state.doc, this.current.pos)
    view.dispatch(view.state.tr.setSelection(selection))
    const slice = selection.content()
    const { dom, text } = view.serializeForClipboard(slice)
    event.dataTransfer.clearData()
    event.dataTransfer.setData("text/html", dom.innerHTML)
    event.dataTransfer.setData("text/plain", text)
    event.dataTransfer.effectAllowed = "copyMove"
    event.dataTransfer.setDragImage(this.current.dom, 0, 0)
    ;(view as unknown as { dragging: unknown }).dragging = {
      slice,
      move: true,
    }
  }

  update() {
    if (this.current && !this.current.dom.isConnected) this.hide()
  }

  destroy() {
    cancelAnimationFrame(this.frame)
    this.host.removeEventListener("mousemove", this.onMove)
    this.host.removeEventListener("mouseleave", this.hide)
    this.view.dom.removeEventListener("keydown", this.hide)
    this.handle.remove()
  }
}

export const BlockHandle = Extension.create({
  name: "blockHandle",
  addProseMirrorPlugins() {
    const editor = this.editor
    return [
      new Plugin({
        key: new PluginKey("blockHandle"),
        view: (view) => new BlockHandleView(view, editor),
      }),
    ]
  },
})
