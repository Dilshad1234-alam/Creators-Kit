/** @type {import('next').NextConfig} */

if (process.env.NODE_ENV === 'development' && !process.env.CI) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 3600,
    deviceSizes: [640, 750, 1080, 1200, 1920],
    imageSizes: [32, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  experimental: {
    // Optimize memory during compilation and prevent spawning excessive worker threads
    memoryBasedWorkersCount: true,
    cpus: 2,
  },
  async redirects() {
    return [
      {
        source: '/products',
        destination: '/product',
        permanent: true,
      },
      {
        source: '/masterclass',
        destination: '/account?tab=masterclass',
        permanent: true,
      },
      {
        source: '/blog/:path*',
        destination: '/',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
