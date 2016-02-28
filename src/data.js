import io from 'socket.io-client'
import { routeActions } from 'redux-simple-router'
import { API, SERVER} from './variables'
import { onEvent } from './api'

export default class Data {
  constructor(store) {
    this.store = store

    onEvent('set', data => store.dispatch({type: 'set', data}))
    onEvent('added', data => store.dispatch({type: 'added', data}))
    onEvent('updated', data => store.dispatch({type: 'updated', data}))
    onEvent('focused', view => store.dispatch({type: 'view/focused', view}))
    onEvent('unfocused', view => store.dispatch({type: 'view/unfocused', view}))
    onEvent('view/set', views => store.dispatch({type: 'view/set', views}))
    onEvent('removed', data => {
      // if the thing we're focused on just got removed, we need to redirect
      if (store.getState().routing.location.pathname === `/data/${data.id}`) {
        if (data.redirectTo) {
          store.dispatch(routeActions.push(`/data/${data.redirectTo}`))
        } else {
          store.dispatch(routeActions.push('/'))
        }
      }
      store.dispatch({type: 'removed', data})
    })

    onEvent('breakdown', store.dispatch.bind(store))
  }
}
