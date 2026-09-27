/**
 * Every inline icon the design uses, copied from its markup so stroke weights
 * and view boxes match exactly. They inherit colour from their parent.
 */

/** Diagonal "go" arrow. The one that appears inside buttons and links. */
export function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 12 12 4M6 4h6v6" />
    </svg>
  )
}

/** Downward arrow, used by "scroll on" style buttons. */
export function DownIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M8 3v10M3 8l5 5 5-5" />
    </svg>
  )
}

/** Button arrow wrapped in its pill, the shape `.btn .arr` styles. */
export function ButtonArrow({ down = false }: { down?: boolean }) {
  return <span className="arr">{down ? <DownIcon /> : <ArrowIcon />}</span>
}

export function CheckIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2.5 6.5l2.5 2.5 4.5-5" />
    </svg>
  )
}

export function ChevronIcon() {
  return (
    <svg
      className="chev"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M2.5 4.5 6 8l3.5-3.5" />
    </svg>
  )
}

export function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  )
}

/** Solid play triangle, on video tiles. */
export function PlayIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M5 3.2v9.6a.6.6 0 0 0 .9.5l7.6-4.8a.6.6 0 0 0 0-1L5.9 2.7a.6.6 0 0 0-.9.5Z" />
    </svg>
  )
}

/** Map pin, beside an event's city. */
export function PinIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path d="M8 14.5s4.5-4.2 4.5-7.8a4.5 4.5 0 0 0-9 0c0 3.6 4.5 7.8 4.5 7.8Z" />
      <circle cx="8" cy="6.6" r="1.6" />
    </svg>
  )
}

/** Camera, beside an event's photo and video count. */
export function CameraIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path d="M2 5.5A1.5 1.5 0 0 1 3.5 4h1.6l1-1.5h3.8l1 1.5h1.6A1.5 1.5 0 0 1 14 5.5v6a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 11.5Z" />
      <circle cx="8" cy="8.4" r="2.4" />
    </svg>
  )
}

/** Thin cross, closing the gallery. */
export function CloseIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
    </svg>
  )
}

export function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.5 8.5h-3V21h3zM5 3.5A1.75 1.75 0 1 0 5 7a1.75 1.75 0 0 0 0-3.5zM21 13.6c0-3.4-1.8-5.3-4.6-5.3-1.7 0-2.8.9-3.3 1.8V8.5h-3V21h3v-6.5c0-1.7.6-2.9 2.2-2.9 1.5 0 2 1.1 2 2.9V21h3z" />
    </svg>
  )
}

export function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  )
}

export function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 12s0-4-.5-5.5a2.5 2.5 0 0 0-1.8-1.8C18.2 4.2 12 4.2 12 4.2s-6.2 0-7.7.5A2.5 2.5 0 0 0 2.5 6.5C2 8 2 12 2 12s0 4 .5 5.5a2.5 2.5 0 0 0 1.8 1.8c1.5.5 7.7.5 7.7.5s6.2 0 7.7-.5a2.5 2.5 0 0 0 1.8-1.8C22 16 22 12 22 12z" />
      <path d="M10 9.5v5l4.5-2.5z" fill="currentColor" />
    </svg>
  )
}

export function TickIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
    >
      <path d="M5 12l5 5 9-10" />
    </svg>
  )
}

/** The four process-step glyphs, keyed by the `icon` field in content/home.ts. */
const PROCESS_ICONS = {
  chat: (
    <>
      <path d="M4 5h16v11H9l-5 4z" />
      <path d="M8 9h8M8 12h5" />
    </>
  ),
  check: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <path d="M8 12l3 3 5-6" />
    </>
  ),
  file: (
    <>
      <path d="M7 3h7l5 5v13H7z" />
      <path d="M14 3v5h5M10 13h6M10 17h6" />
    </>
  ),
  flag: (
    <>
      <path d="M5 21V4" />
      <path d="M5 4h12l-2 4 2 4H5" />
    </>
  ),
} as const

export type ProcessIcon = keyof typeof PROCESS_ICONS

export function ProcessIconGlyph({ name }: { name: ProcessIcon }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      {PROCESS_ICONS[name]}
    </svg>
  )
}
