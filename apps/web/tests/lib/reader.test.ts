import { beforeAll, describe, expect, it } from "vitest"

import { signReader, verifyReader } from "@/lib/reader"

/**
 * Seam: lib/reader
 * Behavior spec: the reader cookie opens gated research only when it was
 * issued by this server; a copied, edited or invented value opens nothing.
 */
describe("reader cookie", () => {
  beforeAll(() => {
    process.env.READER_COOKIE_SECRET = "test-secret"
  })

  it("round-trips the reader's email", async () => {
    const value = await signReader("reader@example.com")
    expect(await verifyReader(value)).toBe("reader@example.com")
  })

  it("rejects a value whose email was swapped", async () => {
    const [, signature] = (await signReader("reader@example.com")).split(".")
    const forged = `${btoa("someone@else.com").replace(/=+$/, "")}.${signature}`
    expect(await verifyReader(forged)).toBeNull()
  })

  it("rejects a value signed with another secret", async () => {
    const value = await signReader("reader@example.com")
    process.env.READER_COOKIE_SECRET = "rotated-secret"
    expect(await verifyReader(value)).toBeNull()
    process.env.READER_COOKIE_SECRET = "test-secret"
  })

  it("rejects missing and malformed values", async () => {
    expect(await verifyReader(undefined)).toBeNull()
    expect(await verifyReader("")).toBeNull()
    expect(await verifyReader("no-dot")).toBeNull()
    expect(await verifyReader("a.b.c")).toBeNull()
  })
})
