import React, { Component } from 'react'
import { Card, CardTitle, CardActions, RaisedButton, TextField } from 'material-ui'
import { updateViewName } from '../api'

export default class User extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: window.localStorage.getItem('breakdown/view/name') || 'Visitor ' + Date.now()
    }
  }

  nameChange(value) {
    this.setState({name: value})
  }

  formSubmit(event) {
    event.preventDefault()
    window.localStorage.setItem('breakdown/view/name', this.state.name)
    updateViewName(this.state.name)
  }

  render() {
    return (
      <div className="full-screen">
        <Card className="mini-content">
          <form onSubmit={ this.formSubmit.bind(this) }>
            <TextField value={ this.state.name } onChange={ event => this.nameChange(event.target.value) }/>
            <CardActions>
              <RaisedButton label="Update User" primary={ true }/>
            </CardActions>
          </form>
        </Card>
      </div>
    )
  }
}
