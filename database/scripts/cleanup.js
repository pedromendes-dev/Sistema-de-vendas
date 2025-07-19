#!/usr/bin/env node

/**
 * Script de Limpeza Automática
 * Remove dados desnecessários e corrige problemas comuns
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("🧹 Iniciando limpeza do projeto...");

// Função para remover console.logs
function removeConsoleLogs() {
  console.log("📝 Removendo console.logs...");

  const files = [
    "client/src/components/SimpleNotificationButton.tsx",
    "client/src/components/ModernNotificationButton.tsx",
    "server/routes.ts",
    "server/utils/backup.ts",
    "server/migrations/hash-passwords.ts",
    "server/vite.ts",
    "client/src/utils/auto-backup.ts",
  ];

  files.forEach((file) => {
    if (fs.existsSync(file)) {
      let content = fs.readFileSync(file, "utf8");
      content = content.replace(/console\.log\([^)]*\);?/g, "// Log removed");
      fs.writeFileSync(file, content);
      console.log(`✅ Limpo: ${file}`);
    }
  });
}

// Função para limpar backups antigos
function cleanOldBackups() {
  console.log("🗂️  Limpando backups antigos...");

  const backupDir = "backups";
  if (fs.existsSync(backupDir)) {
    const files = fs
      .readdirSync(backupDir)
      .filter((f) => f.startsWith("backup_") && f.endsWith(".json"))
      .map((f) => ({
        name: f,
        path: path.join(backupDir, f),
        time: fs.statSync(path.join(backupDir, f)).mtime.getTime(),
      }))
      .sort((a, b) => b.time - a.time);

    // Manter apenas os 5 mais recentes
    files.slice(5).forEach((file) => {
      fs.unlinkSync(file.path);
      console.log(`🗑️  Removido: ${file.name}`);
    });
  }
}

// Função para limpar imagens antigas
function cleanOldImages() {
  console.log("🖼️  Limpando imagens antigas...");

  const assetsDir = "attached_assets";
  if (fs.existsSync(assetsDir)) {
    const files = fs
      .readdirSync(assetsDir)
      .filter((f) => f.match(/\.(png|jpg|jpeg|gif|svg)$/i))
      .map((f) => ({
        name: f,
        path: path.join(assetsDir, f),
        time: fs.statSync(path.join(assetsDir, f)).mtime.getTime(),
      }))
      .sort((a, b) => b.time - a.time);

    // Manter apenas as 10 mais recentes
    files.slice(10).forEach((file) => {
      fs.unlinkSync(file.path);
      console.log(`🗑️  Removido: ${file.name}`);
    });
  }
}

// Função para verificar dependências não utilizadas
function checkUnusedDependencies() {
  console.log("📦 Verificando dependências não utilizadas...");

  try {
    const result = execSync("npx depcheck --json", { encoding: "utf8" });
    const data = JSON.parse(result);

    if (data.dependencies.length > 0) {
      console.log("⚠️  Dependências não utilizadas encontradas:");
      data.dependencies.forEach((dep) => console.log(`   - ${dep}`));
    }

    if (data.devDependencies.length > 0) {
      console.log("⚠️  DevDependencies não utilizadas encontradas:");
      data.devDependencies.forEach((dep) => console.log(`   - ${dep}`));
    }
  } catch (error) {
    console.log(
      "ℹ️  Instale depcheck para verificar dependências: npm install -g depcheck"
    );
  }
}

// Função para formatar código
function formatCode() {
  console.log("🎨 Formatando código...");

  try {
    execSync('npx prettier --write "**/*.{js,jsx,ts,tsx,json,css,md}"', {
      stdio: "inherit",
    });
    console.log("✅ Código formatado com Prettier");
  } catch (error) {
    console.log(
      "ℹ️  Instale Prettier para formatação: npm install -D prettier"
    );
  }
}

// Executar limpeza
try {
  removeConsoleLogs();
  cleanOldBackups();
  cleanOldImages();
  checkUnusedDependencies();
  formatCode();

  console.log("🎉 Limpeza concluída com sucesso!");
  console.log("📋 Resumo das ações:");
  console.log("   - Console.logs removidos");
  console.log("   - Backups antigos limpos");
  console.log("   - Imagens antigas removidas");
  console.log("   - Dependências verificadas");
  console.log("   - Código formatado");
} catch (error) {
  console.error("❌ Erro durante a limpeza:", error.message);
  process.exit(1);
}
