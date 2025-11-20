/**
 * Utilitários de performance para otimização do site
 */

// Debounce para otimizar eventos frequentes
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle para limitar execuções
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Preload de recursos críticos
export function preloadResource(href: string, as: string) {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
}

// Prefetch de páginas para navegação mais rápida
export function prefetchPage(href: string) {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  document.head.appendChild(link);
}

// Lazy load de imagens com Intersection Observer
export function lazyLoadImage(img: HTMLImageElement) {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const image = entry.target as HTMLImageElement;
          if (image.dataset.src) {
            image.src = image.dataset.src;
            image.classList.add('loaded');
            observer.unobserve(image);
          }
        }
      });
    });
    
    observer.observe(img);
  } else {
    // Fallback para navegadores sem suporte
    if (img.dataset.src) {
      img.src = img.dataset.src;
    }
  }
}

// Otimização de scroll
export function optimizeScroll(callback: () => void) {
  let ticking = false;
  
  return () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        callback();
        ticking = false;
      });
      ticking = true;
    }
  };
}

// Cache de dados em memória
class MemoryCache {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private ttl: number;

  constructor(ttl: number = 5 * 60 * 1000) { // 5 minutos padrão
    this.ttl = ttl;
  }

  set(key: string, data: any) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  clear() {
    this.cache.clear();
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }
}

export const memoryCache = new MemoryCache();

// Medição de performance
export function measurePerformance(name: string, fn: () => void) {
  if (typeof window === 'undefined') return fn();
  
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`);
  
  return result;
}

// Web Vitals tracking
export function reportWebVitals(metric: any) {
  // Enviar para analytics se necessário
  console.log('[Web Vitals]', metric);
}
