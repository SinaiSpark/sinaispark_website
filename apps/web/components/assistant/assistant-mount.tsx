import { Assistant } from "@/components/assistant/assistant"
import { getAssistantSettings } from "@/lib/assistant/content"
import { assistantEnabled } from "@/lib/assistant/db"
import { getContactDetails } from "@/lib/site-content"

/**
 * Puts the assistant on every page when it's switched on in the CMS
 * ("Assistant settings") and the site has its database. The WhatsApp button
 * uses the number from the CMS's contact details.
 */
export async function AssistantMount() {
  if (!assistantEnabled()) return null
  const settings = await getAssistantSettings()
  if (!settings.enabled) return null
  const whatsapp = await getContactDetails()
    .then((contact) => contact.whatsapp)
    .catch(() => null)
  return (
    <Assistant
      name={settings.name}
      whatsapp={whatsapp}
      whatsappLabel={settings.whatsappLabel}
    />
  )
}
