*Note:* The app is only maintained for my personal use and thus hardly tested, documented etc.

# Concept
Memoneo provides a small cli to encrypt and sync your markdown notes to a remote backend which can be self-hosted.

# Tech stack
Memoneo builds upon three applications (which can be setup through the provided Docker Compose config):

- PostgreSQL
- Hasura GraphQL API
- Keycloak

# Security issue
The IV is stored in plain text in the database, instead of being prepended to the ciphertext. This is a potential security issue.