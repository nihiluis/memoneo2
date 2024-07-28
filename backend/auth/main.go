package main

import (
	"github.com/joho/godotenv"
	"github.com/nihiluis/memoneo2/auth/internal/api"
	"github.com/nihiluis/memoneo2/auth/internal/configs"
	"github.com/nihiluis/memoneo2/auth/internal/services/auth/keycloak"
	"github.com/nihiluis/memoneo2/auth/internal/services/enckeys"
	"github.com/nihiluis/memoneo2/auth/internal/services/users"
	"github.com/nihiluis/memoneo2/core/lib/datastore"
	"github.com/nihiluis/memoneo2/core/lib/logger"
	"github.com/nihiluis/memoneo2/core/lib/server/http"
	"go.uber.org/zap"
)

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		panic(err)
	}

	logger := logger.NewService()
	configs := configs.NewService()

	keycloakConfig := configs.Keycloak()
	pgConfig := configs.Datastore()
	authConfig := configs.Auth()
	httpConfig := configs.HTTP()
	apiConfig := configs.API()

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
