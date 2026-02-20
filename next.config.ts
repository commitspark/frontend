import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  trailingSlash: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '15mb',
    },
  },
  output: 'standalone',
}

export default nextConfig
