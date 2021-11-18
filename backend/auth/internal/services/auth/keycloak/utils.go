package keycloak

import (
	"bytes"
	"crypto/rsa"
	"encoding/base64"
	"encoding/binary"
	"math/big"

	"github.com/Nerzal/gocloak/v7"
	"github.com/pkg/errors"
)

func findUsedKey(usedKeyID string, keys []gocloak.CertResponseKey) *gocloak.CertResponseKey {
	for _, key := range keys {
		if *(key.Kid) == usedKeyID {
			return &key
		}
	}

	return nil
}

// this could help too
// https://stackoverflow.com/questions/39410808/how-to-convert-a-interface-into-type-rsa-publickey-golang
func decodePublicKey(e, n *string) (*rsa.PublicKey, error) {
	const errMessage = "could not decode public key"

	decN, err := base64.RawURLEncoding.DecodeString(*n)
	if err != nil {
		return nil, errors.Wrap(err, errMessage)
	}

	nInt := big.NewInt(0)
	nInt.SetBytes(decN)

	decE, err := base64.RawURLEncoding.DecodeString(*e)
	if err != nil {
		return nil, errors.Wrap(err, errMessage)
	}

	var eBytes []byte
	if len(decE) < 8 {
		eBytes = make([]byte, 8-len(decE), 8)
		eBytes = append(eBytes, decE...)
	} else {
		eBytes = decE
	}

	eReader := bytes.NewReader(eBytes)
	var eInt uint64
	err = binary.Read(eReader, binary.BigEndian, &eInt)
	if err != nil {
		return nil, errors.Wrap(err, errMessage)
	}

	pKey := rsa.PublicKey{N: nInt, E: int(eInt)}
	return &pKey, nil
}
