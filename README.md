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

  const user = await this.slonik.connect(connection => {
    return connection.one(queryText)
  })

  reply.send(user)
}
```

## API

#### Decorator

This plugin decorates fastify with `slonik` exposing `connect` and `pool`.
View [Slonik API](https://github.com/gajus/slonik#slonik-usage-api) for details.

## Development and Testing

[Tap](https://node-tap.org/) is used for testing. Use `npm test` command to run tests.

### Docker approach

First, start postgres with:

```
$ npm run postgres
```

Then you can, in another terminal, find the running docker and init the DB:

```
$ docker ps
CONTAINER ID        IMAGE                 COMMAND                  CREATED             STATUS              PORTS                    NAMES
28341f85c4cd        postgres:9.6-alpine   "docker-entrypoint.s…"   3 minutes ago       Up 3 minutes        0.0.0.0:5432->5432/tcp   fastify-slonik

$ npm run load-data
```

To run the tests:

- If you haven't already, install [direnv](https://direnv.net/docs/installation.html)
- Unblock .envrc by running command `direnv allow`
- Create .envrc `cp .envrc.example .envrc`
- Copy your public ip

```sh
$ ifconfig -u | grep 'inet ' | grep -v 127.0.0.1 | cut -d\  -f2 | head -1
# <your-public-ip> <-- Copy this
```

- Update .envrc with copied public-ip `export PUBLIC_IP=<your-public-ip>`

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
