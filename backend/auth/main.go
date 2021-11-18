package main

import (
	"github.com/joho/godotenv"
	"github.com/memoneo/auth/internal/api"
	"github.com/memoneo/auth/internal/configs"
	"github.com/memoneo/auth/internal/services/auth/keycloak"
	"github.com/memoneo/auth/internal/services/users"
	"github.com/memoneo/core/lib/datastore"
	"github.com/memoneo/core/lib/logger"
	"github.com/memoneo/core/lib/server/http"
	"go.uber.org/zap"
)

func main() {
	err := godotenv.Load(".env")

	configs, err := configs.NewService()
	if err != nil {
		panic(err)
	}

	logger := logger.NewService()

	keycloakConfig, err := configs.Keycloak()
	pgConfig, err := configs.Datastore()
	authConfig, err := configs.Auth()
	httpConfig, err := configs.HTTP()

	datastore, err := datastore.NewService(pgConfig)
	if err != nil {
		panic(err)
	}
	defer datastore.DB.Close()

	keycloak, err := keycloak.NewService(logger, datastore, keycloakConfig)
	if err != nil {
		panic(err)
	}

	users, err := users.NewService(logger, datastore, keycloak)
	if err != nil {
		panic(err)
	}

	server, err := http.NewEchoService(logger, httpConfig)
	if err != nil {
		panic(err)
	}

	api, err := api.NewService(logger, keycloak, authConfig, users)
	if err != nil {
		panic(err)
	}
	api.AddHandlers(server)

	logger.Zap.Info("Loaded all services")
	logger.Zap.Infow("HTTP server starting", zap.String("port", httpConfig.Port))
	server.Start()
}
