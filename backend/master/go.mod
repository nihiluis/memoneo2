module github.com/memoneo/master

go 1.19

replace github.com/memoneo/core => ../core

require (
	github.com/dghubble/sling v1.4.1
	github.com/dgrijalva/jwt-go/v4 v4.0.0-preview1 // indirect
	github.com/go-playground/universal-translator v0.17.0 // indirect
	github.com/go-playground/validator v9.31.0+incompatible
	github.com/gofrs/uuid v4.4.0+incompatible
	github.com/joho/godotenv v1.5.1
	github.com/labstack/echo/v4 v4.10.2
	github.com/leodido/go-urn v1.2.0 // indirect
	github.com/memoneo/core v0.0.0-00010101000000-000000000000
	go.uber.org/zap v1.24.0
	gopkg.in/go-playground/assert.v1 v1.2.1 // indirect
)
