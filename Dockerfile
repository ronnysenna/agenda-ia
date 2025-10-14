# Multi-stage build para otimizar tamanho final
FROM node:20-alpine AS dependencies

# Instalar dependências de sistema necessárias
RUN apk add --no-cache \
    libc6-compat \
    openssl \
    ca-certificates

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependências
RUN npm ci --frozen-lockfile

# Stage 2: Build
FROM node:20-alpine AS builder

# Instalar dependências de build
RUN apk add --no-cache \
    libc6-compat \
    openssl \
    ca-certificates \
    python3 \
    make \
    g++

# Configurar Prisma para Alpine
ENV PRISMA_CLIENT_ENGINE_TYPE=binary
ENV PRISMA_CLI_BINARY_TARGETS=linux-musl-openssl-3.0.x
ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1

WORKDIR /app

# Copiar dependências do stage anterior
COPY --from=dependencies /app/node_modules ./node_modules
COPY package*.json ./

# Copiar código fonte e schema
COPY prisma ./prisma/
COPY . .

# Argumentos do EasyPanel com valores padrão seguros
ARG DATABASE_URL
ARG NEXTAUTH_URL
ARG NEXTAUTH_SECRET
ARG CLOUDINARY_CLOUD_NAME
ARG CLOUDINARY_API_KEY
ARG CLOUDINARY_API_SECRET
ARG EMAIL_SERVER_HOST
ARG EMAIL_SERVER_PORT
ARG EMAIL_SERVER_USER
ARG EMAIL_SERVER_PASSWORD
ARG EMAIL_FROM
ARG TRUSTED_ORIGINS

# Argumentos de build do EasyPanel
ARG DATABASE_URL
ARG NEXTAUTH_URL
ARG NEXTAUTH_SECRET
ARG CLOUDINARY_CLOUD_NAME
ARG CLOUDINARY_API_KEY
ARG CLOUDINARY_API_SECRET
ARG EMAIL_SERVER_HOST
ARG EMAIL_SERVER_PORT
ARG EMAIL_SERVER_USER
ARG EMAIL_SERVER_PASSWORD
ARG EMAIL_FROM
ARG TRUSTED_ORIGINS

# Criar .env para build
RUN echo "DATABASE_URL=${DATABASE_URL}" > .env && \
    echo "NEXTAUTH_URL=${NEXTAUTH_URL}" >> .env && \
    echo "NEXTAUTH_SECRET=${NEXTAUTH_SECRET}" >> .env && \
    echo "NODE_ENV=production" >> .env && \
    echo "TRUSTED_ORIGINS=${TRUSTED_ORIGINS}" >> .env

# Gerar Prisma Client
RUN npx prisma generate

# Build Next.js com log detalhado
RUN npm run build > build.log 2>&1 || (cat build.log && exit 1)

# Verificar build
RUN ls -la .next && test -f .next/BUILD_ID && echo "✅ BUILD_ID: $(cat .next/BUILD_ID)"

# Stage 3: Runtime
FROM node:20-alpine AS runtime

# Instalar apenas dependências runtime
RUN apk add --no-cache \
    libc6-compat \
    curl \
    openssl \
    ca-certificates

# Configurar ambiente de produção
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=80
ENV HOSTNAME="0.0.0.0"

WORKDIR /app

# Copiar arquivos necessários do builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/generated/prisma ./src/generated/prisma

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 && \
    chown -R nextjs:nodejs /app

# Verificar se o build foi copiado corretamente
RUN test -f .next/BUILD_ID && echo "✅ Runtime ready - BUILD_ID: $(cat .next/BUILD_ID)"

USER nextjs

# Expor porta
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=15s --start-period=45s --retries=3 \
    CMD curl -f http://localhost:80/api/version || exit 1

# Inicializar aplicação
CMD ["npm", "start"]
