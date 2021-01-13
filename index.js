'use strict'

const fastifyPlugin = require('fastify-plugin')
const { createPool, sql } = require('slonik')

function initFastifySlonik (initPool = createPool, sqlClient = sql) {
  const fastifySlonik = async (fastify, options) => {
    const { connectionString } = options
    const pool = initPool(connectionString)
    try {
      await pool.connect(async connection => {
        fastify.log.info('connected to postgres db')
      })
    } catch (err) {
      fastify.log.error(err)
    }
    console.log('connected')
    const db = {
      connect: pool.connect.bind(pool),
      pool: pool
    }

    fastify.decorate('slonik', db)
    fastify.decorate('sql', sqlClient)
  }
  return fastifySlonik
}

module.exports = fastifyPlugin(initFastifySlonik(), {
  fastify: '3.x',
  name: 'fastify-slonik',
  dependencies: ['slonik']
})
module.exports.plugin = initFastifySlonik
