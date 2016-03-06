'use strict';

module.exports = class Transaction {
  constructor(knwl) {
    this.knwl = knwl
    this.languages = {
      english: true
    }
  }

  parseAction(word) {
    const losses = [
      'remove',
      'used',
      'lost',
      'expired',
      'cooked',
      'baked',
      'trashed',
      'ate',
      'consumed'
    ]

    const gains = [
      'add',
      'bought',
      'added',
      'found',
      'purchased'
    ]

    if (losses.indexOf(word) > -1) {
      return 'remove'
    }

    if (gains.indexOf(word) > -1) {
      return 'add'
    }

    return false
  }

  calls() {
    const words = this.knwl.words.get('words')
    const results = []

    for (let i = 0, l = words.length; i < l; i++) {
      let action = this.parseAction(words[i])
      if (action) {
        results.push({
          action,
          preview: this.knwl.tasks.preview(i, words),
          found: i
        })
      }
    }

    return results
  }
}
