package models

import (
	"github.com/gofrs/uuid/v5"
	"github.com/nihiluis/memoneo2/core/lib/models"
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
