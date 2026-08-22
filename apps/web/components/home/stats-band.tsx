import { HOME } from "@/lib/content/home"
import { CountUp } from "@/components/motion/count-up"

/**
 * Snapshot Stats — navy full-bleed band with count-up tabular numerals (§13).
 */
export function StatsBand() {
  return (
    <section aria-label="Company statistics" className="bg-primary">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-16 lg:px-8">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {HOME.stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-1 text-center"
            >
              <dd className="font-mono text-4xl font-semibold tracking-tight text-gold tabular-nums md:text-5xl">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </dd>
              <dt className="text-sm text-primary-foreground/75">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
