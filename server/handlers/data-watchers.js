const DI = require('../injector')
const view = DI.get('view')

module.exports = {
  path: 'watchers',
  callback: (request, response) => {
    switch (request.type) {
      case 'add':
        view.focus([request.body], request.socket)
        return 5
    }
  }
}
