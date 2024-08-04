package keycloak

import (
	"context"
	"crypto/rsa"
	"errors"
	"fmt"
	"os"
	"sync"
	"time"

	"github.com/gofrs/uuid/v5"

	"github.com/Nerzal/gocloak/v13"
	"github.com/nihiluis/memoneo2/auth/internal/services/auth"
	"github.com/nihiluis/memoneo2/core/lib/datastore"
	"github.com/nihiluis/memoneo2/core/lib/logger"
)

// Keycloak implements the Auth interface.
type Keycloak struct {
	datastore        *datastore.Datastore
	client           *gocloak.GoCloak
	config           *Config
	token            *gocloak.JWT
	tokenLastUpdated time.Time
	logger           *logger.Logger
	Certs            interface{}
	publicKey        *rsa.PublicKey
	tokenMutex       *sync.Mutex
}

// Config struct holds all the configurations for accessing a keycloak instance.
type Config struct {
	Host string `json:"host,omitempty"`
	Port string `json:"port,omitempty"`

	ClientID     string `json:"clientId,omitempty"`
	ClientSecret string `json:"clientSecret,omitempty"`

	RealmName string `json:"realmName,omitempty"`
	Kid       string `json:"kid,omitempty"`

	AdminUserName string `json:"adminUsername,omitempty"`
	AdminPassword string `json:"adminPassword,omitempty"`
}

// NewService creates a new Keycloak service.
func NewService(logger *logger.Logger, datastore *datastore.Datastore, config *Config) (*Keycloak, error) {
	keycloakURL := config.Host

	if config.Port != "" {
		keycloakURL = fmt.Sprintf("%s:%s", config.Host, config.Port)
	}

	client := gocloak.NewClient(keycloakURL)
	proxyAuthHeader := os.Getenv("PROXY_AUTHORIZATION_HEADER")
	if proxyAuthHeader != "" {
		client.RestyClient().SetHeader("Proxy-Authorization", proxyAuthHeader)
	}

	ctx := context.Background()
	initialToken, err := getToken(ctx, config, client)
	if err != nil {
		return nil, err
	}

	certResult, err := client.GetCerts(ctx, config.RealmName)
	if err != nil {
		return nil, err
	}
	if certResult.Keys == nil || len(*certResult.Keys) == 0 {
		return nil, fmt.Errorf("there is no keys to decode the token")
	}
	key := findUsedKey(config.Kid, *certResult.Keys)
	if key == nil {
		return nil, fmt.Errorf("keycloak publicKey may not be nil")
	}
	rsaPublicKey, err := decodePublicKey(key.E, key.N)
	if err != nil {
		return nil, err
	}

	w := &Keycloak{
		logger:           logger,
		datastore:        datastore,
		client:           client,
		config:           config,
		token:            initialToken,
		tokenLastUpdated: time.Now(),
		publicKey:        rsaPublicKey,
		tokenMutex:       &sync.Mutex{},
	}

	return w, nil
}

func (k *Keycloak) PublicKey() interface{} {
	return k.publicKey
}

func getToken(ctx context.Context, config *Config, client *gocloak.GoCloak) (*gocloak.JWT, error) {
	token, err := client.LoginAdmin(ctx, config.AdminUserName, config.AdminPassword, "master")

	return token, err
}

func (k *Keycloak) getToken(ctx context.Context) (*gocloak.JWT, error) {
	now := time.Now()

	k.tokenMutex.Lock()

	if now.After(k.tokenLastUpdated.Add(time.Second * time.Duration(52))) {
		newToken, err := getToken(ctx, k.config, k.client)
		if err != nil {
			return nil, err
		}

		k.token = newToken
		k.tokenLastUpdated = now
	}
	newToken := *k.token

	k.tokenMutex.Unlock()

	return &newToken, nil
}

