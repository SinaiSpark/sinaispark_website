import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ArticleShell } from "@/components/article/article-shell"
import { PreviewBar } from "@/components/article/preview-bar"
import { PostCard } from "@/components/company/blog-sections"
import { BLOG } from "@/content/blog"
import { ROUTES } from "@/content/site"
import { cleanArticleHtml } from "@/lib/article-html"
import { getPost, getPosts } from "@/lib/content-api"
import { isPreviewing } from "@/lib/preview"
import { toMetadata } from "@/lib/seo"
import { getSeoSettings } from "@/lib/settings"
import { SITE } from "@/lib/site-config"

type Params = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const draft = await isPreviewing(ROUTES.blogPost(slug))
  const [post, settings] = await Promise.all([
    getPost(slug, { draft }),
    getSeoSettings(),
  ])
  if (!post) return {}
  return toMetadata(
    post.seo,
    {
      title: post.title,
      description: post.excerpt,
      path: post.href,
      image: post.image,
      type: "article",
      publishedTime: post.isoDate,
    },
    settings
  )
}

/** A blog post, with three more from the blog after it. */
export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params
  const draft = await isPreviewing(ROUTES.blogPost(slug))

  const [post, posts] = await Promise.all([
    getPost(slug, { draft }),
    getPosts(),
  ])
  if (!post) notFound()

  const copy = BLOG.article
  const more = posts.filter((p) => p.slug !== slug).slice(0, 3)

  return (
    <ArticleShell
      image={post.image}
      crumbs={[
        { label: "Home", href: ROUTES.home },
        { label: BLOG.hero.crumb, href: ROUTES.blog },
        { label: post.format },
      ]}
      title={post.title}
      lede={post.excerpt}
      facts={[
        { label: "Published", value: post.date, dateTime: post.isoDate },
        { label: "Format", value: post.format },
        { label: "Market", value: post.market },
        { label: "Reading time", value: post.readTime },
      ]}
      back={{ label: copy.back, href: ROUTES.blog }}
      cta={{ headline: copy.ctaHeadline, body: copy.ctaBody, ...copy.cta }}
      preview={draft ? <PreviewBar path={post.href} /> : null}
      jsonLd={[
        {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.isoDate,
          image: post.image,
          url: `${SITE.url}${post.href}`,
          publisher: { "@type": "Organization", name: SITE.name },
        },
        post.seo?.structuredData,
      ]}
      after={
        more.length ? (
          <section className="ar-more" data-surface="light">
            <div className="wrap">
              <p className="eyebrow">{copy.more}</p>
              <div className="bl-grid">
                {more.map((p) => (
                  <PostCard post={p} key={p.id} />
                ))}
              </div>
            </div>
          </section>
        ) : null
      }
    >
      <div
        className="ar-rich"
        dangerouslySetInnerHTML={{ __html: cleanArticleHtml(post.body) }}
      />
    </ArticleShell>
  )
}
