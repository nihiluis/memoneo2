package models

import (
	"time"

	"github.com/gofrs/uuid"
)

// Keypair holds the encrypted private and the public key which are used to encrypt parts of the data.
type Keypair struct {
	tableName struct{} `pg:"keypair"`

	ID uuid.UUID `pg:",type:uuid,pk"`

	PubKey     string `pg:",type:text"`
	PrivateKey string `pg:",type:text"`

	CreatedAt time.Time `json:"createdAt" pg:",default:now()"`
	//UpdatedAt time.Time `json:"updatedAt" pg:",default:now()"`
}
