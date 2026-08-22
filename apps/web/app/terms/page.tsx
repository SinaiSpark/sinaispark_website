import type { Metadata } from "next"

import { Breadcrumbs } from "@/components/site/breadcrumbs"
import { CTASection } from "@/components/site/cta-section"

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms and conditions for using the Sinai Spark Global website and services.",
  alternates: { canonical: "/terms/" },
}

/**
 * Legal stub — retained from the original proposal (Conflict log #2).
 * PENDING_CLIENT_DATA: final legal text to be supplied by the client.
 */
export default function TermsPage() {
  return (
    <>
      <div className="bg-background-alt">
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <Breadcrumbs pathname="/terms/" />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
          <h1 className="text-3xl font-semibold tracking-[-0.02em] md:text-4xl">
            Terms &amp; Conditions
          </h1>
        </div>
      </div>
      <section className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-12 leading-relaxed text-muted-foreground sm:px-6 lg:px-8">
          <p>
            These terms are being finalized with our legal team. Website content
            is provided for general information; service engagements are
            governed by a signed proposal or agreement.
          </p>
          {/* PENDING_CLIENT_DATA — full terms text pending client/legal sign-off. */}
        </div>
      </section>
      <CTASection
        title="Questions?"
        buttons={[{ label: "Contact Us", href: "/contact/", variant: "gold" }]}
      />
    </>
  )
}
