const { test } = require('tap')
const Fastify = require('fastify')
const fastifySlonik = require('../index')

const connectionString = process.env.DATABASE_URL
const BAD_DB_NAME = 'db_that_does_not_exist'
const connectionStringBadDbName = connectionString.replace(/\/[^/]+$/, '/' + BAD_DB_NAME)

test('Namespace should exist:', async t => {
  const fastify = Fastify()

  t.teardown(() => fastify.close())

  fastify.register(fastifySlonik, { connectionString })
  await fastify.ready()

  t.ok(fastify.hasDecorator('slonik'), 'has slonik decorator')
  t.ok(fastify.slonik.pool)
  t.ok(fastify.slonik.connect)
  t.ok(fastify.slonik.query)
  t.ok(fastify.slonik.transaction)
  t.ok(fastify.slonik.exists)
  t.ok(fastify.hasDecorator('sql'), 'has sql decorator')
})

test('When fastify.slonik root namespace is used:', async t => {
  const testName = 'foobar'

  const fastify = Fastify()

  t.teardown(async () => {
    const removeUser = fastify.sql`
      DELETE FROM
        users
      WHERE
        username=${testName};
    `
    await fastify.slonik.transaction(removeUser)
    fastify.close()
  })

  fastify.register(fastifySlonik, { connectionString })
  await fastify.ready()

  t.test('should be able to make a query', async t => {
    const queryString = fastify.sql`
      SELECT 1 as one
    `
    const queryResult = await fastify.slonik.query(queryString)
    const { rows: [{ one }] } = queryResult
    t.is(one, 1)
  })

  t.test('should be able to make a transaction', async t => {
    const queryString = fastify.sql`
      INSERT INTO
        users(username)
      VALUES
        (${testName})
      RETURNING
        *;
    `
    const queryResult = await fastify.slonik.transaction(queryString)
    const { rows: [{ username }] } = queryResult
    t.is(username, testName)
  })

  t.test('should be able to make a exists query', async t => {
    const queryString = fastify.sql`
      SELECT
        1
      FROM
        users
      WHERE
        username=${testName}
    `
    const queryResult = await fastify.slonik.exists(queryString)
    t.ok(queryResult)
  })
})

test('should throw error when pg fails to perform an operation', async t => {
  const fastify = Fastify()
  t.teardown(() => fastify.close())

  fastify.register(fastifySlonik, {
    connectionString: connectionStringBadDbName
  })

  await fastify.ready()

  const queryString = fastify.sql`
    SELECT 1 as one
  `

  try {
    const queryResult = await fastify.slonik.query(queryString)
    t.fail(queryResult)
  } catch (err) {
    t.ok(err)
    t.is(err.message, `database "${BAD_DB_NAME}" does not exist`)
  }
})
