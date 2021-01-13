const { test } = require('tap')
const Fastify = require('fastify')
const { plugin: fastifySlonik } = require('../index')
const { BAD_DB_NAME, connectionStringBadDbName } = require('./helpers')

test('Namespace should exist:', (t) => {
  // t.test('fastify.slonik', t => {
  t.plan(1)

  const fastify = Fastify()
  t.teardown(() => fastify.close())

  const initPoolCalledWith = []

  const mockInitPool = (connectionString) => {
    initPoolCalledWith.push(connectionString)
    return {
      connect: async () => {
        // connectCalledWith.push(connectionString)
        console.log(connectionString)
        console.log('MOCK')
        return 'hello world'
      }
    }
  }

  fastify.register(
    fastifySlonik(mockInitPool), {
      connectionString: 'postgres://testdb'
    }
  )

  fastify.ready((err) => {
    console.log(initPoolCalledWith)
    t.is(initPoolCalledWith[0], 'postgres://testdb')
    // t.error(err)

    // t.ok(fastify.slonik)
    // t.ok(fastify.slonik.pool)
    // t.ok(fastify.slonik.connect)
  })
  // })
  //   test('fastify.sql', (t) => {
  //     t.plan(2)

  //     const fastify = Fastify()
  //     t.teardown(() => fastify.close())

  //     fastify.register(fastifySlonik, {
  //       connectionString
  //     })

  //     fastify.ready((err) => {
  //       t.error(err)

  //       t.ok(fastify.sql)
  //     })
  //   })
  //   t.end()
  // })

  // test('When fastify.slonik root namespace is used:', (t) => {
  //   t.test('should be able to use make a query', t => {
  //     t.plan(2)

  //     const fastify = Fastify()
  //     t.teardown(() => fastify.close())

  //     fastify.register(fastifySlonik, {
  //       connectionString
  //     })

  //     fastify.ready(async (err) => {
  //       t.error(err)
  //       const queryString = fastify.sql`
  //         SELECT 1 as one
  //       `

  //       const queryResult = await fastify.slonik.connect(connection => {
  //         return connection.query(queryString)
  //       })

  //       t.equal(queryResult.rows[0].one, 1)
  //     })
  //   })
  //   t.end()
  // })

  // test('should throw error when pg fails to perform an operation', (t) => {
  //   const fastify = Fastify()
  //   t.teardown(() => fastify.close())

  //   fastify.register(fastifySlonik, {
  //     connectionString: connectionStringBadDbName
  //   })

//   fastify.ready(async (err) => {
//     t.error(err)
//     const queryString = fastify.sql`
//       SELECT 1 as one
//     `
//     try {
//       const queryResult = await fastify.slonik.connect(connection => {
//         return connection.query(queryString)
//       })
//       t.fail(queryResult)
//     } catch (err) {
//       t.ok(err)
//       t.is(err.message, `database "${BAD_DB_NAME}" does not exist`)
//     }
//     t.end()
//   })
})
