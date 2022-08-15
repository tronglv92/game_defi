package db

import (
	"context"
	"marketplace/util"
	"testing"

	"github.com/stretchr/testify/require"
)

func createRandomWeapon(store Store, state int64) (CreateWeaponTxResult, error) {
	abilities := []AbilityParams{}
	for j := 1; j <= 2; j++ {
		abilities = append(abilities, AbilityParams{
			Img:         util.RandomImage(),
			Name:        util.RandomName(),
			Level:       util.RandomLevel(),
			Description: util.RandomString(6),
		})
	}

	random := util.RandomNonce()

	result, err := store.CreateWeaponTx(context.Background(), CreateWeaponTxParams{
		Img:   util.RandomImage(),
		Name:  util.RandomName(),
		Type:  util.RandomType(),
		Level: util.RandomLevel(),
		Star:  util.RandomStar(),
		Price: util.RandomPrice(),
		State: state,
		Nonce: random,
		Stat: StatParams{
			Damage:   util.RandomFloat(1, 300),
			Speed:    util.RandomFloat(1, 300),
			Hp:       util.RandomFloat(1, 300),
			Critical: util.RandomFloat(1, 300),
		},
		Abilities: abilities,
	})
	return result, err
}
func checkTestCreateRandomWeapon(t *testing.T, result CreateWeaponTxResult, err error) {
	require.NoError(t, err)
	require.NotEmpty(t, result)

	// check weapon
	weapon := result.Weapon
	require.NotEmpty(t, weapon)
	require.NotZero(t, weapon.ID)
	require.NotZero(t, weapon.CreatedAt)

	// check weapon stat
	weaponStat := result.WeaponStat
	require.NotEmpty(t, weaponStat)
	require.Equal(t, weaponStat.WeaponID, weapon.ID)
	require.NotZero(t, weaponStat.ID)
	require.NotZero(t, weaponStat.CreatedAt)

	weaponAbilities := result.WeaponAbilities
	require.True(t, len(weaponAbilities) > 0)
	for j := 0; j < len(weaponAbilities); j++ {
		require.NotEmpty(t, weaponAbilities[j])
		require.Equal(t, weaponAbilities[j].WeaponID, weapon.ID)
		require.NotZero(t, weaponAbilities[j].ID)
		require.NotZero(t, weaponAbilities[j].CreatedAt)
	}
}
func TestCreateWeaponTx(t *testing.T) {
	store := NewStore(testDB)

	//run n concurrent transfer transactions
	n := 5

	errs := make(chan error)
	results := make(chan CreateWeaponTxResult)

	for i := 0; i < n; i++ {
		go func() {
			result, err := createRandomWeapon(store, util.Market)
			errs <- err
			results <- result
		}()
	}

	// check results
	// existed := make(map[int]bool)

	for i := 0; i < n; i++ {
		err := <-errs

		result := <-results

		checkTestCreateRandomWeapon(t, result, err)
	}
}

func transactionWeapon(t *testing.T, store Store, address string) (TransactionWeaponTxResult, error) {
	weapon, err := createRandomWeapon(store, util.Market)
	checkTestCreateRandomWeapon(t, weapon, err)
	result, err := store.TransactionWeaponTx(context.Background(), TransactionWeaponTxParams{
		WeaponId:    weapon.Weapon.ID,
		Hash:        util.RandomString(6),
		FromAddress: util.RandomString(6),
		ToAddress:   address,
		Price:       util.RandomPrice(),
		TokenId:     util.RandomInt(1, 100),
	})
	return result, err
}
func checkTesttransactionWeapon(t *testing.T, result TransactionWeaponTxResult, err error) {
	require.NoError(t, err)
	require.NotEmpty(t, result)

	// check weapon
	weapon := result.Weapon

	require.NotEmpty(t, weapon)
	require.NotZero(t, weapon.ID)
	require.NotZero(t, weapon.CreatedAt)
	require.Equal(t, weapon.State, util.Game)
	require.True(t, !weapon.Block)

	// check transaction weapon
	transactionWeapon := result.TransactionWeapon

	require.NotEmpty(t, transactionWeapon)
	require.Equal(t, transactionWeapon.WeaponID, weapon.ID)
	require.NotZero(t, transactionWeapon.ID)
	require.NotZero(t, transactionWeapon.CreatedAt)

	// check weapon nft
	weaponNft := result.WeaponNft
	require.NotEmpty(t, weaponNft)

	require.NotZero(t, weaponNft.ID)
	require.NotZero(t, weaponNft.CreatedAt)
	require.Equal(t, weaponNft.WeaponID, weapon.ID)
	require.Equal(t, weaponNft.AddressOwner, transactionWeapon.ToAddress)
}
func TestTransactionWeaponTx(t *testing.T) {
	store := NewStore(testDB)

	//run n concurrent transfer transactions
	n := 5

	errs := make(chan error)
	results := make(chan TransactionWeaponTxResult)

	for i := 0; i < n; i++ {
		go func() {
			result, err := transactionWeapon(t, store, util.RandomName())
			errs <- err
			results <- result
		}()
	}

	// check results
	// existed := make(map[int]bool)

	for i := 0; i < n; i++ {
		err := <-errs

		result := <-results

		checkTesttransactionWeapon(t, result, err)
	}
}

