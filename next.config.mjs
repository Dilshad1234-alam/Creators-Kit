/** @type {import('next').NextConfig} */

if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/masterclass',
        destination: '/account?tab=masterclass',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
