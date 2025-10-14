# Dockerfile simplificado para Next.js com Prisma
FROM node:20.11-alpine AS base

# Configurações gerais
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Etapa única de construção para simplificar
WORKDIR /app

# Copia package.json e package-lock.json
COPY package.json package-lock.json* ./

# Copia o código fonte do projeto
COPY . .

# Instala todas as dependências
RUN npm install

# Variáveis de ambiente para o Prisma
ENV PRISMA_CLIENT_ENGINE_TYPE=binary
ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=true

# Cria diretórios necessários para o Prisma
RUN mkdir -p /app/node_modules/@prisma/client/runtime
RUN mkdir -p /app/src/generated/prisma

# Cria um arquivo vazio para evitar erro do wasm-engine-edge.js
RUN touch /app/node_modules/@prisma/client/runtime/wasm-engine-edge.js

# Gera o cliente Prisma
RUN npx prisma generate || echo "Continuando após tentativa de geração do Prisma"

# Constrói o aplicativo Next.js
RUN npm run build

# Configura usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    chown -R nextjs:nodejs /app

# Define usuário não-root
USER nextjs

# Configura variáveis de ambiente para produção
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Expõe a porta do servidor
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=10s --retries=3 \
    CMD wget -q --spider http://localhost:3000/ || exit 1

# Inicia o servidor Next.js
CMD ["npm", "run", "start"]
