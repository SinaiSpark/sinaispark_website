import { useState } from "react"
import { NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react"
import { Pencil, Trash } from "@strapi/icons"

import { useRichText } from "../context"
import { displayUrl } from "../html"
import type { ImageAttrs, ImageLayout } from "../nodes"

const LAYOUTS: { id: ImageLayout; label: string; hint: string }[] = [
  { id: "block", label: "Full width", hint: "Across the whole column" },
  { id: "side", label: "Wrap text", hint: "Right, with text flowing around" },
  { id: "left", label: "Left", hint: "Narrower, on the left" },
  { id: "right", label: "Right", hint: "Narrower, on the right" },
]

/** An image block: picture, caption underneath, tools while selected. */
export const ImageView = ({
  node,
  selected,
  editor,
  updateAttributes,
  deleteNode,
}: ReactNodeViewProps) => {
  const { pickImage } = useRichText()
  const attrs = node.attrs as ImageAttrs
  const [altOpen, setAltOpen] = useState(false)
  const editable = editor.isEditable

  return (
    <NodeViewWrapper
      className={`ss-rt-image ss-rt-image--${attrs.layout}${selected ? " is-selected" : ""}`}
      data-layout={attrs.layout}
    >
      {selected && editable && (
        <div className="ss-rt-float" contentEditable={false}>
          <div className="ss-rt-seg" role="group" aria-label="Placement">
            {LAYOUTS.map((layout) => (
              <button
                key={layout.id}
                type="button"
                title={layout.hint}
                aria-pressed={attrs.layout === layout.id}
                onClick={() => updateAttributes({ layout: layout.id })}
              >
                {layout.label}
              </button>
            ))}
          </div>
          <span className="ss-rt-float-sep" />
          <button
            type="button"
            className={attrs.alt ? "" : "is-warn"}
            aria-pressed={altOpen}
            onClick={() => setAltOpen((open) => !open)}
          >
            Alt text
          </button>
          <button
            type="button"
            title="Replace image"
            onClick={() =>
              pickImage((picked) =>
                updateAttributes({ ...picked, caption: attrs.caption })
              )
            }
          >
            <Pencil /> Replace
          </button>
          <button
            type="button"
            className="is-danger"
            title="Remove image"
            onClick={deleteNode}
          >
            <Trash />
          </button>
        </div>
      )}

      <div className="ss-rt-image-frame" data-drag-handle>
        {attrs.src ? (
          <img src={displayUrl(attrs.src)} alt={attrs.alt} draggable={false} />
        ) : (
          <div className="ss-rt-empty">Image missing</div>
        )}
        {!attrs.alt && editable && (
          <span
            className="ss-rt-badge"
            title="Describe the image for screen readers and Google"
          >
            No alt text
          </span>
        )}
      </div>

      {selected && editable && altOpen && (
        <label className="ss-rt-field" contentEditable={false}>
          <span>Alt text</span>
          <input
            autoFocus
            value={attrs.alt}
            placeholder="What the image shows, for screen readers and Google"
            onChange={(e) => updateAttributes({ alt: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && setAltOpen(false)}
          />
        </label>
      )}

      {(attrs.caption || (selected && editable)) && (
        <input
          className="ss-rt-caption"
          value={attrs.caption}
          readOnly={!editable}
          placeholder="Add a caption (optional)"
          onChange={(e) => updateAttributes({ caption: e.target.value })}
        />
      )}
    </NodeViewWrapper>
  )
}
