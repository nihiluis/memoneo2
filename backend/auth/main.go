package main

import (
	"github.com/joho/godotenv"
	"github.com/memoneo/auth/internal/api"
	"github.com/memoneo/auth/internal/configs"
	"github.com/memoneo/auth/internal/services/auth/keycloak"
	"github.com/memoneo/auth/internal/services/enckeys"
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
	apiConfig, err := configs.API()

	datastore, err := datastore.NewService(pgConfig)
	if err != nil {
		logger.Zap.Panicw("Unable to load postgres data", zap.Error(err))
	}
	defer datastore.DB.Close()

	keycloak, err := keycloak.NewService(logger, datastore, keycloakConfig)
	if err != nil {
		logger.Zap.Panicw("Unable to load keycloak service", zap.Error(err))
	}

	enckeys, err := enckeys.NewService(logger, datastore)
	if err != nil {
		logger.Zap.Panicw("Unable to load enckeys service", zap.Error(err))
	}

	users, err := users.NewService(logger, datastore, keycloak)
	if err != nil {
		logger.Zap.Panicw("Unable to load users service", zap.Error(err))
	}

	server, err := http.NewEchoService(logger, httpConfig)
	if err != nil {
		logger.Zap.Panicw("Unable to load http server", zap.Error(err))
	}

	api, err := api.NewService(logger, keycloak, apiConfig, authConfig, users, enckeys)
	if err != nil {
		logger.Zap.Panicw("Unable to load api service", zap.Error(err))
	}
	api.AddHandlers(server)

	logger.Zap.Info("Loaded all services")
	logger.Zap.Infow("HTTP server starting", zap.String("port", httpConfig.Port))

	server.Start()
}
