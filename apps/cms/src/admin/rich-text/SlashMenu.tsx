import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"

import type { Block } from "./blocks"

export type SlashMenuProps = {
  items: Block[]
  command: (item: Block) => void
}

export type SlashMenuHandle = {
  onKeyDown: (event: KeyboardEvent) => boolean
}

/** The block picker that opens on "/". Arrow keys, Enter, or click. */
export const SlashMenu = forwardRef<SlashMenuHandle, SlashMenuProps>(
  ({ items, command }, ref) => {
    const [active, setActive] = useState(0)
    const list = useRef<HTMLDivElement>(null)

    useEffect(() => setActive(0), [items])

    useEffect(() => {
      list.current
        ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
        ?.scrollIntoView({ block: "nearest" })
    }, [active])

    useImperativeHandle(ref, () => ({
      onKeyDown: (event) => {
        if (!items.length) return false
        if (event.key === "ArrowDown") {
          setActive((i) => (i + 1) % items.length)
          return true
        }
        if (event.key === "ArrowUp") {
          setActive((i) => (i - 1 + items.length) % items.length)
          return true
        }
        if (event.key === "Enter" || event.key === "Tab") {
          const item = items[active]
          if (item) command(item)
          return true
        }
        return false
      },
    }))

    if (!items.length) {
      return (
        <div className="ss-rt-menu">
          <p className="ss-rt-menu-empty">No matching blocks</p>
        </div>
      )
    }

    let index = -1
    const groups = (["Text", "Media"] as const)
      .map((group) => ({
        group,
        items: items.filter((item) => item.group === group),
      }))
      .filter((g) => g.items.length)

    return (
      <div className="ss-rt-menu" ref={list} role="listbox">
        {groups.map(({ group, items: groupItems }) => (
          <div key={group}>
            <p className="ss-rt-menu-group">{group}</p>
            {groupItems.map((item) => {
              index += 1
              const i = index
              return (
                <button
                  key={item.id}
                  type="button"
                  role="option"
                  data-index={i}
                  aria-selected={i === active}
                  className="ss-rt-menu-item"
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => command(item)}
                >
                  <span className="ss-rt-menu-icon">{item.icon}</span>
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.hint}</small>
                  </span>
                </button>
              )
            })}
          </div>
        ))}
      </div>
    )
  }
)
