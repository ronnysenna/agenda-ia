# Solucionando o problema "Service is not reachable" no EasyPanel

Se você estiver vendo a mensagem "Service is not reachable" ao acessar o serviço no EasyPanel, siga estas etapas para resolver o problema:

## 1. Verifique se o container está rodando

1. No painel do EasyPanel, acesse o serviço "front"
2. Verifique o status do container na página principal
3. Se o container não estiver rodando, tente iniciar novamente clicando em "Start"

## 2. Verifique os logs do container

1. Clique na aba "Logs" para ver os logs do container
2. Procure por erros como:
   - `Error: connect ECONNREFUSED`
   - `ERR_CONNECTION_REFUSED`
   - `Port 3000 is already in use`
   - Erros de banco de dados
   - Erros de variáveis de ambiente

## 3. Execute o script de diagnóstico

Execute este comando no terminal do container no EasyPanel:

```bash
bash /app/scripts/diagnostico.sh
```

Este script irá fornecer informações detalhadas sobre o estado do aplicativo dentro do container.

## 4. Verifique as variáveis de ambiente

Certifique-se de que todas as variáveis de ambiente necessárias estão configuradas corretamente:

1. `DATABASE_URL` - URL de conexão com o banco de dados PostgreSQL
2. `NEXTAUTH_URL` - URL pública do seu serviço (https://vendamais-front.dgohio.easypanel.host)
3. `NEXTAUTH_SECRET` - Chave secreta para autenticação
4. Variáveis de Cloudinary, Email, etc.

## 5. Problemas comuns e soluções

### O serviço não inicia:
- Verifique se o banco de dados está acessível
- Verifique se a porta 3000 está liberada
- Verifique se não há erros de compilação do Next.js

### O serviço inicia mas não é acessível:
- Verifique se o healthcheck está configurado corretamente
- Verifique se o aplicativo está escutando na porta 3000
- Verifique se há algum firewall ou regra de rede bloqueando o acesso

### Erro no banco de dados:
- Verifique se a string de conexão está correta
- Verifique se o banco foi criado e as migrações foram aplicadas
- Verifique se o usuário tem permissões suficientes

## 6. Recriando o serviço

Se nenhuma das soluções acima funcionar, tente recriar o serviço:

1. Faça backup de qualquer dado importante
2. Remova o serviço no EasyPanel
3. Crie o serviço novamente com as configurações corretas
4. Faça o deploy do código novamente

## 7. Verificando o endpoint de healthcheck

Nosso aplicativo agora tem um endpoint de healthcheck em `/api/version` que pode ser usado para verificar se o serviço está funcionando corretamente.

Você pode tentar acessar manualmente este endpoint para verificar se o aplicativo está respondendo:

```
https://vendamais-front.dgohio.easypanel.host/api/version
```

Se este endpoint responder mas o site principal não, pode haver um problema específico com a rota principal da aplicação.
