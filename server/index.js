'use strict'

var debug = require('debug')('hey-fridge')

var path = require('path')
var Promise = require('bluebird')

var app = require('express')()
app.use(require('cors')())
app.use(require('body-parser').json())

var http = require('http').Server(app)
var io = require('socket.io')(http)

var Breakdown = require('./breakdown/path')
var bd = new Breakdown({
	name: 'data',
	pathDelimiter: '/'
})

var live = require('./breakdown/live')
live(bd)
bd.watch(path.join(__dirname, 'handlers/**/*'))

const DI = require('./injector')

http.listen(process.env.PORT || 3000, '0.0.0.0', () => debug('at your service'))

app.post('/api/1/breakdown', (req, res) => {
	bd.run(req.body, response => {
		res.send(response)
	})
})

// create, read, update, delete
io.on('connect', socket => {
  // TODO remove this hack shit
  socket.onclose = function(reason) {
    if (socket._events.disconnecting) {
      socket._events.disconnecting()
    }
    Object.getPrototypeOf(this).onclose.call(this, reason)
  }

	socket.on('breakdown', request => {
		request.socket = socket
		bd.run(request, response => {
			if (response.body) {
				// don't bother sending empty responses
				delete response.socket
				socket.emit('breakdown', response)
			}
		})
	})

  socket.on('disconnecting', () => {
  })
})
