# Dockerfile otimizado para Next.js com Prisma
FROM node:20.11-alpine AS base

# Configurações gerais
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Fase de instalação de dependências
FROM base AS deps
WORKDIR /app

# Copia arquivos de configuração
COPY package.json package-lock.json* ./

# Instala as dependências
RUN npm ci

# Fase de compilação
FROM base AS builder
WORKDIR /app

# Configurações específicas do Prisma para contêiner
ENV PRISMA_CLIENT_ENGINE_TYPE=binary

# Cria o build ID
RUN echo "build-$(date +%s)" > /tmp/build_id

# Copia dependências da fase anterior
COPY --from=deps /app/node_modules ./node_modules

# Copia todo o código fonte
COPY . .

# Adiciona o build ID ao arquivo .env se necessário
RUN if [ -f .env ]; then \
    echo "NEXT_PUBLIC_BUILD_ID=$(cat /tmp/build_id)" >> .env; \
    else \
    echo "NODE_ENV=production" > .env && \
    echo "NEXT_PUBLIC_BUILD_ID=$(cat /tmp/build_id)" >> .env; \
    fi

# Gera o Prisma Client com configurações otimizadas
RUN NODE_ENV=production npx prisma generate --schema=./prisma/schema.prisma

# Cria o arquivo wasm-engine-edge.js se ele não existir (hack para evitar o erro)
RUN mkdir -p /app/node_modules/@prisma/client/runtime && \
    touch /app/node_modules/@prisma/client/runtime/wasm-engine-edge.js

# Build do Next.js
RUN npm run build

# Etapa de execução
FROM base AS runner
WORKDIR /app

# Adiciona usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Configura permissões adequadas
RUN mkdir -p /app/.next && chown -R nextjs:nodejs /app

# Copia os arquivos necessários para execução
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/.env* ./
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/src/generated ./src/generated

# Define o usuário não-root
USER nextjs

# Define as variáveis de ambiente para produção
ENV PORT=3000
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"

# Define usuário não-root
USER nextjs

# Expõe a porta do servidor
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=10s --retries=3 \
    CMD wget -q --spider http://localhost:3000/ || exit 1

# Inicia o servidor Next.js
CMD ["npm", "run", "start"]
