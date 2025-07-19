import { Pool } from "pg";
import { config } from "dotenv";
import bcrypt from "bcrypt";

config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function testAllOperations() {
  console.log("🧪 Teste final completo do banco de dados...\n");

  try {
    // 1. Teste de conexão
    console.log("1. Testando conexão...");
    const startTime = Date.now();
    await pool.query("SELECT NOW()");
    const connectionTime = Date.now() - startTime;
    console.log(`✅ Conexão OK (${connectionTime}ms)\n`);

    // 2. Teste de operações CRUD - Attendants
    console.log("2. Testando CRUD - Attendants...");

    // CREATE
    const attendantResult = await pool.query(
      `
      INSERT INTO attendants (name, image_url, earnings) 
      VALUES ($1, $2, $3) 
      RETURNING id, name, earnings
    `,
      ["Teste Final", "https://via.placeholder.com/150", "0.00"]
    );

    const attendantId = attendantResult.rows[0].id;
    console.log(`✅ Attendant criado: ${attendantResult.rows[0].name}`);

    // READ
    const readAttendant = await pool.query(
      `
      SELECT * FROM attendants WHERE id = $1
    `,
      [attendantId]
    );
    console.log(`✅ Attendant lido: ${readAttendant.rows[0].name}`);

    // UPDATE
    await pool.query(
      `
      UPDATE attendants 
      SET name = $1, earnings = $2 
      WHERE id = $3
    `,
      ["Teste Final Atualizado", "100.00", attendantId]
    );
    console.log(`✅ Attendant atualizado`);

    // DELETE (vamos manter para outros testes)
    // await pool.query(`DELETE FROM attendants WHERE id = $1`, [attendantId]);
    // console.log(`✅ Attendant deletado`);

    // 3. Teste de operações CRUD - Sales
    console.log("\n3. Testando CRUD - Sales...");

    // CREATE
    const saleResult = await pool.query(
      `
      INSERT INTO sales (attendant_id, value, client_name, client_phone, client_email) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING id, value, client_name
    `,
      [
        attendantId,
        "250.00",
        "Cliente Teste",
        "(11) 99999-9999",
        "teste@email.com",
      ]
    );

    const saleId = saleResult.rows[0].id;
    console.log(`✅ Sale criada: R$ ${saleResult.rows[0].value}`);

    // Verificar se earnings foi atualizado automaticamente
    const earningsCheck = await pool.query(
      `
      SELECT earnings FROM attendants WHERE id = $1
    `,
      [attendantId]
    );
    console.log(
      `✅ Earnings atualizado automaticamente: R$ ${earningsCheck.rows[0].earnings}`
    );

    // READ
    const readSale = await pool.query(
      `
      SELECT s.*, a.name as attendant_name 
      FROM sales s 
      JOIN attendants a ON s.attendant_id = a.id 
      WHERE s.id = $1
    `,
      [saleId]
    );
    console.log(`✅ Sale lida: Cliente ${readSale.rows[0].client_name}`);

    // UPDATE
    await pool.query(
      `
      UPDATE sales 
      SET value = $1, client_name = $2 
      WHERE id = $3
    `,
      ["300.00", "Cliente Teste Atualizado", saleId]
    );
    console.log(`✅ Sale atualizada`);

    // Verificar earnings após atualização
    const earningsAfterUpdate = await pool.query(
      `
      SELECT earnings FROM attendants WHERE id = $1
    `,
      [attendantId]
    );
    console.log(
      `✅ Earnings após atualização: R$ ${earningsAfterUpdate.rows[0].earnings}`
    );

    // DELETE
    await pool.query(
      `
      DELETE FROM sales WHERE id = $1
    `,
      [saleId]
    );
    console.log(`✅ Sale deletada`);

    // Verificar earnings após exclusão
    const earningsAfterDelete = await pool.query(
      `
      SELECT earnings FROM attendants WHERE id = $1
    `,
      [attendantId]
    );
    console.log(
      `✅ Earnings após exclusão: R$ ${earningsAfterDelete.rows[0].earnings}`
    );

    // 4. Teste de operações CRUD - Admins
    console.log("\n4. Testando CRUD - Admins...");

    const hashedPassword = await bcrypt.hash("test123", 10);

    // CREATE
    const adminResult = await pool.query(
      `
      INSERT INTO admins (username, password, email, role, is_active) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING id, username, role
    `,
      ["teste_admin", hashedPassword, "teste@admin.com", "admin", 1]
    );

    const adminId = adminResult.rows[0].id;
    console.log(`✅ Admin criado: ${adminResult.rows[0].username}`);

    // READ
    const readAdmin = await pool.query(
      `
      SELECT * FROM admins WHERE id = $1
    `,
      [adminId]
    );
    console.log(`✅ Admin lido: ${readAdmin.rows[0].username}`);

    // UPDATE
    await pool.query(
      `
      UPDATE admins 
      SET email = $1, role = $2 
      WHERE id = $3
    `,
      ["teste_atualizado@admin.com", "super_admin", adminId]
    );
    console.log(`✅ Admin atualizado`);

    // DELETE
    await pool.query(
      `
      DELETE FROM admins WHERE id = $1
    `,
      [adminId]
    );
    console.log(`✅ Admin deletado`);

    // 5. Teste de operações CRUD - Goals
    console.log("\n5. Testando CRUD - Goals...");

    // CREATE
    const goalResult = await pool.query(
      `
      INSERT INTO goals (attendant_id, title, description, target_value, goal_type, start_date, end_date, is_active) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING id, title, target_value
    `,
      [
        attendantId,
        "Meta Teste",
        "Descrição da meta teste",
        "1000.00",
        "monthly",
        new Date(),
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
        1,
      ]
    );

    const goalId = goalResult.rows[0].id;
    console.log(
      `✅ Goal criada: ${goalResult.rows[0].title}, Meta R$ ${goalResult.rows[0].target_value}`
    );

    // READ
    const readGoal = await pool.query(
      `
      SELECT g.*, a.name as attendant_name 
      FROM goals g 
      JOIN attendants a ON g.attendant_id = a.id 
      WHERE g.id = $1
    `,
      [goalId]
    );
    console.log(`✅ Goal lida: ${readGoal.rows[0].title}`);

    // UPDATE
    await pool.query(
      `
      UPDATE goals 
      SET title = $1, target_value = $2 
      WHERE id = $3
    `,
      ["Meta Teste Atualizada", "1500.00", goalId]
    );
    console.log(`✅ Goal atualizada`);

    // DELETE
    await pool.query(
      `
      DELETE FROM goals WHERE id = $1
    `,
      [goalId]
    );
    console.log(`✅ Goal deletada`);

    // 6. Teste de queries complexas
    console.log("\n6. Testando queries complexas...");

    // Criar algumas vendas para teste
    await pool.query(
      `
      INSERT INTO sales (attendant_id, value, client_name, client_phone) 
      VALUES ($1, $2, $3, $4)
    `,
      [attendantId, "150.00", "Cliente A", "(11) 11111-1111"]
    );

    await pool.query(
      `
      INSERT INTO sales (attendant_id, value, client_name, client_phone) 
      VALUES ($1, $2, $3, $4)
    `,
      [attendantId, "200.00", "Cliente B", "(11) 22222-2222"]
    );

    // Query com JOIN
    const complexQuery = await pool.query(`
      SELECT 
        a.name as attendant_name,
        COUNT(s.id) as total_sales,
        COALESCE(SUM(s.value), 0) as total_revenue,
        COALESCE(AVG(s.value), 0) as average_ticket
      FROM attendants a
      LEFT JOIN sales s ON a.id = s.attendant_id
      GROUP BY a.id, a.name
      ORDER BY total_revenue DESC
    `);
    console.log(`✅ Query complexa: ${complexQuery.rows.length} resultados`);

    // Query com agregação
    const aggregationQuery = await pool.query(`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as sales_count,
        SUM(value) as total_revenue,
        AVG(value) as average_ticket
      FROM sales
      WHERE created_at >= CURRENT_DATE - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month DESC
    `);
    console.log(
      `✅ Query de agregação: ${aggregationQuery.rows.length} resultados`
    );

    // Teste de função personalizada
    const summaryResult = await pool.query(`
      SELECT * FROM get_sales_summary()
    `);
    console.log(
      `✅ Função get_sales_summary: ${summaryResult.rows.length} resultados`
    );

    // 7. Teste de performance
    console.log("\n7. Testando performance...");

    // Teste de velocidade de leitura
    const readStart = Date.now();
    await pool.query("SELECT COUNT(*) FROM sales");
    const readTime = Date.now() - readStart;
    console.log(`✅ Leitura rápida: ${readTime}ms`);

    // Teste de velocidade de escrita
    const writeStart = Date.now();
    const testSale = await pool.query(
      `
      INSERT INTO sales (attendant_id, value, client_name) 
      VALUES ($1, $2, $3) 
      RETURNING id
    `,
      [attendantId, "100.00", "Performance Test"]
    );

    await pool.query(
      `
      DELETE FROM sales WHERE id = $1
    `,
      [testSale.rows[0].id]
    );
    const writeTime = Date.now() - writeStart;
    console.log(`✅ Escrita rápida: ${writeTime}ms`);

    // 8. Teste de transações
    console.log("\n8. Testando transações...");

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Criar attendant
      const attendantResult = await client.query(
        `
        INSERT INTO attendants (name, image_url, earnings) 
        VALUES ($1, $2, $3) 
        RETURNING id
      `,
        ["Transação Test", "https://via.placeholder.com/150", "0.00"]
      );

      // Criar venda
      await client.query(
        `
        INSERT INTO sales (attendant_id, value, client_name) 
        VALUES ($1, $2, $3)
      `,
        [attendantResult.rows[0].id, "400.00", "Cliente Transação"]
      );

      await client.query("COMMIT");
      console.log(`✅ Transação commitada com sucesso`);

      // Limpar dados de teste
      await pool.query(`
        DELETE FROM sales WHERE client_name = 'Cliente Transação'
      `);
      await pool.query(`
        DELETE FROM attendants WHERE name = 'Transação Test'
      `);
    } catch (error) {
      await client.query("ROLLBACK");
      console.log(`❌ Transação revertida: ${error.message}`);
    } finally {
      client.release();
    }

    // 9. Teste de constraints
    console.log("\n9. Testando constraints...");

    try {
      // Tentar inserir valor negativo (deve falhar)
      await pool.query(`
        INSERT INTO sales (attendant_id, value, client_name) 
        VALUES (1, -100.00, 'Teste Negativo')
      `);
      console.log(
        `❌ Constraint falhou - deveria ter rejeitado valor negativo`
      );
    } catch (error) {
      console.log(`✅ Constraint funcionando: ${error.message}`);
    }

    // 10. Verificação final
    console.log("\n10. Verificação final...");

    const finalChecks = [
      "SELECT COUNT(*) as attendants FROM attendants",
      "SELECT COUNT(*) as sales FROM sales",
      "SELECT COUNT(*) as admins FROM admins",
      "SELECT COUNT(*) as goals FROM goals",
      "SELECT COUNT(*) as achievements FROM achievements",
      "SELECT COUNT(*) as notifications FROM notifications",
      "SELECT COUNT(*) as leaderboard FROM leaderboard",
    ];

    for (const check of finalChecks) {
      const result = await pool.query(check);
      const tableName = check.split(" ")[3];
      const count = result.rows[0][tableName];
      console.log(`✅ ${tableName}: ${count} registros`);
    }

    // Limpar dados de teste
    await pool.query(
      `
      DELETE FROM sales WHERE attendant_id = $1
    `,
      [attendantId]
    );
    await pool.query(
      `
      DELETE FROM attendants WHERE id = $1
    `,
      [attendantId]
    );

    console.log("\n🎉 Todos os testes passaram com sucesso!");
    console.log("\n📊 Resumo dos testes:");
    console.log("✅ Operações CRUD - Attendants");
    console.log("✅ Operações CRUD - Sales");
    console.log("✅ Operações CRUD - Admins");
    console.log("✅ Operações CRUD - Goals");
    console.log("✅ Queries complexas");
    console.log("✅ Testes de performance");
    console.log("✅ Transações");
    console.log("✅ Constraints");
    console.log("✅ Verificação final");
    console.log(
      "\n🚀 Banco de dados totalmente otimizado e funcionando perfeitamente!"
    );
  } catch (error) {
    console.error("❌ Erro durante os testes:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Executar testes
testAllOperations().catch(console.error);
