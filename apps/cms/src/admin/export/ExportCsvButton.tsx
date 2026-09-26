import { useState } from "react"
import { useLocation, useParams } from "react-router-dom"
import { Button } from "@strapi/design-system"
import { Download } from "@strapi/icons"
import { useFetchClient, useNotification } from "@strapi/strapi/admin"

import { EXPORTS, toCsv } from "./csv"

const PAGE_SIZE = 100

type ListResponse = {
  results: Record<string, unknown>[]
  pagination: { pageCount: number }
}

/**
 * "Export CSV" beside the list view's settings, on enquiries and subscribers
 * only. It exports what the list currently shows, with its filters, search
 * and sort, but every page of it, not just the one on screen. It reads
 * through the admin's own API, so it only works for people allowed to see
 * the list.
 */
export function ExportCsvButton() {
  const { slug = "" } = useParams<{ slug: string }>()
  const { search } = useLocation()
  const { get } = useFetchClient()
  const { toggleNotification } = useNotification()
  const [busy, setBusy] = useState(false)

  const config = EXPORTS[slug]
  if (!config) return null

  const run = async () => {
    setBusy(true)
    try {
      const query = new URLSearchParams(search)
      query.delete("page")
      query.set("pageSize", String(PAGE_SIZE))

      const rows: Record<string, unknown>[] = []
      for (let page = 1, pageCount = 1; page <= pageCount; page++) {
        query.set("page", String(page))
        const { data } = await get<ListResponse>(
          `/content-manager/collection-types/${slug}?${query}`
        )
        rows.push(...data.results)
        pageCount = data.pagination.pageCount
      }

      const blob = new Blob([toCsv(config.columns, rows)], {
        type: "text/csv;charset=utf-8",
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${config.file}-${new Date().toISOString().slice(0, 10)}.csv`
      link.click()
      URL.revokeObjectURL(url)
    } catch {
      toggleNotification({
        type: "danger",
        message: "The export failed. Try again, or reload the page.",
      })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Button
      variant="tertiary"
      startIcon={<Download />}
      loading={busy}
      onClick={run}
    >
      Export CSV
    </Button>
  )
}
