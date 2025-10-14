# Configuração do EasyPanel para o Serviço Front-End

Para resolver o erro "No such image: easypanel/vendamais/front:latest", siga estas instruções detalhadas:

## 1. Configurações de Serviço no EasyPanel

1. Acesse seu painel do EasyPanel
2. Selecione o projeto "vendamais"
3. Clique no serviço "front"
4. Vá para a aba "Source" (ou "Build")

## 2. Configuração Correta do Build

Certifique-se de que o método de build está configurado corretamente:

### Se estiver usando Git como fonte:

1. **Repository URL**: URL do seu repositório Git
2. **Branch**: branch que contém o código (geralmente `main` ou `master`)
3. **Dockerfile Path**: `/Dockerfile` (caminho para o Dockerfile no repositório)
4. **Context Directory**: `/` (diretório raiz do projeto)
5. **Automatic Deployment**: Ative se quiser que o EasyPanel faça build automático quando houver push para o branch configurado

### Se estiver usando Upload direto:

1. Certifique-se de que o Dockerfile está na raiz do diretório carregado
2. Verifique se todos os arquivos necessários foram incluídos no upload

## 3. Configuração de Variáveis de Ambiente

Na aba "Environment Variables", certifique-se de que todas as variáveis necessárias estão configuradas:

```
DATABASE_URL=postgres://postgres:suasenha@easypanel.ronnysenna.com.br:6543/vendamais?sslmode=disable
NEXTAUTH_URL=https://vendamais-front.dgohio.easypanel.host
NEXTAUTH_SECRET=sua_chave_secreta
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=seu_email@gmail.com
EMAIL_SERVER_PASSWORD=sua_senha_app
EMAIL_FROM=AgendaAI
NODE_ENV=production
TRUSTED_ORIGINS=https://vendamais-front.dgohio.easypanel.host,http://localhost:3000
```

## 4. Redeploy do Serviço

Depois de verificar todas as configurações:

1. Clique no botão "Deploy" ou "Redeploy"
2. Acompanhe o log de build para identificar possíveis erros

## 5. Verificação de Logs

Se o erro persistir:

1. Vá para a aba "Logs" do serviço
2. Verifique os logs de build para identificar exatamente onde o processo está falhando

## 6. Alternativa: Build Local e Push Manual

Se o build automático continuar falhando:

1. Faça build da imagem localmente:
   ```bash
   docker build -t easypanel/vendamais/front:latest .
   ```

2. Salve a imagem como arquivo:
   ```bash
   docker save easypanel/vendamais/front:latest -o vendamais-front.tar
   ```

3. Carregue a imagem manualmente no EasyPanel usando a interface de upload
