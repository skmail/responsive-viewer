const config = require('./config')

function findPlugin(plugins, name) {
  for (let plugin of plugins) {
    if (plugin.constructor.name === name) {
      return plugin
    }
  }
}
function applyWebpackConfig(webpackConfig) {
  webpackConfig.output.filename = `static/js/[name].js`

  const miniCssExtractPlugin = findPlugin(
    webpackConfig.plugins,
    'MiniCssExtractPlugin'
  )

  if (miniCssExtractPlugin) {
    miniCssExtractPlugin.options.filename = `static/css/[name].css`
  }

  findPlugin(webpackConfig.plugins, 'HtmlWebpackPlugin').userOptions.chunks = [
    'main',
  ]

  webpackConfig.entry = config.entry
}

module.exports = applyWebpackConfig
