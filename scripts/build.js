const rewire = require('rewire')
const applyWebpackConfig = require('./applyWebpackConfig')
const defaults = rewire('react-scripts/scripts/build.js')
let config = defaults.__get__('config')

config.optimization.splitChunks = {
  cacheGroups: {
    default: false,
  },
}

config.devtool = undefined

config.optimization.runtimeChunk = false

applyWebpackConfig(config)
