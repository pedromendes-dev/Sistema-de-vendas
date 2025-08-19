import { z } from 'zod';
import { VALIDATION } from '../constants/app.constants';

/**
 * Schemas de Validação
 * Sistema de Vendas - Pedro Mendes
 * 
 * Este arquivo contém todos os schemas de validação
 * usando Zod para garantir a integridade dos dados.
 */

// ========================================
// SCHEMAS BASE
// ========================================

/**
 * Schema para ID
 */
export const idSchema = z.string().uuid('ID deve ser um UUID válido');

/**
 * Schema para email
 */
export const emailSchema = z
  .string()
  .min(VALIDATION.MIN_EMAIL_LENGTH, `Email deve ter pelo menos ${VALIDATION.MIN_EMAIL_LENGTH} caracteres`)
  .max(VALIDATION.MAX_EMAIL_LENGTH, `Email deve ter no máximo ${VALIDATION.MAX_EMAIL_LENGTH} caracteres`)
  .email('Email deve ser válido');

/**
 * Schema para senha
 */
export const passwordSchema = z
  .string()
  .min(VALIDATION.MIN_PASSWORD_LENGTH, `Senha deve ter pelo menos ${VALIDATION.MIN_PASSWORD_LENGTH} caracteres`)
  .max(VALIDATION.MAX_PASSWORD_LENGTH, `Senha deve ter no máximo ${VALIDATION.MAX_PASSWORD_LENGTH} caracteres`)
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número');

/**
 * Schema para nome
 */
export const nameSchema = z
  .string()
  .min(VALIDATION.MIN_NAME_LENGTH, `Nome deve ter pelo menos ${VALIDATION.MIN_NAME_LENGTH} caracteres`)
  .max(VALIDATION.MAX_NAME_LENGTH, `Nome deve ter no máximo ${VALIDATION.MAX_NAME_LENGTH} caracteres`)
  .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços');

/**
 * Schema para telefone
 */
export const phoneSchema = z
  .string()
  .min(VALIDATION.MIN_PHONE_LENGTH, `Telefone deve ter pelo menos ${VALIDATION.MIN_PHONE_LENGTH} dígitos`)
  .max(VALIDATION.MAX_PHONE_LENGTH, `Telefone deve ter no máximo ${VALIDATION.MAX_PHONE_LENGTH} dígitos`)
  .regex(/^\d+$/, 'Telefone deve conter apenas números');

/**
 * Schema para CPF
 */
export const cpfSchema = z
  .string()
  .length(VALIDATION.CPF_LENGTH, `CPF deve ter exatamente ${VALIDATION.CPF_LENGTH} dígitos`)
  .regex(/^\d+$/, 'CPF deve conter apenas números')
  .refine((cpf) => {
    // Validação dos dígitos verificadores
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10))) return false;
    
    return true;
  }, 'CPF inválido');

/**
 * Schema para CNPJ
 */
export const cnpjSchema = z
  .string()
  .length(VALIDATION.CNPJ_LENGTH, `CNPJ deve ter exatamente ${VALIDATION.CNPJ_LENGTH} dígitos`)
  .regex(/^\d+$/, 'CNPJ deve conter apenas números')
  .refine((cnpj) => {
    // Validação dos dígitos verificadores
    if (/^(\d)\1{13}$/.test(cnpj)) return false;
    
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cnpj.charAt(i)) * weights1[i];
    }
    let remainder = sum % 11;
    let digit1 = remainder < 2 ? 0 : 11 - remainder;
    
    sum = 0;
    for (let i = 0; i < 13; i++) {
      sum += parseInt(cnpj.charAt(i)) * weights2[i];
    }
    remainder = sum % 11;
    let digit2 = remainder < 2 ? 0 : 11 - remainder;
    
    return parseInt(cnpj.charAt(12)) === digit1 && parseInt(cnpj.charAt(13)) === digit2;
  }, 'CNPJ inválido');

// ========================================
// SCHEMAS DE USUÁRIO
// ========================================

/**
 * Schema para criação de usuário
 */
export const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  phone: phoneSchema.optional(),
  permissionLevel: z.enum(['admin', 'manager', 'attendant', 'viewer']),
});

/**
 * Schema para atualização de usuário
 */
export const updateUserSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema.optional(),
  phone: phoneSchema.optional(),
  permissionLevel: z.enum(['admin', 'manager', 'attendant', 'viewer']).optional(),
  status: z.enum(['active', 'inactive', 'suspended', 'pending']).optional(),
});

