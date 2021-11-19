package api

import (
	"net/http"

	"github.com/dghubble/sling"
	"github.com/go-playground/validator"
	"github.com/gofrs/uuid"
	"github.com/labstack/echo/v4"
	echoMiddleware "github.com/labstack/echo/v4/middleware"
	"github.com/memoneo/core/lib/logger"
	memohttp "github.com/memoneo/core/lib/server/http"
	userMiddleware "github.com/memoneo/core/lib/server/http/middleware"
)

var validate *validator.Validate

type API struct {
	logger   *logger.Logger
	validate *validator.Validate
	config   *Config
}

type Config struct {
	GraphQLSecret           string
	GraphQLSecretHeader     string
	GraphQLEndpointURL      string
	GraphQLRelayEndpointURL string
	GraphQLWorkspaceHeader  string
	GraphQLUserHeader       string
	GraphQLRoleHeader       string
	GraphQLRoleName         string
	WorkspaceContextKey     string
	UserIDContextKey        string
	AuthEndpointUrl         string
}

func NewService(logger *logger.Logger, config *Config) (*API, error) {
	validate := validator.New()

	return &API{logger, validate, config}, nil
}

// AddHandlers adds the echo handlers that are part of this package.
func (api *API) AddHandlers(s *memohttp.EchoServer) {
	s.Echo.Use(echoMiddleware.Logger())

	s.Echo.Use(echoMiddleware.CORSWithConfig(echoMiddleware.CORSConfig{
		AllowOrigins:     s.Config.AllowOrigins,
		AllowCredentials: true,
		AllowMethods:     []string{http.MethodGet, http.MethodPut, http.MethodPost, http.MethodDelete},
	}))

	userCookieAuthMiddleware := userMiddleware.UserCookieAuth(api.logger)
	s.Echo.Use(userCookieAuthMiddleware)

	userAuthConfig := &userMiddleware.UserAuthConfig{
		AuthEndpointURL: api.config.AuthEndpointUrl,
	}
	userAuthMiddleware := userMiddleware.UserAuthWithConfig(userAuthConfig)

	s.Echo.Use(userAuthMiddleware)

	s.Echo.POST("/v1/graphql", api.handleGraphQLQuery)
	s.Echo.POST("/v1/relay", api.handleGraphQLRelayQuery)
}

// GraphQLQueryRequestBody contains the graphql query.
type GraphQLQueryRequestBody struct {
	Query string `json:"query" validate:"required"`
}

// handleGraphQLQuery handles a wrapper endpoint for the Hasura GraphQL engine. This imposes some performance penalties,
// but allows for greater developer productivity as no dabbling with the token claims in Keycloak is needed. Furthermore,
// the keycloak-hasura-connector can be omitted.
// At some point this endpoint might become legacy.
func (api *API) handleGraphQLQuery(c echo.Context) error {
	var data map[string]interface{}

	workspaceID := c.Get(api.config.WorkspaceContextKey).(uuid.UUID)

	s := sling.New().Post(api.config.GraphQLEndpointURL).
		Set(api.config.GraphQLWorkspaceHeader, workspaceID.String()).
		Set(api.config.GraphQLSecretHeader, api.config.GraphQLSecret).
		Set(api.config.GraphQLRoleHeader, api.config.GraphQLRoleName)
	_, err := s.Body(c.Request().Body).ReceiveSuccess(&data)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, data)
}

// handleGraphQLQuery handles a wrapper endpoint for the Hasura GraphQL engine. This imposes some performance penalties,
// but allows for greater developer productivity as no dabbling with the token claims in Keycloak is needed. Furthermore,
// the keycloak-hasura-connector can be omitted.
// At some point this endpoint might become legacy.
func (api *API) handleGraphQLRelayQuery(c echo.Context) error {
	var data map[string]interface{}

	workspaceID := c.Get(api.config.WorkspaceContextKey).(uuid.UUID)
	userID := c.Get(api.config.UserIDContextKey).(uuid.UUID)

	s := sling.New().Post(api.config.GraphQLRelayEndpointURL).
		Set(api.config.GraphQLSecretHeader, api.config.GraphQLSecret).
		Set(api.config.GraphQLWorkspaceHeader, workspaceID.String()).
		Set(api.config.GraphQLRoleHeader, api.config.GraphQLRoleName).
		Set(api.config.GraphQLUserHeader, userID.String())
	_, err := s.Body(c.Request().Body).ReceiveSuccess(&data)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, data)
}
