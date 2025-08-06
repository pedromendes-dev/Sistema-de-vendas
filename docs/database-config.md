# Configuração do Banco de Dados

Este guia explica como configurar o PostgreSQL para uso com o sistema de controle de vendas.

## 1. Instale o PostgreSQL

- **Windows:** Baixe em https://www.postgresql.org/download/windows/
- **Mac:** `brew install postgresql`
- **Linux:** `sudo apt install postgresql`

## 2. Crie o banco de dados e usuário

Abra o terminal do PostgreSQL e execute:

```sql
CREATE DATABASE vendas_db;
CREATE USER vendas_user WITH PASSWORD 'sua_senha';
GRANT ALL PRIVILEGES ON DATABASE vendas_db TO vendas_user;
```

## 3. Configure o arquivo `.env`

No diretório raiz do projeto, crie ou edite o arquivo `.env`:

```
DATABASE_URL=postgresql://vendas_user:sua_senha@localhost:5432/vendas_db
PORT=3000
NODE_ENV=development
```

## 4. Execute a configuração inicial

No terminal do projeto, rode:

```bash
npm run db:setup
```

Isso criará as tabelas e aplicará as migrações necessárias.

---
