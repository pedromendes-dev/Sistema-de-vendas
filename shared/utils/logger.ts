import fs from 'fs';
import path from 'path';

/**
 * Sistema de Logging
 * Sistema de Vendas - Pedro Mendes
 * 
 * Este arquivo gerencia todo o sistema de logging
 * da aplicação com diferentes níveis e destinos.
 */

// ========================================
// TIPOS E INTERFACES
// ========================================

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  data?: any;
  userId?: string;
  ip?: string;
  userAgent?: string;
  duration?: number;
}

export interface LoggerConfig {
  level: LogLevel;
  filePath?: string;
  maxSize?: string;
  maxFiles?: number;
  enableConsole: boolean;
  enableFile: boolean;
  enableColors: boolean;
}

// ========================================
// CONFIGURAÇÃO PADRÃO
// ========================================

const DEFAULT_CONFIG: LoggerConfig = {
  level: (process.env.LOG_LEVEL as LogLevel) || 'info',
  filePath: process.env.LOG_FILE || './logs/app.log',
  maxSize: process.env.LOG_MAX_SIZE || '10m',
  maxFiles: parseInt(process.env.LOG_MAX_FILES || '5'),
  enableConsole: true,
  enableFile: process.env.NODE_ENV === 'production',
  enableColors: process.env.NODE_ENV !== 'production',
};

// ========================================
// UTILITÁRIOS
// ========================================

/**
 * Converte string de tamanho para bytes
 */
function parseSize(size: string): number {
  const units: Record<string, number> = {
    b: 1,
    kb: 1024,
    mb: 1024 * 1024,
    gb: 1024 * 1024 * 1024,
  };

  const match = size.toLowerCase().match(/^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)$/);
  if (!match) return 10 * 1024 * 1024; // 10MB padrão

  const [, value, unit] = match;
  return parseFloat(value) * units[unit];
}

/**
 * Cria diretório de logs se não existir
 */
function ensureLogDirectory(filePath: string): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Rotaciona arquivo de log se necessário
 */
function rotateLogFile(filePath: string, maxSize: number): void {
  try {
    if (!fs.existsSync(filePath)) return;

    const stats = fs.statSync(filePath);
    if (stats.size < maxSize) return;

    const dir = path.dirname(filePath);
    const ext = path.extname(filePath);
    const base = path.basename(filePath, ext);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    // Move arquivo atual para backup
    const backupPath = path.join(dir, `${base}-${timestamp}${ext}`);
    fs.renameSync(filePath, backupPath);

    // Remove arquivos antigos se exceder maxFiles
    const files = fs.readdirSync(dir)
      .filter(file => file.startsWith(base) && file !== path.basename(filePath))
      .sort()
      .reverse();

    while (files.length >= DEFAULT_CONFIG.maxFiles) {
      const fileToRemove = files.pop();
      if (fileToRemove) {
        fs.unlinkSync(path.join(dir, fileToRemove));
      }
    }
  } catch (error) {
    console.error('Erro ao rotacionar arquivo de log:', error);
  }
}

// ========================================
// CLASSE PRINCIPAL DO LOGGER
// ========================================

