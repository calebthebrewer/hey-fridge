import { combineReducers } from 'redux'
import { routeReducer } from 'redux-simple-router'

function data(state = [], action) {
  if (!action.body) return state

	switch (action.type) {
    case 'focus':
      return action.body
    case 'add':
      if (action.body && action.body.length) {
        return [...state, ...action.body]
      } else {
        return [...state, action.body]
      }
    case 'update':
      return state.map(data => {
        if (action.data.id === data.id) {
          return Object.assign({}, data, action.data)
        } else {
          return data
        }
      })
		case 'removed':
			return state.filter(data => data.id !== action.data.id)
		default:
			return state
	}
}

function search(state = [], action) {
  switch (action.type) {
    case 'search/set':
      return action.data;
    default:
      return state;
  }
}

function views(state = {}, action) {
  switch (action.type) {
    case 'view/set':
      return action.views
    case 'view/focused':
      if (!state[action.view.dataId]) {
        let newState = Object.assign({}, state)
        newState[action.view.dataId] = [action.view.viewId]
        return newState
      }
      if (state[action.view.dataId].indexOf(action.view.viewId) < 0) {
        let newState = Object.assign({}, state)
        newState[action.view.dataId].push(action.view.viewId)
        return newState
      }
    case 'view/unfocused':
      const { viewId, dataId } = action.view
      if (state[dataId]) {
        let newState = Object.assign({}, state)
        let index = newState[dataId].indexOf(viewId)
        if (index > -1) {
          newState[dataId].splice(newState[dataId].indexOf(viewId), 1)
          return newState
        }
      }
      return state;
    default:
      return state;
  }
}

function trees(state = [], action) {
  switch (action.type) {
    case 'set':
      let data = action.data
      let trees = []
      let map = {}

      for (let i = 0, l = data.length; i < l; i++) {
        map[data[i].id] = Object.assign({}, data[i])
      }

      for (let i = 0, keys = Object.keys(map), l = keys.length; i < l; i++) {
        let thisData = map[keys[i]]
        let parent = map[thisData.parentId]

        if (parent) {
          (parent.children || (parent.children = [])).push(thisData)
        } else {
          trees.push(thisData)
        }
      }

      return trees
    default:
      return state
  }
}

export default combineReducers({
	data,
  search,
  views,
  trees,
	routing: routeReducer
})
