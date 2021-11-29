package models

import (
	"time"

	"github.com/gofrs/uuid"
)

// User represents a user of the apps
type User struct {
	tableName struct{}

	ID     uuid.UUID `json:"-"`
	AuthID uuid.UUID `json:"-"`

	Mail string `json:"mail"`

	Level int `json:"level"`

	InvitedBy   *User         `json:"invitedBy"`
	InvitedByID uuid.NullUUID `json:"-"`

	CreatedAt time.Time `json:"createdAt"`
	//UpdatedAt time.Time `json:"updatedAt" pg:",default:now()"`
}
