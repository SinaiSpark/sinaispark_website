import { useState } from "react"
import { NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react"
import { Pencil, Play, Trash } from "@strapi/icons"

import { toEmbedUrl } from "../html"

/** A YouTube or Vimeo player; starts as a box to paste the link into. */
export const VideoView = ({
  node,
  selected,
  editor,
  updateAttributes,
  deleteNode,
}: ReactNodeViewProps) => {
  const src = node.attrs.src as string | null
  const [editing, setEditing] = useState(!src)
  const [link, setLink] = useState("")
  const [invalid, setInvalid] = useState(false)
  const editable = editor.isEditable

  const apply = () => {
    const embed = toEmbedUrl(link)
    if (!embed) return setInvalid(true)
    updateAttributes({ src: embed })
    setEditing(false)
    setLink("")
    setInvalid(false)
  }

  if (!src || (editing && editable)) {
    return (
      <NodeViewWrapper
        className={`ss-rt-video-input${selected ? " is-selected" : ""}`}
      >
        <div contentEditable={false}>
          <span className="ss-rt-video-icon">
            <Play />
          </span>
          <input
            autoFocus
            value={link}
            placeholder="Paste a YouTube or Vimeo link, then press Enter"
            onChange={(e) => {
              setLink(e.target.value)
              setInvalid(false)
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                apply()
              }
              if (e.key === "Escape" && src) setEditing(false)
            }}
          />
          <button type="button" className="is-primary" onClick={apply}>
            Embed
          </button>
          <button
            type="button"
            title={src ? "Cancel" : "Remove"}
            onClick={() => (src ? setEditing(false) : deleteNode())}
          >
            {src ? "Cancel" : <Trash />}
          </button>
        </div>
        {invalid && (
          <p className="ss-rt-error">
            That isn't a YouTube or Vimeo video link.
          </p>
        )}
      </NodeViewWrapper>
    )
  }

  return (
    <NodeViewWrapper className={`ss-rt-video${selected ? " is-selected" : ""}`}>
      {selected && editable && (
        <div className="ss-rt-float" contentEditable={false}>
          <button type="button" onClick={() => setEditing(true)}>
            <Pencil /> Change video
          </button>
          <button
            type="button"
            className="is-danger"
            title="Remove video"
            onClick={deleteNode}
          >
            <Trash />
          </button>
        </div>
      )}
      <div className="ss-rt-video-frame" data-drag-handle>
        {/* The admin sends no referrer, and YouTube won't play without one. */}
        <iframe
          src={src}
          title="Video"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
        {/* Clicks select the block instead of starting the video. */}
        {!selected && <div className="ss-rt-video-shield" />}
      </div>
    </NodeViewWrapper>
  )
}
