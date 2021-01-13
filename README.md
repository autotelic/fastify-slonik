# Fastify Slonik

A [Fastify](https://www.fastify.io/) plugin that uses the PostgreSQL client, [Slonik](https://www.npmjs.com/package/slonik). Slonik abstracts repeating code patterns, protects against unsafe connection handling and value interpolation, and provides a rich debugging experience.

## Usage

Example:

```js
const fastifySlonik = require('./plugins/fastify-slonik')

module.exports = async function (fastify, options) {
  fastify.register(fastifySlonik, {
    connectionString: process.env.DATABASE_URL
  })
  
// To Do: Add mock routes...
```

## Dependencies

- fastify: ^3.0.x,
- fastify-cli: ^2.5.x,
- fastify-plugin: ^3.0.x,
- slonik: ^23.5.x

## License

Licensed under [MIT](./LICENSE).
