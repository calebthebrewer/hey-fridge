'use strict';

module.exports = class Transaction {
  constructor(knwl) {
    this.knwl = knwl
    this.languages = {
      english: true
    }
  }

  parseDirection(word) {
    const losses = [
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
      'bought',
      'added',
      'found',
      'purchased'
    ]

    if (losses.indexOf(word) > -1) {
      return 'loss'
    }

    if (gains.indexOf(word) > -1) {
      return 'gain'
    }

    return false
  }

  calls() {
    const words = this.knwl.words.get('words')
    const results = []

    for (let i = 0, l = words.length; i < l; i++) {
      let direction = this.parseDirection(words[i])
      if (direction) {
        results.push({
          direction,
          preview: this.knwl.tasks.preview(i, words),
          found: i
        })
      }
    }

    return results
  }
}
