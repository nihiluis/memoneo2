package enckeys

import (
	uuid "github.com/gofrs/uuid"
	"github.com/memoneo/auth/lib/models"
	"github.com/memoneo/core/lib/datastore"
)

// EnckeyRepository enables CRUD ops on the db for the Keypair objects.
type EnckeyRepository struct {
	datastore *datastore.Datastore
}

func init() {
}

func (r *EnckeyRepository) create(enckey *models.Enckey) (*models.Enckey, error) {
	_, err := r.datastore.DB.Model(enckey).Insert()
	if err != nil {
		return nil, err
	}

	return enckey, nil
}

func (r *EnckeyRepository) remove(enckey *models.Enckey) error {
	_, err := r.datastore.DB.Model(enckey).Delete()

	return err
}

func (r *EnckeyRepository) GetByID(id uuid.UUID) (*models.Enckey, error) {
	enckey := new(models.Enckey)

	err := r.datastore.DB.Model(enckey).
		Where("id = ?", id).
		Select()

	return enckey, err
}

func (r *EnckeyRepository) GetByIDOptional(id uuid.UUID) (*models.Enckey, error) {
	var enckeys []models.Enckey

	err := r.datastore.DB.Model(enckeys).
		Where("id = ?", id).
		Select()

	if len(enckeys) == 0 {
		return nil, nil
	}

	return &enckeys[0], err
}