/**
 * Schema para login
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Senha é obrigatória'),
});

/**
 * Schema para alteração de senha
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: passwordSchema,
  confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

// ========================================
// SCHEMAS DE CLIENTE
// ========================================

/**
 * Schema para endereço
 */
export const addressSchema = z.object({
  street: z.string().min(3, 'Rua deve ter pelo menos 3 caracteres'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Bairro deve ter pelo menos 2 caracteres'),
  city: z.string().min(2, 'Cidade deve ter pelo menos 2 caracteres'),
  state: z.string().length(2, 'Estado deve ter 2 caracteres'),
  zipCode: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP deve estar no formato 00000-000'),
});

/**
 * Schema para criação de cliente
 */
export const createClientSchema = z.object({
  name: nameSchema,
  type: z.enum(['individual', 'company', 'wholesale']),
  email: emailSchema.optional(),
  phone: phoneSchema.optional(),
  cpf: cpfSchema.optional(),
  cnpj: cnpjSchema.optional(),
  address: addressSchema.optional(),
  notes: z.string().max(1000, 'Observações devem ter no máximo 1000 caracteres').optional(),
  tags: z.array(z.string()).max(10, 'Máximo de 10 tags').optional(),
}).refine((data) => {
  // Validação: CPF para pessoa física, CNPJ para empresa
  if (data.type === 'individual' && data.cnpj) {
    return false;
  }
  if (data.type === 'company' && data.cpf) {
    return false;
  }
  return true;
}, {
  message: 'Tipo de cliente não compatível com documento fornecido',
});

/**
 * Schema para atualização de cliente
 */
export const updateClientSchema = createClientSchema.partial();

// ========================================
// SCHEMAS DE VENDA
// ========================================

/**
 * Schema para item de venda
 */
export const saleItemSchema = z.object({
  productId: idSchema,
  quantity: z.number().positive('Quantidade deve ser positiva'),
  unitPrice: z.number().positive('Preço unitário deve ser positivo'),
  description: z.string().min(1, 'Descrição é obrigatória'),
});

/**
 * Schema para criação de venda
 */
export const createSaleSchema = z.object({
  amount: z.number().positive('Valor deve ser positivo'),
  paymentType: z.enum(['cash', 'credit_card', 'debit_card', 'pix', 'transfer']),
  attendantId: idSchema,
  clientId: idSchema.optional(),
  items: z.array(saleItemSchema).min(1, 'Pelo menos um item é obrigatório'),
  notes: z.string().max(500, 'Observações devem ter no máximo 500 caracteres').optional(),
});

/**
 * Schema para atualização de venda
 */
export const updateSaleSchema = z.object({
  amount: z.number().positive('Valor deve ser positivo').optional(),
  status: z.enum(['pending', 'completed', 'cancelled', 'refunded']).optional(),
  notes: z.string().max(500, 'Observações devem ter no máximo 500 caracteres').optional(),
});

// ========================================
// SCHEMAS DE META
// ========================================

/**
 * Schema para criação de meta
 */
export const createGoalSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  description: z.string().max(500, 'Descrição deve ter no máximo 500 caracteres').optional(),
  type: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']),
  target: z.number().positive('Meta deve ser positiva'),
  attendantId: idSchema.optional(),
  category: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  startDate: z.string().datetime('Data de início deve ser válida'),
  endDate: z.string().datetime('Data de fim deve ser válida'),
}).refine((data) => {
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  return endDate > startDate;
}, {
  message: 'Data de fim deve ser posterior à data de início',
  path: ['endDate'],
});

/**
 * Schema para atualização de meta
 */
export const updateGoalSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres').optional(),
  description: z.string().max(500, 'Descrição deve ter no máximo 500 caracteres').optional(),
  target: z.number().positive('Meta deve ser positiva').optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  endDate: z.string().datetime('Data de fim deve ser válida').optional(),
});

// ========================================
// SCHEMAS DE RELATÓRIO
// ========================================

/**
 * Schema para geração de relatório
 */
export const generateReportSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  type: z.enum(['sales', 'performance', 'clients', 'goals', 'custom']),
  format: z.enum(['pdf', 'excel', 'csv', 'json']).default('pdf'),
  parameters: z.record(z.any()).optional(),
  startDate: z.string().datetime('Data de início deve ser válida').optional(),
  endDate: z.string().datetime('Data de fim deve ser válida').optional(),
});

