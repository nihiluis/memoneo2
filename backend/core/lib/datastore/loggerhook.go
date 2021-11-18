package datastore

import (
	"context"
	"fmt"

	"github.com/go-pg/pg/v10"
)

type DBLoggerHook struct{}

func (d DBLoggerHook) BeforeQuery(c context.Context, q *pg.QueryEvent) (context.Context, error) {
	return c, nil
}

func (d DBLoggerHook) AfterQuery(c context.Context, q *pg.QueryEvent) error {
	v, _ := q.FormattedQuery()

	fmt.Println(string(v))
	return nil
}
