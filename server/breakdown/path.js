'use strict'

const Debug = require('debug')

module.exports = Breakdown

function Breakdown(options) {
  this.name = options && options.name ? options.name : 'server'
  this.pathDelimiter = options && options.pathDelimiter
    ? options.pathDelimiter : '.'
  this.handlers = {}
  this.debug = Debug(`breakdown:path:${this.name}`)

  if (options &&  options.handlers) {
    const paths = Object.keys(options.handlers)
    for (let i = 0, l = paths.length; i < l; i++) {
      this.addHandler(paths[i], options.handlers[paths[i]])
    }
  }
}

/**
 * This is where you teach it things.
 * @param {String} path The path which this handler should handle
 * @param {Function} handler The method invoked at this path, which should have
 *                           the signature ({action, body[, path]})
 */
Breakdown.prototype.use = function addHandler(path, handler) {
  if (this.handlers[path]) {
    this.debug(`replacing handler for ${path}`)
  } else {
    this.debug(`adding handler for ${path}`)
  }

  this.handlers[path] = function (request, response) {
    handler(request, response)
  }
}

/**
 * This is where the stuff comes in.
 * @param  {Object} request {action, path, body}
 * @return {?}
 */
Breakdown.prototype.run = function handleRequest(request, callback) {
  const paths = parsePaths(request.path, this.pathDelimiter)
  const response = callback instanceof Responder
    ? callback
    : new Responder(request, callback)

  if (this.handlers[paths.path]) {
    this.debug(`handling ${paths.path}`)
    let subRequest = Object.assign({}, request, {
      path: paths.nextPath
    })
    this.handlers[paths.path](subRequest, response)
  } else {
    this.debug(`no handler found for ${paths.path}`)
  }
}

Breakdown.prototype.ignore = function ignorePath(path) {
  this.debug(`ignoring ${path}`)
  delete this.handlers[path]
}

const responderDebug = Debug('breakdown:responder')

/**
 * The responder is a smart callback who builds a response and sends it when the
 * request has been completely handled.
 * @param {Function} callback The callback method for the entire request
 */
function Responder(request, callback) {
  this.request = request
  this.callback = callback
  this.sent = false
}

Responder.prototype.send = function respond(body) {
  if (this.sent) {
    responderDebug(`already sent response for ${this.request.path}`)
  }

  if (this.callback) {
    responderDebug(`sending response for ${this.request.path}`)

    const response = Object.assign({}, this.request, {
      body
    })
    this.sent = true
    this.callback(response)
  } else {
    responderDebug(`no callback provided for ${this.request.path}`)
  }
}

function parsePaths(path, delimiter) {
  if (!path) {
    return {
      path
    }
  }

  const splitPoint = path.indexOf(delimiter)

  if (splitPoint < 0) {
    return {
      path
    }
  }

  return {
    path: path.substr(0, splitPoint),
    nextPath: path.substr(splitPoint + 1, path.length)
  }
}
