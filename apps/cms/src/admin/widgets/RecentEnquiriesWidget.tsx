import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import { Badge, Box, Flex, Typography } from "@strapi/design-system"
import { useFetchClient } from "@strapi/strapi/admin"

const ENQUIRIES = "/content-manager/collection-types/api::enquiry.enquiry"

type Enquiry = {
  documentId: string
  fullName: string
  service?: string | null
  market?: string | null
  leadStatus: string
  createdAt: string
}

const STATUS_COLOURS: Record<string, [string, string]> = {
  New: ["primary100", "primary700"],
  Contacted: ["secondary100", "secondary700"],
  Qualified: ["warning100", "warning700"],
  Won: ["success100", "success700"],
  Lost: ["neutral150", "neutral600"],
  Spam: ["danger100", "danger700"],
}

const ago = (iso: string) => {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (minutes < 60) return `${Math.max(1, minutes)} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} h ago`
  const days = Math.round(hours / 24)
  return days < 14
    ? `${days} d ago`
    : new Date(iso).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
      })
}

/** The five newest enquiries; each opens its entry. */
export const RecentEnquiriesWidget = () => {
  const { get } = useFetchClient()
  const [items, setItems] = useState<Enquiry[] | null>(null)

  useEffect(() => {
    let live = true
    get<{ results: Enquiry[] }>(
      `${ENQUIRIES}?page=1&pageSize=5&sort=createdAt:DESC`
    )
      .then((res) => live && setItems(res.data.results))
      .catch(() => live && setItems([]))
    return () => {
      live = false
    }
  }, [get])

  if (items === null) return null
  if (!items.length) {
    return (
      <Typography variant="omega" textColor="neutral600">
        No enquiries yet. They appear here when someone uses a form on the site.
      </Typography>
    )
  }

  return (
    <Flex direction="column" alignItems="stretch" gap={1}>
      {items.map((item) => {
        const [bg, fg] = STATUS_COLOURS[item.leadStatus] ?? STATUS_COLOURS.Lost
        return (
          <Box
            key={item.documentId}
            tag={NavLink}
            to={`${ENQUIRIES}/${item.documentId}`}
            padding={2}
            hasRadius
            style={{ textDecoration: "none" }}
          >
            <Flex justifyContent="space-between" gap={3}>
              <Flex direction="column" alignItems="flex-start" minWidth={0}>
                <Typography variant="omega" fontWeight="semiBold" ellipsis>
                  {item.fullName}
                </Typography>
                <Typography variant="pi" textColor="neutral600" ellipsis>
                  {[item.service, item.market].filter(Boolean).join(" · ") ||
                    "General enquiry"}
                </Typography>
              </Flex>
              <Flex direction="column" alignItems="flex-end" gap={1} shrink={0}>
                <Badge backgroundColor={bg} textColor={fg}>
                  {item.leadStatus}
                </Badge>
                <Typography variant="pi" textColor="neutral500">
                  {ago(item.createdAt)}
                </Typography>
              </Flex>
            </Flex>
          </Box>
        )
      })}
    </Flex>
  )
}

export default RecentEnquiriesWidget
