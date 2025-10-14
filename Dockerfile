# Dockerfile otimizado para produção no EasyPanel
FROM node:20-alpine AS base

# Instalar dependências do sistema necessárias
RUN apk add --no-cache libc6-compat curl wget bash openssl ca-certificates

# Definir variáveis de ambiente para produção
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PRISMA_CLIENT_ENGINE_TYPE=binary
ENV PRISMA_CLI_BINARY_TARGETS=linux-musl-openssl-3.0.x

WORKDIR /app

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

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências com cache otimizado
RUN npm ci --only=production --no-audit --no-fund && \
    npm cache clean --force

# Copiar schema do Prisma
COPY prisma ./prisma/

# Gerar cliente Prisma com configurações específicas para Alpine
RUN npx prisma generate

# Copiar código fonte
COPY . .

# Criar arquivo .env para build time
RUN echo "DATABASE_URL=${DATABASE_URL}" > .env && \
    echo "NEXTAUTH_URL=${NEXTAUTH_URL}" >> .env && \
    echo "NEXTAUTH_SECRET=${NEXTAUTH_SECRET}" >> .env && \
    echo "NODE_ENV=production" >> .env && \
    echo "TRUSTED_ORIGINS=${TRUSTED_ORIGINS}" >> .env && \
    echo "CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME}" >> .env && \
    echo "CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY}" >> .env && \
    echo "CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET}" >> .env

# Build da aplicação Next.js
RUN npm run build

# Verificar se o build foi criado corretamente
RUN ls -la .next && \
    test -f .next/BUILD_ID && \
    echo "✅ Build ID: $(cat .next/BUILD_ID)" && \
    echo "✅ Next.js build concluído com sucesso!" && \
    echo "✅ Prisma Client gerado para: linux-musl-openssl-3.0.x"

# Remover arquivos de desenvolvimento desnecessários
RUN rm -rf .env && \
    rm -rf node_modules/.cache && \
    rm -rf /tmp/* && \
    rm -rf /root/.npm

# Configurar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 && \
    chown -R nextjs:nodejs /app && \
    chown -R nextjs:nodejs /app/.next

USER nextjs

# Expor porta padrão do Next.js
EXPOSE 3000

# Configurar variáveis de ambiente runtime
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Healthcheck aprimorado
HEALTHCHECK --interval=30s --timeout=15s --start-period=45s --retries=3 \
    CMD curl -f http://localhost:3000/api/version || exit 1

# Comando de inicialização otimizado
CMD ["npm", "start"]
