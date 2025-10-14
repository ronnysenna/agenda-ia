# Dockerfile simplificado e funcional para Next.js + Prisma
FROM node:20-alpine

# Instalar dependências essenciais
RUN apk add --no-cache libc6-compat curl wget bash

WORKDIR /app

# Variáveis de ambiente
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PRISMA_CLIENT_ENGINE_TYPE=binary

# Args do EasyPanel
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

# Copiar package files
COPY package*.json ./

# Instalar todas as dependências (incluindo dev para o build)
RUN npm install

# Copiar prisma
COPY prisma ./prisma/

# Copiar código
COPY . .

# Criar .env se necessário
RUN echo "DATABASE_URL=${DATABASE_URL:-postgresql://localhost:5432/agendaai}" > .env && \
    echo "NEXTAUTH_URL=${NEXTAUTH_URL:-http://localhost:3000}" >> .env && \
    echo "NEXTAUTH_SECRET=${NEXTAUTH_SECRET:-fallback-secret}" >> .env && \
    echo "NODE_ENV=production" >> .env

# Gerar Prisma e fazer build
RUN npx prisma generate && \
    npm run build && \
    echo "Build concluído! Verificando..." && \
    ls -la .next && \
    test -f .next/BUILD_ID && echo "✅ BUILD_ID: $(cat .next/BUILD_ID)"

# Limpar deps de dev
RUN npm ci --only=production && npm cache clean --force

# Setup usuário
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

# Comando simples
CMD ["npm", "start"]
