/**
 * Constantes da Aplicação
 * Sistema de Vendas - Pedro Mendes
 * 
 * Este arquivo contém todas as constantes utilizadas
 * em todo o sistema.
 */

// ========================================
// CONFIGURAÇÕES DO SISTEMA
// ========================================

export const APP_CONFIG = {
  NAME: 'Sistema de Vendas',
  VERSION: '1.0.0',
  AUTHOR: 'Pedro Mendes',
  DESCRIPTION: 'Sistema de gestão de vendas com gamificação',
  SUPPORT_EMAIL: 'suporte@sistemavendas.com',
  WEBSITE: 'https://sistemavendas.com',
} as const;

// ========================================
// CONFIGURAÇÕES DE PAGINAÇÃO
// ========================================

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  MIN_LIMIT: 5,
} as const;

// ========================================
// CONFIGURAÇÕES DE CACHE
// ========================================

export const CACHE = {
  DEFAULT_TTL: 300, // 5 minutos
  USER_SESSION_TTL: 3600, // 1 hora
  DASHBOARD_TTL: 60, // 1 minuto
  REPORTS_TTL: 1800, // 30 minutos
} as const;

// ========================================
// CONFIGURAÇÕES DE ARQUIVOS
// ========================================

export const FILE_LIMITS = {
  MAX_AVATAR_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_DOCUMENT_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
} as const;

// ========================================
// CONFIGURAÇÕES DE VALIDAÇÃO
// ========================================

export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MIN_EMAIL_LENGTH: 5,
  MAX_EMAIL_LENGTH: 254,
  MIN_PHONE_LENGTH: 10,
  MAX_PHONE_LENGTH: 11,
  CPF_LENGTH: 11,
  CNPJ_LENGTH: 14,
} as const;

// ========================================
// CONFIGURAÇÕES DE NOTIFICAÇÕES
// ========================================

export const NOTIFICATIONS = {
  MAX_UNREAD: 50,
  AUTO_DELETE_DAYS: 30,
  SOUND_DURATION: 3000, // 3 segundos
  TOAST_DURATION: 5000, // 5 segundos
} as const;

// ========================================
// CONFIGURAÇÕES DE BACKUP
// ========================================

export const BACKUP = {
  DEFAULT_RETENTION_DAYS: 30,
  MAX_RETENTION_DAYS: 365,
  MIN_RETENTION_DAYS: 7,
  AUTO_BACKUP_HOUR: 2, // 2h da manhã
  MAX_BACKUP_SIZE: 1024 * 1024 * 1024, // 1GB
} as const;

// ========================================
// CONFIGURAÇÕES DE SEGURANÇA
// ========================================

export const SECURITY = {
  BCRYPT_ROUNDS: 12,
  JWT_EXPIRY: '24h',
  SESSION_EXPIRY: '24h',
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutos
  PASSWORD_HISTORY_SIZE: 5,
} as const;

// ========================================
// CONFIGURAÇÕES DE PERFORMANCE
// ========================================

export const PERFORMANCE = {
  REQUEST_TIMEOUT: 30000, // 30 segundos
  MAX_CONCURRENT_REQUESTS: 100,
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutos
  RATE_LIMIT_MAX_REQUESTS: 100,
  COMPRESSION_THRESHOLD: 1024, // 1KB
} as const;

// ========================================
// CONFIGURAÇÕES DE RELATÓRIOS
// ========================================

export const REPORTS = {
  MAX_GENERATION_TIME: 5 * 60 * 1000, // 5 minutos
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  SUPPORTED_FORMATS: ['pdf', 'excel', 'csv', 'json'] as const,
  DEFAULT_FORMAT: 'pdf' as const,
} as const;

// ========================================
// CONFIGURAÇÕES DE DASHBOARD
// ========================================

export const DASHBOARD = {
  DEFAULT_REFRESH_INTERVAL: 30000, // 30 segundos
  MIN_REFRESH_INTERVAL: 10000, // 10 segundos
  MAX_REFRESH_INTERVAL: 300000, // 5 minutos
  MAX_WIDGETS_PER_ROW: 4,
  MAX_WIDGETS_PER_COLUMN: 6,
} as const;

// ========================================
// CONFIGURAÇÕES DE GAMIFICAÇÃO
// ========================================

export const GAMIFICATION = {
  POINTS_PER_SALE: 10,
  BONUS_POINTS_THRESHOLD: 1000, // R$ 1000
  BONUS_POINTS_MULTIPLIER: 1.5,
  DAILY_GOAL_BONUS: 50,
  WEEKLY_GOAL_BONUS: 200,
  MONTHLY_GOAL_BONUS: 1000,
  MAX_DAILY_POINTS: 1000,
} as const;

// ========================================
// CONFIGURAÇÕES DE COMISSÕES
// ========================================

export const COMMISSIONS = {
  DEFAULT_RATE: 0.05, // 5%
  MIN_RATE: 0.01, // 1%
  MAX_RATE: 0.20, // 20%
  BONUS_THRESHOLD: 5000, // R$ 5000
  BONUS_RATE: 0.02, // 2% adicional
} as const;

