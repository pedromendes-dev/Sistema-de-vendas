<!-- cSpell:ignore gamificada Drizzle setup PRIVILEGES postgresql pages migrations gamificação -->

# 🚀 Sistema de Vendas - Pedro Mendes

![Screenshot do Sistema](assets/imgs/image.png)

> **"Transformando o controle de vendas em uma experiência motivacional e eficiente"**

---

## 📖 A História do Projeto

Este sistema nasceu da necessidade real de gerenciar uma equipe de vendas de forma mais humana e motivacional. Como desenvolvedor apaixonado por criar soluções que realmente funcionam, decidi construir algo que não apenas controlasse números, mas que inspirasse e motivasse a equipe através de gamificação e acompanhamento transparente de metas.

**O que me motivou:**
- 🎯 Necessidade de acompanhar metas de forma visual e motivacional
- 👥 Gestão humanizada de atendentes com reconhecimento
- 📊 Relatórios que realmente ajudam na tomada de decisão
- 🏆 Sistema de ranking que motiva a equipe

---

## ✨ O que este sistema faz de diferente

- **👤 Gestão humanizada**: Cada atendente tem sua foto e perfil personalizado
- **💰 Transparência total**: Histórico completo de vendas para todos
- **🎯 Metas inteligentes**: Sistema que se adapta à realidade da equipe
- **🏆 Gamificação real**: Ranking que motiva sem criar competição tóxica
- **📊 Insights práticos**: Relatórios que você realmente usa no dia a dia
- **🔒 Segurança simples**: Backup automático sem complicações

---

## 🛠 Tecnologias que escolhi

**Frontend:** React + TypeScript (robustez e produtividade)  
**Backend:** Express.js + PostgreSQL (simplicidade e confiabilidade)  
**UI:** Tailwind CSS + Radix UI (beleza sem perder funcionalidade)  
**Banco:** Drizzle ORM (type-safety e performance)

---

## 🚀 Como usar

```bash
# Clone e instale
git clone [seu-repositorio]
cd Sistema-de-vendas
npm install

# Configure o banco
npm run db:setup

# Rode em desenvolvimento
npm run dev
```

**Acesse:** `http://localhost:3000`  
**Login padrão:** `administrador` / `root123`

### Comandos que uso no dia a dia

```bash
npm run dev          # Desenvolvimento
npm run build        # Produção
npm run db:optimize  # Manutenção do banco
npm run db:test      # Testes
```

---

## 🗄️ Configuração do banco

1. **Instale o PostgreSQL** (recomendo a versão mais recente)
2. **Crie o banco:**
   ```sql
   CREATE DATABASE vendas_db;
   CREATE USER vendas_user WITH PASSWORD 'sua_senha_segura';
   GRANT ALL PRIVILEGES ON DATABASE vendas_db TO vendas_user;
   ```
3. **Configure o `.env`:**
   ```env
   DATABASE_URL=postgresql://vendas_user:sua_senha_segura@localhost:5432/vendas_db
   PORT=3000
   NODE_ENV=development
   ```

---

## 🏗️ Como organizei o código

```
📁 Sistema-de-vendas/
├── 📁 client/          # Interface React (o que o usuário vê)
│   ├── 📁 src/
│   │   ├── 📁 components/   # Componentes reutilizáveis
│   │   ├── 📁 pages/       # Páginas principais
│   │   ├── 📁 hooks/       # Lógica compartilhada
│   │   └── 📁 utils/       # Funções auxiliares
├── 📁 server/          # Backend Express (a lógica)
│   ├── 📁 routes/      # Endpoints da API
│   ├── 📁 utils/       # Funções do servidor
│   └── 📄 index.ts     # Ponto de entrada
├── 📁 database/        # Tudo sobre dados
│   ├── 📁 scripts/     # Scripts de manutenção
│   ├── 📁 config/      # Configurações
│   └── 📁 migrations/  # Evolução do banco
└── 📁 shared/          # Código compartilhado
```

---

## 💡 Funcionalidades que mais uso

- **Dashboard em tempo real**: Vejo o desempenho da equipe a qualquer momento
- **Sistema de metas**: Defino objetivos realistas e acompanho o progresso
- **Ranking motivacional**: A equipe adora ver quem está se destacando
- **Relatórios personalizados**: Gero insights específicos para cada necessidade
- **Backup automático**: Durmo tranquilo sabendo que os dados estão seguros

---

## 🆘 Quando algo não funciona

1. **PostgreSQL rodando?** Verifique se o serviço está ativo
2. **Arquivo `.env` configurado?** Confirme as credenciais
3. **Execute:** `npm run db:test` para diagnosticar
4. **Consulte a documentação** em `/docs`

---

## 🤝 Contribuições

Este é um projeto pessoal, mas se você quiser contribuir ou tem ideias para melhorar, estou sempre aberto a sugestões! 

**Contato:** [Seu email ou GitHub]

---

> **Desenvolvido com ❤️ por Pedro Mendes**  
> *"Código é poesia, e poesia deve ser humana"*
