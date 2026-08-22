import { existsSync } from "node:fs"
import { join } from "node:path"

import { describe, expect, it } from "vitest"

import { IMAGES, PENDING_IMAGE_SLOTS } from "@/lib/images"

const PUBLIC_DIR = join(__dirname, "../../public")

/**
 * Seam: lib/images ASSET_MANIFEST
 * Behavior spec: every registered asset exists on disk with usable alt text
 * and license metadata; pending slots are declared explicitly.
 */
describe("image asset manifest", () => {
  it("registers at least the hero and all five market images", () => {
    for (const key of [
      "homeHero",
      "countrySaudiArabia",
      "countryUae",
      "countryUk",
      "countryBahrain",
      "indiaMumbai",
    ] as const) {
      expect(IMAGES[key], `missing asset: ${key}`).toBeDefined()
    }
  })

  it("has a real file behind every registered src", () => {
    for (const [key, asset] of Object.entries(IMAGES)) {
      const file = join(PUBLIC_DIR, asset.src)
      expect(existsSync(file), `${key} → ${asset.src} not found`).toBe(true)
    }
  })

  it("gives every asset descriptive alt text", () => {
    for (const [, asset] of Object.entries(IMAGES)) {
      expect(asset.alt.length).toBeGreaterThan(15)
    }
  })

  it("records license + credit for placeholder photography", () => {
    for (const [, asset] of Object.entries(IMAGES)) {
      if (asset.status === "placeholder") {
        expect(asset.license).toMatch(/CC|Public|FAL/)
        expect(asset.credit?.length ?? 0).toBeGreaterThan(0)
      }
    }
  })

  it("declares which slots still await imagery", () => {
    expect(PENDING_IMAGE_SLOTS).toContain("services/compliance-planning")
  })
})
