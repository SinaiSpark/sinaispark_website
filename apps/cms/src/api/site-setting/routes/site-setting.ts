import { factories } from "@strapi/strapi"

// The website only reads these; editing happens in the admin.
export default factories.createCoreRouter("api::site-setting.site-setting", {
  only: ["find"],
})
