import { factories } from "@strapi/strapi"

// The website only reads this; editing happens in the admin.
export default factories.createCoreRouter("api::home-page.home-page", {
  only: ["find"],
})
