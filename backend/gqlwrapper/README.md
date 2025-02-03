# Memoneo GQL Wrapper
Wraps GraphQL queries and mutations via Urql into a simple REST API. With it, the React Native app doesn't have to bother with additional GraphQL complexity and setup.

# Tech stack
- Bun
- Elysia web framework
- Urql GraphQL client
- Typescript
- Docker

# Setup
A config.json file is required in the root of the project. See `config.example.json` for an example.

# Running
```bash
# Locally
bun install
bun run dev
```

# Docker
```bash
docker build -t gqlwrapper .
docker run -p 3000:3000 gqlwrapper
```