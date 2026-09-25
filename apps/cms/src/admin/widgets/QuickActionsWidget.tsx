import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import { Badge, Box, Flex, LinkButton, Typography } from "@strapi/design-system"
import { ExternalLink, Feather, Images, Plus } from "@strapi/icons"
import { useFetchClient } from "@strapi/strapi/admin"

const CM = "/content-manager"
const SITE = `${CM}/single-types/api::site-setting.site-setting`
const SEO = `${CM}/single-types/api::seo-setting.seo-setting`
const WEB_URL = process.env.STRAPI_ADMIN_WEB_URL

type Status = { insights: boolean; indexing: boolean } | null

/**
 * The home screen's first card: start writing, and the two switches that
 * decide what the public sees (both off until launch).
 */
export const QuickActionsWidget = () => {
  const { get } = useFetchClient()
  const [status, setStatus] = useState<Status>(null)

  useEffect(() => {
    let live = true
    Promise.all([
      get<{ data: { insightsEnabled?: boolean } }>(SITE),
      get<{ data: { allowIndexing?: boolean } }>(SEO),
    ])
      .then(([site, seo]) => {
        if (!live) return
        setStatus({
          insights: Boolean(site.data.data?.insightsEnabled),
          indexing: Boolean(seo.data.data?.allowIndexing),
        })
      })
      .catch(() => {})
    return () => {
      live = false
    }
  }, [get])

  return (
    <Flex direction="column" alignItems="stretch" gap={4}>
      <Flex gap={2} wrap="wrap">
        <LinkButton
          tag={NavLink}
          to={`${CM}/collection-types/api::blog-post.blog-post/create`}
          startIcon={<Plus />}
        >
          New blog post
        </LinkButton>
        <LinkButton
          tag={NavLink}
          to={`${CM}/collection-types/api::research-article.research-article/create`}
          startIcon={<Feather />}
          variant="secondary"
        >
          New research
        </LinkButton>
        <LinkButton
          tag={NavLink}
          to="/plugins/upload"
          startIcon={<Images />}
          variant="tertiary"
        >
          Media
        </LinkButton>
        {WEB_URL && (
          <LinkButton
            href={WEB_URL}
            target="_blank"
            rel="noreferrer"
            endIcon={<ExternalLink />}
            variant="tertiary"
          >
            View site
          </LinkButton>
        )}
      </Flex>

      <Flex direction="column" alignItems="stretch" gap={2}>
        <StatusRow
          label="Research on the site"
          on={status?.insights}
          onText="Live"
          offText="Hidden"
          to={SITE}
        />
        <StatusRow
          label="Search engines"
          on={status?.indexing}
          onText="Allowed"
          offText="Blocked (pre-launch)"
          to={SEO}
        />
      </Flex>
    </Flex>
  )
}

const StatusRow = ({
  label,
  on,
  onText,
  offText,
  to,
}: {
  label: string
  on: boolean | undefined
  onText: string
  offText: string
  to: string
}) => (
  <Box
    tag={NavLink}
    to={to}
    padding={3}
    hasRadius
    background="neutral100"
    style={{ textDecoration: "none" }}
  >
    <Flex justifyContent="space-between" gap={2}>
      <Typography variant="omega" textColor="neutral700">
        {label}
      </Typography>
      {on === undefined ? (
        <Typography variant="pi" textColor="neutral500">
          –
        </Typography>
      ) : (
        <Badge
          backgroundColor={on ? "success100" : "neutral150"}
          textColor={on ? "success700" : "neutral600"}
        >
          {on ? onText : offText}
        </Badge>
      )}
    </Flex>
  </Box>
)

export default QuickActionsWidget
