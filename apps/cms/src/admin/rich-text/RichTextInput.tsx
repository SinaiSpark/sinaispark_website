import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react"
import { Field, Flex } from "@strapi/design-system"
import { Collapse, Expand, Plus } from "@strapi/icons"
import { useFetchClient, useField, useStrapiApp } from "@strapi/strapi/admin"
import { EditorContent, useEditor, useEditorState } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Subscript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import TextAlign from "@tiptap/extension-text-align"
import { TableCell, TableHeader, TableRow } from "@tiptap/extension-table"
import { CharacterCount, Placeholder } from "@tiptap/extensions"
import { useTheme } from "styled-components"

import { openBlockMenu } from "./blocks"
import { assetToImage, EditorContext, type RichTextContext } from "./context"
import { BlockHandle, SlashCommand } from "./extensions"
import { toStoredHtml } from "./html"
import { Redo, Undo } from "./icons"
import { Btn, TableMenu, TextMenu } from "./Menus"
import { CaptionedTable, FigureImage, Video, type ImageAttrs } from "./nodes"
import { useEditorStyles } from "./styles"

type Props = {
  name: string
  label: ReactNode
  hint?: ReactNode
  required?: boolean
  disabled?: boolean
  labelAction?: ReactNode
}

type Asset = Parameters<typeof assetToImage>[0]
type MediaLibraryDialogProps = {
  allowedTypes?: string[]
  multiple?: boolean
  onClose: () => void
  onSelectAssets: (assets: Asset[]) => void
}

const WORDS_PER_MINUTE = 220

const imageFiles = (files?: FileList | null) =>
  Array.from(files ?? []).filter((file) =>
    /^image\/(jpeg|png|webp|gif|avif)$/.test(file.type)
  )

/**
 * The article editor: a clean page in the site's typography. "/" or the "+"
 * beside a block adds headings, lists, images, tables and video; selecting
 * text shows its formatting; blocks drag to reorder. Stores HTML the website
 * already knows how to show (see ./html.ts).
 */
