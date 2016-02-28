'use strict'

const cloneDeep = require('lodash.cloneDeep')
const Debug = require('debug')

module.exports = Breakdown

function Breakdown(options) {
  this.name = options && options.name ? options.name : 'server'
  this.handlers = {}
  this.debug = Debug(`breakdown:tree:${this.name}`)

  if (options &&  options.handlers) {
    const paths = Object.keys(options.handlers)
    for (let i = 0, l = paths.length; i < l; i++) {
      this.addHandler(paths[i], options.handlers[paths[i]])
    }
  }
}

/**
 * This is where the stuff comes in.
 * @param  {Object} request {action, path, body}
 * @return {?}
 */
Breakdown.prototype.handleRequest = function handleRequest(request, callback, listener) {
  const body = request.body
  const paths = Object.keys(body)
  const responder = new Responder(request, callback, listener)

  for (let i = 0, l = paths.length; i < l; i++) {
    let path = paths[i]

    if (this.handlers[path]) {
      this.debug(`handling ${path}`)
      let subRequest = Object.assign({}, request, {
        body: body[path],
        path
      })
      this.handlers[path](subRequest, responder)
    } else {
      this.debug(`no handler found for ${path}`)
    }
  }
}

/**
 * This is where you teach it things.
 * @param {String} path The path which this handler should handle
 * @param {Function} handler The method invoked at this path, which should have
 *                           the signature ({action, body[, path]})
 */
Breakdown.prototype.addHandler = function addHandler(path, handler) {
  if (this.handlers[path]) {
    this.debug(`replacing handler for ${path}`)
  } else {
    this.debug(`adding handler for ${path}`)
  }

  this.handlers[path] = function (request, response) {
    response.request(path)
    handler(request, response.respond.bind(response, path))
  }
}

const responderDebug = Debug('breakdown:responder')

/**
 * The responder is a smart callback who builds a response and sends it when the
 * request has been completely handled.
 * @param {Function} callback The callback method for the entire request
 */
function Responder(request, callback, listener) {
  this.count = 0
  this.response = cloneDeep(request)
  this.originalRequest = request
  this.callback = callback ? callback : () => {}
  this.listener = listener ? listener : () => {}
  this.sent = false
  this.willHear = false
}

Responder.prototype.request = function request(path) {
  if (this.sent) {
    return responderDebug('request could not be set because request was closed')
  }

  this.count++
  this.response.body[path] = undefined
}

Responder.prototype.respond = function respond(path, body, dontHear) {
  if (this.sent) {
    return responderDebug('response could not be set because request was closed')
  }

  if (dontHear) {
    delete this.originalRequest.body[path]
  } else {
    this.willHear = true
  }

  if (body) {
    if (body.body) {
      this.response.body[path] = body.body
    } else {
      this.response.body[path] = body
    }
  }

  if (!--this.count) {
    this.send(this.response)
    if (this.willHear) {
      this.listener(this.originalRequest)
    }
  }
}

Responder.prototype.send = function send(message) {
  this.sent = true
  this.callback(message)
}
