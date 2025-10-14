# Dockerfile simplificado para debugging
FROM node:20.11-alpine

# Instalar dependências básicas
RUN apk add --no-cache libc6-compat curl wget

# Diretório de trabalho
WORKDIR /app

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

# Criar arquivo .env com as variáveis de ambiente
RUN echo "DATABASE_URL=\"${DATABASE_URL:-postgresql://postgres:postgres@localhost:5432/agendaai}\"" > .env && \
    echo "NEXTAUTH_URL=\"${NEXTAUTH_URL:-http://localhost:3000}\"" >> .env && \
    echo "NEXTAUTH_SECRET=\"${NEXTAUTH_SECRET:-build-secret}\"" >> .env && \
    echo "CLOUDINARY_CLOUD_NAME=\"${CLOUDINARY_CLOUD_NAME:-build-cloud}\"" >> .env && \
    echo "CLOUDINARY_API_KEY=\"${CLOUDINARY_API_KEY:-build-key}\"" >> .env && \
    echo "CLOUDINARY_API_SECRET=\"${CLOUDINARY_API_SECRET:-build-secret}\"" >> .env && \
    echo "EMAIL_SERVER_HOST=\"${EMAIL_SERVER_HOST:-smtp.example.com}\"" >> .env && \
    echo "EMAIL_SERVER_PORT=\"${EMAIL_SERVER_PORT:-587}\"" >> .env && \
    echo "EMAIL_SERVER_USER=\"${EMAIL_SERVER_USER:-user@example.com}\"" >> .env && \
    echo "EMAIL_SERVER_PASSWORD=\"${EMAIL_SERVER_PASSWORD:-password}\"" >> .env && \
    echo "EMAIL_FROM=\"${EMAIL_FROM:-noreply@example.com}\"" >> .env && \
    echo "NODE_ENV=production" >> .env && \
    echo "TRUSTED_ORIGINS=\"${TRUSTED_ORIGINS:-https://vendamais-front.dgohio.easypanel.host}\"" >> .env

# Copiar arquivos de dependências
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm install

# Copiar todo o código
COPY . .

# Definir variáveis de ambiente
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Gerar cliente Prisma
RUN echo "=== GERANDO PRISMA CLIENT ===" && \
    npx prisma generate && \
    echo "=== PRISMA CLIENT GERADO COM SUCESSO ==="

# Verificar antes do build
RUN echo "=== ANTES DO BUILD ===" && \
    ls -la . && \
    echo "=== VERIFICANDO PACKAGE.JSON ===" && \
    cat package.json | grep -A 5 -B 5 '"build"'

# Fazer o build do Next.js com logs detalhados
RUN echo "=== INICIANDO BUILD DO NEXT.JS ===" && \
    npm run build 2>&1 | tee build.log && \
    echo "=== BUILD CONCLUÍDO ==="

# Verificar se o build foi criado
RUN echo "=== VERIFICANDO BUILD APÓS NPM RUN BUILD ===" && \
    ls -la . && \
    echo "=== DIRETÓRIO .NEXT ===" && \
    ls -la .next 2>/dev/null || echo "DIRETÓRIO .NEXT NÃO EXISTE!" && \
    echo "=== PROCURANDO BUILD_ID ===" && \
    find . -name "*BUILD*" -type f 2>/dev/null || echo "NENHUM ARQUIVO BUILD_ID ENCONTRADO" && \
    echo "=== LOGS DO BUILD ===" && \
    cat build.log | tail -20 && \
    echo "=== VERIFICAÇÃO CONCLUÍDA ==="

# Expor porta
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=10s --timeout=5s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:3000/api/version || exit 1

# Iniciar aplicação com debug completo
CMD ["sh", "-c", "echo '=== DEBUG NO MOMENTO DA EXECUÇÃO ===' && pwd && ls -la . && echo '=== CONTEÚDO .NEXT ===' && ls -la .next 2>/dev/null || echo 'DIRETÓRIO .NEXT NÃO EXISTE' && echo '=== PROCURANDO BUILD_ID ===' && find . -name '*BUILD*' 2>/dev/null || echo 'BUILD_ID NÃO ENCONTRADO' && echo '=== TENTANDO INICIAR NEXT.JS ===' && npm start"]
