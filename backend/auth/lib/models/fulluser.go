package models

import (
	"github.com/gofrs/uuid"
	"github.com/memoneo/core/lib/models"
)

// FullUser represents an authenticated user of the apps.
type FullUser struct {
	ID     uuid.UUID `json:"-"`
	AuthID uuid.UUID `json:"-"`

	Mail      string `json:"mail" validate:"required"`
	FirstName string `json:"firstName" validate:"required"`
	LastName  string `json:"lastName" validate:"required"`

	Level int `json:"level"`

	InvitedBy *models.User `json:"invitedBy"`
}
