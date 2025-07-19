# Sistema de Controle de Vendas

Um sistema completo para gerenciar vendas, atendentes e metas de forma simples e eficiente.

## O que é?

Este é um sistema que ajuda você a controlar as vendas da sua equipe. Ele permite cadastrar atendentes, registrar vendas, definir metas e acompanhar o desempenho de cada pessoa. Tudo isso com uma interface moderna e fácil de usar.

## Principais funcionalidades

### Para o gestor:

- **Cadastrar atendentes** com foto e informações
- **Registrar vendas** de forma rápida e organizada
- **Definir metas** para cada atendente
- **Acompanhar ranking** e performance da equipe
- **Ver relatórios** e estatísticas em tempo real
- **Configurar o sistema** conforme suas necessidades

### Para os atendentes:

- **Visualizar suas vendas** e ganhos
- **Acompanhar metas** e progresso
- **Ver conquistas** e reconhecimentos
- **Acessar histórico** de vendas

## Como usar

### Primeira vez:

1. Instale as dependências: `npm install`
2. Configure o banco de dados: `npm run db:setup`
3. Inicie o sistema: `npm run dev`
4. Acesse no navegador e faça login como administrador

### Login padrão:

- **Usuário:** administrador
- **Senha:** root123

### Comandos úteis:

```bash
npm run dev          # Rodar em desenvolvimento
npm run build        # Preparar para produção
npm run db:optimize  # Otimizar banco de dados
npm run db:test      # Testar funcionalidades
```

## Tecnologias usadas

### Frontend (interface):

- **React** - Para criar a interface
- **TypeScript** - Para código mais seguro
- **Tailwind CSS** - Para estilização moderna
- **Vite** - Para desenvolvimento rápido

### Backend (servidor):

- **Express.js** - Para criar a API
- **PostgreSQL** - Para armazenar os dados
- **Drizzle ORM** - Para trabalhar com o banco

### Ferramentas:

- **Zod** - Para validar dados
- **React Query** - Para gerenciar estado
- **Lucide React** - Para ícones

## Estrutura do projeto

```
📁 Sistema/
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

## Configuração do banco

### 1. Instalar PostgreSQL

- **Windows:** Baixe em postgresql.org
- **Mac:** `brew install postgresql`
- **Linux:** `sudo apt install postgresql`

### 2. Criar banco de dados

```sql
CREATE DATABASE vendas_db;
CREATE USER vendas_user WITH PASSWORD 'sua_senha';
GRANT ALL PRIVILEGES ON DATABASE vendas_db TO vendas_user;
```

### 3. Configurar arquivo .env

```env
DATABASE_URL=postgresql://vendas_user:sua_senha@localhost:5432/vendas_db
PORT=3000
NODE_ENV=development
```

## Funcionalidades detalhadas

### Gestão de Atendentes

- Cadastro com foto e informações pessoais
- Controle de status (ativo/inativo)
- Histórico completo de vendas
- Estatísticas de performance
- Exportação de dados

### Registro de Vendas

- Seleção rápida do atendente
- Captura de dados do cliente
- Cálculo automático de comissões
- Validação de valores
- Histórico detalhado

### Sistema de Metas

- Definição de metas individuais
- Acompanhamento de progresso
- Notificações de conquistas
- Relatórios de performance

### Painel Administrativo

- Login seguro
- Controle total do sistema
- Configurações personalizáveis
- Relatórios e exportações
- Backup automático

## Responsividade

O sistema funciona perfeitamente em:

- **Celulares** (320px+)
- **Tablets** (768px+)
- **Computadores** (1024px+)
- **Telas grandes** (1920px+)

## Segurança

- Senhas criptografadas
- Validação de dados
- Proteção contra ataques
- Headers de segurança

## Performance

- Carregamento rápido
- Cache inteligente
- Otimização de imagens
- Bundle otimizado

## Deploy

O sistema está pronto para ser publicado em:

- Vercel
- Netlify
- Railway
- Heroku

Basta configurar as variáveis de ambiente e fazer o deploy.

## Documentação disponível

### 📚 Guias práticos:

- **[COMO_USAR.md](COMO_USAR.md)** - Guia rápido de como usar o sistema
- **[database-config.md](database-config.md)** - Como configurar o banco de dados
- **[ORGANIZACAO_PROJETO.md](ORGANIZACAO_PROJETO.md)** - Como o projeto está organizado

### 📖 Para começar:

1. Leia **[COMO_USAR.md](COMO_USAR.md)** para entender as funcionalidades
2. Siga **[database-config.md](database-config.md)** para configurar o banco
3. Use os comandos do **[ORGANIZACAO_PROJETO.md](ORGANIZACAO_PROJETO.md)** para manutenção

## Suporte

Se encontrar algum problema:

1. Verifique se o PostgreSQL está rodando
2. Confirme as configurações no arquivo .env
3. Execute `npm run db:test` para verificar o banco
4. Consulte a documentação em docs/

---

**Sistema desenvolvido para facilitar o controle de vendas e motivar a equipe através de gamificação e acompanhamento de metas.**
