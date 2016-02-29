import React, { Component } from 'react'
import { connect } from 'react-redux'

import { emit } from '../api'
//require(!style!css!sass!./style.css)

export default class Fridge extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fridge: {
        apples: 5,
        milk: 1,
        onions: 2
      }
    }
  }
  render() {
    return (
      <div>
        I'm a fridge.
      </div>
    )
  }
}