class Logger {
  private config: LoggerConfig;
  private logFileStream?: fs.WriteStream;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.initialize();
  }

  /**
   * Inicializa o logger
   */
  private initialize(): void {
    if (this.config.enableFile && this.config.filePath) {
      ensureLogDirectory(this.config.filePath);
      this.logFileStream = fs.createWriteStream(this.config.filePath, { flags: 'a' });
    }
  }

  /**
   * Formata entrada de log
   */
  private formatLogEntry(entry: LogEntry): string {
    const timestamp = entry.timestamp;
    const level = entry.level.toUpperCase().padEnd(5);
    const context = entry.context ? `[${entry.context}]` : '';
    const message = entry.message;
    const data = entry.data ? ` | ${JSON.stringify(entry.data)}` : '';
    const duration = entry.duration ? ` | ${entry.duration}ms` : '';

    return `${timestamp} ${level} ${context} ${message}${data}${duration}`;
  }

  /**
   * Adiciona cores ao console (apenas em desenvolvimento)
   */
  private colorize(level: LogLevel, text: string): string {
    if (!this.config.enableColors) return text;

    const colors: Record<LogLevel, string> = {
      debug: '\x1b[36m', // Cyan
      info: '\x1b[32m',  // Green
      warn: '\x1b[33m',  // Yellow
      error: '\x1b[31m', // Red
    };

    const reset = '\x1b[0m';
    return `${colors[level]}${text}${reset}`;
  }

  /**
   * Escreve log no arquivo
   */
  private writeToFile(entry: LogEntry): void {
    if (!this.config.enableFile || !this.logFileStream || !this.config.filePath) return;

    try {
      const logLine = this.formatLogEntry(entry) + '\n';
      this.logFileStream.write(logLine);

      // Rotaciona arquivo se necessário
      if (this.config.maxSize) {
        rotateLogFile(this.config.filePath, parseSize(this.config.maxSize));
      }
    } catch (error) {
      console.error('Erro ao escrever no arquivo de log:', error);
    }
  }

  /**
   * Escreve log no console
   */
  private writeToConsole(entry: LogEntry): void {
    if (!this.config.enableConsole) return;

    const formattedEntry = this.formatLogEntry(entry);
    const coloredEntry = this.colorize(entry.level, formattedEntry);
    
    switch (entry.level) {
      case 'error':
        console.error(coloredEntry);
        break;
      case 'warn':
        console.warn(coloredEntry);
        break;
      case 'info':
        console.info(coloredEntry);
        break;
      case 'debug':
        console.debug(coloredEntry);
        break;
    }
  }

  /**
   * Verifica se o nível de log deve ser exibido
   */
  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.config.level);
    const messageLevelIndex = levels.indexOf(level);
    
    return messageLevelIndex >= currentLevelIndex;
  }

  /**
   * Método principal de logging
   */
  private log(level: LogLevel, message: string, options: Partial<LogEntry> = {}): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...options,
    };

    this.writeToConsole(entry);
    this.writeToFile(entry);
  }

  // ========================================
  // MÉTODOS PÚBLICOS
  // ========================================

  /**
   * Log de debug
   */
  debug(message: string, options?: Partial<LogEntry>): void {
    this.log('debug', message, options);
  }

  /**
   * Log de informação
   */
  info(message: string, options?: Partial<LogEntry>): void {
    this.log('info', message, options);
  }

  /**
   * Log de aviso
   */
  warn(message: string, options?: Partial<LogEntry>): void {
    this.log('warn', message, options);
  }

  /**
   * Log de erro
   */
  error(message: string, options?: Partial<LogEntry>): void {
    this.log('error', message, options);
  }

  /**
   * Log de performance
   */
  performance(operation: string, duration: number, options?: Partial<LogEntry>): void {
    this.info(`${operation} executado em ${duration}ms`, { ...options, duration });
  }

  /**
   * Log de acesso
   */
  access(method: string, path: string, statusCode: number, duration: number, options?: Partial<LogEntry>): void {
    const level = statusCode >= 400 ? 'warn' : 'info';
    const message = `${method} ${path} ${statusCode}`;
    
    this.log(level, message, { ...options, duration, context: 'ACCESS' });
  }

  /**
   * Log de segurança
   */
  security(event: string, userId?: string, ip?: string, options?: Partial<LogEntry>): void {
    this.warn(`Evento de segurança: ${event}`, { ...options, userId, ip, context: 'SECURITY' });
  }

  /**
   * Log de banco de dados
   */
  database(operation: string, table: string, duration: number, options?: Partial<LogEntry>): void {
    this.debug(`${operation} na tabela ${table}`, { ...options, duration, context: 'DATABASE' });
  }

  /**
   * Fecha o logger
   */
  close(): void {
    if (this.logFileStream) {
      this.logFileStream.end();
    }
  }

  /**
   * Atualiza configuração
   */
  updateConfig(newConfig: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.initialize();
  }
}

// ========================================
// INSTÂNCIA GLOBAL
// ========================================

export const logger = new Logger();

// ========================================
// FUNÇÕES DE CONVENIÊNCIA
// ========================================

/**
 * Logger para contexto específico
 */
export function createContextLogger(context: string) {
  return {
    debug: (message: string, options?: Partial<LogEntry>) => 
      logger.debug(message, { ...options, context }),
    info: (message: string, options?: Partial<LogEntry>) => 
      logger.info(message, { ...options, context }),
    warn: (message: string, options?: Partial<LogEntry>) => 
      logger.warn(message, { ...options, context }),
    error: (message: string, options?: Partial<LogEntry>) => 
      logger.error(message, { ...options, context }),
  };
}

/**
 * Logger para usuário específico
 */
export function createUserLogger(userId: string) {
  return {
    debug: (message: string, options?: Partial<LogEntry>) => 
      logger.debug(message, { ...options, userId }),
    info: (message: string, options?: Partial<LogEntry>) => 
      logger.info(message, { ...options, userId }),
    warn: (message: string, options?: Partial<LogEntry>) => 
      logger.warn(message, { ...options, userId }),
    error: (message: string, options?: Partial<LogEntry>) => 
      logger.error(message, { ...options, userId }),
  };
}

// ========================================
// EXPORTAÇÕES
// ========================================

export default logger;
export { Logger };
export type { LoggerConfig, LogEntry, LogLevel };
