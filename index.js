'use strict'

const chalk = require('chalk')

module.exports = function createExpressLogger (log, options) {
  options = parseOptions(options)

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

    if (shouldIgnore(url)) {
      return
    }

    const status = res.statusCode
    const duration = Date.now() - start

    let logLevel
    let color = 'white'
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

  function shouldIgnore (url) {
    return options.ignore.some((pattern) => {
      if (typeof pattern === 'string') {
        return url === pattern
      }
      if (pattern.test) {
        return pattern.test(url)
      }
      if (typeof pattern === 'function') {
        return pattern(url)
      }
      return false
    })
  }
}

function parseOptions (options) {
  options = Object.assign({
    ignore: []
  }, options)

  if (!(options.ignore instanceof Array)) {
    options.ignore = [options.ignore]
  }

  return options
}
