/**
 * Joins class names, dropping anything falsy.
 *
 *   cx("tag", isFlagship && "is-flag")  ->  "tag is-flag"
 *
 * Use this instead of building class names inside a template literal. Writing
 * `` `tag${flag ? " is-flag" : ""}` `` looks equivalent, but a formatter that
 * understands class attributes will trim the leading space out of the string
 * and silently produce `tagis-flag`. Keeping the separator out of the literals
 * means there is no space for anything to trim.
 */
export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ")
}
