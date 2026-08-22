"use client"

import { motion } from "framer-motion"
import { Reveal } from "@/components/motion/reveal"
import { HOME } from "@/lib/content/home"

export function MissionVision() {
  return (
    <section
      aria-label="Mission and vision"
      className="relative z-0 overflow-hidden bg-background-alt"
    >
      {/* Subtle ambient light leak in the background */}
      <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/5 blur-[100px]" />

      <div className="mx-auto grid max-w-7xl gap-16 px-4 py-24 sm:px-6 md:py-32 lg:grid-cols-2 lg:gap-24 lg:px-8">
        {[
          {
            ...HOME.missionVision.mission,
            delay: 0,
          },
          {
            ...HOME.missionVision.vision,
            delay: 0.15,
          },
        ].map((item) => (
          <div key={item.title} className="group relative flex flex-col pt-10">
            {/* Animated Gold Line - Always reliable */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 1,
                ease: [0.22, 1, 0.36, 1],
                delay: item.delay,
              }}
              style={{ originX: 0 }}
              className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-gold via-gold/70 to-transparent"
            />

            <Reveal delay={item.delay + 0.2}>
              <h2 className="text-3xl font-bold tracking-tight text-foreground transition-colors duration-500 group-hover:text-primary md:text-4xl">
                {item.title}
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </Reveal>

            {/* Extremely subtle hover highlight box */}
            <div className="pointer-events-none absolute -inset-8 -z-10 rounded-3xl bg-white/40 opacity-0 transition-opacity duration-700 group-hover:opacity-100 dark:bg-white/5" />
          </div>
        ))}
      </div>
    </section>
  )
}
