package users

import (
	uuid "github.com/gofrs/uuid"
	"github.com/memoneo/auth/internal/services/auth"
	"github.com/memoneo/core/lib/datastore"
	"github.com/memoneo/core/lib/logger"
	"github.com/memoneo/core/lib/models"
)

// Users struct holds all the dependencies required for the users package. And exposes all services
// provided by this package as its methods.
type Users struct {
	Repository UserRepository
	auth       auth.Auth
	logger     *logger.Logger
}

// NewService creates a new Users service.
func NewService(logger *logger.Logger, datastore *datastore.Datastore, auth auth.Auth) (*Users, error) {
	repo := UserRepository{datastore}

	w := &Users{repo, auth, logger}

	return w, nil
}

// CreateUser first creates a user on the Auth service and afterwards the user that represents the data in the apps.
func (u *Users) CreateUser(authUser *auth.User, user *models.User) (*auth.User, *models.User, error) {
	authUser, err := u.auth.CreateUser(authUser)
	if err != nil {
		u.logger.Zap.Debugw("Failed to create auth user",
			"authUser", authUser,
			"user", user,
			"err", err)
		return nil, nil, err
	}

	user.AuthID = authUser.ID
	user, err = u.Repository.create(user)
	if err != nil {
		u.logger.Zap.Debugw("Failed to create user in repository",
			"authUser", authUser,
			"user", user,
			"err", err)
		err2 := u.auth.DeleteUser(authUser)
		if err2 != nil {
			u.logger.Zap.Errorw("Unable to delete orphaned auth user",
				"err", err2.Error(),
				"authUserId", authUser.ID,
				"authUserMail", authUser.Mail)
		}

		return nil, nil, err
	}

	return authUser, user, nil
}

// Login logs a user into keycloak and returns the access token.
func (u *Users) Login(mail string, password string) (string, error) {
	return u.auth.Login(mail, password)
}

// GetAuthUserByMail retrieves an auth user by its mail.
func (u *Users) GetAuthUserByMail(mail string) (*auth.User, error) {
	return u.auth.GetUserByMail(mail)
}

// GetAuthUserByID retrieves an auth user by its id.
func (u *Users) GetAuthUserByID(id uuid.UUID) (*auth.User, error) {
	return u.auth.GetUserByID(id)
}

// GetDataUserByAuthID retrieves a data user by its authID.
func (u *Users) GetDataUserByAuthID(authID uuid.UUID) (*models.User, error) {
	return u.Repository.GetByAuthID(authID)
}

// GetDataUserByID retrieves a data user by its id.
func (u *Users) GetDataUserByID(id uuid.UUID) (*models.User, error) {
	return u.Repository.GetByID(id)
}