export const RichTextInput = forwardRef<HTMLDivElement, Props>(
  ({ name, label, hint, required, disabled, labelAction }, ref) => {
    useEditorStyles()
    const theme = useTheme() as unknown as { colors: Record<string, string> }
    const field = useField<string>(name)
    const { post } = useFetchClient()
    const components = useStrapiApp("RichText", (state) => state.components)
    const MediaLibraryDialog = components[
      "media-library"
    ] as unknown as ComponentType<MediaLibraryDialogProps>

    const [picker, setPicker] = useState<
      ((attrs: Partial<ImageAttrs>) => void) | null
    >(null)
    const [focusMode, setFocusMode] = useState(false)
    const [source, setSource] = useState<string | null>(null)
    const [uploading, setUploading] = useState(0)
    const [uploadError, setUploadError] = useState<string | null>(null)

    const context = useMemo<RichTextContext>(
      () => ({ pickImage: (onPick) => setPicker(() => onPick) }),
      []
    )
    const contextRef = useRef(context)
    const emitted = useRef<string>(field.value ?? "")
    const onChange = useRef(field.onChange)
    onChange.current = field.onChange
    const emit = (html: string) => {
      if (html === emitted.current) return
      emitted.current = html
      onChange.current(name, html)
    }

    const upload = useCallback(
      async (files: File[]) => {
        const form = new FormData()
        files.forEach((file) => form.append("files", file))
        setUploading((n) => n + files.length)
        setUploadError(null)
        try {
          const { data } = await post<Asset[]>("/upload", form)
          return data.map(assetToImage)
        } catch {
          setUploadError(
            "The image couldn't be uploaded. Try the media library."
          )
          return []
        } finally {
          setUploading((n) => n - files.length)
        }
      },
      [post]
    )
    const uploadRef = useRef(upload)
    uploadRef.current = upload

    const editor = useEditor({
      immediatelyRender: true,
      shouldRerenderOnTransaction: false,
      editable: !disabled,
      content: field.value || "",
      extensions: [
        StarterKit.configure({
          heading: { levels: [2, 3, 4] },
          codeBlock: false,
          link: {
            openOnClick: false,
            autolink: true,
            defaultProtocol: "https",
            HTMLAttributes: { target: null, rel: null },
          },
          dropcursor: { width: 2, class: "ss-rt-dropcursor" },
        }),
        Subscript,
        Superscript,
        TextAlign.configure({
          types: ["heading", "paragraph"],
          alignments: ["left", "center", "right"],
        }),
        CaptionedTable.configure({ resizable: false }),
        TableRow,
        TableHeader,
        TableCell,
        FigureImage,
        Video,
        Placeholder.configure({
          placeholder: ({ node, editor: e }) => {
            if (node.type.name === "heading") return "Heading"
            return e.isEmpty
              ? "Start writing, or press '/' to add a heading, image, table or video…"
              : "Press '/' for blocks"
          },
        }),
        CharacterCount,
        SlashCommand.configure({ getContext: () => contextRef.current }),
        BlockHandle,
      ],
      editorProps: {
        attributes: { class: "ss-rt-prose", spellcheck: "true" },
        handlePaste: (view, event) => {
          const files = imageFiles(event.clipboardData?.files)
          if (!files.length) return false
          const at = view.state.selection.from
          uploadRef.current(files).then((images) =>
            editorRef.current
              ?.chain()
              .insertContentAt(
                at,
                images.map((attrs) => ({ type: "figureImage", attrs }))
              )
              .run()
          )
          return true
        },
        handleDrop: (view, event, _slice, moved) => {
          if (moved) return false
          const files = imageFiles(event.dataTransfer?.files)
          if (!files.length) return false
          event.preventDefault()
          const at =
            view.posAtCoords({ left: event.clientX, top: event.clientY })
              ?.pos ?? view.state.selection.from
          uploadRef.current(files).then((images) =>
            editorRef.current
              ?.chain()
              .insertContentAt(
                at,
                images.map((attrs) => ({ type: "figureImage", attrs }))
              )
              .run()
          )
          return true
        },
      },
      onUpdate: ({ editor: e }) =>
        emit(e.isEmpty ? "" : toStoredHtml(e.getHTML())),
    })
    const editorRef = useRef(editor)
    editorRef.current = editor

    // A value changed from outside (discard changes, history, locale).
    useEffect(() => {
      const value = field.value ?? ""
      if (!editor || value === emitted.current) return
      emitted.current = value
      editor.commands.setContent(value, { emitUpdate: false })
    }, [editor, field.value])

    useEffect(() => {
      editor?.setEditable(!disabled)
    }, [editor, disabled])

    useEffect(() => {
      if (!focusMode) return
      const onKey = (e: KeyboardEvent) =>
        e.key === "Escape" && setFocusMode(false)
      document.addEventListener("keydown", onKey)
      document.body.style.overflow = "hidden"
      return () => {
        document.removeEventListener("keydown", onKey)
        document.body.style.overflow = ""
      }
    }, [focusMode])

    const stats = useEditorState({
      editor,
      selector: ({ editor: e }) => ({
        words: e?.storage.characterCount.words() ?? 0,
        canUndo: e?.can().undo() ?? false,
        canRedo: e?.can().redo() ?? false,
      }),
    })

    const toggleSource = () => {
      if (!editor) return
      if (source === null) {
        setSource(toStoredHtml(editor.getHTML()))
      } else {
        editor.commands.setContent(source, { emitUpdate: true })
        setSource(null)
      }
    }

    // On the root: the "/" menu and bubbles render outside the field.
    useEffect(() => {
      const c = theme.colors
      const vars: Record<string, string> = {
        "--rt-bg": c.neutral0,
        "--rt-surface": c.neutral100,
        "--rt-line": c.neutral200,
        "--rt-line-strong": c.neutral300,
        "--rt-text": c.neutral800,
        "--rt-muted": c.neutral600,
        "--rt-subtle": c.neutral500,
        "--rt-primary": c.primary600,
        "--rt-primary-strong": c.primary700,
        "--rt-primary-soft": c.primary100,
        "--rt-danger": c.danger600,
        "--rt-warn": c.warning600,
        "--rt-warn-soft": c.warning100,
      }
      const root = document.documentElement.style
      Object.entries(vars).forEach(([key, value]) =>
        root.setProperty(key, value)
      )
    }, [theme])

    const minutes = Math.max(1, Math.round(stats.words / WORDS_PER_MINUTE))

    return (
      <Field.Root
        id={name}
        name={name}
        error={field.error}
        hint={hint}
        required={required}
      >
        <Flex direction="column" alignItems="stretch" gap={1}>
          <Field.Label action={labelAction}>{label}</Field.Label>
          <EditorContext.Provider value={context}>
            <div
              ref={ref}
              className={`ss-rt${focusMode ? " is-focus" : ""}${disabled ? " is-disabled" : ""}${field.error ? " has-error" : ""}`}
            >
              <div className="ss-rt-bar">
                <button
                  type="button"
                  className="ss-rt-insert"
                  disabled={disabled || source !== null}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor && openBlockMenu(editor)}
                >
                  <Plus /> Insert
                </button>
                <span className="ss-rt-sep" />
                <Btn
                  label="Undo (Ctrl+Z)"
                  disabled={!stats.canUndo}
                  onClick={() => editor?.chain().focus().undo().run()}
                >
                  <Undo />
                </Btn>
                <Btn
                  label="Redo (Ctrl+Shift+Z)"
                  disabled={!stats.canRedo}
                  onClick={() => editor?.chain().focus().redo().run()}
                >
                  <Redo />
                </Btn>
                <span className="ss-rt-status" aria-live="polite">
                  {uploading > 0
                    ? `Uploading ${uploading} image${uploading > 1 ? "s" : ""}…`
                    : uploadError}
                </span>
                <span className="ss-rt-count">
                  {stats.words.toLocaleString()} words · {minutes} min read
                </span>
                <button
                  type="button"
                  className="ss-rt-chip"
                  aria-pressed={source !== null}
                  title="Edit the HTML directly"
                  onClick={toggleSource}
                >
                  {source === null ? "HTML" : "Back to editor"}
                </button>
                <Btn
                  label={focusMode ? "Exit focus mode (Esc)" : "Focus mode"}
                  onClick={() => setFocusMode((on) => !on)}
                >
                  {focusMode ? <Collapse /> : <Expand />}
                </Btn>
              </div>

              <div className="ss-rt-scroll">
                {source !== null ? (
                  <textarea
                    className="ss-rt-source"
                    value={source}
                    spellCheck={false}
                    onChange={(e) => {
                      setSource(e.target.value)
                      emit(e.target.value)
                    }}
                  />
                ) : (
                  <EditorContent editor={editor} className="ss-rt-content" />
                )}
              </div>

              {editor && source === null && (
                <>
                  <TextMenu editor={editor} />
                  <TableMenu editor={editor} />
                </>
              )}
            </div>
          </EditorContext.Provider>
          <Field.Hint />
          <Field.Error />
        </Flex>

        {picker && MediaLibraryDialog && (
          <MediaLibraryDialog
            allowedTypes={["images"]}
            multiple={false}
            onClose={() => setPicker(null)}
            onSelectAssets={(assets) => {
              const [asset] = assets
              if (asset) picker(assetToImage(asset))
              setPicker(null)
            }}
          />
        )}
      </Field.Root>
    )
  }
)

export default RichTextInput
