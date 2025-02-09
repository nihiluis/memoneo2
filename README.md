# Memoneo
Memoneo provides a small cli to encrypt and sync your markdown notes to a Postgres database via a self-hosted backend.

## Demo



## Project structure
## Frontends
- [Memoneo CLI](./cli/README.md) organize your markdown notes locally and sync them to the Memoneo server
- [Memoneo app](./app/README.md) - Android app for syncing transcribed voice notes

## Backends
- [Memoneo auth](./auth/README.md) - Handles authentication and authorization
- [Memoneo master](./master/README.md) - Wraps the Hasura GraphQL database layer
- [Memoneo gqlwrapper](./gqlwrapper/README.md) - Provides selected REST endpoints for the Memoneo app, wrapping the Hasura GraphQL API