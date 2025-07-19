# Como Usar o Sistema

Guia rápido para começar a usar o sistema de controle de vendas.

## Primeiros passos

### 1. Instalar e configurar

```bash
# Instalar dependências
npm install

# Configurar banco de dados
npm run db:setup

# Iniciar o sistema
npm run dev
```

### 2. Fazer login

- **Usuário:** administrador
- **Senha:** root123

## Funcionalidades principais

### Para o gestor

#### Cadastrar atendentes

1. Vá em "Atendentes" no menu
2. Clique em "Adicionar Atendente"
3. Preencha nome, foto e informações
4. Salve

#### Registrar vendas

1. Vá em "Vendas" no menu
2. Selecione o atendente
3. Digite o valor da venda
4. Adicione dados do cliente (opcional)
5. Salve

#### Definir metas

1. Vá em "Metas" no menu
2. Clique em "Nova Meta"
3. Escolha o atendente
4. Defina valor e prazo
5. Salve

#### Ver relatórios

1. Vá em "Dashboard" no menu
2. Veja estatísticas em tempo real
3. Acompanhe performance da equipe

### Para os atendentes

#### Ver suas vendas

1. Acesse o sistema
2. Veja seu card na página inicial
3. Clique para ver detalhes

#### Acompanhar metas

1. Vá em "Metas" no menu
2. Veja suas metas ativas
3. Acompanhe o progresso

#### Ver ranking

1. Vá em "Ranking" no menu
2. Veja sua posição na equipe
3. Acompanhe conquistas

## Comandos úteis

### Desenvolvimento

```bash
npm run dev          # Rodar em desenvolvimento
npm run build        # Preparar para produção
npm run start        # Rodar em produção
```

### Banco de dados

```bash
npm run db:setup     # Configurar banco
npm run db:optimize  # Otimizar performance
npm run db:test      # Testar funcionalidades
npm run db:health    # Verificar saúde
```

### Utilitários

```bash
node utils/show-structure.js  # Ver estrutura do projeto
```

## Dicas importantes

### Para gestores

- **Configure metas realistas** para motivar a equipe
- **Monitore o ranking** regularmente
- **Use as notificações** para reconhecer conquistas
- **Faça backups** dos dados importantes

### Para atendentes

- **Registre vendas** imediatamente
- **Acompanhe suas metas** diariamente
- **Veja o ranking** para se motivar
- **Complete dados do cliente** quando possível

### Para todos

- **Use o sistema** regularmente
- **Mantenha dados atualizados**
- **Faça login/logout** corretamente
- **Reporte problemas** se encontrar

## Resolução de problemas

### Sistema não inicia

1. Verifique se o PostgreSQL está rodando
2. Confirme as configurações no arquivo .env
3. Execute `npm run db:test` para verificar

### Erro de login

1. Verifique usuário e senha
2. Confirme se o banco está funcionando
3. Tente recarregar a página

### Dados não salvam

1. Verifique a conexão com o banco
2. Confirme se todos os campos estão preenchidos
3. Execute `npm run db:health` para verificar

### Performance lenta

1. Execute `npm run db:optimize`
2. Verifique se há muitos dados antigos
3. Considere fazer limpeza periódica

## Próximos passos

Depois de configurar:

1. **Cadastre seus atendentes**
2. **Configure metas iniciais**
3. **Comece a registrar vendas**
4. **Monitore o desempenho**
5. **Ajuste conforme necessário**

---

**O sistema está pronto para uso! Qualquer dúvida, consulte a documentação ou entre em contato.**
