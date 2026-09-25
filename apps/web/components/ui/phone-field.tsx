"use client"

import {
  getCountries,
  getCountryCallingCode,
  isValidPhoneNumber,
  parsePhoneNumber,
  type CountryCode,
} from "libphonenumber-js"
import { useEffect, useMemo, useState } from "react"

import { cx } from "@/lib/cx"

/** Our markets and the Gulf first, then every other country A–Z. */
const FIRST: CountryCode[] = ["SA", "AE", "IN", "GB", "BH", "QA", "KW", "OM"]

function useCountries() {
  return useMemo(() => {
    const names = new Intl.DisplayNames(["en"], { type: "region" })
    const all = getCountries().map((code) => ({
      code,
      name: names.of(code) ?? code,
      dial: `+${getCountryCallingCode(code)}`,
    }))
    const first = FIRST.map((code) => all.find((c) => c.code === code)!)
    const rest = all
      .filter((c) => !FIRST.includes(c.code))
      .sort((a, b) => a.name.localeCompare(b.name))
    return { first, rest }
  }, [])
}

export type PhoneValue = { country: CountryCode; number: string }

/** The full number as stored: "+966 50 123 4567", or "" when empty. */
export function phoneToString({ country, number }: PhoneValue) {
  if (!number.trim()) return ""
  try {
    return parsePhoneNumber(number, country).formatInternational()
  } catch {
    return `+${getCountryCallingCode(country)} ${number.trim()}`
  }
}

export function phoneIsValid({ country, number }: PhoneValue) {
  return !number.trim() || isValidPhoneNumber(number, country)
}

/**
 * Country code picker + number. The picker is a native select laid over a
 * country-and-code label, so it's the phone's own list on mobile and fully
 * keyboard accessible. No flag emoji: Windows shows them as letters. The
 * number is tidied when the visitor leaves the field.
 */
export function PhoneField({
  id,
  name,
  value,
  onChange,
  invalid,
}: {
  id: string
  /** The hidden input carrying the full number in the form data. */
  name: string
  value: PhoneValue
  onChange: (value: PhoneValue, userPickedCountry?: boolean) => void
  invalid?: boolean
}) {
  const { first, rest } = useCountries()
  const dial = `+${getCountryCallingCode(value.country)}`
  // Country names come from the browser's Intl data, which differs from the
  // server's, so the full list is only built once the page is running.
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  const selected = [...first, ...rest].find((c) => c.code === value.country)

  return (
    <div className={cx("phone", invalid && "is-invalid")}>
      <label className="phone-cc">
        <span aria-hidden="true">
          <b>{value.country}</b> {dial}
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path
              d="M2 4l3 3 3-3"
              stroke="currentColor"
              fill="none"
              strokeWidth="1.5"
            />
          </svg>
        </span>
        <select
          aria-label="Country code"
          value={value.country}
          onChange={(e) =>
            onChange(
              { country: e.target.value as CountryCode, number: value.number },
              true
            )
          }
        >
          {ready ? (
            <>
              <optgroup label="Common">
                {first.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.dial})
                  </option>
                ))}
              </optgroup>
              <optgroup label="All countries">
                {rest.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.dial})
                  </option>
                ))}
              </optgroup>
            </>
          ) : (
            <option value={value.country}>{selected?.dial ?? dial}</option>
          )}
        </select>
      </label>
      <input
        id={id}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        placeholder="Phone number"
        value={value.number}
        aria-invalid={invalid || undefined}
        onChange={(e) => {
          const typed = e.target.value
          // Pasted in full international form: take the country from it.
          if (typed.trim().startsWith("+")) {
            try {
              const parsed = parsePhoneNumber(typed)
              if (parsed.country && parsed.isValid()) {
                return onChange(
                  {
                    country: parsed.country,
                    number: parsed.formatNational(),
                  },
                  true
                )
              }
            } catch {
              // Not a full number yet: keep what was typed.
            }
            return onChange({ ...value, number: typed })
          }
          onChange({ ...value, number: typed })
        }}
        // Tidied once typing is done: formatting mid-typing fights the caret.
        onBlur={() => {
          if (!value.number.trim()) return
          try {
            if (isValidPhoneNumber(value.number, value.country)) {
              onChange({
                ...value,
                number: parsePhoneNumber(
                  value.number,
                  value.country
                ).formatNational(),
              })
            }
          } catch {
            // Leave it as typed; the form flags invalid numbers.
          }
        }}
      />
      <input type="hidden" name={name} value={phoneToString(value)} />
    </div>
  )
}
