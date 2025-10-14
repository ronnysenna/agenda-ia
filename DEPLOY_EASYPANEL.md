# Deploy no EasyPanel

Este documento contém instruções para fazer o deploy do projeto no EasyPanel.

## Configuração de Variáveis de Ambiente

No EasyPanel, configure as seguintes variáveis de ambiente:

```
# Banco de Dados
DATABASE_URL=postgres://postgres:suasenha@host:porta/banco?sslmode=disable

# Autenticação
NEXTAUTH_SECRET=chave_segura_gerada
NEXTAUTH_URL=https://vendamais-front.dgohio.easypanel.host
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret

# Email
EMAIL_SERVER_HOST=seu_smtp_host
EMAIL_SERVER_PORT=porta_smtp
EMAIL_SERVER_USER=usuario_smtp
EMAIL_SERVER_PASSWORD=senha_smtp
EMAIL_FROM=nome_remetente

# Configuração
NODE_ENV=production
TRUSTED_ORIGINS=https://vendamais-front.dgohio.easypanel.host,http://localhost:3000
```

## Processo de Build

O Dockerfile foi modificado para usar argumentos de build (ARGs) em vez de um arquivo `.env.docker`. Isso permite que o EasyPanel injete as variáveis de ambiente diretamente durante o build.

## Troubleshooting

Se encontrar erros relacionados a variáveis de ambiente faltando, verifique se todas as variáveis necessárias estão configuradas no EasyPanel.

## Atualização do Esquema do Banco de Dados

Após o deploy, pode ser necessário executar migrações do Prisma:

```bash
npx prisma migrate deploy
```

Você pode configurar isso como um comando a ser executado após o deploy no EasyPanel.
