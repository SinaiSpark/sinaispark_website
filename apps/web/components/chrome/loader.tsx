import { BrandMark } from "@/components/ui/brand-mark"
import { LOADER } from "@/content/home"

/**
 * Home page loader. The mark draws itself, the rule fills, then the whole
 * panel lifts away and hands the page to the hero.
 *
 * It is hidden (not unmounted) when the intro finishes, so React's tree stays
 * stable. On reduced-motion it is hidden immediately, and CSS hides it outright
 * on coarse pointers.
 */
export function Loader() {
  return (
    <div className="loader" id="loader" aria-hidden="true">
      <div className="loader-inner">
        <BrandMark className="loader-mark" />
        <div className="loader-line">
          <i />
        </div>
        <div className="loader-word">{LOADER.word}</div>
      </div>
    </div>
  )
}

/** The trailing dot that replaces the pointer on fine-pointer devices. */
export function Cursor() {
  return <div className="cursor" id="cursor" aria-hidden="true" />
}