// ========================================
// CONFIGURAÇÕES DE META
// ========================================

export const GOALS = {
  DEFAULT_DAILY_TARGET: 1000, // R$ 1000
  DEFAULT_WEEKLY_TARGET: 5000, // R$ 5000
  DEFAULT_MONTHLY_TARGET: 20000, // R$ 20000
  MIN_TARGET: 100, // R$ 100
  MAX_TARGET: 1000000, // R$ 1.000.000
  PROGRESS_UPDATE_INTERVAL: 60000, // 1 minuto
} as const;

// ========================================
// CONFIGURAÇÕES DE CLIENTES
// ========================================

export const CLIENTS = {
  MAX_TAGS_PER_CLIENT: 10,
  MAX_NOTES_LENGTH: 1000,
  AUTO_ARCHIVE_DAYS: 365, // 1 ano sem atividade
  DUPLICATE_CHECK_FIELDS: ['email', 'phone', 'cpf', 'cnpj'] as const,
} as const;

// ========================================
// CONFIGURAÇÕES DE VENDAS
// ========================================

export const SALES = {
  MAX_ITEMS_PER_SALE: 100,
  MAX_NOTES_LENGTH: 500,
  MIN_AMOUNT: 0.01,
  MAX_AMOUNT: 1000000, // R$ 1.000.000
  REFUND_WINDOW_DAYS: 30,
} as const;

// ========================================
// CONFIGURAÇÕES DE ATENDENTES
// ========================================

export const ATTENDANTS = {
  MAX_AVATAR_SIZE: 2 * 1024 * 1024, // 2MB
  MAX_BIO_LENGTH: 500,
  MIN_WORKING_HOURS: 4,
  MAX_WORKING_HOURS: 12,
  DEFAULT_COMMISSION_RATE: 0.05, // 5%
} as const;

// ========================================
// CONFIGURAÇÕES DE AUDITORIA
// ========================================

export const AUDIT = {
  LOG_RETENTION_DAYS: 1095, // 3 anos
  MAX_LOG_ENTRIES: 1000000,
  SENSITIVE_FIELDS: ['password', 'token', 'secret'] as const,
  LOG_LEVELS: ['error', 'warn', 'info', 'debug'] as const,
} as const;

// ========================================
// CONFIGURAÇÕES DE DESENVOLVIMENTO
// ========================================

export const DEVELOPMENT = {
  DEBUG_MODE: process.env.NODE_ENV === 'development',
  HOT_RELOAD: process.env.HOT_RELOAD_ENABLED === 'true',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  ENABLE_PROFILING: process.env.ENABLE_PROFILING === 'true',
} as const;

// ========================================
// MENSAGENS DO SISTEMA
// ========================================

export const MESSAGES = {
  ERRORS: {
    UNAUTHORIZED: 'Acesso não autorizado',
    FORBIDDEN: 'Acesso negado',
    NOT_FOUND: 'Recurso não encontrado',
    VALIDATION_ERROR: 'Erro de validação',
    INTERNAL_ERROR: 'Erro interno do servidor',
    DATABASE_ERROR: 'Erro no banco de dados',
    NETWORK_ERROR: 'Erro de conexão',
    TIMEOUT_ERROR: 'Tempo limite excedido',
  },
  SUCCESS: {
    CREATED: 'Recurso criado com sucesso',
    UPDATED: 'Recurso atualizado com sucesso',
    DELETED: 'Recurso removido com sucesso',
    LOGIN_SUCCESS: 'Login realizado com sucesso',
    LOGOUT_SUCCESS: 'Logout realizado com sucesso',
    BACKUP_SUCCESS: 'Backup realizado com sucesso',
  },
  WARNINGS: {
    SESSION_EXPIRING: 'Sua sessão expirará em breve',
    BACKUP_OVERDUE: 'Backup em atraso',
    DISK_SPACE_LOW: 'Espaço em disco baixo',
    PERFORMANCE_DEGRADED: 'Performance degradada detectada',
  },
} as const;

// ========================================
// CONFIGURAÇÕES DE ROTAS
// ========================================

export const ROUTES = {
  API: {
    BASE: '/api',
    VERSION: '/v1',
    AUTH: '/auth',
    USERS: '/users',
    SALES: '/sales',
    CLIENTS: '/clients',
    GOALS: '/goals',
    REPORTS: '/reports',
    BACKUP: '/backup',
    HEALTH: '/health',
  },
  FRONTEND: {
    HOME: '/',
    DASHBOARD: '/dashboard',
    SALES: '/sales',
    CLIENTS: '/clients',
    ATTENDANTS: '/attendants',
    GOALS: '/goals',
    RANKING: '/ranking',
    HISTORY: '/history',
    ADMIN: '/admin',
    PROFILE: '/profile',
    SETTINGS: '/settings',
  },
} as const;
