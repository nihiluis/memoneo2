package main

import (
	"github.com/joho/godotenv"
	"github.com/nihiluis/memoneo2/core/lib/logger"
	"github.com/nihiluis/memoneo2/core/lib/server/http"
	"github.com/nihiluis/memoneo2/master/internal/api"
	"github.com/nihiluis/memoneo2/master/internal/configs"
	"go.uber.org/zap"
)

func main() {
	err := godotenv.Load(".env")

	configs, err := configs.NewService()
	if err != nil {
		panic(err)
	}

	logger := logger.NewService()

	httpConfig, err := configs.HTTP()
	apiConfig, err := configs.API()

	server, err := http.NewEchoService(logger, httpConfig)
	if err != nil {
		panic(err)
	}

	api, err := api.NewService(logger, apiConfig)
	if err != nil {
		panic(err)
	}
	api.AddHandlers(server)

	logger.Zap.Info("Loaded all services")
	logger.Zap.Infow("HTTP server starting on", zap.String("port", httpConfig.Port))

	server.Start()
	logger.Zap.Info("Shutting down")
}
