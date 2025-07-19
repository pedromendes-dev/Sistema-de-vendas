import { readdir, stat } from "fs/promises";
import { join } from "path";

async function showStructure(
  dir = ".",
  prefix = "",
  maxDepth = 3,
  currentDepth = 0
) {
  if (currentDepth > maxDepth) return;

  try {
    const items = await readdir(dir);
    const sortedItems = items.sort((a, b) => {
      // Diretórios primeiro, depois arquivos
      const aStat = stat(join(dir, a));
      const bStat = stat(join(dir, b));
      return aStat
        .then((stat) => stat.isDirectory())
        .then((isDir) => (isDir ? -1 : 1));
    });

    for (let i = 0; i < sortedItems.length; i++) {
      const item = sortedItems[i];
      const path = join(dir, item);
      const stats = await stat(path);
      const isLast = i === sortedItems.length - 1;
      const isDirectory = stats.isDirectory();

      // Pular node_modules e outros diretórios desnecessários
      if (
        item === "node_modules" ||
        item === ".git" ||
        item === "dist" ||
        item === ".vscode"
      ) {
        continue;
      }

      const icon = isDirectory ? "📁" : getFileIcon(item);
      const connector = isLast ? "└── " : "├── ";
      const nextPrefix = isLast ? "    " : "│   ";

      console.log(`${prefix}${connector}${icon} ${item}`);

      if (isDirectory && currentDepth < maxDepth) {
        await showStructure(
          path,
          prefix + nextPrefix,
          maxDepth,
          currentDepth + 1
        );
      }
    }
  } catch (error) {
    console.error(`Erro ao ler diretório ${dir}:`, error.message);
  }
}

function getFileIcon(filename) {
  const ext = filename.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "js":
    case "ts":
      return "📄";
    case "json":
      return "⚙️";
    case "md":
      return "📝";
    case "sql":
      return "🗄️";
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "svg":
      return "🖼️";
    case "css":
      return "🎨";
    case "html":
      return "🌐";
    case "txt":
      return "📄";
    default:
      return "📄";
  }
}

async function main() {
  console.log("📁 Estrutura do Projeto Organizado\n");

  console.log("🎯 Principais Diretórios:");
  console.log("├── 📊 database/     - Banco de dados e scripts");
  console.log("├── 📚 docs/         - Documentação");
  console.log("├── 🧪 tests/        - Testes");
  console.log("├── 🛠️ utils/        - Utilitários");
  console.log("├── 🎨 assets/       - Assets e imagens");
  console.log("├── 🏗️ client/       - Frontend React");
  console.log("├── ⚙️ server/       - Backend Express");
  console.log("└── 🔗 shared/       - Código compartilhado\n");

  console.log("📋 Estrutura Detalhada:");
  await showStructure(".", "", 3);

  console.log("\n✅ Organização Concluída!");
  console.log("\n📊 Benefícios:");
  console.log("   • Separação clara de responsabilidades");
  console.log("   • Fácil manutenção e navegação");
  console.log("   • Escalabilidade para crescimento");
  console.log("   • Scripts organizados por funcionalidade");
  console.log("   • Documentação centralizada");
  console.log("   • Testes isolados");
  console.log("   • Assets organizados");
}

main().catch(console.error);
