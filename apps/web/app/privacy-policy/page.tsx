import type { Metadata } from "next"

import { Breadcrumbs } from "@/components/site/breadcrumbs"
import { CTASection } from "@/components/site/cta-section"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Sinai Spark Global collects, uses and protects your personal data.",
  alternates: { canonical: "/privacy-policy/" },
}

/**
 * Legal stub — retained from the original proposal (Conflict log #2).
 * PENDING_CLIENT_DATA: final legal text to be supplied by the client.
 */
export default function PrivacyPolicyPage() {
  return (
    <>
      <div className="bg-background-alt">
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <Breadcrumbs pathname="/privacy-policy/" />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
          <h1 className="text-3xl font-semibold tracking-[-0.02em] md:text-4xl">
            Privacy Policy
          </h1>
        </div>
      </div>
      <section className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-12 leading-relaxed text-muted-foreground sm:px-6 lg:px-8">
          <p>
            This policy is being finalized with our legal team. In the meantime,
            we collect only the information you share through our consultation
            form and use it solely to respond to your enquiry. Nothing is sold
            or shared with third parties for marketing purposes.
          </p>
          {/* PENDING_CLIENT_DATA — full policy text pending client/legal sign-off. */}
        </div>
      </section>
      <CTASection
        title="Questions about your data?"
        buttons={[{ label: "Contact Us", href: "/contact/", variant: "gold" }]}
      />
    </>
  )
}
