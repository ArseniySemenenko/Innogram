# syntax=docker/dockerfile:1.4

FROM node:24-alpine AS base
RUN corepack enable
WORKDIR /app

FROM base AS deps
COPY . .
RUN pnpm install --frozen-lockfile

FROM deps AS builder
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter=client_app build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Копируем standalone целиком — сохраняется структура apps/client_app/
COPY --from=builder /app/apps/client_app/.next/standalone ./

# static и public кладём относительно server.js
COPY --from=builder /app/apps/client_app/.next/static ./apps/client_app/.next/static
COPY --from=builder /app/apps/client_app/public ./apps/client_app/public

EXPOSE 3000
CMD ["node", "apps/client_app/server.js"]