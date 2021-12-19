package keypairs

import (
	uuid "github.com/gofrs/uuid"
	"github.com/memoneo/auth/lib/models"
	"github.com/memoneo/core/lib/datastore"
)

// KeypairRepository enables CRUD ops on the db for the Keypair objects.
type KeypairRepository struct {
	datastore *datastore.Datastore
}

func init() {
}

func (r *KeypairRepository) create(keypair *models.Keypair) (*models.Keypair, error) {
	_, err := r.datastore.DB.Model(keypair).Insert()
	if err != nil {
		return nil, err
	}

	return keypair, nil
}

func (r *KeypairRepository) remove(keypair *models.Keypair) error {
	_, err := r.datastore.DB.Model(keypair).Delete()

	return err
}

func (r *KeypairRepository) GetByID(id uuid.UUID) (*models.Keypair, error) {
	keypair := new(models.Keypair)

	err := r.datastore.DB.Model(keypair).
		Where("id = ?", id).
		Select()

	return keypair, err
}

func (r *KeypairRepository) GetByIDOptional(id uuid.UUID) (*models.Keypair, error) {
	var keypairs []models.Keypair

	err := r.datastore.DB.Model(keypairs).
		Where("id = ?", id).
		Select()

	if len(keypairs) == 0 {
		return nil, nil
	}

	return &keypairs[0], err
}
