/**
 * The brand fonts across the admin: Manrope for text, Schibsted Grotesk for
 * page titles, as on the website. Element selectors only, never Strapi's
 * generated class names, so an admin update can't break it.
 */
const CSS = `
body, button, input, textarea, select {
  font-family: "Manrope Variable", "Manrope", -apple-system, "Segoe UI", Roboto, sans-serif;
}
h1 {
  font-family: "Schibsted Grotesk Variable", "Schibsted Grotesk", "Helvetica Neue", Arial, sans-serif;
  letter-spacing: -0.015em;
}
`

export function applyAdminStyles() {
  if (document.getElementById("ss-admin-styles")) return
  const style = document.createElement("style")
  style.id = "ss-admin-styles"
  style.textContent = CSS
  document.head.appendChild(style)
}
