#!/bin/bash
# Script para build e teste do Docker do AgendaAI

echo "===> Iniciando build do Docker para o AgendaAI..."
echo "===> Data e hora: $(date)"

# Limpar containers e imagens anteriores
echo "===> Limpando containers e imagens anteriores..."
docker rm -f agendaai-container 2>/dev/null || true
docker rmi -f agendaai-image 2>/dev/null || true

# Construir a imagem
echo "===> Construindo a imagem Docker..."
docker build -t agendaai-image --progress=plain . 

# Verificar se o build foi bem-sucedido
if [ $? -ne 0 ]; then
    echo "===> ERRO: O build do Docker falhou!"
    exit 1
fi

echo "===> Build concluído com sucesso!"
echo "===> Iniciando container para teste..."

# Criar e iniciar o container
docker run -d --name agendaai-container -p 3000:3000 \
    -e DATABASE_URL="postgresql://postgres:postgres@host.docker.internal:5432/agendaai?schema=public" \
    -e NEXTAUTH_URL="http://localhost:3000" \
    -e NEXTAUTH_SECRET="teste-local-secret" \
    agendaai-image

# Verificar se o container iniciou
if [ $? -ne 0 ]; then
    echo "===> ERRO: Não foi possível iniciar o container!"
    exit 1
fi

echo "===> Container iniciado com sucesso!"
echo "===> Verificando logs do container..."

# Aguardar um momento para o container iniciar
sleep 5

# Mostrar logs
docker logs agendaai-container

echo "===> Teste o aplicativo acessando: http://localhost:3000"
echo "===> Use o seguinte comando para ver os logs em tempo real:"
echo "     docker logs -f agendaai-container"
echo "===> Para parar o container, execute:"
echo "     docker stop agendaai-container"
