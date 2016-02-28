import React, { Component } from 'react'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import { createHistory } from 'history'
import { Router, IndexRoute, Route } from 'react-router'
import { syncHistory } from 'redux-simple-router'

import DevTools from './dev-tools'
import reducer from './reducer'
import Navigation from './navigation'
import Listener from './listener'
import API from './api'

const history = createHistory()
const middleware = syncHistory(history)
const finalCreateStore = compose(
  applyMiddleware(middleware),
  DevTools.instrument()
)(createStore)
const store = finalCreateStore(reducer)

if (window.localStorage.getItem('breakdown/view/name')) {
  updateViewName(window.localStorage.getItem('breakdown/view/name'))
}

export default class App extends Component {
  render() {
    return (
    	<Provider store={ store }>
        <div>
      		<Router history={ history }>
      			<Route path="/" component={ Navigation }>
              <IndexRoute component={ Listener }/>
      			</Route>
      		</Router>
          <DevTools/>
        </div>
    	</Provider>
    )
  }
}
