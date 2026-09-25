import { beforeAll, describe, expect, it } from "vitest"

import { cleanArticleHtml, previewHtml } from "@/lib/article-html"

/**
 * Seam: lib/article-html
 * Behavior spec: article HTML from the CMS keeps everything the editor can
 * make (headings, lists, tables, images, captions, video, alignment) and
 * loses anything that could run code or restyle the site. Gated previews cut
 * at whole top-level blocks.
 */
describe("article html", () => {
  beforeAll(() => {
    process.env.CMS_PUBLIC_URL = "https://cms.example.com"
  })

  it("keeps the editor's structure", () => {
    const html =
      '<h2>Fees</h2><p style="text-align:center">Centred</p><ul><li>One</li></ul>' +
      '<figure class="table"><table><thead><tr><th scope="col">Item</th></tr></thead>' +
      '<tbody><tr><td colspan="2">Row</td></tr></tbody></table><figcaption>Cap</figcaption></figure>' +
      "<blockquote><p>Quote</p></blockquote><hr>"
    const clean = cleanArticleHtml(html)
    expect(clean).toContain("<h2>Fees</h2>")
    expect(clean).toContain('style="text-align:center"')
    expect(clean).toContain('<figure class="table">')
    expect(clean).toContain('<td colspan="2">')
    expect(clean).toContain("<figcaption>Cap</figcaption>")
    expect(clean).toContain("<blockquote>")
  })

  it("strips scripts, handlers, javascript: links and stray styles", () => {
    const clean = cleanArticleHtml(
      '<p onclick="x()">Hi<script>alert(1)</script></p>' +
        '<a href="javascript:alert(1)">bad</a>' +
        '<img src="/uploads/a.webp" onerror="alert(1)">' +
        '<p style="color:red;text-align:right">Styled</p><h1>Title</h1>'
    )
    expect(clean).not.toMatch(
      /script|onclick|onerror|javascript:|color:red|<h1/
    )
    expect(clean).toContain('style="text-align:right"')
  })

  it("points relative images, and every srcset size, at the CMS", () => {
    const clean = cleanArticleHtml(
      '<figure class="image"><img src="/uploads/a.webp" srcset="/uploads/small_a.webp 500w, /uploads/a.webp 1200w" alt="A"></figure>'
    )
    expect(clean).toContain('src="https://cms.example.com/uploads/a.webp"')
    expect(clean).toContain(
      'srcset="https://cms.example.com/uploads/small_a.webp 500w, https://cms.example.com/uploads/a.webp 1200w"'
    )
    expect(clean).toContain('loading="lazy"')
  })

  it("allows YouTube and Vimeo players only", () => {
    const clean = cleanArticleHtml(
      '<figure class="media"><iframe src="https://www.youtube.com/embed/abc"></iframe></figure>' +
        '<iframe src="https://evil.example.com/x"></iframe>'
    )
    expect(clean).toContain('src="https://www.youtube.com/embed/abc"')
    expect(clean).not.toContain("evil.example.com")
  })

  it("marks external links noopener", () => {
    const clean = cleanArticleHtml(
      '<a href="https://misa.gov.sa" target="_blank">MISA</a>'
    )
    expect(clean).toContain('rel="noopener noreferrer"')
  })

  it("keeps what the admin's article editor stores", () => {
    // Verbatim shapes from apps/cms/src/admin/rich-text (saved HTML).
    const clean = cleanArticleHtml(
      '<p style="text-align: center">Centred</p>' +
        '<figure class="image image-style-side"><img src="/uploads/a.webp" alt="A" width="1200" height="896" srcset="/uploads/small_a.webp 500w, /uploads/a.webp 1200w"><figcaption>Cap</figcaption></figure>' +
        '<figure class="media"><div><iframe src="https://www.youtube-nocookie.com/embed/abc123" title="Video" allow="encrypted-media" allowfullscreen="true"></iframe></div></figure>' +
        '<figure class="table"><table><thead><tr><th scope="col">Item</th></tr></thead><tbody><tr><td>Row</td></tr></tbody></table><figcaption>Table cap</figcaption></figure>' +
        '<ul><li>One</li></ul><p><a href="https://misa.gov.sa" target="_blank">MISA</a> and <a href="/services/">services</a></p>'
    )
    expect(clean).toMatch(/style="text-align: ?center"/)
    expect(clean).toContain('<figure class="image image-style-side">')
    expect(clean).toContain("<figcaption>Cap</figcaption>")
    expect(clean).toContain(
      'src="https://www.youtube-nocookie.com/embed/abc123"'
    )
    expect(clean).toContain('<th scope="col">Item</th>')
    expect(clean).toContain("<figcaption>Table cap</figcaption>")
    expect(clean).toContain('rel="noopener noreferrer"')
    expect(clean).toContain('href="/services/"')
  })

  it("cuts a gated preview at whole top-level blocks", () => {
    const clean = cleanArticleHtml(
      "<p>One</p><h2>Two</h2><ul><li>Three</li></ul><p>Four</p>"
    )
    const preview = previewHtml(clean, 3)
    expect(preview).toContain("Three")
    expect(preview).not.toContain("Four")
  })
})
