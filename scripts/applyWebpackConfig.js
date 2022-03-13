const rewire = require('rewire')
const paths = rewire('react-scripts/config/paths.js')
const config = require('./config')
const fs = require('fs-extra')

function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: file => file !== paths.appHtml,
  })
}

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

  const htmlWebpackPlugin = findPlugin(
    webpackConfig.plugins,
    'HtmlWebpackPlugin'
  )

  htmlWebpackPlugin.userOptions.chunks = ['main']

  copyPublicFolder()

  webpackConfig.entry = config.entry
}

module.exports = applyWebpackConfig
