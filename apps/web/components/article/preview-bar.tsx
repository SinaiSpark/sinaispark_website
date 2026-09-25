/**
 * Shown on every page while an editor is previewing drafts (Next.js draft
 * mode), so an unpublished version is never mistaken for the live one.
 */
export function PreviewBar({ path, note }: { path: string; note?: string }) {
  const exit = `/api/preview/exit/?path=${encodeURIComponent(path)}`
  return (
    <div className="ar-previewbar" role="status">
      <b>Preview</b>
      <span>
        You are seeing the latest draft, not the published page.
        {note ? ` ${note}` : ""}
      </span>
      {/* A plain link: leaving draft mode needs a full request. */}
      <a href={exit}>Exit preview</a>
    </div>
  )
}
