# syntax=docker/dockerfile:1.4

FROM node:24-alpine AS base
RUN corepack enable
WORKDIR /app

# --- builder: ставим всё и собираем ---
FROM base AS builder
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter=auth_microservice build

# --- prod-deps: deploy только прод-зависимости для этого приложения ---
FROM builder AS prod-deps
RUN pnpm --filter=auth_microservice --prod deploy /prod/auth

# --- runner: копируем только самодостаточный deploy ---
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=prod-deps /prod/auth ./
# dist уже внутри /prod/auth, если он был в files/ или .gitignore
# Если dist не попал — скопируйте отдельно:
# COPY --from=builder /app/apps/auth_microservice/dist ./dist

EXPOSE 4001
CMD ["node", "dist/main.js"]