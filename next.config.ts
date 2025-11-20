import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false, // Remove widget de desenvolvimento Next.js
  
  // Ignorar erros durante build (compatibilidade Vercel)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Configuração de imagens para principais provedores
  images: {
    remotePatterns: [
      // Unsplash - Banco de imagens gratuitas
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
      },
      
      // Supabase Storage
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.com',
      },
      
      // Firebase Storage
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
      
      // AWS S3 e CloudFront
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
      },
      
      // Vercel Blob
      {
        protocol: 'https',
        hostname: '*.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      
      // Cloudinary
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '*.cloudinary.com',
      },
      
      // Pexels - Banco de imagens gratuitas
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      
      // Pixabay - Banco de imagens gratuitas
      {
        protocol: 'https',
        hostname: 'pixabay.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
      },
      
      // GitHub (avatares, imagens de repos)
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      
      // Imgur
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      {
        protocol: 'https',
        hostname: 'imgur.com',
      },
      
      // Google Drive
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      
      // YouTube thumbnails
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      
      // Vimeo thumbnails
      {
        protocol: 'https',
        hostname: 'i.vimeocdn.com',
      },
      
      // CDNs populares
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
      },
      {
        protocol: 'https',
        hostname: 'unpkg.com',
      },
      
      // Outros provedores populares
      {
        protocol: 'https',
        hostname: '*.uploadthing.com', // UploadThing
      },
      {
        protocol: 'https',
        hostname: '*.imagekit.io', // ImageKit
      },
      {
        protocol: 'https',
        hostname: '*.sanity.io', // Sanity CMS
      },
      {
        protocol: 'https',
        hostname: 'assets.vercel.com', // Vercel assets
      },
      
      // Para desenvolvimento local
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
      },
    ],
    
    // Formatos de imagem suportados
    formats: ['image/webp', 'image/avif'],
    
    // Tamanhos otimizados para diferentes dispositivos
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Cache otimizado
    minimumCacheTTL: 60,
  },
  
  // Configuração experimental para melhor performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  
  // Otimizações de performance
  compress: true,
  poweredByHeader: false,
  
  // Headers de segurança e CORS
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Segurança - Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://*.vercel.app",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co https://*.supabase.com https://api.openai.com wss://*.supabase.co",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
          // Segurança - X-Frame-Options (proteção contra clickjacking)
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          // Segurança - X-Content-Type-Options (previne MIME sniffing)
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Segurança - Referrer Policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Segurança - Permissions Policy
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          // Segurança - X-XSS-Protection
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Segurança - Strict-Transport-Security (HSTS)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'production' 
              ? 'https://brinde.ai' 
              : '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS, PATCH'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With, Accept, X-CSRF-Token'
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true'
          },
          // Rate limiting headers
          {
            key: 'X-RateLimit-Limit',
            value: '100'
          },
          {
            key: 'X-RateLimit-Remaining',
            value: '99'
          },
        ]
      },
      {
        source: '/_next/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
        ]
      },
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]
  },
};

export default nextConfig;
