package keypairs

import (
	"github.com/gofrs/uuid"
	"github.com/memoneo/auth/lib/models"
	"github.com/memoneo/core/lib/datastore"
	"github.com/memoneo/core/lib/logger"
)

// Keypairs struct holds all the dependencies required for the keypairs package. And exposes all services
// provided by this package as its methods.
type Keypairs struct {
	Repository KeypairRepository
	logger     *logger.Logger
}

// NewService creates a new Keypairs service.
func NewService(logger *logger.Logger, datastore *datastore.Datastore) (*Keypairs, error) {
	repo := KeypairRepository{datastore}

	w := &Keypairs{repo, logger}

	return w, nil
}

// CreateKeypair first creates a keypair.
func (u *Keypairs) CreateKeypair(keypair *models.Keypair) (*models.Keypair, error) {
	keypair, err := u.Repository.create(keypair)
	if err != nil {
		u.logger.Zap.Debugw("Failed to create keypair in repository",
			"keypair", keypair,
			"err", err)

		return nil, err
	}

	return keypair, nil
}

// GetKeypair retrieves the keypair from the database via the user id
func (u *Keypairs) GetKeypair(id uuid.UUID) (*models.Keypair, error) {
	keypair, err := u.Repository.GetByIDOptional(id)
	if err != nil {
		u.logger.Zap.Debugw("Failed to retrieve keypair for user id",
			"userId", id,
			"err", err)

		return nil, err
	}

	return keypair, nil
}
