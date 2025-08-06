<!-- cSpell:ignore gamificada Drizzle setup PRIVILEGES postgresql pages migrations gamificação -->

# 🚀 SISTEMA-DE-VENDAS

![Screenshot do Sistema](assets/imgs/image.png)
_Impulsione vendas, acelere resultados, transforme seu negócio!_

[![last commit](https://img.shields.io/github/last-commit/SEU_USUARIO/SEU_REPO?style=flat-square)]()
[![typescript](https://img.shields.io/badge/typescript-80.9%25-blue?style=flat-square)]()
[![languages](https://img.shields.io/badge/languages-5-informational?style=flat-square)]()

---

## 📋 Sumário

- [Sobre](#sobre)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Como usar](#como-usar)
- [Configuração do banco](#configuração-do-banco)
- [Documentação](#documentação)
- [Suporte](#suporte)

---

## 📝 Sobre

## Sistema completo para gerenciar vendas, atendentes e metas de forma simples, eficiente e gamificada.

## ✨ Funcionalidades

- 👤 Cadastro de atendentes com foto
- 💰 Registro e histórico de vendas
- 🎯 Definição e acompanhamento de metas
- 🏆 Ranking e conquistas
- 📊 Relatórios em tempo real
- ⚙️ Configurações avançadas
- 🔒 Segurança e backup automático

---

## 🛠 Tecnologias

**Frontend:** React, TypeScript, Tailwind CSS, Vite  
**Backend:** Express.js, PostgreSQL, Drizzle ORM  
**Ferramentas:** Zod, React Query, Lucide React

---

## 🚀 Como usar

```bash
npm install
npm run db:setup
npm run dev
```

Acesse: `http://localhost:3000`  
Login padrão: **administrador** / **root123**

### Comandos úteis

```bash
npm run dev          # Rodar em desenvolvimento
npm run build        # Preparar para produção
npm run db:optimize  # Otimizar banco de dados
npm run db:test      # Testar funcionalidades
```

---

## 🗄️ Configuração do banco

1. Instale o PostgreSQL
2. Crie o banco e usuário:
   ```sql
   CREATE DATABASE vendas_db;
   CREATE USER vendas_user WITH PASSWORD 'sua_senha';
   GRANT ALL PRIVILEGES ON DATABASE vendas_db TO vendas_user;
   ```
3. Configure o arquivo `.env`:
   ```env
   DATABASE_URL=postgresql://vendas_user:sua_senha@localhost:5432/vendas_db
   PORT=3000
   NODE_ENV=development
   ```

---

## 🏗️ Estrutura do projeto

```
📁 Website/
├── 📁 client/          # Interface (React)
│   ├── 📁 src/
│   │   ├── 📁 components/   # Componentes da tela
│   │   ├── 📁 pages/       # Páginas do sistema
│   │   ├── 📁 hooks/       # Lógica reutilizável
│   │   └── 📁 utils/       # Funções auxiliares
├── 📁 server/          # Servidor (Express)
│   ├── 📁 routes/      # Rotas da API
│   ├── 📁 utils/       # Funções do servidor
│   └── 📄 index.ts     # Arquivo principal
├── 📁 database/        # Banco de dados
│   ├── 📁 scripts/     # Scripts de manutenção
│   ├── 📁 config/      # Configurações
│   └── 📁 migrations/  # Migrações do banco
└── 📁 shared/          # Código compartilhado
```

---

## 📚 Documentação

- [Guia rápido de uso](COMO_USAR.md)
- [Configuração do banco](database-config.md)
- [Organização do projeto](ORGANIZACAO_PROJETO.md)

---

## 🆘 Suporte

1. Verifique se o PostgreSQL está rodando
2. Confirme as configurações no arquivo `.env`
3. Execute `npm run db:test`
4. Consulte a documentação em `/docs`

---

> Sistema desenvolvido para facilitar o controle de vendas e motivar a equipe através de gamificação e acompanhamento de metas.
