package models

import (
	"time"

	"github.com/gofrs/uuid/v5"
)

// User represents a user of the apps.
type User struct {
	tableName struct{} `pg:"memouser"`

	ID     uuid.UUID `pg:",type:uuid,pk,default:uuid_generate_v4()"`
	AuthID uuid.UUID `pg:",type:uuid,unique:idx_auth_id"`

	Level int `json:"level" pg:",notnull,default:0"`

	InvitedBy   *User         `json:"invitedBy" pg:"-"`
	InvitedByID uuid.NullUUID `json:"-" pg:",type:uuid"`

	CreatedAt time.Time `json:"createdAt" pg:",default:now()"`
	//UpdatedAt time.Time `json:"updatedAt" pg:",default:now()"`
}
