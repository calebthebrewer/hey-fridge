'use strict'

const _ = require('lodash')
const Knwl = require('knwl.js')
const pluralize = require('pluralize')
const debug = require('debug')('fridge')

const knwl = new Knwl('english')
knwl.register('amounts', require('../knwl-plugins/amounts'))
knwl.register('transaction', require('../knwl-plugins/transaction'))

const food = {}

module.exports = {
  path: 'fridge',
  callback: (request, response) => {
    knwl.init(request.body)

    const transaction = knwl.get('transaction')
    if (!transaction.length) {
      return
    }
    debug('transaction parsed as a %s', transaction[0].direction)
    const gain = transaction[0].direction === 'gain'

    const amounts = knwl.get('amounts')
    for (let i = 0, l = amounts.length; i < l; i++) {
      let amount = amounts[i]
      if (amount.unit) {
        let unit = pluralize.plural(amount.unit, 1)

        if (!food[unit]) {
          food[unit] = 0
        }

        if (gain) {
          food[unit] += amount.amount
        } else {
          food[unit] -= amount.amount
        }

        debug('amount parsed as %s %s', amount.amount, amount.unit)
      }
    }

    console.log(food)
    response.send(food)
  }
}
