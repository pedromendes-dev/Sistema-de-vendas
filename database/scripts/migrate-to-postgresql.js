#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🔄 Migrando configuração do banco para PostgreSQL...\n");

// 1. Gerar migrações baseadas no schema
console.log("📝 Gerando migrações...");
try {
  execSync("npx drizzle-kit generate", { stdio: "inherit" });
  console.log("✅ Migrações geradas!");
} catch (error) {
  console.log("❌ Erro ao gerar migrações");
}

// 2. Executar migrações
console.log("\n🗄️  Executando migrações...");
try {
  execSync("npx drizzle-kit push", { stdio: "inherit" });
  console.log("✅ Migrações executadas!");
} catch (error) {
  console.log("❌ Erro ao executar migrações");
  console.log(
    "Verifique se o PostgreSQL está rodando e o DATABASE_URL está correto"
  );
}

// 3. Criar dados iniciais
console.log("\n📊 Criando dados iniciais...");
try {
  execSync("node scripts/seed-database.js", { stdio: "inherit" });
  console.log("✅ Dados iniciais criados!");
} catch (error) {
  console.log(
    "⚠️  Erro ao criar dados iniciais (pode ser normal se não existir)"
  );
}

console.log("\n🎉 Migração concluída!");
console.log("\n📋 Próximos passos:");
console.log("1. Execute: npm run dev");
console.log("2. Acesse: http://localhost:3000");
console.log("3. Verifique se todas as tabelas foram criadas");
