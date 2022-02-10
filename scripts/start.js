const rewire = require('rewire')
const applyWebpackConfig = require('./applyWebpackConfig')

const defaults = rewire('react-scripts/scripts/start.js')
let createDevServerConfig = defaults.__get__('createDevServerConfig')
let configFactory = defaults.__get__('configFactory')

defaults.__set__('configFactory', (...args) => {
  const webpackConfig = configFactory(...args)

  applyWebpackConfig(webpackConfig)

  return webpackConfig
})

defaults.__set__('createDevServerConfig', (...args) => {
  const devServerConfig = createDevServerConfig(...args)
  devServerConfig.devMiddleware.writeToDisk = true
  devServerConfig.hot = false
  return devServerConfig
})
