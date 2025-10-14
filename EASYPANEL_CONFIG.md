# 🚀 CONFIGURAÇÃO EASYPANEL - VENDAMAIS

## 📋 Variáveis de Ambiente Obrigatórias

Copie e configure essas variáveis no painel do EasyPanel:

```bash
# Database
DATABASE_URL=postgresql://vendamais:vendamais123@postgresql.dgohio.easypanel.host:5432/vendamais

# Authentication
NEXTAUTH_URL=https://vendamais-front.dgohio.easypanel.host
NEXTAUTH_SECRET=vendamais-secret-key-2023
TRUSTED_ORIGINS=https://vendamais-front.dgohio.easypanel.host

# Node.js
NODE_ENV=production
```

## 🎯 Configurações do Serviço EasyPanel

### 1. Source (GitHub)
- **Repository:** Seu repositório do projeto
- **Branch:** main/master
- **Build Context:** . (root)

### 2. Build
- **Dockerfile:** Dockerfile (na raiz)
- **Build Arguments:** Automático via variáveis de ambiente

### 3. Deploy
- **Port:** 3000
- **Health Check:** `/api/version`
- **Restart Policy:** always

### 4. Environment Variables
```
DATABASE_URL=postgresql://vendamais:vendamais123@postgresql.dgohio.easypanel.host:5432/vendamais
NEXTAUTH_URL=https://vendamais-front.dgohio.easypanel.host
NEXTAUTH_SECRET=vendamais-secret-key-2023
TRUSTED_ORIGINS=https://vendamais-front.dgohio.easypanel.host
NODE_ENV=production
```

### 5. Domínio
- **Domain:** vendamais-front.dgohio.easypanel.host
- **SSL:** Automático via EasyPanel

## ✅ Checklist Pré-Deploy

- [ ] Repositório atualizado com último commit
- [ ] Variáveis de ambiente configuradas
- [ ] Banco PostgreSQL funcionando
- [ ] Domínio configurado no EasyPanel

## 🔍 Testes Pós-Deploy

1. **Aplicação principal:**
   ```
   https://vendamais-front.dgohio.easypanel.host
   ```

2. **Health check:**
   ```
   https://vendamais-front.dgohio.easypanel.host/api/version
   ```
   Deve retornar JSON com status da aplicação

3. **Páginas importantes:**
   - Login: `/login`
   - Dashboard: `/dashboard`
   - Serviços: `/service/list`

## 🚨 Resolução de Problemas

### "Service is not reachable"
1. Verificar logs do container
2. Confirmar se porta 3000 está exposta
3. Verificar se BUILD_ID existe

### "Could not find production build"
1. Verificar se `.next` está sendo criado
2. Confirmar que `npm run build` executa no Dockerfile
3. Verificar se `.next` não está no .dockerignore

### Erro de conexão com banco
1. Verificar DATABASE_URL
2. Confirmar se PostgreSQL está rodando
3. Testar conexão manual

## 📊 Monitoramento

- **CPU/Memory:** Dashboard EasyPanel
- **Logs:** Console do container
- **Uptime:** Health check automático
- **Errors:** Logs da aplicação

## 🎉 Sucesso!

Se tudo estiver funcionando:
- ✅ Aplicação acessível via HTTPS
- ✅ Health check retornando status OK
- ✅ Login funcionando
- ✅ Dashboard carregando
- ✅ Banco de dados conectado

---
**Preparado em:** 14 de outubro de 2025  
**Status:** ✅ PRONTO PARA DEPLOY
