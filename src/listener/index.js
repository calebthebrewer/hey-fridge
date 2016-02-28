import React, { Component } from 'react'
import { connect } from 'react-redux'
import annyang from 'imports?this=>window!exports?window.annyang!../../node_modules/annyang/annyang'
//import tts from 'light-tts'

import { emit } from '../api'
require('!style!css!sass!./style.scss')

const handlers = [
  'fridge',
  'wallet'
]

class Listener extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    const commands = handlers.reduce((currentCommands, handler) => {
      currentCommands[`${handler} *command`] = command => {
        this.setState({result: `${handler}, ${command}`})
        emit({
          path: handler,
          body: command
        })
        //tts.say(command)
      }
      return currentCommands
    }, {})
    annyang.addCommands(commands)
    annyang.addCallback('result', console.log.bind(console))
    annyang.start()
  }

  render() {
    const { result } = this.state
    return (
      <div>
        <h1>I'm listening!</h1>
        <p>{result}</p>
      </div>
    )
  }
}

function select(state) {
  return {
    trees: state.trees
  }
}

export default connect(select)(Listener)
