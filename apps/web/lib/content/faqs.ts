/**
 * General FAQ content — seeded from the revised content document's service
 * copy. PENDING_CLIENT_DATA: the client has not yet supplied the general FAQ
 * set; these are drafted from approved service descriptions and must be
 * reviewed before launch. (The India page FAQs ARE client-supplied verbatim.)
 */

export interface Faq {
  question: string
  answer: string
}

export const faqs: Faq[] = [
  {
    question: "What does it take to register a company in Saudi Arabia?",
    answer:
      "Foreign investors need a MISA (Ministry of Investment) investment license, commercial registration with the Ministry of Commerce, and the right entity structure — typically an LLC, branch or representative office. Sinai Spark Global manages the full process, including document preparation, attestation and government submission.",
  },
  {
    question: "How long does company formation in Saudi Arabia usually take?",
    answer:
      "Timelines depend on entity type and activity, but most formations complete within a few weeks once documents are in order. We give you a realistic timeline at the free consultation and track every milestone for you.",
    // PENDING_CLIENT_DATA — confirm official turnaround figures.
  },
  {
    question: "Which Saudi license types exist, and which one do I need?",
    answer:
      "Saudi Arabia issues several distinct license types depending on business activity: Commercial, Industrial, Entrepreneurial, Service and Real Estate licenses. Picking the wrong category costs time later, so we assess your activity first. See our licensing pages for details on each.",
  },
  {
    question: "Can I own 100% of my Saudi company as a foreign investor?",
    answer:
      "In many sectors, yes — full foreign ownership is available, notably under the industrial license. The right structure is confirmed during your consultation based on your specific activity.",
  },
  {
    question: "What are PRO services, and do I need them?",
    answer:
      "PRO (Public Relations Officer) services mean ongoing government liaison: work visa processing, labor documentation and Ministry paperwork. If you employ staff in Saudi Arabia, keeping these current is mandatory — this is exactly what our PRO & Visa service handles.",
  },
  {
    question: "What happens after my company is formed?",
    answer:
      "Formation is a one-time event; staying compliant is not. Our compliance service tracks renewal dates, filing deadlines and regulatory changes so nothing is missed after launch.",
  },
  {
    question: "Do you operate outside Saudi Arabia?",
    answer:
      "Yes. Sinai Spark Global is a global business setup partner with active operations across Saudi Arabia, the UAE, the UK, India and Bahrain. Saudi Arabia remains our flagship and most detailed practice.",
  },
]
