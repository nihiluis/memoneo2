package models

import (
	"time"

	"github.com/gofrs/uuid"
)

// Enckey holds the encrypted private and the public key which are used to encrypt parts of the data.
type Enckey struct {
	tableName struct{} `pg:"enckey"`

	ID uuid.UUID `json:"id" pg:",type:uuid,pk"`

	Key  string `json:"key" pg:",type:text"`
	Salt string `json:"salt" pg:",type:text"`

	CreatedAt time.Time `json:"createdAt" pg:",default:now()"`
	//UpdatedAt time.Time `json:"updatedAt" pg:",default:now()"`
}
