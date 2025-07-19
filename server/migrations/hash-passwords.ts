// Script para migrar senhas existentes para hash bcrypt
import { db } from "../db";
import { admins } from "@shared/schema";
import { hashPassword } from "../utils/auth";
import { eq } from "drizzle-orm";

async function migratePasswords() {
  // Iniciando migração de senhas...

  try {
    // Buscar todos os admins
    const allAdmins = await db.select().from(admins);

    for (const admin of allAdmins) {
      // Verificar se a senha já está hasheada (bcrypt hashes começam com $2)
      if (!admin.password.startsWith("$2")) {
        // Migrando senha do admin

        // Hash da senha atual
        const hashedPassword = await hashPassword(admin.password);

        // Atualizar no banco
        await db
          .update(admins)
          .set({ password: hashedPassword })
          .where(eq(admins.id, admin.id));

        // Senha migrada com sucesso
      } else {
        // Senha já está hasheada
      }
    }

    // Migração de senhas concluída!
  } catch (error) {
    console.error("❌ Erro na migração:", error);
    process.exit(1);
  }
}

// Executar migração se chamado diretamente
if (require.main === module) {
  migratePasswords()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { migratePasswords };