func TestEditWeaponSuccess(t *testing.T) {
	store := NewStore(testDB)

	//run n concurrent transfer transactions
	n := 5

	errs := make(chan error)
	results := make(chan UpdateWeaponTxResult)
	args := make(chan UpdateWeaponTxParams)
	for i := 0; i < n; i++ {
		go func() {
			weapon, err := createRandomWeapon(store, util.Market)
			abilities := []AbilityParams{}
			for j := 1; j <= 3; j++ {
				abilities = append(abilities, AbilityParams{
					Img:         util.RandomImage(),
					Name:        util.RandomName(),
					Level:       util.RandomLevel(),
					Description: util.RandomString(6),
				})
			}
			arg := UpdateWeaponTxParams{
				ID:    weapon.Weapon.ID,
				Img:   util.RandomImage(),
				Name:  util.RandomName(),
				Type:  util.RandomType(),
				Level: util.RandomLevel(),
				Star:  util.RandomStar(),
				Price: util.RandomPrice(),
				Nonce: util.RandomNonce(),

				Abilities: abilities,
				Stat: StatParams{
					Damage:   util.RandomFloat(1, 300),
					Speed:    util.RandomFloat(1, 300),
					Hp:       util.RandomFloat(1, 300),
					Critical: util.RandomFloat(1, 300),
				},
			}
			result, err := store.UpdateWeaponTx(context.Background(), arg)
			errs <- err
			results <- result
			args <- arg
		}()
	}
	for i := 0; i < n; i++ {
		err := <-errs

		result := <-results
		arg := <-args
		require.NoError(t, err)
		require.NotEmpty(t, result)

		// check weapon
		weapon := result.Weapon
		require.NotEmpty(t, weapon)
		require.NotZero(t, weapon.ID)
		require.NotZero(t, weapon.CreatedAt)
		require.Equal(t, weapon.Name, arg.Name)
		require.Equal(t, weapon.Img, arg.Img)
		require.Equal(t, weapon.Type, arg.Type)
		require.Equal(t, weapon.Level, arg.Level)
		require.Equal(t, weapon.Star, arg.Star)
		require.Equal(t, weapon.Price, arg.Price)
		require.Equal(t, weapon.Nonce, arg.Nonce)

		// check weapon stat
		weaponStat := result.WeaponStat
		require.NotEmpty(t, weaponStat)
		require.Equal(t, weaponStat.WeaponID, weapon.ID)
		require.NotZero(t, weaponStat.ID)
		require.NotZero(t, weaponStat.CreatedAt)
		require.Equal(t, weaponStat.Damage, arg.Stat.Damage)
		require.Equal(t, weaponStat.Speed, arg.Stat.Speed)
		require.Equal(t, weaponStat.Hp, arg.Stat.Hp)
		require.Equal(t, weaponStat.Critical, arg.Stat.Critical)

		weaponAbilities := result.WeaponAbilities
		require.Len(t, weaponAbilities, 3)
		require.Equal(t, len(weaponAbilities), len(arg.Abilities))

		for index, ability := range weaponAbilities {
			require.NotEmpty(t, ability)
			require.Equal(t, ability.WeaponID, weapon.ID)
			require.NotZero(t, ability.ID)
			require.NotZero(t, ability.CreatedAt)
			require.Equal(t, ability.Name, arg.Abilities[index].Name)
			require.Equal(t, ability.Img, arg.Abilities[index].Img)
			require.Equal(t, ability.Level, arg.Abilities[index].Level)
			require.Equal(t, ability.Description, arg.Abilities[index].Description)
		}

	}
}

func TestEditWeaponError(t *testing.T) {
	store := NewStore(testDB)

	//run n concurrent transfer transactions
	n := 5

	errs := make(chan error)
	results := make(chan UpdateWeaponTxResult)
	args := make(chan UpdateWeaponTxParams)
	for i := 0; i < n; i++ {
		go func() {
			abilities := []AbilityParams{}
			for j := 1; j <= 3; j++ {
				abilities = append(abilities, AbilityParams{
					Img:         util.RandomImage(),
					Name:        util.RandomName(),
					Level:       util.RandomLevel(),
					Description: util.RandomString(6),
				})
			}
			arg := UpdateWeaponTxParams{
				ID:    -1,
				Img:   util.RandomImage(),
				Name:  util.RandomName(),
				Type:  util.RandomType(),
				Level: util.RandomLevel(),
				Star:  util.RandomStar(),
				Price: util.RandomPrice(),
				Nonce: util.RandomNonce(),

				Abilities: abilities,
				Stat: StatParams{
					Damage:   util.RandomFloat(1, 300),
					Speed:    util.RandomFloat(1, 300),
					Hp:       util.RandomFloat(1, 300),
					Critical: util.RandomFloat(1, 300),
				},
			}
			result, err := store.UpdateWeaponTx(context.Background(), arg)
			errs <- err
			results <- result
			args <- arg
		}()
	}
	for i := 0; i < n; i++ {
		err := <-errs
		result := <-results

		require.Empty(t, result)
		require.Error(t, err)

	}
}
