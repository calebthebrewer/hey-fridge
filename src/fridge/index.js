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
        <h1>Hey, Fridge!</h1>
        <h2>A catalog of your food and stuff.</h2>
        <table>
          <thead>
            <tr>
              <th>Food</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Apples</td>
              <td>2</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}
