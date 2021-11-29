package api

import (
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go/v4"
	"github.com/go-playground/validator"
	"github.com/gofrs/uuid"
	"github.com/labstack/echo/v4"
	echoMiddleware "github.com/labstack/echo/v4/middleware"
	"github.com/memoneo/auth/internal/services/auth"
	"github.com/memoneo/auth/internal/services/users"
	authmodels "github.com/memoneo/auth/lib/models"
	"github.com/memoneo/auth/lib/utils"
	"github.com/memoneo/core/lib/logger"
	"github.com/memoneo/core/lib/models"
	archhttp "github.com/memoneo/core/lib/server/http"
	"github.com/memoneo/core/lib/server/http/middleware"
)

var validate *validator.Validate

type API struct {
	auth          auth.Auth
	authConfig    *auth.Config
	users         *users.Users
	logger        *logger.Logger
	validate      *validator.Validate
	authPublicKey interface{}
}

func NewService(logger *logger.Logger, auth auth.Auth, authConfig *auth.Config, users *users.Users) (*API, error) {
	validate := validator.New()

	publicKey := auth.PublicKey()

	return &API{auth, authConfig, users, logger, validate, publicKey}, nil
}

// AddHandlers adds the echo handlers that are part of this package.
func (api *API) AddHandlers(s *archhttp.EchoServer) {
	s.Echo.Use(echoMiddleware.CORSWithConfig(echoMiddleware.CORSConfig{
		AllowOrigins:     s.Config.AllowOrigins,
		AllowCredentials: true,
		AllowMethods:     []string{http.MethodGet, http.MethodPost},
	}))

	signingKey := api.authPublicKey

	cookieMiddleware := middleware.UserCookieAuth(api.logger)
	authMiddleware := middleware.JWTWithConfig(middleware.JWTConfig{
		SigningKey:    signingKey,
		SigningMethod: jwt.SigningMethodRS256.Name,
		ErrorHandlerWithContext: func(err error, c echo.Context) error {
			api.logger.Zap.Debugw("Unable to verify token", "errMessage", err.Error())

			return c.JSON(http.StatusUnauthorized, echo.Map{"message": "token is invalid"})
		},
	})

	authGroup := s.Echo.Group("/auth")
	authGroup.Use(cookieMiddleware)
	authGroup.Use(authMiddleware)

	s.Echo.GET("/publickey", api.getAuthPublicKey)
	s.Echo.POST("/login", api.login)
	s.Echo.POST("/register", api.register)
	authGroup.GET("", api.checkAuth)
}

// LoginRequestBody is the JSON body of a request to the login handler.
type LoginRequestBody struct {
	Mail     string `json:"mail"`
	Password string `json:"password"`
}

func (api *API) getAuthPublicKey(c echo.Context) error {
	return c.JSON(http.StatusOK, echo.Map{"publicKey": api.authPublicKey})
}

func (api *API) login(c echo.Context) error {
	body := new(LoginRequestBody)
	if err := c.Bind(body); err != nil {
		return err
	}
	mail := body.Mail
	password := body.Password

	token, err := api.performLogin(c, mail, password)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, echo.Map{"message": "Unknown user and password combination or auth backend is down."})
	}

	return c.JSON(http.StatusOK, echo.Map{"token": token})
}

func (api *API) performLogin(c echo.Context, mail string, password string) (string, error) {
	token, err := api.users.Login(mail, password)
	if err != nil {
		return "", err
	}

	cookie := new(http.Cookie)
	cookie.Name = "token"
	cookie.Value = token
	cookie.Domain = api.authConfig.AuthCookieDomain
	cookie.Expires = time.Now().Add(24 * time.Hour)
	cookie.Secure = true
	// should be temporary. check if available on https same domain
	cookie.SameSite = http.SameSiteNoneMode
	cookie.HttpOnly = true

	c.SetCookie(cookie)

	return token, nil
}

// RegisterRequestBody is the JSON body of a request to the register handler.
type RegisterRequestBody struct {
	User     *authmodels.FullUser `json:"user" validate:"required"`
	Password string               `json:"password" validate:"required"`
}

func (api *API) register(c echo.Context) error {
	body := new(RegisterRequestBody)
	if err := c.Bind(body); err != nil {
		return err
	}
	err := api.validate.Struct(body)
	if err != nil {
		return err
	}

	user := body.User
	api.logger.Zap.Infow("Handling registration attempt", "user", user)

	authUser := &auth.User{
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Mail:      user.Mail,
		Password:  body.Password,
	}
	dataUser := &models.User{}

	authUser, dataUser, err = api.users.CreateUser(authUser, dataUser)
	if err != nil {
		api.logger.Zap.Debugw("Failed to create user", "user", user, "err", err)
		return err
	}

	user = utils.MergeUser(authUser, dataUser)

	token, err := api.performLogin(c, user.Mail, body.Password)

	return c.JSON(http.StatusOK, echo.Map{"token": token, "user": user})
}

func (api *API) checkAuth(c echo.Context) error {
	token := c.Get("user").(*jwt.Token)

	claims := token.Claims.(jwt.MapClaims)
	idString := claims["sub"]
	firstName := claims["given_name"].(string)
	lastName := claims["family_name"].(string)
	mail := claims["email"].(string)

	id, err := uuid.FromString(idString.(string))
	if err != nil {
		return err
	}

	authUser := &auth.User{
		FirstName: firstName,
		LastName:  lastName,
		Mail:      mail,
	}

	dataUser, err := api.users.GetDataUserByAuthID(id)
	if err != nil {
		return err
	}

	fullUser := utils.MergeUser(authUser, dataUser)

	return c.JSON(http.StatusOK, echo.Map{
		"token":      token.Raw,
		"userId":     dataUser.ID,
		"authUserId": id,
		"user":       fullUser,
	})
}
