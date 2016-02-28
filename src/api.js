import io from 'socket.io-client'
import { API, SERVER } from './variables'

let socket = io.connect(SERVER)

export function onEvent(event, callback) {
  socket.on(event, callback)
}

export function emit(message) {
  if (!message.path) {
    console.error(`No path defined for ${message}`)
  }

  socket.emit('breakdown', message)
}
