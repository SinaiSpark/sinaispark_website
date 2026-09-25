import { redirect } from "next/navigation"

import { endPreview } from "@/lib/preview"

/** "Exit preview" in the preview bar: back to the published page. */
export async function GET(request: Request) {
  const path = new URL(request.url).searchParams.get("path") ?? "/"
  await endPreview()
  redirect(/^\/(?!\/)[\w\-/]*$/.test(path) ? path : "/")
}
