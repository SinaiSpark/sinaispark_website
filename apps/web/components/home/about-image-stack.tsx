"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@workspace/ui/lib/utils"

import type { ImageAsset } from "@/lib/images"

type AboutImageStackProps = {
  assets: ImageAsset[]
  className?: string
}

export function AboutImageStack({ assets, className }: AboutImageStackProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (assets.length <= 1) return
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % assets.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [assets.length])

  if (assets.length === 0) return null

  return (
    <div className={cn("relative h-full w-full", className)}>
      <AnimatePresence initial={false}>
        <motion.div
          key={assets[activeIndex]?.src}
          initial={{ scale: 0.9, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0, zIndex: 10 }}
          exit={{ scale: 1.05, opacity: 0, y: -40, zIndex: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute inset-0 overflow-hidden rounded-lg shadow-xl"
        >
          {assets[activeIndex] && (
            <Image
              src={assets[activeIndex].src}
              alt={assets[activeIndex].alt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              quality={85}
              className="object-cover"
              style={
                assets[activeIndex].focal
                  ? { objectPosition: assets[activeIndex].focal }
                  : undefined
              }
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
