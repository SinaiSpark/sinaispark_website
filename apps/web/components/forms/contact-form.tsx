"use client"

import { useState } from "react"

import { contactFormSchema, SERVICE_OPTIONS } from "@/lib/contact-schema"
import { SITE } from "@/lib/site-config"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Textarea } from "@workspace/ui/components/textarea"
import { cn } from "@workspace/ui/lib/utils"

type FieldErrors = Partial<Record<string, string>>

const inputClass = "bg-background"

function FieldWrap({
  label,
  htmlFor,
  error,
  optional,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  optional?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5" data-invalid={!error || undefined}>
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
        {optional ? (
          <span className="ml-1 font-normal text-muted-foreground">
            (optional)
          </span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}

/**
 * Consultation form — validates client-side against lib/contact-schema.
 * Submissions compose a pre-filled email to info@sinaispark.com until the
 * backend endpoint lands in Phase 4 (plan §6 Phase 4).
 */
export function ContactForm() {
  const [errors, setErrors] = useState<FieldErrors>({})
  const [service, setService] = useState<string>("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const raw = Object.fromEntries(formData.entries())

    const result = contactFormSchema.safeParse(raw)
    if (!result.success) {
      const fieldErrors: FieldErrors = {}
      for (const issue of result.error.issues) {
        const key = String(issue.path[0])
        if (!fieldErrors[key]) fieldErrors[key] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    const data = result.data
    const body = [
      `Name: ${data.fullName}`,
      `Company: ${data.companyName || "—"}`,
      `Email: ${data.email}`,
      `Phone/WhatsApp: ${data.phone}`,
      `Country: ${data.country}`,
      `Service of interest: ${data.serviceOfInterest}`,
      "",
      data.message,
    ].join("\n")

    const mailto = `mailto:${SITE.email}?subject=${encodeURIComponent(
      `Consultation request — ${data.serviceOfInterest}`
    )}&body=${encodeURIComponent(body)}`
    window.location.href = mailto
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FieldWrap label="Full name" htmlFor="fullName" error={errors.fullName}>
          <Input
            id="fullName"
            name="fullName"
            autoComplete="name"
            aria-invalid={!!errors.fullName || undefined}
            className={inputClass}
          />
        </FieldWrap>
        <FieldWrap
          label="Company name"
          htmlFor="companyName"
          error={errors.companyName}
          optional
        >
          <Input
            id="companyName"
            name="companyName"
            autoComplete="organization"
            className={inputClass}
          />
        </FieldWrap>
        <FieldWrap label="Email" htmlFor="email" error={errors.email}>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email || undefined}
            className={inputClass}
          />
        </FieldWrap>
        <FieldWrap
          label="Phone or WhatsApp number"
          htmlFor="phone"
          error={errors.phone}
        >
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+966 5X XXX XXXX"
            aria-invalid={!!errors.phone || undefined}
            className={inputClass}
          />
        </FieldWrap>
        <FieldWrap label="Country" htmlFor="country" error={errors.country}>
          <Input
            id="country"
            name="country"
            autoComplete="country-name"
            aria-invalid={!!errors.country || undefined}
            className={inputClass}
          />
        </FieldWrap>
        <FieldWrap
          label="Service of interest"
          htmlFor="serviceOfInterest"
          error={errors.serviceOfInterest}
        >
          <Select
            name="serviceOfInterest"
            value={service}
            onValueChange={(value) => {
              setService(
                typeof value === "string" ? value : String(value ?? "")
              )
            }}
            items={SERVICE_OPTIONS.map((option) => ({
              label: option,
              value: option,
            }))}
          >
            <SelectTrigger
              id="serviceOfInterest"
              aria-invalid={!!errors.serviceOfInterest || undefined}
            >
              <SelectValue placeholder="Choose a service" />
              {/* Hidden input so the value participates in FormData */}
              <input type="hidden" name="serviceOfInterest" value={service} />
            </SelectTrigger>
            <SelectContent>
              {SERVICE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldWrap>
      </div>

      <FieldWrap label="Message" htmlFor="message" error={errors.message}>
        <Textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Tell us about your business and where you want to operate."
          aria-invalid={!!errors.message || undefined}
          className={cn(inputClass)}
        />
      </FieldWrap>

      <Button
        type="submit"
        className="h-11 w-full rounded-md text-sm sm:w-auto sm:px-8"
      >
        Request Free Consultation
      </Button>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Submitting opens your email app with your message pre-filled — or reach
        us directly on WhatsApp for the fastest response.
      </p>
    </form>
  )
}
