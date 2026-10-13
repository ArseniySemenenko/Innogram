# syntax=docker/dockerfile:1.4

FROM node:24-alpine AS base
RUN corepack enable
RUN npm install -g turbo
WORKDIR /app

# --- Pruner ---
FROM base AS pruner
COPY . .
RUN turbo prune notifications_consumer_microservice --docker

# --- Installer ---
FROM base AS installer
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

# --- Builder ---
FROM base AS builder
COPY --from=installer /app/ .
COPY --from=pruner /app/out/full/ .
RUN pnpm turbo run build --filter=notifications_consumer_microservice

# --- Runner ---
FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/apps/notifications_consumer_microservice/dist ./dist
COPY --from=builder /app/apps/notifications_consumer_microservice/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 4001
CMD ["node", "dist/main.js"]
