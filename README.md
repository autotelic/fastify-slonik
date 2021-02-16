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

  const queryText = this.sql`
    SELECT * FROM users
    WHERE user_id = ${userId}
  `

  const user = await this.slonik.query(queryText)

  reply.send(user)
}
```

## API

#### Decorator

This plugin decorates fastify with `slonik` exposing `connect`, `pool`, `query`, `transaction` and `exists`.
View [Slonik API](https://github.com/gajus/slonik#slonik-usage-api) for details.

## Development and Testing

[Tap](https://node-tap.org/) is used for testing. Use `npm test` command to run tests.

### Docker approach

```
$ docker-compose up
```

To run the tests:

- Create .envrc `cp .envrc.example .envrc`
- If not using direnv, update .envrc to .env

```
$ npm test
```

### Custom Postgres approach

1. Set up a database of your choice in a postgres server of your choice
2. Create the required table using
    ```sql
    CREATE TABLE users(id serial PRIMARY KEY, username VARCHAR (50) NOT NULL);
    ```
3. Create .envrc `cp .envrc.example .envrc` and update environment variables accordingly


## License

Licensed under [MIT](./LICENSE).
