package models

import (
	"time"

	"github.com/gofrs/uuid/v5"
)

// Document represents an object of the IT landscape.
type Document struct {
	tableName struct{} `pg:"document"`

	ID          uuid.UUID `pg:",type:uuid,pk,default:uuid_generate_v4()"`
	ExternalID  string
	Name        string `pg:",notnull"`
	Description string `pg:",notnull,default:''"`

	TypeID uuid.UUID `pg:",type:uuid,notnull"`
	Type   *DocumentType

	Values []*DocumentFieldValue `pg:"fk:document_id" json:"values"`

	CreatedAt time.Time `json:"createdAt" pg:",default:now()"`
	UpdatedAt time.Time `json:"updatedAt" pg:",default:now()"`
}

// DocumentType specifies the type of an object. E.g. an application or an IT component.
type DocumentType struct {
	tableName struct{} `pg:"document_type"`

	ID          uuid.UUID `pg:",type:uuid,pk,default:uuid_generate_v4()"`
	ExternalID  string    `pg:",notnull"`
	Name        string    `pg:",notnull"`
	Description string    `pg:",notnull,default:''"`
	Color       string    `pg:",notnull,default:'#ececec'"`

	Documents []*Document      `pg:"fk:type_id" json:"documents"`
	Fields    []*DocumentField `pg:"fk:type_id" json:"fields"`

	WorkspaceID uuid.UUID `pg:",type:uuid,notnull"`

	CreatedAt time.Time `json:"createdAt" pg:",default:now()"`
	UpdatedAt time.Time `json:"updatedAt" pg:",default:now()"`
}

// DocumentField represents a field that contains data for a Document.
type DocumentField struct {
	tableName struct{} `pg:"document_field"`

	ID          uuid.UUID `pg:",type:uuid,pk,default:uuid_generate_v4()"`
	ExternalID  string    `pg:",notnull"`
	Name        string    `pg:",notnull"`
	Description string    `pg:",notnull,default:''"`

	FieldType string `pg:",notnull"`

	TypeID uuid.UUID `pg:",type:uuid"`
	Type   *DocumentType

	CreatedAt time.Time `json:"createdAt" pg:",default:now()"`
	UpdatedAt time.Time `json:"updatedAt" pg:",default:now()"`
}

// DocumentFieldValue specifies the value of a DocumentField.
type DocumentFieldValue struct {
	tableName struct{} `pg:"document_field_value"`

	FieldID    uuid.UUID `pg:",type:uuid,unique:idx_document_id_field_id"`
	Field      *DocumentField
	DocumentID uuid.UUID `pg:",type:uuid,unique:idx_document_id_field_id"`
	Document   *Document
	Value      string

	CreatedAt time.Time `json:"createdAt" pg:",default:now()"`
	UpdatedAt time.Time `json:"updatedAt" pg:",default:now()"`
}

// DocumentFieldType represents the data type for a DocumentField and its value.
type DocumentFieldType struct {
	Name string
}

// DocumentMutation is currently unused.
type DocumentMutation struct {
}
