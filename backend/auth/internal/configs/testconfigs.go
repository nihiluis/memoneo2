package configs

import (
	"time"

	"github.com/memoneo/auth/internal/services/auth/keycloak"
	"github.com/memoneo/core/lib/datastore"
	"github.com/memoneo/core/lib/server/http"
)

// TestConfigs struct handles all dependencies required for handling configurations
type TestConfigs struct {
}

// HTTP returns the configuration required for HTTP package
func (cfg *TestConfigs) HTTP() (*http.Config, error) {
	return &http.Config{
		Port: "8080",
	}, nil
}

// Keycloak returns the configuration required for the keycloak auth impl.
func (cfg *TestConfigs) Keycloak() (*keycloak.Config, error) {
	return &keycloak.Config{
		Host: "http://localhost",
		Port: "8080",
	}, nil
}

// Datastore returns datastore configuration
func (cfg *TestConfigs) Datastore() (*datastore.Config, error) {
	return &datastore.Config{
		Host:   "localhost",
		Port:   "5432",
		Driver: "postgres",

		StoreName: "archstack",
		Username:  "",
		Password:  "",

		SSLMode: "",

		ConnPoolSize: 10,
		ReadTimeout:  time.Second * 5,
		WriteTimeout: time.Second * 5,
		IdleTimeout:  time.Second * 60,
		DialTimeout:  time.Second * 10,
	}, nil
}

// NewTestService returns an instance of Config with all the required dependencies initialized
func NewTestService() (*TestConfigs, error) {
	return &TestConfigs{}, nil
}
