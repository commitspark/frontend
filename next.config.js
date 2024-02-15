const path = require('path')

module.exports = {
  trailingSlash: true,
  optimizeFonts: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
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
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack },
  ) => {
    config.resolve.alias.graphql$ = path.resolve(
      __dirname,
      './node_modules/graphql/index.js',
    )
    config.resolve.preferRelative = true
    return config
  },
}
