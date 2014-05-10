
var path = require('path')
  , rootPath = path.normalize(__dirname + '/..')
  ;

module.exports = {
  development: {
    db: 'mongodb://localhost/light-tracker-dev',
    root: rootPath,
    app: {
      name: 'Light Tracker'
    },
  },
  production: {
    db: process.env.MONGOHQ_URL,
    root: rootPath,
    app: {
      name: 'Light Tracker'
    }
  }
}
