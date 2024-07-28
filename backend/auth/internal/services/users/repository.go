package users

import (
	uuid "github.com/gofrs/uuid/v5"
	"github.com/nihiluis/memoneo2/core/lib/datastore"
	"github.com/nihiluis/memoneo2/core/lib/models"
)

// UserRepository enables CRUD ops on the db for the User objects.
type UserRepository struct {
	datastore *datastore.Datastore
}

func init() {
	//orm.RegisterTable((*models.WorkspaceAndUser)(nil))
}

func (r *UserRepository) create(user *models.User) (*models.User, error) {
	id, err := uuid.NewV4()
	if err != nil {
		return nil, err
	}

	user.ID = id

	_, err = r.datastore.DB.Model(user).Insert()
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (r *UserRepository) remove(user *models.User) error {
	_, err := r.datastore.DB.Model(user).Delete()

	return err
}

func (r *UserRepository) GetByID(id uuid.UUID) (*models.User, error) {
	user := new(models.User)

	err := r.datastore.DB.Model(user).
		Where("id = ?", id).
		Select()

	return user, err
}

func (r *UserRepository) GetByAuthID(authID uuid.UUID) (*models.User, error) {
	user := new(models.User)

	err := r.datastore.DB.Model(user).
		Where("auth_id = ?", authID).
		Select()

	return user, err
}
