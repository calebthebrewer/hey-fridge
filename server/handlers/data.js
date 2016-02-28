const DI = require('../injector')

const data = DI.get('data')
const view = DI.get('view')

module.exports = {
  path: 'data',
  callback: (request, response) => {
    switch (request.type) {
      case 'add':
        return data.create(request.body)
          .then(response.send.bind(response))
  		case 'update':
  		  return data.update(request.id, request.body)
  		    .then(response.send.bind(response))
  		case 'delete':
  			return data._getParentId(request.id)
  				.then(parentId => {
  					redirectId = parentId
  					return data.remove(request.id)
  				})
  				.then(response.send.bind(response))
  		case 'focus':
  			return data.get(request.body.id, {parent: true, children: true, siblings: true})
  				.then(data => {
            if (request.body.watch) {
              const roomIds = data.map(room => room.id)
              view.focus(roomIds, request.socket)
            }
            response.send(data)
          })
      default:
        return data.getAll()
          .then(foundData => {
            response.send(foundData)
          })
    }
  }
}
