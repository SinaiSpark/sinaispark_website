import type { SVGProps } from "react"

/** The few editor glyphs @strapi/icons doesn't have, drawn to match it. */
const Svg = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    aria-hidden
    {...props}
  />
)

export const AlignLeft = () => (
  <Svg>
    <path d="M5 8h22M5 13h14M5 18h22M5 23h14" />
  </Svg>
)
export const AlignCenter = () => (
  <Svg>
    <path d="M5 8h22M9 13h14M5 18h22M9 23h14" />
  </Svg>
)
export const AlignRight = () => (
  <Svg>
    <path d="M5 8h22M13 13h14M5 18h22M13 23h14" />
  </Svg>
)
export const Divider = () => (
  <Svg>
    <path d="M4 16h24" />
    <path d="M8 9h16M8 23h16" strokeOpacity=".35" />
  </Svg>
)
export const Subscript = () => (
  <Svg>
    <path d="M5 7l10 12M15 7L5 19" />
    <path
      d="M20 20c0-1.4 1-2.2 2.4-2.2s2.4.8 2.4 2c0 2.2-4.8 3-4.8 6h4.8"
      strokeWidth="2"
    />
  </Svg>
)
export const Superscript = () => (
  <Svg>
    <path d="M5 11l10 13M15 11L5 24" />
    <path
      d="M20 7c0-1.4 1-2.2 2.4-2.2s2.4.8 2.4 2c0 2.2-4.8 3-4.8 6h4.8"
      strokeWidth="2"
    />
  </Svg>
)
export const ClearFormat = () => (
  <Svg>
    <path d="M8 7h16M16 7l-4 18M20 20l6 6M26 20l-6 6" />
  </Svg>
)
export const Undo = () => (
  <Svg>
    <path d="M11 9L5 15l6 6" />
    <path d="M5 15h14a7 7 0 0 1 0 14h-4" />
  </Svg>
)
export const Redo = () => (
  <Svg>
    <path d="M21 9l6 6-6 6" />
    <path d="M27 15H13a7 7 0 0 0 0 14h4" />
  </Svg>
)
