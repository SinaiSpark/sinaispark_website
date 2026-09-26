import type { FeatureExtractionPipeline } from "@huggingface/transformers"

/**
 * Text embeddings from a small open model (bge-small-en-v1.5, 384 dims)
 * running inside this Node process: no API key, no per-call cost, and the
 * visitor's words never leave the server. The ~35MB model downloads on first
 * use into ASSISTANT_MODEL_CACHE (default .cache/models) and loads in a few
 * seconds; after that an embedding takes milliseconds.
 */
const MODEL = "Xenova/bge-small-en-v1.5"

/** bge's instruction for the query side of question → passage search. */
const QUERY_PREFIX = "Represent this sentence for searching relevant passages: "

const shared = globalThis as unknown as {
  assistantEmbedder?: Promise<FeatureExtractionPipeline>
}

function embedder() {
  shared.assistantEmbedder ??= (async () => {
    const { pipeline, env } = await import("@huggingface/transformers")
    env.cacheDir = process.env.ASSISTANT_MODEL_CACHE ?? ".cache/models"
    return pipeline("feature-extraction", MODEL, { dtype: "q8" })
  })().catch((error) => {
    shared.assistantEmbedder = undefined
    throw error
  })
  return shared.assistantEmbedder
}

async function run(texts: string[]): Promise<number[][]> {
  if (!texts.length) return []
  const embed = await embedder()
  const out: number[][] = []
  // Small batches keep memory flat when a whole site is indexed.
  for (let i = 0; i < texts.length; i += 16) {
    const batch = texts.slice(i, i + 16)
    const tensor = await embed(batch, { pooling: "cls", normalize: true })
    out.push(...(tensor.tolist() as number[][]))
  }
  return out
}

/** Passages to be searched: page sections, documents. */
export const embedPassages = (texts: string[]) => run(texts)

/** A visitor's question, for searching passages. */
export async function embedQuery(text: string) {
  return (await run([QUERY_PREFIX + text]))[0]!
}

/** Questions compared with other questions (both sides unprefixed). */
export const embedQuestions = (texts: string[]) => run(texts)
