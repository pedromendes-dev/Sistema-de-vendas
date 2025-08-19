/**
 * Tipos Comuns
 * Sistema de Vendas - Pedro Mendes
 * 
 * Este arquivo contém tipos TypeScript reutilizáveis
 * em todo o sistema.
 */

// ========================================
// TIPOS BÁSICOS
// ========================================

/**
 * Status genérico para operações
 */
export type Status = 'success' | 'error' | 'warning' | 'info';

/**
 * Estado de carregamento
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Direção de ordenação
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Filtro genérico
 */
export interface Filter<T = any> {
  field: keyof T;
  value: string | number | boolean;
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'in' | 'not';
}

/**
 * Paginação
 */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Ordenação
 */
export interface Sort<T = any> {
  field: keyof T;
  direction: SortDirection;
}

/**
 * Parâmetros de consulta
 */
export interface QueryParams<T = any> {
  filters?: Filter<T>[];
  sort?: Sort<T>;
  pagination?: Partial<Pagination>;
  search?: string;
}

// ========================================
// TIPOS DE RESPOSTA
// ========================================

/**
 * Resposta padrão da API
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
  path: string;
}

/**
 * Resposta de erro da API
 */
export interface ApiError {
  success: false;
  error: string;
  message: string;
  status: number;
  timestamp: string;
  path: string;
  details?: any;
}

/**
 * Resposta de sucesso da API
 */
export interface ApiSuccess<T = any> {
  success: true;
  data: T;
  message?: string;
  timestamp: string;
  path: string;
}

/**
 * Resposta paginada da API
 */
export interface PaginatedResponse<T = any> extends ApiSuccess<T[]> {
  pagination: Pagination;
}

// ========================================
// TIPOS DE USUÁRIO E AUTENTICAÇÃO
// ========================================

/**
 * Níveis de permissão
 */
export type PermissionLevel = 'admin' | 'manager' | 'attendant' | 'viewer';

/**
 * Status do usuário
 */
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

/**
 * Usuário base
 */
export interface BaseUser {
  id: string;
  name: string;
  email: string;
  permissionLevel: PermissionLevel;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * Usuário com informações completas
 */
export interface User extends BaseUser {
  phone?: string;
  avatar?: string;
  lastLogin?: string;
  preferences?: UserPreferences;
}

/**
 * Preferências do usuário
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'pt-BR' | 'en-US' | 'es-ES';
  notifications: {
    email: boolean;
    push: boolean;
    sound: boolean;
  };
  dashboard: {
    defaultView: 'overview' | 'detailed' | 'minimal';
    refreshInterval: number;
  };
}

// ========================================
// TIPOS DE VENDAS
// ========================================

/**
 * Status da venda
 */
export type SaleStatus = 'pending' | 'completed' | 'cancelled' | 'refunded';

/**
 * Tipo de pagamento
 */
export type PaymentType = 'cash' | 'credit_card' | 'debit_card' | 'pix' | 'transfer';

/**
 * Venda base
 */
export interface BaseSale {
  id: string;
  amount: number;
  status: SaleStatus;
  paymentType: PaymentType;
  attendantId: string;
  clientId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Venda com informações completas
 */
export interface Sale extends BaseSale {
  items: SaleItem[];
  commission: number;
  notes?: string;
  completedAt?: string;
}

/**
 * Item da venda
 */
export interface SaleItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  description: string;
}

// ========================================
// TIPOS DE CLIENTE
// ========================================

/**
 * Tipo de cliente
 */
export type ClientType = 'individual' | 'company' | 'wholesale';

/**
 * Status do cliente
 */
export type ClientStatus = 'active' | 'inactive' | 'prospect';

/**
 * Cliente base
 */
export interface BaseClient {
  id: string;
  name: string;
  type: ClientType;
  status: ClientStatus;
  email?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Cliente com informações completas
 */
export interface Client extends BaseClient {
  cpf?: string;
  cnpj?: string;
  address?: Address;
  notes?: string;
  tags?: string[];
}

/**
 * Endereço
 */
export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

// ========================================
// TIPOS DE META
// ========================================

/**
 * Tipo de meta
 */
export type GoalType = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

/**
 * Status da meta
 */
export type GoalStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

/**
 * Meta base
 */
export interface BaseGoal {
  id: string;
  title: string;
  description?: string;
  type: GoalType;
  target: number;
  current: number;
  status: GoalStatus;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Meta com informações completas
 */
export interface Goal extends BaseGoal {
  attendantId?: string;
  category?: string;
  priority: 'low' | 'medium' | 'high';
  progress: number; // 0-100
  rewards?: string[];
}

// ========================================
// TIPOS DE NOTIFICAÇÃO
// ========================================

/**
 * Tipo de notificação
 */
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

/**
 * Prioridade da notificação
 */
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Notificação base
 */
export interface BaseNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  read: boolean;
  createdAt: string;
}

/**
 * Notificação com informações completas
 */
export interface Notification extends BaseNotification {
  userId?: string;
  actionUrl?: string;
  expiresAt?: string;
  metadata?: Record<string, any>;
}

// ========================================
// TIPOS DE RELATÓRIO
// ========================================

/**
 * Tipo de relatório
 */
export type ReportType = 'sales' | 'performance' | 'clients' | 'goals' | 'custom';

/**
 * Formato do relatório
 */
export type ReportFormat = 'pdf' | 'excel' | 'csv' | 'json';

/**
 * Relatório base
 */
export interface BaseReport {
  id: string;
  name: string;
  type: ReportType;
  format: ReportFormat;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
}

/**
 * Relatório com informações completas
 */
export interface Report extends BaseReport {
  userId: string;
  parameters: Record<string, any>;
  fileUrl?: string;
  fileSize?: number;
  error?: string;
}

// ========================================
// TIPOS DE AUDITORIA
// ========================================

/**
 * Tipo de ação auditada
 */
export type AuditAction = 'create' | 'read' | 'update' | 'delete' | 'login' | 'logout';

/**
 * Entrada de auditoria
 */
export interface AuditEntry {
  id: string;
  userId: string;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

// ========================================
// TIPOS DE CONFIGURAÇÃO
// ========================================

/**
 * Configuração do sistema
 */
export interface SystemConfig {
  id: string;
  key: string;
  value: any;
  description?: string;
  category: string;
  editable: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Configuração de backup
 */
export interface BackupConfig {
  enabled: boolean;
  schedule: string;
  retentionDays: number;
  includeFiles: boolean;
  compression: boolean;
  encryption: boolean;
  lastBackup?: string;
  nextBackup?: string;
}
