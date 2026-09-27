import { useState } from "react"
import {
  Box,
  Button,
  DateTimePicker,
  Flex,
  Typography,
} from "@strapi/design-system"
import { Clock } from "@strapi/icons"
import {
  unstable_useDocumentActions as useDocumentActions,
  useForm,
  useNotification,
} from "@strapi/strapi/admin"

/** The content types with a "Publish at" field (see config/cron-tasks.ts). */
export const SCHEDULABLE = [
  "api::blog-post.blog-post",
  "api::research-article.research-article",
  "api::event.event",
]

type Props = {
  model: string
  collectionType: string
  documentId?: string
  activeTab: string | null
  document?: { status?: string; publishAt?: string | null } | null
  meta?: unknown
}

const when = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
})

/**
 * "Schedule" beside Publish: pick a time and the draft goes live by itself
 * (config/cron-tasks.ts runs every minute). It checks the draft as Publish
 * would first, so a missing field is caught now rather than at 9am tomorrow.
 * Only the first publish can be scheduled.
 */
const ScheduleContent = ({
  model,
  collectionType,
  documentId,
  document,
}: Props) => {
  const { toggleNotification } = useNotification()
  const { update } = useDocumentActions()
  const modified = useForm("SchedulePanel", (s) => s.modified)
  const validate = useForm("SchedulePanel", (s) => s.validate)
  const getValues = useForm("SchedulePanel", (s) => s.getValues)
  const resetForm = useForm("SchedulePanel", (s) => s.resetForm)
  const scheduled = useForm(
    "SchedulePanel",
    (s) => (s.values as { publishAt?: string | null }).publishAt ?? null
  )
  const [picking, setPicking] = useState(false)
  const [at, setAt] = useState<Date | undefined>(() => {
    const d = new Date(Date.now() + 24 * 60 * 60 * 1000)
    d.setHours(9, 0, 0, 0)
    return d
  })
  const [busy, setBusy] = useState(false)

  if (!documentId) {
    return (
      <Typography variant="pi" textColor="neutral600">
        Save the draft first, then pick when it goes live.
      </Typography>
    )
  }
  if (document?.status && document.status !== "draft") {
    return (
      <Typography variant="pi" textColor="neutral600">
        Already live. Changes go out when you press Publish.
      </Typography>
    )
  }

  const save = async (publishAt: string | null) => {
    if (modified) {
      toggleNotification({
        type: "warning",
        message: "Save your changes first, then schedule.",
      })
      return
    }
    if (publishAt) {
      if (new Date(publishAt).getTime() <= Date.now()) {
        toggleNotification({
          type: "warning",
          message: "Pick a time in the future, or press Publish now.",
        })
        return
      }
      // Same checks as Publish, so the scheduled publish can't fail on them.
      const { errors } = await validate(true, { status: "published" })
      if (errors) {
        toggleNotification({
          type: "danger",
          message:
            "Fill in the fields marked in red first: the article can't go live without them.",
        })
        return
      }
    }

    setBusy(true)
    try {
      const res = await update({ collectionType, model, documentId }, {
        publishAt,
      } as Record<string, unknown>)
      if ("data" in res) {
        resetForm({ ...getValues(), publishAt })
        setPicking(false)
        toggleNotification({
          type: "success",
          message: publishAt
            ? `Scheduled for ${when.format(new Date(publishAt))}.`
            : "No longer scheduled.",
        })
      }
    } finally {
      setBusy(false)
    }
  }

  if (scheduled && !picking) {
    const date = new Date(scheduled)
    const overdue = date.getTime() < Date.now() - 2 * 60 * 1000
    return (
      <Flex direction="column" alignItems="stretch" gap={3} width="100%">
        <Box
          padding={3}
          hasRadius
          background={overdue ? "danger100" : "primary100"}
        >
          <Flex gap={2} alignItems="flex-start">
            <Box color={overdue ? "danger600" : "primary600"} paddingTop="2px">
              <Clock />
            </Box>
            <Flex direction="column" alignItems="flex-start" gap={1}>
              <Typography
                variant="omega"
                fontWeight="semiBold"
                textColor={overdue ? "danger700" : "primary700"}
              >
                {overdue ? "Missed its time" : "Goes live"}
              </Typography>
              <Typography variant="pi" textColor="neutral700">
                {when.format(date)}
              </Typography>
              {overdue && (
                <Typography variant="pi" textColor="neutral700">
                  A required field is probably empty. Fix it and press Publish.
                </Typography>
              )}
            </Flex>
          </Flex>
        </Box>
        <Flex gap={2}>
          <Button
            variant="secondary"
            fullWidth
            disabled={busy}
            onClick={() => {
              setAt(date)
              setPicking(true)
            }}
          >
            Change
          </Button>
          <Button
            variant="danger-light"
            fullWidth
            loading={busy}
            onClick={() => save(null)}
          >
            Unschedule
          </Button>
        </Flex>
      </Flex>
    )
  }

  return (
    <Flex direction="column" alignItems="stretch" gap={2} width="100%">
      <DateTimePicker
        aria-label="Publish at"
        value={at}
        onChange={(value) => setAt(value ?? undefined)}
        minDate={new Date()}
        step={15}
        clearLabel="Clear"
      />
      <Flex gap={2}>
        {picking && (
          <Button
            variant="tertiary"
            fullWidth
            disabled={busy}
            onClick={() => setPicking(false)}
          >
            Cancel
          </Button>
        )}
        <Button
          fullWidth
          variant="secondary"
          startIcon={<Clock />}
          loading={busy}
          disabled={!at}
          onClick={() => at && save(at.toISOString())}
        >
          Schedule
        </Button>
      </Flex>
      <Typography variant="pi" textColor="neutral600">
        Goes live by itself at this time. Save any changes first.
      </Typography>
    </Flex>
  )
}

/** Registered with addEditViewSidePanel; hidden on other content types. */
export const SchedulePanel = (props: Props) => {
  if (!SCHEDULABLE.includes(props.model) || props.activeTab === "published") {
    return null
  }
  return {
    title: "Schedule",
    content: <ScheduleContent {...props} />,
  }
}
