import type { Metadata } from "next"

import { PageHeader } from "@/components/site/page-header"
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
      <PageHeader
        pathname="/terms/"
        eyebrow="Legal"
        title="Terms & Conditions"
      />
      <section className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-14 text-lg leading-relaxed text-muted-foreground sm:px-6 md:py-20 lg:px-8">
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
        buttons={[{ label: "Contact Us", href: "/contact/", variant: "brand" }]}
      />
    </>
  )
}
