import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import { Box, Flex, Grid, Typography } from "@strapi/design-system"
import { useFetchClient } from "@strapi/strapi/admin"

type Stat = { label: string; href: string; path: string }

const WEEK_AGO = () =>
  new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
const CM = "/content-manager/collection-types"
const ENQUIRY = "api::enquiry.enquiry"
const SUBSCRIBER = "api::subscriber.subscriber"

/**
 * The counts shown on the admin home screen. Each one is a filtered list in
 * the content manager, so clicking a number opens exactly those rows.
 */
const stats = (): Stat[] => {
  const since = encodeURIComponent(WEEK_AGO())
  return [
    {
      label: "New enquiries",
      path: `filters[$and][0][leadStatus][$eq]=New`,
      href: `/content-manager/collection-types/${ENQUIRY}?filters[$and][0][leadStatus][$eq]=New`,
    },
    {
      label: "Enquiries this week",
      path: `filters[$and][0][createdAt][$gte]=${since}`,
      href: `/content-manager/collection-types/${ENQUIRY}?filters[$and][0][createdAt][$gte]=${since}`,
    },
    {
      label: "Newsletter subscribers",
      path: `filters[$and][0][newsletter][$eq]=true&filters[$and][1][unsubscribedAt][$null]=true`,
      href: `/content-manager/collection-types/${SUBSCRIBER}?filters[$and][0][newsletter][$eq]=true`,
    },
    {
      label: "New emails this week",
      path: `filters[$and][0][createdAt][$gte]=${since}`,
      href: `/content-manager/collection-types/${SUBSCRIBER}?filters[$and][0][createdAt][$gte]=${since}`,
    },
  ]
}

const uidOf = (href: string) => (href.includes(ENQUIRY) ? ENQUIRY : SUBSCRIBER)

export const LeadsWidget = () => {
  const { get } = useFetchClient()
  const [items] = useState(stats)
  const [totals, setTotals] = useState<(number | null)[]>(items.map(() => null))

  useEffect(() => {
    let live = true
    Promise.all(
      items.map((item) =>
        get<{ pagination: { total: number } }>(
          `${CM}/${uidOf(item.href)}?page=1&pageSize=1&${item.path}`
        )
          .then((res) => res.data.pagination.total)
          .catch(() => null)
      )
    ).then((values) => live && setTotals(values))
    return () => {
      live = false
    }
  }, [get, items])

  return (
    <Grid.Root gap={3}>
      {items.map((item, i) => (
        <Grid.Item key={item.label} col={6} s={12}>
          <Box
            tag={NavLink}
            to={item.href}
            padding={4}
            hasRadius
            background="neutral100"
            width="100%"
            style={{ textDecoration: "none" }}
          >
            <Flex direction="column" alignItems="flex-start" gap={1}>
              <Typography variant="alpha" textColor="primary600">
                {totals[i] ?? "–"}
              </Typography>
              <Typography variant="pi" textColor="neutral600">
                {item.label}
              </Typography>
            </Flex>
          </Box>
        </Grid.Item>
      ))}
    </Grid.Root>
  )
}

export default LeadsWidget