// ========================================
// SCHEMAS DE FILTROS
// ========================================

/**
 * Schema para filtros de consulta
 */
export const filterSchema = z.object({
  field: z.string().min(1, 'Campo é obrigatório'),
  value: z.union([z.string(), z.number(), z.boolean()]),
  operator: z.enum(['equals', 'contains', 'greater', 'less', 'in', 'not']),
});

/**
 * Schema para ordenação
 */
export const sortSchema = z.object({
  field: z.string().min(1, 'Campo é obrigatório'),
  direction: z.enum(['asc', 'desc']).default('asc'),
});

/**
 * Schema para paginação
 */
export const paginationSchema = z.object({
  page: z.number().int().positive('Página deve ser positiva').default(1),
  limit: z.number().int().min(5, 'Limite mínimo é 5').max(100, 'Limite máximo é 100').default(20),
});

/**
 * Schema para parâmetros de consulta
 */
export const queryParamsSchema = z.object({
  filters: z.array(filterSchema).optional(),
  sort: sortSchema.optional(),
  pagination: paginationSchema.optional(),
  search: z.string().optional(),
});

// ========================================
// SCHEMAS DE CONFIGURAÇÃO
// ========================================

/**
 * Schema para configuração do sistema
 */
export const systemConfigSchema = z.object({
  key: z.string().min(1, 'Chave é obrigatória'),
  value: z.any(),
  description: z.string().optional(),
  category: z.string().min(1, 'Categoria é obrigatória'),
  editable: z.boolean().default(true),
});

// ========================================
// SCHEMAS DE BACKUP
// ========================================

/**
 * Schema para configuração de backup
 */
export const backupConfigSchema = z.object({
  enabled: z.boolean().default(true),
  schedule: z.string().regex(/^(\*|([0-5]?[0-9])) (\*|([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|[12][0-9]|3[01])) (\*|([1-9]|1[0-2])) (\*|([0-6]))$/, 'Formato de cronograma inválido'),
  retentionDays: z.number().int().min(7, 'Retenção mínima é 7 dias').max(365, 'Retenção máxima é 365 dias').default(30),
  includeFiles: z.boolean().default(false),
  compression: z.boolean().default(true),
  encryption: z.boolean().default(false),
});

// ========================================
// SCHEMAS DE NOTIFICAÇÃO
// ========================================

/**
 * Schema para criação de notificação
 */
export const createNotificationSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  message: z.string().min(1, 'Mensagem é obrigatória'),
  type: z.enum(['info', 'success', 'warning', 'error']).default('info'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  userId: idSchema.optional(),
  actionUrl: z.string().url('URL de ação deve ser válida').optional(),
  expiresAt: z.string().datetime('Data de expiração deve ser válida').optional(),
});

// ========================================
// SCHEMAS DE AUDITORIA
// ========================================

/**
 * Schema para entrada de auditoria
 */
export const auditEntrySchema = z.object({
  userId: idSchema,
  action: z.enum(['create', 'read', 'update', 'delete', 'login', 'logout']),
  resource: z.string().min(1, 'Recurso é obrigatório'),
  resourceId: idSchema.optional(),
  details: z.record(z.any()).optional(),
  ipAddress: z.string().ip('Endereço IP deve ser válido').optional(),
  userAgent: z.string().optional(),
});

// ========================================
// EXPORTAÇÕES
// ========================================

export {
  // Schemas base
  idSchema,
  emailSchema,
  passwordSchema,
  nameSchema,
  phoneSchema,
  cpfSchema,
  cnpjSchema,
  
  // Schemas de usuário
  createUserSchema,
  updateUserSchema,
  loginSchema,
  changePasswordSchema,
  
  // Schemas de cliente
  addressSchema,
  createClientSchema,
  updateClientSchema,
  
  // Schemas de venda
  saleItemSchema,
  createSaleSchema,
  updateSaleSchema,
  
  // Schemas de meta
  createGoalSchema,
  updateGoalSchema,
  
  // Schemas de relatório
  generateReportSchema,
  
  // Schemas de filtros
  filterSchema,
  sortSchema,
  paginationSchema,
  queryParamsSchema,
  
  // Schemas de configuração
  systemConfigSchema,
  backupConfigSchema,
  
  // Schemas de notificação
  createNotificationSchema,
  
  // Schemas de auditoria
  auditEntrySchema,
};
