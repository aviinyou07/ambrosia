# syntax=docker/dockerfile:1

############################################
# Stage 1 — install deps, compile TS, then
# prune back to production dependencies.
#
# A single `npm ci` serves both the build and the runtime tree. An earlier
# version of this file had separate `builder` and `deps` stages, which BuildKit
# runs concurrently — two full dependency downloads at once, which is slower and
# flaky on constrained networks (it failed with ECONNRESET).
############################################
FROM node:22-alpine AS builder
WORKDIR /app

# Be patient with a flaky registry rather than failing the whole deploy.
ENV NPM_CONFIG_FETCH_RETRIES=5
ENV NPM_CONFIG_FETCH_RETRY_MINTIMEOUT=20000
ENV NPM_CONFIG_FETCH_RETRY_MAXTIMEOUT=120000
ENV NPM_CONFIG_AUDIT=false
ENV NPM_CONFIG_FUND=false

COPY package.json package-lock.json ./
# --include=dev is required: Coolify injects NODE_ENV=production into the build,
# and `npm ci` silently skips devDependencies when it is set, which left tsc
# missing ("sh: tsc: not found").
RUN npm ci --include=dev

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Drop devDependencies in place; dist/ is already built.
RUN npm prune --omit=dev

############################################
# Stage 2 — runtime
############################################
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# curl is used by the container healthcheck
RUN apk add --no-cache curl

COPY --from=builder /app/node_modules ./node_modules
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
