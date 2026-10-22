# syntax=docker/dockerfile:1.4

FROM node:24-alpine AS base
RUN corepack enable
WORKDIR /app

FROM base AS builder
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter=core_microservice build

FROM builder AS prod-deps
RUN pnpm --filter=core_microservice --prod deploy --legacy /prod/core

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=prod-deps /prod/core ./
COPY --from=builder /app/apps/core_microservice/dist ./dist

EXPOSE 4002
CMD ["node", "dist/main.js"]