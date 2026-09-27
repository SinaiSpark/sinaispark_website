/**
 * Event dates as the site prints them. Events can run over several days, so
 * a range is collapsed to read naturally: "12–14 Mar 2026",
 * "28 Feb – 2 Mar 2026", "30 Dec 2025 – 2 Jan 2026".
 *
 * Dates arrive from the CMS as yyyy-mm-dd and are read in UTC, so the day
 * never shifts with the server's time zone.
 */
const parse = (iso: string | null | undefined) => {
  if (!iso) return null
  const date = new Date(`${iso}T00:00:00Z`)
  return Number.isNaN(date.getTime()) ? null : date
}

const part = (date: Date, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-GB", { ...options, timeZone: "UTC" }).format(date)

const day = (date: Date) => part(date, { day: "numeric" })
const month = (date: Date) => part(date, { month: "short" })
const year = (date: Date) => part(date, { year: "numeric" })

export function formatEventDates(
  start: string | null | undefined,
  end?: string | null
) {
  const from = parse(start)
  if (!from) return "Date to be confirmed"
  const to = parse(end)

  const single = `${day(from)} ${month(from)} ${year(from)}`
  if (!to || to.getTime() <= from.getTime()) return single

  if (year(from) !== year(to)) {
    return `${single} – ${day(to)} ${month(to)} ${year(to)}`
  }
  if (month(from) !== month(to)) {
    return `${day(from)} ${month(from)} – ${day(to)} ${month(to)} ${year(to)}`
  }
  return `${day(from)}–${day(to)} ${month(to)} ${year(to)}`
}

/** The date stamp on an event card: "14" over "Mar 2026". */
export function dateStamp(start: string | null | undefined) {
  const from = parse(start)
  if (!from) return { day: "–", rest: "TBC" }
  return { day: day(from), rest: `${month(from)} ${year(from)}` }
}

/**
 * Whether an event is still to come on `today` (yyyy-mm-dd). An event is
 * upcoming until its last day has passed.
 */
export function isUpcoming(
  start: string | null | undefined,
  end: string | null | undefined,
  today: string
) {
  const last = end || start
  return Boolean(last) && last! >= today
}

/** Today as yyyy-mm-dd, in UTC like the dates it is compared with. */
export const todayIso = () => new Date().toISOString().slice(0, 10)
