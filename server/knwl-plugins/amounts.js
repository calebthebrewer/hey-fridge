'use strict';

const _ = require('lodash')

module.exports = class Amounts {
  constructor(knwl) {
    this.knwl = knwl
    this.languages = {
      english: true
    }
  }

  parseAmount(word) {
    let test = parseInt(word)
    if (!_.isNaN(test)) {
      return test
    }

    const amounts = [
      'zero',
      'one',
      'two',
      'tree',
      'four',
      'five',
      'six',
      'seven',
      'eight',
      'nine',
      'ten',
      'eleven',
      'twelve',
      'thirteen',
      'fourteen',
      'fifteen',
      'sixteen',
      'seventeen',
      'eighteen',
      'nineteen',
      'twenty'
    ]

    test = amounts.indexOf(word)
    return test > -1 ? test : false
  }

  calls() {
    const words = this.knwl.words.get('words')
    const results = []

    for (let i = 0, l = words.length; i < l; i++) {
      let amount = this.parseAmount(words[i])
      if (amount !== false) {
        let unit = l > i ? words[i + 1] : undefined
        results.push({
          amount,
          unit,
          preview: this.knwl.tasks.preview(i, words),
          found: i
        })
      }
    }

    return results
  }
}
