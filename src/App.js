import React, { Component } from 'react'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import { createHistory } from 'history'
import { Router, IndexRoute, Route } from 'react-router'
import { syncHistory } from 'redux-simple-router'

import DevTools from './dev-tools'
import reducer from './reducer'
import HeyFridge from './hey-fridge'
import Listener from './listener'
import Fridge from './fridge'
import API from './api'

const history = createHistory()
const middleware = syncHistory(history)
const finalCreateStore = compose(
  applyMiddleware(middleware),
  DevTools.instrument()
)(createStore)
const store = finalCreateStore(reducer)

export default class App extends Component {
  render() {
    return (
    	<Provider store={ store }>
        <div>
      		<Router history={ history }>
      			<Route path="/" component={ HeyFridge }>
              <IndexRoute component={ Listener }/>
              <Route path="fridge" component={ Fridge }/>
      			</Route>
      		</Router>
          <DevTools/>
        </div>
    	</Provider>
    )
  }
}
