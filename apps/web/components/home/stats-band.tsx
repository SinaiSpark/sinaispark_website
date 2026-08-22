import { HOME } from "@/lib/content/home"
import { Reveal } from "@/components/motion/reveal"
import { CountUp } from "@/components/motion/count-up"

export function StatsBand() {
  return (
    <section aria-label="Company statistics" className="bg-primary">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-16 lg:px-8">
        <Reveal
          delay={0.1}
          className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4 md:gap-x-12"
        >
          {HOME.stats.map((stat, index) => (
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
        </Reveal>
      </div>
    </section>
  )
}