// CreateUser creates a new user on the keycloak instance.
func (k *Keycloak) CreateUser(user *auth.User) (*auth.User, error) {
	ctx := context.Background()
	token, err := k.getToken(ctx)
	if err != nil {
		k.logger.Zap.Debugw("Failed to get token",
			"err", err)
		return nil, err
	}

	enabled := true

	keycloakUser := gocloak.User{
		FirstName: &user.FirstName,
		LastName:  &user.LastName,
		Email:     &user.Mail,
		Enabled:   &enabled,
		Username:  &user.Mail,
	}

	idString, err := k.client.CreateUser(ctx, token.AccessToken, k.config.RealmName, keycloakUser)
	if err != nil {
		k.logger.Zap.Debugw("Failed to create keycloak user",
			"keycloakUser", keycloakUser,
			"err", err)
		return nil, err
	}

	id, err := uuid.FromString(idString)
	if err != nil {
		k.logger.Zap.Errorw("Unable to parse id from idString. Keycloak user must be reset.",
			"idString", idString,
			"keycloakUser", keycloakUser)
		return nil, err
	}
	user.ID = id

	err = k.client.SetPassword(ctx, token.AccessToken, idString, k.config.RealmName, user.Password, false)
	if err != nil {
		user.ID = id
		err2 := k.DeleteUser(user)
		if err2 != nil {
			k.logger.Zap.Errorw("Unable to delete orphaned keycloak user",
				"err", err2.Error(),
				"userId", user.ID,
				"userMail", user.Mail)
		}
		return nil, err
	}

	return user, nil
}

// ChangePassword changes the password for a user id.
func (k *Keycloak) ChangePassword(userId uuid.UUID, password string) error {
	ctx := context.Background()
	token, err := k.getToken(ctx)
	if err != nil {
		return err
	}

	err = k.client.SetPassword(ctx, token.AccessToken, userId.String(), k.config.RealmName, password, false)

	return err
}

// GetUserByMail retrieves a user from the keycloak instance by its mail.
func (k *Keycloak) GetUserByMail(mail string) (*auth.User, error) {
	ctx := context.Background()
	token, err := k.getToken(ctx)
	if err != nil {
		return nil, err
	}

	params := gocloak.GetUsersParams{Email: &mail}
	users, err := k.client.GetUsers(ctx, token.AccessToken, k.config.RealmName, params)
	if err != nil {
		return nil, err
	}

	if len(users) > 1 {
		panic(errors.New("keycloak should only return 1 user for a mail"))
	}

	return NewAuthUser(users[0]), nil
}

// GetUserByID retrieves a user from the keycloak instance by its id.
func (k *Keycloak) GetUserByID(id uuid.UUID) (*auth.User, error) {
	ctx := context.Background()
	token, err := k.getToken(ctx)
	if err != nil {
		return nil, err
	}

	user, err := k.client.GetUserByID(ctx, token.AccessToken, k.config.RealmName, id.String())
	if err != nil {
		return nil, err
	}

	return NewAuthUser(user), nil
}

// DeleteUser deletes a user from the keycloak instance by its id.
func (k *Keycloak) DeleteUserByID(id uuid.UUID) error {
	ctx := context.Background()
	token, err := k.getToken(ctx)
	if err != nil {
		return err
	}

	err = k.client.DeleteUser(ctx, token.AccessToken, k.config.RealmName, id.String())
	if err != nil {
		return err
	}

	return nil
}

// DeleteUser deletes a user from the keycloak instance by its id.
func (k *Keycloak) DeleteUser(user *auth.User) error {
	return k.DeleteUserByID(user.ID)
}

func (k *Keycloak) Login(mail string, password string) (string, error) {
	ctx := context.Background()

	token, err := k.client.Login(ctx, k.config.ClientID, k.config.ClientSecret, k.config.RealmName, mail, password)
	if err != nil {
		return "", err
	}

	return token.AccessToken, nil
}

func (k *Keycloak) CheckToken(token string) error {
	const tokenNotActiveMessage = "token isn't active"

	ctx := context.Background()

	tokenValidation, _, err := k.client.DecodeAccessToken(ctx, token, k.config.RealmName)
	if err != nil {
		return err
	}

	//claims := (tokenValidation.Claims).(jwt.MapClaims)
	//claims["name"] = "Jon Snow"

	// rptResult, err := k.client.RetrospectToken(ctx, token, k.config.ClientID, k.config.ClientSecret, k.config.RealmName)
	// if err != nil {
	// 	return err
	// }

	if !tokenValidation.Valid {
		return errors.New(tokenNotActiveMessage)
	}

	//permissions := rptResult.Permissions
	return nil
}

func (k *Keycloak) RetrieveAuthUserFromToken(token string) (*auth.User, error) {
	ctx := context.Background()

	userInfo, err := k.client.GetUserInfo(ctx, token, k.config.RealmName)

	id, err := uuid.FromString(*userInfo.Sub)
	if err != nil {
		return nil, err
	}

	user := &auth.User{
		ID:        id,
		FirstName: *userInfo.GivenName,
		LastName:  *userInfo.FamilyName,
		Mail:      *userInfo.Email,
	}

	return user, nil
}
