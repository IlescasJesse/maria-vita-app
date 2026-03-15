/** @type {import('next').NextConfig} */
const backendBaseUrl = process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';

const nextConfig = {
  // Configuración de React estricto para detectar problemas
  reactStrictMode: true,

  // Configuración de imágenes optimizadas
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Variables de entorno públicas (accesibles en el cliente)
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  },

  // Configuración de Turbopack (Next.js 16+)
  turbopack: {},

  // Configuración de headers de seguridad
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
        ],
      },
    ];
  },

  // Redirecciones
  async redirects() {
    return [
      // Redirigir raíz a landing page
      // {
      //   source: '/',
      //   destination: '/inicio',
      //   permanent: false,
      // },
    ];
  },

  // Rewrites para proxy del backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendBaseUrl.replace(/\/$/, '')}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
