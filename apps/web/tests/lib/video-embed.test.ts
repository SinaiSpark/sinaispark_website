import { describe, expect, it } from "vitest"

import { toVideoEmbed } from "@/lib/video-embed"

const PLAYER =
  "https://www.youtube-nocookie.com/embed/iHB7AtpOnZk?autoplay=1&rel=0"

describe("toVideoEmbed", () => {
  it.each([
    "https://www.youtube.com/watch?v=iHB7AtpOnZk",
    "https://youtube.com/watch?v=iHB7AtpOnZk&t=42s",
    "https://m.youtube.com/watch?v=iHB7AtpOnZk",
    "https://youtu.be/iHB7AtpOnZk?si=abc",
    "https://www.youtube.com/shorts/iHB7AtpOnZk",
    "https://www.youtube.com/embed/iHB7AtpOnZk",
    "https://www.youtube.com/live/iHB7AtpOnZk",
  ])("plays %s from youtube-nocookie", (link) => {
    expect(toVideoEmbed(link)).toEqual({
      provider: "youtube",
      embedUrl: PLAYER,
      thumbnail: "https://i.ytimg.com/vi/iHB7AtpOnZk/maxresdefault.jpg",
    })
  })

  it.each([
    "https://vimeo.com/76979871",
    "https://player.vimeo.com/video/76979871",
  ])("plays %s from Vimeo's player", (link) => {
    expect(toVideoEmbed(link)).toEqual({
      provider: "vimeo",
      embedUrl: "https://player.vimeo.com/video/76979871?autoplay=1",
      thumbnail: null,
    })
  })

  it.each([
    null,
    "",
    "not a url",
    "javascript:alert(1)",
    "https://www.youtube.com/watch?v=short",
    "https://example.com/video.mp4",
    "https://www.linkedin.com/posts/some-post",
  ])("returns null for %s", (link) => {
    expect(toVideoEmbed(link)).toBeNull()
  })
})
