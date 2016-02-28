import axios from 'axios'
import { API, SERVER } from './variables'

export function add(data, callback) {
  httpSend({
    path: 'data',
    type: 'add',
    body: data
  }, callback)
}

function httpSend(message, callback) {
  axios
    .post(`${API}/breakdown`, message)
    .then(response => callback(response.data))
}
