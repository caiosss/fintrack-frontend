import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: 'http://191.22.105.63/:path*',
      },
    ];
  },
};

export default nextConfig;
