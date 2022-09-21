'use strict'

const fastifyPlugin = require('fastify-plugin')
const { createPool, sql } = require('slonik')

const fastifySlonik = async (fastify, options) => {
  const { connectionString, poolOpts = {} } = options
  const pool = createPool(connectionString, poolOpts)

  try {
    await pool.connect(async connection => {
      fastify.log.info('connected to postgres db')
    })
  } catch (err) {
    fastify.log.error(err)
  }

  fastify.decorate('slonik', {
    sql,
    ...pool
  })

  fastify.addHook('onClose', async () => {
    await pool.end()
  })
}

module.exports = fastifyPlugin(fastifySlonik, {
  fastify: '4.x',
  name: 'fastify-slonik'
})
