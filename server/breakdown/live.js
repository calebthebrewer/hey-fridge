'use strict'

const debug = require('debug')('breakdown:live')
const reload = require('require-reload')(require)
const chokidar = require('chokidar')

const handlerCache = {}

module.exports = function BreakdownLive(breakdown) {
  const watcher = chokidar.watch()
  watcher.on('add', liveAdd)
  watcher.on('change', liveChange)
  watcher.on('unlink', liveRemove)
  watcher.on('error', error => {
    console.error(error)
  })

  breakdown.watch = function Live(fileGlob, options) {
    debug(`watching files in ${fileGlob}`)
    watcher.add(fileGlob)
  }

  function liveAdd(filePath) {
    debug(`adding from ${filePath}`)
    liveRequire(filePath)
  }

  function liveChange(filePath) {
    debug(`swapping from ${filePath}`)
    liveRequire(filePath)
  }

  function liveRequire(filePath) {
    try {
      const handler = reload(filePath)

      if (!handler.path) {
        throw new Error('No path defined!')
      }
      if (!handler.callback) {
        throw new Error('No callback defined!')
      }

      handlerCache[filePath] = handler.path
      breakdown.use(handler.path, handler.callback)
      return true
    } catch (error) {
      console.error(`couldn't load a breakdown handler from ${filePath}`, error.stack)
      return false
    }
  }

  function liveRemove(filePath) {
    debug(`removing from ${filePath}`)
    breakdown.ignore(handlerCache[filePath])
    delete handlerCache[filePath]
  }
}
