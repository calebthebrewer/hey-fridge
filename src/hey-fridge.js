import React, { Component } from 'react'
import { Link } from 'react-router'
import { FloatingActionButton } from 'material-ui'
import ActionSearch from 'material-ui/lib/svg-icons/action/search'
import ContentAdd from 'material-ui/lib/svg-icons/content/add'
import AccountSvg from 'material-ui/lib/svg-icons/action/account-circle'
require('!style!css!sass!./style.scss')

export default class HeyFridge extends Component {
	render() {
		return (
      <main>
        { this.props.children }
      </main>
		)
	}
}
