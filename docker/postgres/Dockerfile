# Postgres 17 (Alpine, like before) with the pgvector extension, for the
# assistant's search index. Staying on Alpine keeps existing data volumes
# valid: moving a cluster between musl and glibc images changes how text
# sorts and can silently corrupt text indexes.
FROM postgres:17-alpine

ARG PGVECTOR_VERSION=v0.8.1

RUN apk add --no-cache --virtual .build-deps git build-base \
  && git clone --branch "$PGVECTOR_VERSION" --depth 1 \
    https://github.com/pgvector/pgvector.git /tmp/pgvector \
  && cd /tmp/pgvector \
  # Portable build (no -march=native) and no LLVM bitcode, which Alpine's
  # Postgres would otherwise try to compile with a clang it doesn't ship.
  && make OPTFLAGS="" with_llvm=no \
  && make install with_llvm=no \
  && cd / && rm -rf /tmp/pgvector \
  && apk del .build-deps
