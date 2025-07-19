#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🚀 Configurando banco de dados...\n");

// Verificar se o arquivo .env existe
const envPath = path.join(__dirname, "..", ".env");
if (!fs.existsSync(envPath)) {
  console.log("📝 Criando arquivo .env...");

  const envContent = `# Database Configuration
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/website_db

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Secret (for authentication)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
`;

  fs.writeFileSync(envPath, envContent);
  console.log("✅ Arquivo .env criado!");
  console.log(
    "⚠️  IMPORTANTE: Edite o arquivo .env e configure sua senha do PostgreSQL"
  );
} else {
  console.log("✅ Arquivo .env já existe");
}

// Verificar se as dependências estão instaladas
console.log("\n📦 Verificando dependências...");
try {
  execSync("npm list drizzle-orm", { stdio: "pipe" });
  console.log("✅ Drizzle ORM instalado");
} catch (error) {
  console.log("📦 Instalando Drizzle ORM...");
  execSync("npm install drizzle-orm @neondatabase/serverless drizzle-kit", {
    stdio: "inherit",
  });
}

// Executar migrações
console.log("\n🗄️  Executando migrações...");
try {
  execSync("npx drizzle-kit push", { stdio: "inherit" });
  console.log("✅ Migrações executadas com sucesso!");
} catch (error) {
  console.log("❌ Erro ao executar migrações");
  console.log("Verifique se:");
  console.log("1. PostgreSQL está instalado e rodando");
  console.log('2. O banco de dados "website_db" existe');
  console.log("3. A senha no DATABASE_URL está correta");
  console.log("4. O usuário tem permissões no banco");
}

console.log("\n🎉 Configuração concluída!");
console.log("\n📋 Próximos passos:");
console.log("1. Edite o arquivo .env com sua senha do PostgreSQL");
console.log("2. Execute: npm run dev");
console.log("3. Acesse: http://localhost:3000");
