import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

/**
 * Sistema de Vendas - Servidor Principal
 * Desenvolvido por Pedro Mendes
 * 
 * Este servidor gerencia toda a lógica de negócio do sistema de vendas,
 * incluindo autenticação, operações de banco de dados e API REST.
 */

const app = express();

// Middleware para parsing de JSON e formulários
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware de logging personalizado para monitoramento de performance
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  // Captura a resposta JSON para logging
  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  // Log detalhado das requisições da API
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} em ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      // Limita o tamanho do log para melhor legibilidade
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Inicialização do servidor
(async () => {
  try {
    // Registra todas as rotas da API
    const server = await registerRoutes(app);

    // Middleware de tratamento de erros global
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Erro interno do servidor";

      res.status(status).json({ 
        error: true,
        message,
        timestamp: new Date().toISOString()
      });
      
      // Log do erro para debugging
      log(`Erro ${status}: ${message}`);
      throw err;
    });

    // Configuração do Vite apenas em desenvolvimento
    // Importante: configurar após todas as outras rotas para que
    // a rota catch-all não interfira com as rotas da API
    if (app.get("env") === "development") {
      await setupVite(app, server);
      log("🚀 Modo desenvolvimento ativo - Vite configurado");
    } else {
      serveStatic(app);
      log("🏭 Modo produção ativo - Arquivos estáticos servidos");
    }

    // Inicia o servidor na porta configurada
    const port = process.env.PORT || 5050;
    server.listen(Number(port), "0.0.0.0", () => {
      log(`✅ Servidor rodando na porta ${port}`);
      log(`🌐 Acesse: http://localhost:${port}`);
      log(`📊 Sistema de Vendas - Pedro Mendes`);
    });

  } catch (error) {
    log(`❌ Erro ao inicializar servidor: ${error}`);
    process.exit(1);
  }
})();
