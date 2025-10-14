# Dockerfile otimizado para Next.js com Prisma no Easypanel
FROM node:20.11-alpine AS builder

# Instalar dependências necessárias para o build
RUN apk add --no-cache libc6-compat python3 make g++ curl wget

# Diretório de trabalho
WORKDIR /app

# Configurações do Prisma para build
ENV PRISMA_CLIENT_ENGINE_TYPE=binary
ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=true
ENV PRISMA_GENERATE_DATAPROXY=false
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true
ENV DEBUG="*"
ENV PRISMA_CLIENT_FORCE_WASM=false

# Copiar apenas arquivos de dependências primeiro para melhor cache
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Instalar dependências (usando npm install em vez de ci para maior compatibilidade)
RUN npm install

# Criar diretório necessário para arquivos WASM do Prisma
RUN mkdir -p /app/node_modules/@prisma/client/runtime

# Criar arquivos vazios necessários para o Prisma
RUN touch /app/node_modules/@prisma/client/runtime/wasm-engine-edge.js
RUN touch /app/node_modules/@prisma/client/runtime/wasm-compiler-edge.js

# Copiar o resto do código
COPY . .

# Definir argumentos para variáveis de ambiente
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
ARG NODE_ENV
ARG TRUSTED_ORIGINS

# Criar arquivo .env dinamicamente com os argumentos recebidos
RUN echo "# Arquivo .env gerado automaticamente durante o build" > .env && \
    echo "DATABASE_URL=\"${DATABASE_URL:-postgresql://postgres:postgres@localhost:5432/agendaai}\"" >> .env && \
    echo "NEXTAUTH_URL=\"${NEXTAUTH_URL:-http://localhost:3000}\"" >> .env && \
    echo "NEXTAUTH_SECRET=\"${NEXTAUTH_SECRET:-build-secret-not-for-production}\"" >> .env && \
    echo "CLOUDINARY_CLOUD_NAME=\"${CLOUDINARY_CLOUD_NAME:-build-cloud}\"" >> .env && \
    echo "CLOUDINARY_API_KEY=\"${CLOUDINARY_API_KEY:-build-key}\"" >> .env && \
    echo "CLOUDINARY_API_SECRET=\"${CLOUDINARY_API_SECRET:-build-secret}\"" >> .env && \
    echo "EMAIL_SERVER_HOST=\"${EMAIL_SERVER_HOST:-smtp.example.com}\"" >> .env && \
    echo "EMAIL_SERVER_PORT=\"${EMAIL_SERVER_PORT:-587}\"" >> .env && \
    echo "EMAIL_SERVER_USER=\"${EMAIL_SERVER_USER:-user@example.com}\"" >> .env && \
    echo "EMAIL_SERVER_PASSWORD=\"${EMAIL_SERVER_PASSWORD:-build-password}\"" >> .env && \
    echo "EMAIL_FROM=\"${EMAIL_FROM:-noreply@example.com}\"" >> .env && \
    echo "NODE_ENV=\"${NODE_ENV:-production}\"" >> .env && \
    echo "TRUSTED_ORIGINS=\"${TRUSTED_ORIGINS:-https://vendamais-front.dgohio.easypanel.host,http://localhost:3000}\"" >> .env && \
    cat .env

# Gerar cliente Prisma com suporte explícito para debian-openssl-3.0.x
RUN npx prisma generate --schema=./prisma/schema.prisma || (echo "Prisma generate failed, retrying with manual path creation" && mkdir -p /app/src/generated/prisma && npx prisma generate --schema=./prisma/schema.prisma)

# Verificar geração do cliente Prisma
RUN ls -la /app/src/generated/prisma || echo "Client not generated at expected location"

# Construir o aplicativo
RUN npm run build && ls -la /app/.next || (echo "Build failed! Debugging info:" && cat /app/.next/error.log 2>/dev/null || echo "No error log found")

# Imagem de produção
FROM node:20.11-alpine AS runner

# Instalar dependências necessárias para produção
RUN apk add --no-cache libc6-compat curl wget

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PRISMA_CLIENT_ENGINE_TYPE=binary
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copiar dependências e arquivos de build da etapa anterior
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/generated ./src/generated

# Verificar conteúdo copiado
RUN ls -la /app && \
    ls -la /app/.next && \
    ls -la /app/.next/server && \
    ls -la /app/src/generated/prisma || echo "Diretório não encontrado" && \
    echo "Node version: $(node -v)" && \
    echo "NPM version: $(npm -v)"

# Verificar se o build existe antes de configurar usuários
RUN echo "Verificando se o build de produção está presente:" && \
    ls -la /app/.next/ && \
    test -f /app/.next/BUILD_ID || (echo "BUILD_ID não encontrado!" && exit 1) && \
    echo "Build de produção confirmado!"

# Configurar usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    chown -R nextjs:nodejs /app

USER nextjs

# Expor a porta do servidor
EXPOSE 3000

# Healthcheck mais simples e confiável
HEALTHCHECK --interval=10s --timeout=5s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:3000/api/version || wget -q --spider http://localhost:3000/api/version || exit 1

# Comando para iniciar o aplicativo com verificação de build
CMD ["sh", "-c", "if [ ! -d '/app/.next' ] || [ ! -f '/app/.next/BUILD_ID' ]; then echo 'ERROR: Build de produção não encontrado. Verifique se o build foi executado corretamente.'; ls -la /app/.next/; exit 1; fi && npm start"]
