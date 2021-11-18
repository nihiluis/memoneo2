package middleware

import (
	"fmt"
	"net/http"

	"github.com/dghubble/sling"
	"github.com/gofrs/uuid"
	"github.com/labstack/echo/v4"
	"github.com/memoneo/core/lib/models"
)

type UserAuthConfig struct {
	AuthEndpointURL string
	AuthUserIDKey   string
	DataUserIDKey   string
	UserKey         string
}

func UserAuthWithConfig(config *UserAuthConfig) echo.MiddlewareFunc {
	if config.AuthUserIDKey == "" {
		config.AuthUserIDKey = "authUserID"
	}
	if config.DataUserIDKey == "" {
		config.DataUserIDKey = "dataUserID"
	}
	if config.UserKey == "" {
		config.UserKey = "user"
	}

	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			authHeader := c.Request().Header.Get("Authorization")

			authData, err := callAuth(fmt.Sprintf("%s/auth", config.AuthEndpointURL), authHeader)
			if err != nil {
				return err
			}

			if authData.User == nil {
				return c.JSON(http.StatusUnauthorized, echo.Map{"message": "unauthorized"})
			}

			c.Set(config.AuthUserIDKey, authData.AuthUserID)
			c.Set(config.DataUserIDKey, authData.DataUserID)
			c.Set(config.UserKey, authData.User)

			return next(c)
		}
	}
}

type AuthData struct {
	AuthUserID uuid.UUID    `json:"authUserId"`
	DataUserID uuid.UUID    `json:"userId"`
	User       *models.User `json:"user"`
}

func callAuth(url string, authHeader string) (*AuthData, error) {
	data := new(AuthData)

	_, err := sling.New().Set("Authorization", authHeader).Get(url).ReceiveSuccess(data)
	if err != nil {
		return nil, err
	}

	return data, nil
}
