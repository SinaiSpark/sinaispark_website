/**
 * The HTML the editor stores. The website cleans every body with
 * apps/web/lib/article-html.ts and styles it with .ar-rich, both written
 * around a small set of shapes:
 *
 *   <figure class="image [image-style-side]"><img><figcaption></figure>
 *   <figure class="table"><table><thead>...</thead><tbody>...</tbody></table><figcaption></figure>
 *   <figure class="media"><div><iframe src="youtube/vimeo"></iframe></div></figure>
 *
 * Tiptap's own table output differs (header row inside tbody, a colgroup of
 * editor widths, cells wrapped in <p>), so it is normalised here on save.
 */

const backendUrl = () =>
  (window as unknown as { strapi?: { backendURL?: string } }).strapi
    ?.backendURL ?? ""

/** Upload URLs are stored relative so the same body works on any host. */
export function storedUrl(url: string) {
  const backend = backendUrl()
  return backend && url.startsWith(backend) ? url.slice(backend.length) : url
}

/** ...and shown in the editor from the CMS. */
export function displayUrl(url: string) {
  return url.startsWith("/") ? `${backendUrl()}${url}` : url
}

export function toStoredHtml(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html")

  for (const table of Array.from(doc.querySelectorAll("table"))) {
    table.removeAttribute("style")
    table.querySelectorAll("colgroup").forEach((el) => el.remove())

    const tbody = table.querySelector(":scope > tbody")
    const first = tbody?.querySelector(":scope > tr")
    const cells = first ? Array.from(first.children) : []
    if (
      tbody &&
      first &&
      cells.length &&
      cells.every((cell) => cell.tagName === "TH") &&
      !table.querySelector(":scope > thead")
    ) {
      const thead = doc.createElement("thead")
      thead.appendChild(first)
      table.insertBefore(thead, tbody)
      cells.forEach((cell) => cell.setAttribute("scope", "col"))
    }

    for (const cell of Array.from(table.querySelectorAll("th, td"))) {
      for (const attr of ["colspan", "rowspan"]) {
        if (cell.getAttribute(attr) === "1") cell.removeAttribute(attr)
      }
      cell.removeAttribute("colwidth")
      cell.removeAttribute("style")
      // One plain paragraph per cell is just the cell's text.
      const only = cell.children.length === 1 ? cell.children[0] : null
      if (
        only?.tagName === "P" &&
        !only.attributes.length &&
        cell.childNodes.length === 1
      ) {
        only.replaceWith(...Array.from(only.childNodes))
      }
    }
  }

  // Tiptap wraps list items in <p>; one plain paragraph is just the item.
  for (const li of Array.from(doc.querySelectorAll("li"))) {
    const only = li.firstElementChild
    if (
      only?.tagName === "P" &&
      !only.attributes.length &&
      only === li.lastElementChild &&
      li.childNodes.length === 1
    ) {
      only.replaceWith(...Array.from(only.childNodes))
    }
  }

  // Trailing empty paragraphs are the editor's cursor room, not content.
  const body = doc.body
  while (
    body.lastElementChild?.tagName === "P" &&
    !body.lastElementChild.textContent?.trim() &&
    !body.lastElementChild.querySelector("img, iframe")
  ) {
    body.lastElementChild.remove()
  }

  return body.innerHTML
}

/** A YouTube or Vimeo page link as its embeddable player URL, else null. */
export function toEmbedUrl(input: string | null | undefined) {
  if (!input) return null
  let url: URL
  try {
    url = new URL(input.trim())
  } catch {
    return null
  }
  const host = url.hostname.replace(/^(www\.|m\.)/, "")

  if (host === "youtu.be") return youtube(url.pathname.slice(1))
  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    const v = url.searchParams.get("v")
    if (v) return youtube(v)
    const match = url.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]+)/)
    return match ? youtube(match[1]) : null
  }
  if (host === "vimeo.com") {
    const match = url.pathname.match(/^\/(\d+)/)
    return match ? `https://player.vimeo.com/video/${match[1]}` : null
  }
  if (host === "player.vimeo.com") {
    const match = url.pathname.match(/^\/video\/(\d+)/)
    return match ? `https://player.vimeo.com/video/${match[1]}` : null
  }
  return null
}

function youtube(id: string) {
  return /^[\w-]{6,}$/.test(id)
    ? `https://www.youtube-nocookie.com/embed/${id}`
    : null
}
