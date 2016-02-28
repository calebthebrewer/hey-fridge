var test = require('tape')

var Breakdown = require('./path')
var bd = new Breakdown()
var bd2 = new Breakdown({name: 'child'})

const TEST_VALUE = 'Hi'
const TEST_REQUEST = {
  path: 'data',
  body: TEST_VALUE
}



test('a request is resolved by an immediate handler', t => {
  t.plan(1)

  bd.use('data', (request, response) => {
    return response.send(request.body)
  })

  bd.run(TEST_REQUEST, response => {
    t.equal(response.body, TEST_VALUE)
  })
})

test('a handler can be replaced', t => {
  t.plan(1)

  bd.use('data', (request, response) => {
    response.send(`${request.body}!`)
  })

  bd.run(TEST_REQUEST, response => {
    t.equal(response.body, `${TEST_VALUE}!`)
  })
})

test('a request is resolved by a slow handler', t => {
  t.plan(1)

  bd.use('data', (request, response) => {
    setTimeout(() => response.send(request.body), 250)
  })

  bd.run(TEST_REQUEST, response => {
    t.equal(response.body, TEST_VALUE)
  })
})

test('handlers can be nested', t => {
  t.plan(1)

  const treeRequest = {
    path: 'tree.leaf',
    body: '!'
  }

  bd2.use('leaf', (request, response) => {
    setTimeout(() => response.send(request.body.repeat(2)), 250)
  })

  bd.use('tree', bd2.run.bind(bd2))

  bd.run(treeRequest, response => {
    t.equal(response.body, '!!')
  })
})
