package middleware

import (
	"github.com/labstack/echo/v4"
	"github.com/memoneo/core/lib/logger"
)

func UserCookieAuth(logger *logger.Logger) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			req := c.Request()

			if req.Header.Get("Authorization") != "" {
				logger.Zap.Debugw("found Authorization header")
				return next(c)
			}

			cookie, err := c.Cookie("token")

			if err != nil || cookie.Value == "" {
				logger.Zap.Debugw("no cookie found in request.", "err", err.Error())

				return next(c)
			}

			logger.Zap.Debugw("found cookie token in request", "token", cookie.Value)

			token := cookie.Value

			req.Header.Set("Authorization", "Bearer "+token)

			return next(c)
		}
	}
}
