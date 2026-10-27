#!/usr/bin/env sh
# Ejecuta las pruebas de Playwright dentro de la misma imagen que la CI, para que las
# capturas de regresión visual coincidan. Los argumentos van a `playwright test`:
#   sh scripts/e2e-docker.sh                      # comprobar
#   sh scripts/e2e-docker.sh vrt --update-snapshots   # regenerar las capturas
# Mantener la versión de la imagen igual que la de @playwright/test.
set -eu

IMAGE="mcr.microsoft.com/playwright:v1.64.1-noble"

# La CI de GitHub es x86_64: se fija la plataforma para que el renderizado coincida
# aunque se ejecute en un Mac con Apple Silicon.
docker run --rm --init --ipc=host --platform linux/amd64 \
  -v "$PWD":/work -w /work \
  -v /work/node_modules \
  -v pnpm-store:/root/.local/share/pnpm \
  "$IMAGE" \
  sh -c 'corepack enable && pnpm install --frozen-lockfile && pnpm test:e2e "$@"' sh "$@"
