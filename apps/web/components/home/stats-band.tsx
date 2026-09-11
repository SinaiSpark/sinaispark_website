import { HOME } from "@/lib/content/home"
import { Reveal } from "@/components/motion/reveal"
import { CountUp } from "@/components/motion/count-up"
import { GlassCard } from "@/components/site/glass-card"

/**
 * Snapshot stats — four glass tiles closing the dark opening block.
 * Numbers are white (not teal): at this size a saturated colour shouts,
 * and the teal accent on each tile already carries the brand.
 */
export function StatsBand() {
  return (
    <section
      aria-label="Company statistics"
      data-surface="navy"
      className="border-t border-white/10 bg-primary-deep"
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-16 lg:px-8">
        <Reveal stagger>
          <dl className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {HOME.stats.map((stat) => (
              <GlassCard
                key={stat.label}
                tint
                className="flex flex-col gap-2 p-5 md:p-7"
              >
                <span
                  aria-hidden="true"
                  className="h-1 w-8 rounded-full bg-brand"
                />
                <dd className="order-2 text-4xl font-semibold tracking-[-0.03em] text-primary-foreground tabular-nums md:text-5xl">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </dd>
                <dt className="order-3 text-sm text-primary-foreground/70">
                  {stat.label}
                </dt>
              </GlassCard>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}
