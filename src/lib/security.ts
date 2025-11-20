/**
 * Utilitários de Segurança
 * 
 * Funções para validação, sanitização e proteção de dados
 */

/**
 * Sanitiza entrada de texto removendo caracteres perigosos
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  return input
    .replace(/[<>]/g, '') // Remove < e >
    .replace(/javascript:/gi, '') // Remove javascript:
    .replace(/on\w+=/gi, '') // Remove event handlers (onclick=, onload=, etc)
    .trim();
}

/**
 * Valida email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida URL
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Escapa HTML para prevenir XSS
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  
  return text.replace(/[&<>"'/]/g, (char) => map[char]);
}

/**
 * Valida e sanitiza JSON
 */
export function sanitizeJson<T>(data: unknown): T | null {
  try {
    const jsonString = JSON.stringify(data);
    return JSON.parse(jsonString) as T;
  } catch {
    return null;
  }
}

/**
 * Valida força de senha
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length < 8) {
    feedback.push('Senha deve ter no mínimo 8 caracteres');
  } else {
    score += 1;
  }

  if (!/[a-z]/.test(password)) {
    feedback.push('Adicione letras minúsculas');
  } else {
    score += 1;
  }

  if (!/[A-Z]/.test(password)) {
    feedback.push('Adicione letras maiúsculas');
  } else {
    score += 1;
  }

  if (!/[0-9]/.test(password)) {
    feedback.push('Adicione números');
  } else {
    score += 1;
  }

  if (!/[^a-zA-Z0-9]/.test(password)) {
    feedback.push('Adicione caracteres especiais (!@#$%^&*)');
  } else {
    score += 1;
  }

  return {
    isValid: score >= 4,
    score,
    feedback,
  };
}

/**
 * Gera token CSRF seguro
 */
export function generateCsrfToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Valida token CSRF
 */
export function validateCsrfToken(token: string, storedToken: string): boolean {
  if (!token || !storedToken) return false;
  return token === storedToken;
}

/**
 * Remove dados sensíveis de objetos antes de logging
 */
export function sanitizeForLogging<T extends Record<string, unknown>>(
  data: T,
  sensitiveKeys: string[] = ['password', 'token', 'secret', 'apiKey', 'key']
): T {
  const sanitized = { ...data };
  
  for (const key in sanitized) {
    if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive.toLowerCase()))) {
      sanitized[key] = '[REDACTED]' as T[Extract<keyof T, string>];
    }
  }
  
  return sanitized;
}

/**
 * Valida e limita tamanho de upload
 */
export function validateFileSize(
  file: File,
  maxSizeMB: number = 5
): { isValid: boolean; error?: string } {
  const maxBytes = maxSizeMB * 1024 * 1024;
  
  if (file.size > maxBytes) {
    return {
      isValid: false,
      error: `Arquivo muito grande. Máximo: ${maxSizeMB}MB`,
    };
  }
  
  return { isValid: true };
}

/**
 * Valida tipo de arquivo
 */
export function validateFileType(
  file: File,
  allowedTypes: string[]
): { isValid: boolean; error?: string } {
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Tipo de arquivo não permitido. Permitidos: ${allowedTypes.join(', ')}`,
    };
  }
  
  return { isValid: true };
}

/**
 * Rate limiting simples no cliente
 */
export class ClientRateLimiter {
  private requests: number[] = [];
  
  constructor(
    private maxRequests: number,
    private windowMs: number
  ) {}
  
  canMakeRequest(): boolean {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    if (this.requests.length >= this.maxRequests) {
      return false;
    }
    
    this.requests.push(now);
    return true;
  }
  
  getRemainingRequests(): number {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    return Math.max(0, this.maxRequests - this.requests.length);
  }
}

/**
 * Debounce para prevenir spam de requisições
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  waitMs: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, waitMs);
  };
}

/**
 * Throttle para limitar frequência de execução
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limitMs: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limitMs);
    }
  };
}
