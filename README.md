# Fastify Slonik

A [Fastify] plugin that uses the PostgreSQL client, [Slonik]. Slonik abstracts repeating code patterns, protects against unsafe connection handling and value interpolation, and provides a rich debugging experience.

## Setup

- Clone and install `npm i`

## Dependencies

- fastify-plugin: ^3.0.x,
- slonik: ^23.5.x
- tap: ^14.0.x,
- fastify: ^3.0.x,
- fastify-cli: ^2.5.x,
- standard: ^14.3.x,
- lint-staged: ^10.2.x

## Testing

To confirm the plugin is working:

- If you haven't already, install [direnv](https://direnv.net/docs/installation.html) - you'll need to restart/refresh your shell after installation
- clone [this Harpocrates branch](https://github.com/autotelic/harpocrates#feat/slonik-plugin) and install `npm i`
- Unblock .envrc by running command `direnv allow`
- Create .envrc `cp .envrc.example .envrc`
- Copy your public ip

```sh
$ ifconfig -u | grep 'inet ' | grep -v 127.0.0.1 | cut -d\  -f2 | head -1
# <your-public-ip> <-- Copy this
```

- Update .envrc with copied public-ip `export PUBLIC_IP=<your-public-ip>`, as well as path to directory with Slonik plugin `export SLONIK_PATH=<your-local-path>`
- Create and run [Docker](https://www.docker.com/) container with `docker-compose up` - leave running
- Open a new shell tab or window to seed and migrate database

```sh
cp test_seeds/1605303453216_seeds.js migrations/
npm run migrate up
```

- Run in development `npm run dev`
- If plugin is working correctly, GET request to `localhost:3000/users/1` should return

```js
{
userId: 1,
githubUsername: "Ed",
emailAddress: "Ed@autotelic.com",
firstLogin: 1610...,
mostRecentLogin: 1610...
}
```
