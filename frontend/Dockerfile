# syntax=docker/dockerfile:1

############################################
# Stage 1 — dependencies
############################################
FROM node:22-alpine AS deps
WORKDIR /app

# Be patient with a flaky registry rather than failing the whole deploy.
ENV NPM_CONFIG_FETCH_RETRIES=5
ENV NPM_CONFIG_FETCH_RETRY_MINTIMEOUT=20000
ENV NPM_CONFIG_FETCH_RETRY_MAXTIMEOUT=120000
ENV NPM_CONFIG_AUDIT=false
ENV NPM_CONFIG_FUND=false

COPY package.json package-lock.json ./
# --include=dev is required: NODE_ENV=production in the build environment makes
# `npm ci` skip devDependencies, which holds the Next/Tailwind/TS toolchain.
RUN npm ci --include=dev

############################################
# Stage 2 — build
############################################
FROM node:22-alpine AS builder
WORKDIR /app

# NEXT_PUBLIC_* values are inlined into the client bundle at BUILD time,
# so they must arrive as build args (mark these as Build Variables in Coolify).
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_R2_PUBLIC_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_R2_PUBLIC_URL=$NEXT_PUBLIC_R2_PUBLIC_URL
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

############################################
# Stage 3 — runtime (standalone output)
############################################
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# curl is required by Coolify's container health check, which runs INSIDE the
# container. node:22-alpine ships neither curl nor a usable wget, so without
# this the probe fails and Coolify rolls the deployment back.
RUN apk add --no-cache curl

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
