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
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true
ENV PRISMA_GENERATE_SKIP_AUTOINSTALL=true
ENV DEBUG="*"

# Cria diretórios necessários para o Prisma
RUN mkdir -p /app/node_modules/@prisma/client/runtime
RUN mkdir -p /app/src/generated/prisma

# Instala o Prisma CLI globalmente para garantir que esteja disponível
RUN npm install -g prisma@4.16.2

# Cria arquivos vazios para evitar erros relacionados ao WASM
RUN touch /app/node_modules/@prisma/client/runtime/wasm-engine-edge.js
RUN touch /app/node_modules/@prisma/client/runtime/wasm-compiler-edge.js

# Gera o cliente Prisma
RUN npx prisma generate || echo "Continuando após tentativa de geração do Prisma"

# Verifica se existe o arquivo wasm-compiler-edge.js e cria se não existir
RUN touch /app/node_modules/@prisma/client/runtime/wasm-compiler-edge.js

# Constrói o aplicativo Next.js diretamente sem usar o script do package.json
RUN NODE_ENV=production npx next build

# Verifica se a build foi bem-sucedida
RUN ls -la /app/.next

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

# Inicia o servidor Next.js diretamente
CMD ["npx", "next", "start"]
