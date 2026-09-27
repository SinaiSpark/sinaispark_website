/**
 * Editors paste video links the way they copy them from the browser or the
 * share button. This turns those into the player address to embed, plus a
 * thumbnail where the host offers one without an API call.
 *
 * YouTube plays from youtube-nocookie.com, which sets no cookies until the
 * visitor presses play. Anything unrecognised returns null and is shown as a
 * plain link instead.
 */
export interface VideoEmbed {
  provider: "youtube" | "vimeo"
  embedUrl: string
  thumbnail: string | null
}

const YOUTUBE_ID = /^[\w-]{11}$/

function youtubeId(url: URL) {
  const host = url.hostname.replace(/^(www\.|m\.)/, "")
  if (host === "youtu.be") return url.pathname.slice(1).split("/")[0]
  if (host !== "youtube.com" && host !== "youtube-nocookie.com") return null
  if (url.pathname === "/watch") return url.searchParams.get("v")
  const [, kind, id] = url.pathname.split("/")
  return kind === "embed" || kind === "shorts" || kind === "live" ? id : null
}

function vimeoId(url: URL) {
  const host = url.hostname.replace(/^www\./, "")
  if (host !== "vimeo.com" && host !== "player.vimeo.com") return null
  const id = url.pathname.split("/").find((segment) => /^\d+$/.test(segment))
  return id ?? null
}

export function toVideoEmbed(
  link: string | null | undefined
): VideoEmbed | null {
  if (!link) return null
  let url: URL
  try {
    url = new URL(link.trim())
  } catch {
    return null
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null

  const yt = youtubeId(url)
  if (yt && YOUTUBE_ID.test(yt)) {
    return {
      provider: "youtube",
      embedUrl: `https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0`,
      // The sharpest still; not every video has one (see VideoTile).
      thumbnail: `https://i.ytimg.com/vi/${yt}/maxresdefault.jpg`,
    }
  }

  const vimeo = vimeoId(url)
  if (vimeo) {
    return {
      provider: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeo}?autoplay=1`,
      thumbnail: null,
    }
  }

  return null
}
