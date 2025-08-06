# Organização do Projeto

Este documento descreve a estrutura de pastas e arquivos do sistema de controle de vendas.

## Estrutura principal

```
Website/
├── assets/           # Imagens e arquivos estáticos
├── client/           # Código do frontend (React)
│   ├── public/       # Arquivos públicos (favicon, index.html)
│   └── src/          # Código-fonte da aplicação
│       ├── components/ # Componentes reutilizáveis
│       ├── pages/      # Páginas do sistema
│       ├── hooks/      # Hooks customizados
│       ├── utils/      # Funções auxiliares
│       └── ...
├── database/         # Scripts e migrações do banco de dados
│   ├── scripts/      # Scripts utilitários
│   ├── config/       # Configurações do banco
│   └── migrations/   # Migrações SQL
├── docs/             # Documentação do projeto
├── server/           # Código do backend (API, lógica de negócio)
│   ├── routes/       # Rotas da API
│   ├── utils/        # Utilitários do servidor
│   └── ...
├── shared/           # Código compartilhado entre client/server
├── tests/            # Testes automatizados
├── package.json      # Dependências e scripts
└── ...
```

## Descrição dos principais diretórios

- **assets/**: Imagens, ícones e arquivos estáticos.
- **client/**: Todo o código do frontend (React, TypeScript, Tailwind).
- **database/**: Scripts, migrações e configurações do banco de dados.
- **docs/**: Documentação e guias de uso/configuração.
- **server/**: Backend (API, lógica de negócio, integrações).
- **shared/**: Schemas, tipos e utilitários compartilhados.
- **tests/**: Scripts de teste automatizado.

## Observações
- Não versionar a pasta `node_modules`.
- Manter a documentação sempre atualizada.

---