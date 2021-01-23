const rewire = require('rewire')
const defaults = rewire('react-scripts/scripts/build.js') // If you ejected, use this instead: const defaults = rewire('./build.js')
let config = defaults.__get__('config')

config.optimization.splitChunks = {
  cacheGroups: {
    default: false,
  },
}

config.optimization.runtimeChunk = false

config.output.filename = 'static/js/[name].js'

// Renames main.b100e6da.css to main.css
config.plugins[4].options.filename = 'static/css/[name].css'
config.plugins[4].options.moduleFilename = () => 'static/css/main.css'
