import type { Schema, Struct } from "@strapi/strapi"

export interface ContactOffice extends Struct.ComponentSchema {
  collectionName: "components_contact_offices"
  info: {
    description: "One office tile on the contact page."
    displayName: "Office"
    icon: "house"
  }
  attributes: {
    address: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160
      }>
    city: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40
      }>
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200
      }>
    kicker: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40
      }>
    photo: Schema.Attribute.Media<"images">
    timeZone: Schema.Attribute.Enumeration<
      [
        "Asia/Riyadh",
        "Asia/Dubai",
        "Asia/Bahrain",
        "Asia/Kolkata",
        "Europe/London",
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<"Asia/Riyadh">
  }
}

export interface SharedOpenGraph extends Struct.ComponentSchema {
  collectionName: "components_shared_open_graphs"
  info: {
    description: "How the page looks when shared on LinkedIn, WhatsApp, X or Facebook."
    displayName: "openGraph"
    icon: "project-diagram"
  }
  attributes: {
    ogDescription: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200
      }>
    ogImage: Schema.Attribute.Media<"images">
    ogTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 70
      }>
    ogType: Schema.Attribute.String
    ogUrl: Schema.Attribute.String
  }
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: "components_shared_seos"
  info: {
    description: "Search and social settings. Matches @strapi-community/plugin-seo, whose analyser reads these fields."
    displayName: "seo"
    icon: "search"
  }
  attributes: {
    canonicalURL: Schema.Attribute.String
    keywords: Schema.Attribute.Text
    metaDescription: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160
        minLength: 50
      }>
    metaImage: Schema.Attribute.Media<"images">
    metaRobots: Schema.Attribute.String
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60
      }>
    metaViewport: Schema.Attribute.String
    openGraph: Schema.Attribute.Component<"shared.open-graph", false>
    structuredData: Schema.Attribute.JSON
  }
}

declare module "@strapi/strapi" {
  export namespace Public {
    export interface ComponentSchemas {
      "contact.office": ContactOffice
      "shared.open-graph": SharedOpenGraph
      "shared.seo": SharedSeo
    }
  }
}
