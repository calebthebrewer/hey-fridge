var test = require('tape')

var Breakdown = require('./tree')
var breakdown = new Breakdown()
var treeBreakdown = new Breakdown({name: 'tree'})

const testPath = 'return-body'
const testPath2 = 'test2'
const testValue = 13
const testValue2 = 14

test('a request is resolved by an immediate handler', t => {
  t.plan(1)

  breakdown.addHandler(testPath, (request, callback) => {
    callback(request.body)
  })

  breakdown.handleRequest({body: {'return-body': testValue}}, response => {
    t.equal(response.body[testPath], testValue)
  })
})

test('a handler can be replaced', t => {
  t.plan(1)

  breakdown.addHandler(testPath, (request, callback) => {
    callback(testValue2)
  })

  breakdown.handleRequest({body: {'return-body': testValue2}}, response => {
    t.notEqual(response.body[testPath], testValue)
  })
})

test('a request is resolved by a slow handler', t => {
  t.plan(1)
  t.timeoutAfter(300)

  breakdown.addHandler(testPath2, (request, callback) => {
    setTimeout(() => callback(testValue), 250)
  })

  breakdown.handleRequest({body: {'test2': null}}, response => {
    t.pass()
  })
})

test('multiple request paths are resolved', t => {
  t.plan(2)
  t.timeoutAfter(300)

  breakdown.handleRequest({body: {test2: null, 'return-body': testValue2}}, response => {
    t.equal(response.body[testPath], testValue2)
    t.equal(response.body[testPath2], testValue)
  })
})

test('handlers can be nested', t => {
  t.plan(1)

  treeBreakdown.addHandler('tree', breakdown.handleRequest.bind(breakdown))

  treeBreakdown.handleRequest({body: {tree: {'return-body': null}}}, response => {
    t.equal(response.body.tree[testPath], testValue2)
  })
})

test('listener receive requests', t => {
  t.plan(1)

  breakdown.addHandler('bob', (request, callback) => {
    callback(request.body)
  })

  breakdown.handleRequest({body: {bob: 13}}, () => {}, request => {
    t.equal(request.body.bob, 13)
  })
})

test('listener doesn\'t hear requests it shouldn\'t', t => {
  t.plan(1)

  breakdown.addHandler('joey', (request, callback) => {
    callback(request.body, true)
  })

  breakdown.handleRequest({body: {joey: null}}, () => {
    setTimeout(t.pass.bind(t), 10)
  }, t.fail.bind(t))
})
