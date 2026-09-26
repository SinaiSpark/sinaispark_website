/**
 * CSV for the "Export CSV" button on the enquiry and subscriber lists.
 * Which columns each list exports, in the order a spreadsheet shows them.
 */
type Row = Record<string, unknown>

export interface Column {
  header: string
  value: (row: Row) => unknown
}

const date = (value: unknown) =>
  typeof value === "string" && value ? value.replace("T", " ").slice(0, 16) : ""
const yesNo = (value: unknown) => (value ? "Yes" : "No")

export const EXPORTS: Record<string, { file: string; columns: Column[] }> = {
  "api::enquiry.enquiry": {
    file: "enquiries",
    columns: [
      { header: "Received (UTC)", value: (r) => date(r.createdAt) },
      { header: "Status", value: (r) => r.leadStatus },
      { header: "Name", value: (r) => r.fullName },
      { header: "Email", value: (r) => r.email },
      { header: "Phone", value: (r) => r.phone },
      { header: "Market", value: (r) => r.market },
      { header: "Needs", value: (r) => r.service },
      { header: "Message", value: (r) => r.message },
      { header: "Came from", value: (r) => r.page },
      { header: "Notes", value: (r) => r.notes },
    ],
  },
  "api::subscriber.subscriber": {
    file: "subscribers",
    columns: [
      { header: "Email", value: (r) => r.email },
      { header: "Newsletter", value: (r) => yesNo(r.newsletter) },
      {
        header: "Unsubscribed at (UTC)",
        value: (r) => date(r.unsubscribedAt),
      },
      { header: "First signed up via", value: (r) => r.firstSource },
      {
        header: "Research unlocked",
        // The list endpoint returns relations as a count.
        value: (r) => (r.unlockedResearch as { count?: number })?.count ?? 0,
      },
      { header: "Signed up (UTC)", value: (r) => date(r.createdAt) },
    ],
  },
}

/**
 * One cell. Anything a spreadsheet would run as a formula (a leading =, +,
 * -, @, tab or carriage return) gets a leading apostrophe: enquiries are
 * typed by strangers on the website, and a cell like =HYPERLINK(...) must
 * open as text.
 */
function cell(value: unknown) {
  let text = value === null || value === undefined ? "" : String(value)
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`
  return `"${text.replace(/"/g, '""')}"`
}

/** With a byte-order mark, so Excel reads Arabic and accented names correctly. */
export function toCsv(columns: Column[], rows: Row[]) {
  const lines = [
    columns.map((c) => cell(c.header)).join(","),
    ...rows.map((row) => columns.map((c) => cell(c.value(row))).join(",")),
  ]
  return `﻿${lines.join("\r\n")}\r\n`
}
