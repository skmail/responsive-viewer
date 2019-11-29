console.log(process.env)
if (process.env.REACT_APP_PLATFORM === 'CHROME') {
  module.exports = require('./chrome')
} else if (process.env.REACT_APP_PLATFORM === 'FIREFOX') {
  module.exports = require('./firefox')
} else {
  module.exports = require('./local')
}
