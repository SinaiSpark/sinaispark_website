import { useEffect, useState } from "react"
import { Box, Flex, Typography } from "@strapi/design-system"
import { useFetchClient } from "@strapi/strapi/admin"

const TYPES = [
  { uid: "api::blog-post.blog-post", label: "Blog" },
  { uid: "api::research-article.research-article", label: "Research" },
  { uid: "api::event.event", label: "Events" },
] as const

type Item = {
  uid: string
  label: string
  documentId: string
  title: string
  publishAt: string
}

const when = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
})

/**
 * Drafts waiting on their "Publish at" time, soonest first. A time that has
 * already passed means the automatic publish failed, almost always because a
 * required field is empty, so those are flagged.
 */
export const ScheduledWidget = () => {
  const { get } = useFetchClient()
  const [items, setItems] = useState<Item[] | null>(null)

  useEffect(() => {
    let live = true
    const query =
      "page=1&pageSize=10&sort=publishAt:ASC&hasPublishedVersion=false" +
      "&filters[$and][0][publishAt][$notNull]=true"
    Promise.all(
      TYPES.map(({ uid, label }) =>
        get<{ results: Omit<Item, "uid" | "label">[] }>(
          `/content-manager/collection-types/${uid}?${query}`
        )
          .then((res) => res.data.results.map((r) => ({ ...r, uid, label })))
          .catch(() => [] as Item[])
      )
    ).then((lists) => {
      if (!live) return
      setItems(
        lists
          .flat()
          .sort((a, b) => a.publishAt.localeCompare(b.publishAt))
          .slice(0, 8)
      )
    })
    return () => {
      live = false
    }
  }, [get])

  if (!items) return null
  if (!items.length) {
    return (
      <Typography variant="omega" textColor="neutral600">
        Nothing scheduled. Set “Publish at” on a draft to publish it
        automatically.
      </Typography>
    )
  }

  const now = new Date().toISOString()
  return (
    <Flex direction="column" alignItems="stretch" gap={2}>
      {items.map((item) => {
        const overdue = item.publishAt <= now
        return (
          <Box
            key={item.documentId}
            tag="a"
            href={`/admin/content-manager/collection-types/${item.uid}/${item.documentId}`}
            padding={3}
            hasRadius
            background="neutral100"
            style={{ textDecoration: "none" }}
          >
            <Flex justifyContent="space-between" gap={3}>
              <Typography variant="omega" fontWeight="bold" ellipsis>
                {item.title}
              </Typography>
              <Typography
                variant="pi"
                textColor={overdue ? "danger600" : "primary600"}
                style={{ whiteSpace: "nowrap" }}
              >
                {overdue
                  ? "Overdue: check required fields"
                  : when.format(new Date(item.publishAt))}
              </Typography>
            </Flex>
            <Typography variant="pi" textColor="neutral600">
              {item.label}
            </Typography>
          </Box>
        )
      })}
    </Flex>
  )
}

export default ScheduledWidget
