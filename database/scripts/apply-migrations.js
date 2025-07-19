#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🗄️  Aplicando migrações do PostgreSQL...\n");

// Verificar se o arquivo de migração existe
const migrationFile = path.join(
  __dirname,
  "..",
  "migrations",
  "0000_sticky_emma_frost.sql"
);
if (!fs.existsSync(migrationFile)) {
  console.log("❌ Arquivo de migração não encontrado");
  console.log("Execute primeiro: npm run db:generate");
  process.exit(1);
}

console.log("📄 Arquivo de migração encontrado:", migrationFile);

// Ler o conteúdo da migração
const migrationContent = fs.readFileSync(migrationFile, "utf-8");
console.log("📝 Conteúdo da migração:");
console.log(migrationContent);

console.log("\n⚠️  IMPORTANTE:");
console.log("1. Certifique-se de que o PostgreSQL está rodando");
console.log("2. Configure o arquivo .env com sua senha do PostgreSQL");
console.log("3. Crie o banco de dados: CREATE DATABASE website_db;");
console.log("4. Execute: npm run db:push");

console.log("\n📋 Comandos para executar:");
console.log("1. psql -U postgres");
console.log("2. CREATE DATABASE website_db;");
console.log("3. \\q");
console.log("4. npm run db:push");
console.log("5. npm run db:seed");
