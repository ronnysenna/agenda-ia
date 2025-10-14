#!/bin/bash
# Script para deploy no Easypanel (vendamais/front)

set -e

echo "===> Preparando deploy para Easypanel (vendamais/front)..."
echo "===> Data e hora: $(date)"

# Verificar se o Docker está disponível
if ! command -v docker &> /dev/null; then
    echo "===> ERRO: Docker não encontrado. Por favor, instale o Docker e tente novamente."
    exit 1
fi

# Verificar se o repositório Git está limpo
if [ -n "$(git status --porcelain)" ]; then
    echo "===> AVISO: Existem alterações não commitadas no repositório."
    echo "===> Recomenda-se fazer commit das alterações antes do deploy."
    read -p "===> Deseja continuar mesmo assim? (s/N): " CONTINUE
    if [[ $CONTINUE != "s" && $CONTINUE != "S" ]]; then
        echo "===> Deploy cancelado."
        exit 0
    fi
fi

# Verificar e criar .env.production com as variáveis corretas
echo "===> Criando arquivo .env.production com as variáveis do Easypanel..."
cat > .env.production << EOL
# Banco de dados
DATABASE_URL=postgres://postgres:Ideal2015net@easypanel.ronnysenna.com.br:6543/vendamais?sslmode=disable

# Autenticação
NEXTAUTH_URL=https://vendamais-front.ronnysenna.com.br
NEXTAUTH_SECRET=cUubnx5Bd9sVatuwe70vJPLs57sXjYh
GOOGLE_CLIENT_ID=539151016964-rb1e9psmd3l8usRteplqd74i2je5u22.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=gQCSPX-y5uKxNRePQCsKDfmIPbB-z7BAN37
BETTER_AUTH_SECRET=cUubnx5Bd9sVatuwe70vJPLs57sXjYh

# Cloudinary
CLOUDINARY_CLOUD_NAME=4vq5a1chd
CLOUDINARY_API_KEY=165116311449088
CLOUDINARY_API_SECRET=fsWolGhxnihzLY73LzFH-YuD4F8

# Email (SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=admteralink@gmail.com
EMAIL_PASS=qcltxjumwxvcjqut
EMAIL_FROM=AgendaAI
EOL

echo "===> Verificando o Dockerfile..."
if [ ! -f Dockerfile ]; then
    echo "===> ERRO: Arquivo Dockerfile não encontrado!"
    exit 1
fi

echo "===> Você está pronto para fazer o push para o repositório GitHub."
echo "===> O Easypanel irá detectar as mudanças e iniciar o build automaticamente."
echo ""
echo "===> Passos para o deploy:"
echo "1. Faça commit das alterações: git add . && git commit -m 'Preparado para deploy no Easypanel'"
echo "2. Envie para o repositório: git push origin main"
echo "3. Verifique o status do build no Easypanel: https://easypanel.ronnysenna.com.br"
echo ""
echo "===> Após o deploy, verifique os logs no Easypanel para confirmar que a aplicação está funcionando corretamente."
