// @ts-check
import path from 'node:path'

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  trailingSlash: true,
  optimizeFonts: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/sign-in/',
        permanent: true,
      },
    ]
  },
  output: 'standalone',
  webpack: (
    config,
  ) => {
    config.resolve.alias.graphql$ = path.resolve(
      './node_modules/graphql/index.js',
    )
    return config
  },
}

export default nextConfig