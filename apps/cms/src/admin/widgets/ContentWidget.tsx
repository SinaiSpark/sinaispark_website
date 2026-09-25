import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import { Box, Flex, Grid, Typography } from "@strapi/design-system"
import { useFetchClient } from "@strapi/strapi/admin"

const CM = "/content-manager/collection-types"
const TYPES = [
  { uid: "api::blog-post.blog-post", label: "Blog posts" },
  { uid: "api::research-article.research-article", label: "Research" },
] as const

type Counts = { live: number | null; drafts: number | null }

/** Published and never-published counts; each number opens that list. */
export const ContentWidget = () => {
  const { get } = useFetchClient()
  const [counts, setCounts] = useState<Counts[]>(
    TYPES.map(() => ({ live: null, drafts: null }))
  )

  useEffect(() => {
    let live = true
    const total = (uid: string, published: boolean) =>
      get<{ pagination: { total: number } }>(
        `${CM}/${uid}?page=1&pageSize=1&hasPublishedVersion=${published}`
      )
        .then((res) => res.data.pagination.total)
        .catch(() => null)

    Promise.all(
      TYPES.map(async ({ uid }) => ({
        live: await total(uid, true),
        drafts: await total(uid, false),
      }))
    ).then((values) => live && setCounts(values))
    return () => {
      live = false
    }
  }, [get])

  return (
    <Flex direction="column" alignItems="stretch" gap={3}>
      {TYPES.map((type, i) => (
        <Box key={type.uid}>
          <Typography variant="sigma" textColor="neutral600">
            {type.label}
          </Typography>
          <Grid.Root gap={2} paddingTop={2}>
            <Cell
              value={counts[i].live}
              label="Published"
              to={`${CM}/${type.uid}?hasPublishedVersion=true`}
            />
            <Cell
              value={counts[i].drafts}
              label="Drafts"
              to={`${CM}/${type.uid}?hasPublishedVersion=false`}
            />
          </Grid.Root>
        </Box>
      ))}
    </Flex>
  )
}

const Cell = ({
  value,
  label,
  to,
}: {
  value: number | null
  label: string
  to: string
}) => (
  <Grid.Item col={6} s={12}>
    <Box
      tag={NavLink}
      to={to}
      padding={3}
      hasRadius
      background="neutral100"
      width="100%"
      style={{ textDecoration: "none" }}
    >
      <Flex direction="column" alignItems="flex-start" gap={1}>
        <Typography variant="beta" textColor="neutral800">
          {value ?? "–"}
        </Typography>
        <Typography variant="pi" textColor="neutral600">
          {label}
        </Typography>
      </Flex>
    </Box>
  </Grid.Item>
)

export default ContentWidget
