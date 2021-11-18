package datastore

import (
	"os"
	"strings"

	"github.com/go-pg/pg/v10"
	"github.com/go-pg/pg/v10/orm"
)

type Datastore struct {
	DB *pg.DB
}

// NewService returns a new instance of PG
func NewService(cfg *Config) (*Datastore, error) {
	databaseURL := strings.TrimSpace(os.Getenv("DATABASE_URL"))
	if databaseURL == "" {
		databaseURL = cfg.ConnURL()
	}

	opt, err := pg.ParseURL(databaseURL)
	if err != nil {
		return nil, err
	}

	db := pg.Connect(opt)

	datastore := Datastore{db}

	return &datastore, nil
}

func (datastore *Datastore) CreateSchema(models []interface{}) error {
	for _, model := range models {
		err := datastore.DB.Model(model).CreateTable(&orm.CreateTableOptions{IfNotExists: true})
		if err != nil {
			return err
		}
	}
	return nil
}
