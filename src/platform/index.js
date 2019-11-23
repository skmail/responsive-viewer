console.log(process.env)
if (process.env.REACT_APP_PLATFORM === 'CHROME') {
  module.exports = require('./chrome')
} else {
  module.exports = require('./local')
}
