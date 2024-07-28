package configs

import (
	"os"
	"strings"
	"time"

	"github.com/nihiluis/memoneo2/core/lib/datastore"
	"github.com/nihiluis/memoneo2/core/lib/server/http"
	"github.com/nihiluis/memoneo2/master/internal/api"
)

// Configs struct handles all dependencies required for handling configurations
type Configs struct {
}

// Datastore returns datastore configuration
func (cfg *Configs) Datastore() (*datastore.Config, error) {
	return &datastore.Config{
		Host:   os.Getenv("DB_HOST"),
		Port:   os.Getenv("DB_PORT"),
		Driver: "postgres",

		StoreName: os.Getenv("DB_STORE"), // archstack
		Username:  os.Getenv("DB_USER"),
		Password:  os.Getenv("DB_PASSWORD"),

		SSLMode: "",

		ConnPoolSize: 10,
		ReadTimeout:  time.Second * 5,
		WriteTimeout: time.Second * 5,
		IdleTimeout:  time.Second * 60,
		DialTimeout:  time.Second * 10,
	}, nil
}

// API returns API configuration
func (cfg *Configs) API() (*api.Config, error) {
	return &api.Config{
		GraphQLSecret:           os.Getenv("HASURA_SECRET_KEY"),
		GraphQLSecretHeader:     "X-Hasura-Admin-Secret",
		GraphQLEndpointURL:      os.Getenv("HASURA_GQL_ENDPOINT_URL"),
		GraphQLRelayEndpointURL: os.Getenv("HASURA_RELAY_ENDPOINT_URL"),
		GraphQLUserHeader:       "X-Hasura-User-Id",
		GraphQLRoleHeader:       "X-Hasura-Role",
		GraphQLRoleName:         "user",
		UserIDContextKey:        "dataUserID",
		AuthEndpointUrl:         os.Getenv("AUTH_URL"),
	}, nil
}

// HTTP returns the configuration required for HTTP package
func (cfg *Configs) HTTP() (*http.Config, error) {
	allowOrigins := []string{"http://localhost:3000", "http://localhost:3001"}

	allowOrigins = append(allowOrigins, strings.Split(os.Getenv("ALLOW_ORIGINS"), "|")...)

	return &http.Config{
		Port:         os.Getenv("PORT"),
		AllowOrigins: allowOrigins,
	}, nil
}

// NewService returns an instance of Config with all the required dependencies initialized
func NewService() (*Configs, error) {
	return &Configs{}, nil
}
