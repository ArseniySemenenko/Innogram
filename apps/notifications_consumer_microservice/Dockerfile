# syntax=docker/dockerfile:1.4

FROM node:24-alpine AS base
RUN corepack enable
WORKDIR /app

FROM base AS builder
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter=notifications_consumer_microservice build

FROM builder AS prod-deps
RUN pnpm --filter=notifications_consumer_microservice --prod deploy --legacy /prod/consumer

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=prod-deps /prod/consumer ./
COPY --from=builder /app/apps/notifications_consumer_microservice/dist ./dist

# No EXPOSE: consumer doesn't listen on a port

CMD ["node", "dist/main.js"]