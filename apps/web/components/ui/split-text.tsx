import { Fragment } from "react"

/**
 * Word-mask heading.
 *
 * The design split headings on the client by rewriting innerHTML. Here the
 * `.w` / `.wi` spans are rendered on the server instead, so the markup GSAP
 * animates is the markup React produced — no rewrite, no flash of unsplit text.
 *
 * The space between words sits *between* the `.w` spans, never inside one:
 * `.w` is `overflow:hidden`, so a trailing space within it would be clipped and
 * the words would run together.
 *
 * `data-split` is what the motion code selects on.
 */
export function SplitText({
  as: Tag = "h2",
  text,
  className,
  ...rest
}: {
  as?: "h1" | "h2" | "h3" | "p"
  text: string
  className?: string
} & React.HTMLAttributes<HTMLElement>) {
  const words = text.trim().split(/\s+/)
  return (
    <Tag className={className} data-split {...rest}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="w">
            <span className="wi">{word}</span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  )
}
