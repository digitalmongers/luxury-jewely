import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ['three'],
  allowedDevOrigins: [
    'ais-dev-7sbe6n4grbhdd4xtidjes3-821832804902.asia-southeast1.run.app',
    'ais-pre-7sbe6n4grbhdd4xtidjes3-821832804902.asia-southeast1.run.app',
    '*.asia-southeast1.run.app',
    '**.asia-southeast1.run.app',
    '*.run.app',
    '**.run.app',
    '127.0.0.1',
    'localhost',
  ],
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 88],
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [64, 80, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
