# Memoneo auth API
Contains endpoints for handling auth for the Memoneo apps, built on Keycloak.

## Keycloak config
The auth service needs Keycloak configured with the following:

Realm
- Name: must match the value of `KEYCLOAK_REALM_NAME` in the env variables
Client
- Name: must match the value of `KEYCLOAK_CLIENT_ID` in the env variables
- Access Type: bearer-only

## Env variables
```bash
KEYCLOAK_DB_NAME=keycloak
DB_STORE=...
DB_USER=...
DB_PASSWORD=...
DB_HOST=...
DB_PORT=...
HASURA_SECRET_KEY="..."
KEYCLOAK_ADMIN_USER=...
KEYCLOAK_ADMIN_PASSWORD="..."
KEYCLOAK_CLIENT_ID=auth
KEYCLOAK_CLIENT_SECRET="..."
KEYCLOAK_REALM_NAME=users
KEYCLOAK_HOST=https://keycloak.domain.com
KEYCLOAK_PORT=443
AUTH_COOKIE_DOMAIN=domain.com
KEYCLOAK_KID="..."
AUTH_JWT_SIGNING_KEY="..."
PROXY_AUTHORIZATION_HEADER="..."
PORT=8089
```
