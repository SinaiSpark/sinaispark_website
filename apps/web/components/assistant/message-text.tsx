import { Fragment } from "react"

/**
 * The little formatting the assistant's answers use: paragraphs, "- "
 * bullets, "1. " steps and **bold**. Written answers from the CMS and
 * generated ones share it. Built as React nodes, never as HTML, so nothing a
 * model writes can inject markup.
 */

function inline(text: string) {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .map((part, i) =>
      part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
        <strong key={i}>{part.slice(2, -2)}</strong>
      ) : (
        <Fragment key={i}>{part}</Fragment>
      )
    )
}

type Block =
  | { kind: "p"; lines: string[] }
  | { kind: "ul" | "ol"; items: string[] }

function blocks(text: string): Block[] {
  const out: Block[] = []
  for (const raw of text.replace(/\r/g, "").split("\n")) {
    const line = raw.trim()
    const last = out[out.length - 1]
    if (!line) {
      out.push({ kind: "p", lines: [] })
      continue
    }
    const bullet = line.match(/^[-*•]\s+(.*)$/)
    const step = line.match(/^\d+[.)]\s+(.*)$/)
    if (bullet || step) {
      const kind = bullet ? "ul" : "ol"
      const item = (bullet ?? step)![1]!
      if (last?.kind === kind) last.items.push(item)
      else out.push({ kind, items: [item] })
      continue
    }
    if (last?.kind === "p") last.lines.push(line)
    else out.push({ kind: "p", lines: [line] })
  }
  return out.filter((b) => (b.kind === "p" ? b.lines.length : b.items.length))
}

export function MessageText({ text }: { text: string }) {
  return (
    <>
      {blocks(text).map((block, i) => {
        if (block.kind === "p") {
          return <p key={i}>{inline(block.lines.join(" "))}</p>
        }
        const List = block.kind
        return (
          <List key={i}>
            {block.items.map((item, j) => (
              <li key={j}>{inline(item)}</li>
            ))}
          </List>
        )
      })}
    </>
  )
}
