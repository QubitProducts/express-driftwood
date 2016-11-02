'use strict'

const chalk = require('chalk')

module.exports = function createExpressLogger (log) {
  return function logger (req, res, next) {
    const start = Date.now()

    const end = res.end
    res.end = (...args) => {
      logRequest(req, res, start)
      end.apply(res, args)
    }

    next()
  }

  function logRequest (req, res, start) {
    const url = req.originalUrl

    if (/\/status/.test(url)) {
      return
    }

    const status = res.statusCode
    const duration = Date.now() - start

    let logLevel
    let color
    if (status >= 100) {
      logLevel = 'info'
      color = 'green'
    }
    if (status >= 400) {
      logLevel = 'warn'
      color = 'yellow'
    }
    if (status >= 500) {
      logLevel = 'error'
      color = 'red'
    }

    log[logLevel](`${req.method} ${url} ${chalk.bold[color](status)} ${chalk.grey(duration + 'ms')}`)
  }
}
