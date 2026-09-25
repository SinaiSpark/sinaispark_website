import { factories } from "@strapi/strapi"

// The website only ever creates enquiries; the team works them in the admin.
export default factories.createCoreRouter("api::enquiry.enquiry", {
  only: ["create"],
})
