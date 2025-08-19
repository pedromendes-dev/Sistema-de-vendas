import { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

/**
 * Configuração do Servidor
 * Sistema de Vendas - Pedro Mendes
 * 
 * Este arquivo gerencia todas as configurações de middleware
 * e segurança do servidor Express.
 */

// Configurações de CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200,
};

// Configurações de Rate Limiting
const rateLimitConfig = {
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'), // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limite por IP
  message: {
    error: true,
    message: 'Muitas requisições deste IP, tente novamente mais tarde.',
    retryAfter: Math.ceil(parseInt(process.env.RATE_LIMIT_WINDOW || '900000') / 1000),
  },
  standardHeaders: true,
  legacyHeaders: false,
};

// Configurações de Helmet (segurança)
const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
};

/**
 * Aplica todas as configurações de middleware ao servidor
 * @param app - Instância do Express
 */
export function configureServer(app: Express): void {
  // Middleware de segurança
  app.use(helmet(helmetConfig));
  
  // CORS
  app.use(cors(corsOptions));
  
  // Compressão de resposta
  if (process.env.COMPRESSION_ENABLED === 'true') {
    app.use(compression());
  }
  
  // Rate limiting
  app.use('/api/', rateLimit(rateLimitConfig));
  
  // Middleware de parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  
  // Middleware de logging personalizado
  app.use(loggingMiddleware);
  
  // Middleware de tratamento de erros
  app.use(errorHandler);
}

/**
 * Middleware de logging personalizado
 */
function loggingMiddleware(req: any, res: any, next: any): void {
  const start = Date.now();
  const { method, path, ip } = req;
  
  // Captura a resposta para logging
  const originalSend = res.send;
  res.send = function(data: any) {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    
    // Log apenas para rotas da API
    if (path.startsWith('/api')) {
      console.log(`${method} ${path} ${statusCode} - ${duration}ms - IP: ${ip}`);
    }
    
    return originalSend.call(this, data);
  };
  
  next();
}

/**
 * Middleware de tratamento de erros global
 */
function errorHandler(err: any, req: any, res: any, next: any): void {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor';
  
  // Log do erro
  console.error(`Erro ${status}: ${message}`, err);
  
  // Resposta de erro padronizada
  res.status(status).json({
    error: true,
    message,
    status,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
  });
}

/**
 * Configurações de timeout e limites
 */
export const serverLimits = {
  requestTimeout: parseInt(process.env.REQUEST_TIMEOUT || '30000'),
  maxPayloadSize: '10mb',
  maxConnections: parseInt(process.env.MAX_CONNECTIONS || '100'),
};

/**
 * Verifica se o servidor está em modo de desenvolvimento
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Verifica se o servidor está em modo de produção
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}
