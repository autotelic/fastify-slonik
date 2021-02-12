'use strict'

const fastifyPlugin = require('fastify-plugin')
const { createPool, sql } = require('slonik')

const fastifySlonik = async (fastify, options) => {
  const { connectionString } = options
  const pool = createPool(connectionString)

  try {
    await pool.connect(async connection => {
      fastify.log.info('connected to postgres db')
    })
  } catch (err) {
    fastify.log.error(err)
  }

  async function transaction (connection) {
    return pool.query(connection)
  }

  const db = {
    connect: pool.connect.bind(pool),
    pool: pool,
    query: pool.query.bind(pool),
    transaction: transaction.bind(pool),
    exists: pool.exists.bind(pool)

  }

  fastify.decorate('slonik', db)
  fastify.decorate('sql', sql)
}

module.exports = fastifyPlugin(fastifySlonik, {
  fastify: '3.x',
  name: 'fastify-slonik'
})
