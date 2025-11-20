import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting simples (em produção, use Redis ou similar)
const rateLimit = new Map<string, { count: number; resetTime: number }>();

// Configuração de rate limiting
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto
const MAX_REQUESTS = 100; // 100 requisições por minuto

function getRateLimitKey(request: NextRequest): string {
  // Use IP do cliente ou identificador único
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
  return `${ip}-${request.nextUrl.pathname}`;
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const record = rateLimit.get(key);

  if (!record || now > record.resetTime) {
    // Criar novo registro ou resetar
    rateLimit.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (record.count >= MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

// Limpar registros antigos periodicamente
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimit.entries()) {
    if (now > record.resetTime) {
      rateLimit.delete(key);
    }
  }
}, RATE_LIMIT_WINDOW);

export function middleware(request: NextRequest) {
  // Rate limiting para rotas de API
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const key = getRateLimitKey(request);
    
    if (!checkRateLimit(key)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { 
          status: 429,
          headers: {
            'Retry-After': '60',
            'X-RateLimit-Limit': MAX_REQUESTS.toString(),
            'X-RateLimit-Remaining': '0',
          }
        }
      );
    }
  }

  // Validação de CSRF para métodos que modificam dados
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    
    // Em produção, valide origem
    if (process.env.NODE_ENV === 'production' && origin) {
      const allowedOrigins = [
        'https://brinde.ai',
        `https://${host}`,
      ];
      
      if (!allowedOrigins.some(allowed => origin.startsWith(allowed))) {
        return NextResponse.json(
          { error: 'Invalid origin' },
          { status: 403 }
        );
      }
    }
  }

  // Adicionar headers de segurança adicionais
  const response = NextResponse.next();
  
  // Prevenir cache de dados sensíveis
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  return response;
}

// Configurar quais rotas o middleware deve processar
export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico|icon.svg).*)',
  ],
};
