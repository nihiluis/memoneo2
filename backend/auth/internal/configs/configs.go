package configs

import (
	"os"
	"strings"
	"time"

	"github.com/nihiluis/memoneo2/auth/internal/api"
	"github.com/nihiluis/memoneo2/auth/internal/services/auth"
	"github.com/nihiluis/memoneo2/auth/internal/services/auth/keycloak"
	"github.com/nihiluis/memoneo2/core/lib/datastore"
	"github.com/nihiluis/memoneo2/core/lib/server/http"
)

// Configs struct handles all dependencies required for handling configurations
type Configs struct {
}

// HTTP returns the configuration required for HTTP package
func (cfg *Configs) HTTP() *http.Config {
	allowOrigins := []string{"http://localhost:3000", "http://localhost:3001", "http://localhost:3333"}

	allowOrigins = append(allowOrigins, strings.Split(os.Getenv("ALLOW_ORIGINS"), "|")...)

	return &http.Config{
		Port:         os.Getenv("PORT"),
		AllowOrigins: allowOrigins,
	}
}

// API returns API configuration
func (cfg *Configs) API() *api.Config {
	return &api.Config{
		UserIDContextKey: "dataUserID",
	}
}

// Keycloak returns the configuration required for the keycloak auth impl.
func (cfg *Configs) Keycloak() *keycloak.Config {
	return &keycloak.Config{
		Host:          os.Getenv("KEYCLOAK_HOST"),
		Port:          os.Getenv("KEYCLOAK_PORT"),
		ClientID:      os.Getenv("KEYCLOAK_CLIENT_ID"),
		ClientSecret:  os.Getenv("KEYCLOAK_CLIENT_SECRET"),
		RealmName:     os.Getenv("KEYCLOAK_REALM_NAME"),
		AdminUserName: os.Getenv("KEYCLOAK_ADMIN_USER"),
		AdminPassword: os.Getenv("KEYCLOAK_ADMIN_PASSWORD"),
		Kid:           os.Getenv("KEYCLOAK_KID"),
	}
}

// Auth returns the configuration for the general auth package.
func (cfg *Configs) Auth() *auth.Config {
	return &auth.Config{
		JWTSigningKey:    os.Getenv("AUTH_JWT_SIGNING_KEY"),
		Kid:              os.Getenv("KEYCLOAK_KID"),
		AuthCookieDomain: os.Getenv("AUTH_COOKIE_DOMAIN"),
	}
}

// Datastore returns datastore configuration
func (cfg *Configs) Datastore() *datastore.Config {
	return &datastore.Config{
		Host:   os.Getenv("DB_HOST"),
		Port:   os.Getenv("DB_PORT"),
		Driver: "postgres",

		StoreName: os.Getenv("DB_STORE"), // archstack
		Username:  os.Getenv("DB_USER"),
		Password:  os.Getenv("DB_PASSWORD"),

		SSLMode: os.Getenv("DB_SSL_MODE"),

		ConnPoolSize: 10,
		ReadTimeout:  time.Second * 5,
		WriteTimeout: time.Second * 5,
		IdleTimeout:  time.Second * 60,
		DialTimeout:  time.Second * 10,
	}
}

// NewService returns an instance of Config with all the required dependencies initialized
func NewService() *Configs {
	return &Configs{}
}
