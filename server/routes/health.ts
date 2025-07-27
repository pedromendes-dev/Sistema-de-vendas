import { Router } from 'express';
import { db } from '../db';
import { sql } from 'drizzle-orm';

const router = Router();

router.get('/health', async (req, res) => {
  try {
    // Verificar conexão com o banco de dados
    const result = await db.execute(sql`SELECT 1 as health_check`);
    
    // Retornar status de saúde
    return res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: result.length > 0 ? 'connected' : 'error',
      environment: process.env.NODE_ENV
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'error',
      environment: process.env.NODE_ENV,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;