package middleware

import (
	"errors"
	"strconv"

	"github.com/labstack/echo/v4"
	"github.com/memoneo/core/lib/models"
)

type UserLevelConfig struct {
	RequiredLevel int
}

func UserLevelWithConfig(config *UserLevelConfig, authConfig *UserAuthConfig) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			user, ok := c.Get(authConfig.UserKey).(*models.User)
			if !ok {
				return errors.New("user must be present in context")
			}

			if user.Level < config.RequiredLevel {
				return errors.New("not authorized, level too low: " + strconv.FormatInt(int64(user.Level), 2))
			}

			return next(c)
		}
	}
}
