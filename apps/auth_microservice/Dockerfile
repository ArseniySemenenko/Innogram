# syntax=docker/dockerfile:1.4

FROM node:24-alpine AS base
RUN corepack enable
WORKDIR /app

FROM base AS builder
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter=auth_microservice db:generate
RUN pnpm --filter=auth_microservice build

FROM builder AS prod-deps
RUN pnpm --filter=auth_microservice --prod deploy /prod/auth

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=prod-deps /prod/auth ./

EXPOSE 4001

COPY prisma ./prisma
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]