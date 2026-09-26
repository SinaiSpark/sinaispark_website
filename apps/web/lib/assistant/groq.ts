/**
 * Groq's OpenAI-compatible chat API, called with fetch (no SDK).
 *
 * The site runs on Groq's free plan, where every model has its own daily
 * quota. So answers try a chain of models: when one is rate limited (429) or
 * down, the same request goes to the next, which multiplies the free
 * allowance. Models are env config, so a change needs no deploy of code.
 */
const API = "https://api.groq.com/openai/v1/chat/completions"

const ANSWER_MODELS = (
  process.env.ASSISTANT_MODELS ??
  "openai/gpt-oss-120b,openai/gpt-oss-20b,llama-3.3-70b-versatile"
)
  .split(",")
  .map((m) => m.trim())
  .filter(Boolean)

/** Small jobs: rewriting follow-ups, reading details out of a reply. */
const FAST_MODELS = (
  process.env.ASSISTANT_FAST_MODELS ?? "llama-3.1-8b-instant,openai/gpt-oss-20b"
)
  .split(",")
  .map((m) => m.trim())
  .filter(Boolean)

export interface ChatMessage {
  role: "system" | "user" | "assistant"
  content: string
}

/** Every model in the chain is rate limited or unavailable. */
export class ModelsBusy extends Error {}

export function groqConfigured() {
  return Boolean(process.env.GROQ_API_KEY)
}

function body(model: string, messages: ChatMessage[], extra: object) {
  return JSON.stringify({
    model,
    messages,
    // Answers should repeat the site, not improvise.
    temperature: 0,
    // gpt-oss reasons before answering; "low" keeps the first word quick and
    // spends fewer of the day's tokens. Other models reject these fields.
    ...(model.startsWith("openai/gpt-oss")
      ? { reasoning_effort: "low", include_reasoning: false }
      : {}),
    ...extra,
  })
}

async function post(model: string, messages: ChatMessage[], extra: object) {
  const key = process.env.GROQ_API_KEY
  if (!key) throw new ModelsBusy("GROQ_API_KEY is not set")
  return fetch(API, {
    method: "POST",
    headers: {
      authorization: `Bearer ${key}`,
      "content-type": "application/json",
    },
    body: body(model, messages, extra),
    signal: AbortSignal.timeout(30_000),
  })
}

/**
 * Tries each model until one answers. Any failure moves on: a 429 is the
 * free quota, a 5xx is Groq, and a 400 is usually a model that was retired
 * or doesn't take a parameter, which the next one may well accept.
 */
async function firstAvailable(
  models: string[],
  messages: ChatMessage[],
  extra: object
) {
  for (const model of models) {
    try {
      const res = await post(model, messages, extra)
      if (res.ok) return res
      const detail = await res.text().catch(() => "")
      console.warn(
        `[assistant] ${model} returned ${res.status}: ${detail.slice(0, 200)}`
      )
    } catch (error) {
      console.warn(`[assistant] ${model} failed:`, (error as Error).message)
    }
  }
  throw new ModelsBusy("No model available")
}

/** Streams the answer text as it's generated. */
export async function* streamAnswer(
  messages: ChatMessage[],
  maxTokens = 700
): AsyncGenerator<string> {
  const res = await firstAvailable(ANSWER_MODELS, messages, {
    stream: true,
    max_completion_tokens: maxTokens,
  })
  const reader = res.body!.pipeThrough(new TextDecoderStream()).getReader()
  let buffer = ""
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += value
    const lines = buffer.split("\n")
    buffer = lines.pop() ?? ""
    for (const line of lines) {
      const data = line.startsWith("data:") ? line.slice(5).trim() : ""
      if (!data || data === "[DONE]") continue
      try {
        const chunk = JSON.parse(data) as {
          choices?: { delta?: { content?: string } }[]
        }
        const text = chunk.choices?.[0]?.delta?.content
        if (text) yield text
      } catch {
        // A partial line; the rest arrives with the next read.
      }
    }
  }
}

/** A short JSON reply from the fast models, or null if none could answer. */
export async function completeJson<T>(
  messages: ChatMessage[],
  maxTokens = 200
): Promise<T | null> {
  try {
    const res = await firstAvailable(FAST_MODELS, messages, {
      response_format: { type: "json_object" },
      max_completion_tokens: maxTokens,
    })
    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[]
    }
    return JSON.parse(json.choices?.[0]?.message?.content ?? "null") as T
  } catch (error) {
    console.warn("[assistant] fast model:", (error as Error).message)
    return null
  }
}
