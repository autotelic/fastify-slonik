const { test } = require('tap')
const Fastify = require('fastify')
const fastifySlonik = require('../index')
const { BAD_DB_NAME, connectionString, connectionStringBadDbName } = require('./helpers')

test('Namespace should exist:', (t) => {
  t.test('fastify.slonik', t => {
    t.plan(4)

    const fastify = Fastify()
    t.teardown(() => fastify.close())

    fastify.register(fastifySlonik, {
      connectionString
    })
    fastify.ready((err) => {
      t.error(err)

      t.ok(fastify.slonik)
      t.ok(fastify.slonik.pool)
      t.ok(fastify.slonik.connect)
    })
  })
  test('fastify.sql', (t) => {
    t.plan(2)

    const fastify = Fastify()
    t.teardown(() => fastify.close())

    fastify.register(fastifySlonik, {
      connectionString
    })

    fastify.ready((err) => {
      t.error(err)

      t.ok(fastify.sql)
    })
  })
  t.end()
})

test('When fastify.slonik root namespace is used:', (t) => {
  t.test('should be able to use make a query', t => {
    t.plan(2)

    const fastify = Fastify()
    t.teardown(() => fastify.close())

    fastify.register(fastifySlonik, {
      connectionString
    })

    fastify.ready(async (err) => {
      t.error(err)
      const queryString = fastify.sql`
        SELECT 1 as one
      `

      const queryResult = await fastify.slonik.connect(connection => {
        return connection.query(queryString)
      })

      t.equal(queryResult.rows[0].one, 1)
    })
  })
  t.end()
})

test('should throw error when pg fails to perform an operation', (t) => {
  const fastify = Fastify()
  t.teardown(() => fastify.close())

  fastify.register(fastifySlonik, {
    connectionString: connectionStringBadDbName
  })

  fastify.ready(async (err) => {
    t.error(err)
    const queryString = fastify.sql`
      SELECT 1 as one
    `
    try {
      const queryResult = await fastify.slonik.connect(connection => {
        return connection.query(queryString)
      })
      t.fail(queryResult)
    } catch (err) {
      t.ok(err)
      t.is(err.message, `database "${BAD_DB_NAME}" does not exist`)
    }
    t.end()
  })
})