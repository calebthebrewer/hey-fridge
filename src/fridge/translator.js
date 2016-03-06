const pluralize = require('pluralize')
const debug = require('debug')('fridge:translator')
const Knwl = require('knwl.js')
const knwl = new Knwl('english')
knwl.register('amounts', require('../knwl-plugins/amounts'))
knwl.register('transaction', require('../knwl-plugins/transaction'))

export function translate(string) {
  knwl.init(string)

  const transaction = knwl.get('transaction')
  if (!transaction.length) {
    return
  }
  debug('transaction parsed as a %s', transaction[0].action)

  const amounts = knwl.get('amounts')
  const foods = []
  for (let i = 0, l = amounts.length; i < l; i++) {
    let amount = amounts[i]
    if (amount.unit) {
      debug('amount parsed as %s %s', amount.amount, amount.unit)
      foods.push({
        action: transaction[0].action,
        food: pluralize.plural(amount.unit, 1),
        quantity: amount.amount
      })
    }
  }

  return foods
}
