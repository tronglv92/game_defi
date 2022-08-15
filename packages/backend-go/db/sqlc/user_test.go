package db

import (
	"context"
	"marketplace/util"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
)

func createRandomUser(t *testing.T) User {
	arg := CreateUserParams{
		Username:      util.RandomName(),
		PublicAddress: util.RandomName(),
		Nonce:         util.RandomNonce(),
	}
	user, err := testQueries.CreateUser(context.Background(), arg)
	require.NoError(t, err)
	require.NotEmpty(t, user)

	require.Equal(t, arg.Username, user.Username)
	require.Equal(t, arg.PublicAddress, user.PublicAddress)
	require.Equal(t, arg.Nonce, user.Nonce)
	require.NotZero(t, user.CreatedAt)

	return user
}
func TestCreateUser(t *testing.T) {
	createRandomUser(t)
}
func TestFindUserByPk(t *testing.T) {
	user1 := createRandomUser(t)
	user2, err := testQueries.FindUserByPk(context.Background(), user1.ID)
	require.NoError(t, err)
	require.NotEmpty(t, user2)

	require.Equal(t, user1.Username, user2.Username)
	require.Equal(t, user1.PublicAddress, user2.PublicAddress)

	require.Equal(t, user1.Nonce, user2.Nonce)
	require.WithinDuration(t, user1.CreatedAt, user2.CreatedAt, time.Second)
}

func TestFindUserByAddress(t *testing.T) {
	user1 := createRandomUser(t)
	user2, err := testQueries.FindUserByAddress(context.Background(), user1.PublicAddress)
	require.NoError(t, err)
	require.NotEmpty(t, user2)

	require.Equal(t, user1.Username, user2.Username)
	require.Equal(t, user1.PublicAddress, user2.PublicAddress)

	require.Equal(t, user1.Nonce, user2.Nonce)
	require.WithinDuration(t, user1.CreatedAt, user2.CreatedAt, time.Second)
}
func TestUpdateUserNone(t *testing.T) {
	user1 := createRandomUser(t)
	arg := UpdateUserNonceParams{
		ID:    user1.ID,
		Nonce: util.RandomNonce(),
	}
	user2, err := testQueries.UpdateUserNonce(context.Background(), arg)
	require.NoError(t, err)
	require.NotEmpty(t, user2)

	require.Equal(t, user2.Nonce, arg.Nonce)
}
