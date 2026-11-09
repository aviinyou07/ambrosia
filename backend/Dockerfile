# syntax=docker/dockerfile:1

############################################
# Stage 1 — install full deps & compile TS
############################################
FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

############################################
# Stage 2 — production dependencies only
############################################
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

############################################
# Stage 3 — runtime
############################################
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# curl is used by the container healthcheck
RUN apk add --no-cache curl

COPY --from=deps    /app/node_modules ./node_modules
COPY --from=builder /app/dist         ./dist
COPY package.json ./
# SQL files are shipped so migrations can be run from inside the container
COPY src/database ./src/database

# Fallback local upload dir (R2 is the primary store)
RUN mkdir -p /app/uploads && chown -R node:node /app/uploads

USER node
EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -fsS http://127.0.0.1:5000/api/health || exit 1

CMD ["node", "dist/server.js"]
