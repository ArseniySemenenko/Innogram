# syntax=docker/dockerfile:1.4
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN npm install -g turbo
WORKDIR /app

# --- Pruner ---
FROM base AS pruner
COPY . .
RUN turbo prune client_app --docker

# --- Installer ---
FROM base AS installer
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

# --- Builder ---
FROM base AS builder
COPY --from=installer /app/ .
COPY --from=pruner /app/out/full/ .
RUN pnpm turbo run build --filter=client_app

# --- Runner ---
FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/apps/client_app/.next/standalone ./
COPY --from=builder /app/apps/client_app/.next/static ./apps/client_app/.next/static
COPY --from=builder /app/apps/client_app/public ./apps/client_app/public
EXPOSE 3000
CMD ["node", "apps/client_app/server.js"]
