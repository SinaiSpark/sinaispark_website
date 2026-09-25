import { createContext, useContext } from "react"

import type { ImageAttrs } from "./nodes"

/**
 * What the editor's blocks need from the Strapi field around them. Node views
 * render inside the field's React tree, so they can reach it through context.
 */
export type RichTextContext = {
  /** Opens the media library; calls back with the chosen image. */
  pickImage: (onPick: (attrs: Partial<ImageAttrs>) => void) => void
}

export const EditorContext = createContext<RichTextContext>({
  pickImage: () => {},
})

export const useRichText = () => useContext(EditorContext)

type Asset = {
  url: string
  alternativeText?: string | null
  name?: string
  width?: number | null
  height?: number | null
  mime?: string
  formats?: Record<string, { url: string; width: number }> | null
}

/** A media-library file as image attributes, with every size in srcset. */
export function assetToImage(asset: Asset): Partial<ImageAttrs> {
  const sizes = Object.values(asset.formats ?? {})
    .filter((format) => format?.url && format.width)
    .sort((a, b) => a.width - b.width)
    .map((format) => `${format.url} ${format.width}w`)
  if (sizes.length && asset.width) sizes.push(`${asset.url} ${asset.width}w`)

  return {
    src: asset.url,
    alt: asset.alternativeText ?? "",
    width: asset.width ?? null,
    height: asset.height ?? null,
    srcset: sizes.length ? sizes.join(", ") : null,
  }
}
