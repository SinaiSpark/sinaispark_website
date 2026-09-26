import { Pool } from "pg"

/**
 * The assistant's own tables, in the `assistant` schema of the CMS's Postgres
 * (Strapi never touches schemas it didn't create). The site otherwise talks
 * to the CMS only through its API; this is the one direct connection, because
 * a streamed chat reply can't afford an extra hop per message.
 *
 * Server only. ASSISTANT_DATABASE_URL should be a role limited to this
 * schema in production; locally the CMS's own user is fine.
 */

/** Width of the embedding model's vectors (bge-small-en-v1.5). */
export const DIMENSIONS = 384

// Dev reloads re-evaluate modules; keep one pool per process, not per reload.
const shared = globalThis as unknown as {
  assistantPool?: Pool
  assistantSchema?: Promise<void>
}

export function assistantEnabled() {
  return Boolean(process.env.ASSISTANT_DATABASE_URL)
}

function pool() {
  const url = process.env.ASSISTANT_DATABASE_URL
  if (!url) throw new Error("ASSISTANT_DATABASE_URL is not set")
  shared.assistantPool ??= new Pool({
    connectionString: url,
    max: 5,
    idleTimeoutMillis: 30_000,
  })
  return shared.assistantPool
}

export async function sql<T = Record<string, unknown>>(
  text: string,
  values: unknown[] = []
): Promise<T[]> {
  await ensureSchema()
  return (await pool().query(text, values)).rows as T[]
}

/** pgvector's text form: "[0.1,0.2,...]". */
export const vector = (values: number[]) => `[${values.join(",")}]`

/**
 * Creates the schema on first use. Idempotent, so every process runs it
 * once; changes to existing tables go in as further IF NOT EXISTS steps.
 * CREATE EXTENSION needs a superuser the first time; in production run it
 * once by hand (see apps/web/README.md) and the role here never needs it.
 */
function ensureSchema() {
  shared.assistantSchema ??= migrate().catch((error) => {
    shared.assistantSchema = undefined
    throw error
  })
  return shared.assistantSchema
}

async function migrate() {
  const db = pool()
  const { rows } = await db.query(
    "select 1 from pg_extension where extname = 'vector'"
  )
  if (!rows.length) await db.query("create extension if not exists vector")

  await db.query(`
    create schema if not exists assistant;

    -- Searchable passages: site pages, FAQs and uploaded documents.
    create table if not exists assistant.chunks (
      id bigserial primary key,
      source text not null,
      url text,
      title text not null,
      heading text,
      content text not null,
      hash text not null,
      embedding vector(${DIMENSIONS}) not null,
      updated_at timestamptz not null default now()
    );
    create index if not exists chunks_source on assistant.chunks (source);
    create index if not exists chunks_embedding on assistant.chunks
      using hnsw (embedding vector_cosine_ops);

    -- Questions with a written answer: menu topics and FAQs. A typed
    -- question close enough to one of these gets that answer, free.
    create table if not exists assistant.intents (
      id bigserial primary key,
      kind text not null,
      ref text not null,
      question text not null,
      answer text,
      url text,
      hash text not null,
      embedding vector(${DIMENSIONS}) not null
    );
    create index if not exists intents_kind on assistant.intents (kind);

    -- Generated answers, reused for questions that mean the same thing.
    create table if not exists assistant.answer_cache (
      id bigserial primary key,
      question text not null,
      answer text not null,
      sources jsonb not null default '[]',
      hits integer not null default 0,
      embedding vector(${DIMENSIONS}) not null,
      created_at timestamptz not null default now()
    );

    create table if not exists assistant.sessions (
      id uuid primary key,
      stage text not null default 'open',
      name text,
      email text,
      phone text,
      phone_country text,
      pending jsonb,
      topics text[] not null default '{}',
      service text,
      market text,
      page text,
      last_topic text,
      has_enquiry boolean not null default false,
      generated integer not null default 0,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    create table if not exists assistant.messages (
      id bigserial primary key,
      session_id uuid not null references assistant.sessions (id) on delete cascade,
      role text not null,
      content text not null,
      meta jsonb,
      created_at timestamptz not null default now()
    );
    create index if not exists messages_session on assistant.messages (session_id, id);
  `)
}
