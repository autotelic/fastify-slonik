# Fastify Slonik

A [Fastify](https://www.fastify.io/) plugin that uses the PostgreSQL client, [Slonik](https://www.npmjs.com/package/slonik). Slonik abstracts repeating code patterns, protects against unsafe connection handling and value interpolation, and provides a rich debugging experience.

## Usage

```sh
npm i @autotelic/fastify-slonik
```

##### Example:

```js
// index.js
const fastifySlonik = require('fastify-slonik')

// register fastify-slonik
fastify.register(fastifySlonik, {
  connectionString: process.env.DATABASE_URL
})

// setup test route
fastify.get('/users', async function (request, reply) {
  const { params: { id: userId } } = request

  const queryText = this.slonik.sql`
    SELECT * FROM users
    WHERE user_id = ${userId}
  `

  const user = await this.slonik.query(queryText)

  reply.send(user)
}
```

## API

#### Decorator

This plugin decorates fastify with `slonik` exposing all query methods.
View [Slonik API](https://github.com/gajus/slonik#slonik-usage-api) for details.

## Development and Testing

[Tap](https://node-tap.org/) is used for testing

### Fixtures

```
$ docker-compose up
```

To run the tests:

- Create .envrc `cp .envrc.example .envrc`
- If not using direnv, update .envrc to .env

```
$ npm test
```

## License

Licensed under [MIT](./LICENSE).
