# Configuração do Banco de Dados

Guia prático para configurar o PostgreSQL e deixar o sistema funcionando.

## Instalando o PostgreSQL

### Windows

1. Vá em https://www.postgresql.org/download/windows/
2. Baixe a versão mais recente
3. Execute o instalador
4. Defina uma senha para o usuário `postgres`
5. Mantenha a porta 5432 (padrão)

### Mac

```bash
brew install postgresql
brew services start postgresql
```

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## Criando o banco de dados

### Passo 1: Conectar ao PostgreSQL

```bash
psql -U postgres
```

### Passo 2: Criar o banco

```sql
CREATE DATABASE vendas_sistema;
```

### Passo 3: Criar usuário (opcional, mas recomendado)

```sql
CREATE USER vendas_user WITH PASSWORD 'minha_senha_segura';
GRANT ALL PRIVILEGES ON DATABASE vendas_sistema TO vendas_user;
```

### Passo 4: Sair

```sql
\q
```

## Configurando o arquivo .env

Crie um arquivo `.env` na raiz do projeto:

```env
# Configuração do Banco
DATABASE_URL=postgresql://postgres:sua_senha@localhost:5432/vendas_sistema

# Configuração do Servidor
PORT=3000
NODE_ENV=development

# Chave secreta (mude em produção)
JWT_SECRET=chave-super-secreta-mude-isso-em-producao
```

## Executando as migrações

### Primeira vez:

```bash
# Instalar dependências
npm install

# Aplicar estrutura do banco
npx drizzle-kit push
```

### Se precisar gerar migrações:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

## Testando a conexão

```bash
npm run dev
```

Se aparecer "Login attempt" no console, está funcionando!

## Estrutura das tabelas

O sistema usa estas tabelas:

- **attendants** - Informações dos atendentes
- **sales** - Registro de vendas
- **goals** - Metas dos atendentes
- **achievements** - Conquistas e badges
- **leaderboard** - Ranking da equipe
- **notifications** - Notificações do sistema
- **admins** - Usuários administradores

## Resolvendo problemas

### Erro de conexão

- Verifique se o PostgreSQL está rodando
- Confirme a senha no DATABASE_URL
- Verifique se o banco `vendas_sistema` existe

### Erro de permissão

- Verifique se o usuário tem acesso ao banco
- Use: `GRANT ALL PRIVILEGES ON DATABASE vendas_sistema TO nome_do_usuario;`

### Erro de porta

- Verifique se a porta 5432 está livre
- Use: `netstat -an | grep 5432`

### Erro de autenticação

- Verifique se a senha está correta
- Tente conectar manualmente: `psql -U postgres -d vendas_sistema`

## Comandos úteis

### Verificar status do PostgreSQL

```bash
# Windows
services.msc (procure por "PostgreSQL")

# Mac
brew services list | grep postgresql

# Linux
sudo systemctl status postgresql
```

### Conectar ao banco

```bash
psql -U postgres -d vendas_sistema
```

### Ver tabelas

```sql
\dt
```

### Ver estrutura de uma tabela

```sql
\d nome_da_tabela
```

## Backup e restauração

### Fazer backup

```bash
pg_dump -U postgres vendas_sistema > backup.sql
```

### Restaurar backup

```bash
psql -U postgres vendas_sistema < backup.sql
```

## Dicas importantes

1. **Sempre use senhas fortes** em produção
2. **Mude a porta padrão** se necessário
3. **Faça backups regulares** dos dados
4. **Monitore o espaço em disco**
5. **Configure firewall** adequadamente

## Próximos passos

Depois de configurar o banco:

1. Execute `npm run db:setup` para criar dados iniciais
2. Execute `npm run db:optimize` para otimizar performance
3. Execute `npm run db:test` para verificar se tudo funciona
4. Acesse o sistema e faça login como administrador

---

**Com o banco configurado, o sistema estará pronto para uso!**
