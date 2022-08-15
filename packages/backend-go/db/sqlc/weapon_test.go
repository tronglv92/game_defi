package db

import (
	"context"
	"encoding/json"
	"marketplace/util"
	"strconv"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
)

type Stat struct {
	ID        int64     `json:"id"`
	WeaponID  int64     `json:"weapon_id"`
	Damage    float64   `json:"damage"`
	Speed     float64   `json:"speed"`
	Hp        float64   `json:"hp"`
	Critical  float64   `json:"critical"`
	CreatedAt time.Time `json:"created_at"`
}
type ViewWeaponResult struct {
	ID           int64           `json:"id"`
	Name         string          `json:"name"`
	Price        int64           `json:"price"`
	Type         int64           `json:"type"`
	Img          string          `json:"img"`
	Level        int64           `json:"level"`
	Star         int64           `json:"star"`
	Nonce        int64           `json:"nonce"`
	State        int64           `json:"state"`
	CreatedAt    time.Time       `json:"created_at"`
	Stat         Stat            `json:"stat"`
	Abilities    []WeaponAbility `json:"abilities"`
	AddressOwner string          `json:"address_owner"`
}

func TestFindWeaponByPK(t *testing.T) {

	store := NewStore(testDB)
	weapon1, err := createRandomWeapon(store, util.Market)
	checkTestCreateRandomWeapon(t, weapon1, err)

	result, err := testQueries.FindWeaponByPK(context.Background(), weapon1.Weapon.ID)
	require.NoError(t, err)
	require.NotEmpty(t, result)

	var weaponResult ViewWeaponResult
	err = json.Unmarshal(result, &weaponResult)
	require.NoError(t, err)

	require.NoError(t, err)
	require.NotEmpty(t, weaponResult)
	require.NotEmpty(t, weaponResult.Stat)
	require.Equal(t, len(weapon1.WeaponAbilities), len(weaponResult.Abilities))

	// check weapon
	require.Equal(t, weapon1.Weapon.ID, weaponResult.ID)
	require.Equal(t, weapon1.Weapon.Img, weaponResult.Img)
	require.Equal(t, weapon1.Weapon.Name, weaponResult.Name)
	require.Equal(t, weapon1.Weapon.Price, weaponResult.Price)
	require.Equal(t, weapon1.Weapon.Level, weaponResult.Level)
	require.Equal(t, weapon1.Weapon.Star, weaponResult.Star)
	require.Equal(t, weapon1.Weapon.Nonce, weaponResult.Nonce)
	require.Equal(t, weapon1.Weapon.State, weaponResult.State)

	require.WithinDuration(t, weapon1.Weapon.CreatedAt, weaponResult.CreatedAt, time.Second)

	// check weapon stats
	damge, err := strconv.ParseFloat(weapon1.WeaponStat.Damage, 64)
	hp, err := strconv.ParseFloat(weapon1.WeaponStat.Hp, 64)
	speed, err := strconv.ParseFloat(weapon1.WeaponStat.Speed, 64)
	critical, err := strconv.ParseFloat(weapon1.WeaponStat.Critical, 64)

	require.Equal(t, weapon1.WeaponStat.ID, weaponResult.Stat.ID)
	require.Equal(t, damge, weaponResult.Stat.Damage)
	require.Equal(t, hp, weaponResult.Stat.Hp)
	require.Equal(t, speed, weaponResult.Stat.Speed)
	require.Equal(t, critical, weaponResult.Stat.Critical)
	require.Equal(t, weapon1.WeaponStat.WeaponID, weaponResult.Stat.WeaponID)
	require.WithinDuration(t, weapon1.WeaponStat.CreatedAt, weaponResult.Stat.CreatedAt, time.Second)

	// check weapon abilities
	for i := 0; i < len(weapon1.WeaponAbilities); i++ {
		require.Equal(t, weapon1.WeaponAbilities[i].ID, weaponResult.Abilities[i].ID)
		require.Equal(t, weapon1.WeaponAbilities[i].WeaponID, weaponResult.Abilities[i].WeaponID)
		require.Equal(t, weapon1.WeaponAbilities[i].Img, weaponResult.Abilities[i].Img)
		require.Equal(t, weapon1.WeaponAbilities[i].Name, weaponResult.Abilities[i].Name)
		require.Equal(t, weapon1.WeaponAbilities[i].Description, weaponResult.Abilities[i].Description)
		require.Equal(t, weapon1.WeaponAbilities[i].Level, weaponResult.Abilities[i].Level)
		require.WithinDuration(t, weapon1.WeaponAbilities[i].CreatedAt, weaponResult.Abilities[i].CreatedAt, time.Second)
	}

}

func TestFilterWeaponNoParam(t *testing.T) {
	results, err := testQueries.FilterWeapon(context.Background(), FilterWeaponParams{
		Limit:  5,
		Offset: 5,
	})

	require.NoError(t, err)
	require.NotEmpty(t, results)
	require.Len(t, results, 5)
}
func TestFullFilterPriceBetweenWeapon(t *testing.T) {
	store := NewStore(testDB)

	weapon1, err := createRandomWeapon(store, util.Market)
	checkTestCreateRandomWeapon(t, weapon1, err)

	weapon2, err := createRandomWeapon(store, util.Market)
	checkTestCreateRandomWeapon(t, weapon2, err)

	weapon3, err := createRandomWeapon(store, util.Market)
	checkTestCreateRandomWeapon(t, weapon3, err)

	prices := []int64{weapon1.Weapon.Price, weapon2.Weapon.Price, weapon3.Weapon.Price}
	min, max := util.FindMinAndMax(prices)
	types := []int64{weapon1.Weapon.Type, weapon2.Weapon.Type, weapon3.Weapon.Type}
	stars := []int64{weapon1.Weapon.Star, weapon2.Weapon.Star, weapon3.Weapon.Star}
	results, err := testQueries.FilterWeapon(context.Background(), FilterWeaponParams{
		Isstar:         true,
		Istype:         true,
		Type:           types,
		Star:           stars,
		Pricefrom:      min,
		Priceto:        max,
		Ispricebetween: true,
		Limit:          5,
		Offset:         0,
	})

	require.NoError(t, err)
	require.NotEmpty(t, results)
	require.Len(t, results, 5)

	for i := 0; i < len(results); i++ {
		var weaponResult ViewWeaponResult
		err = json.Unmarshal(results[i], &weaponResult)
		require.NoError(t, err)
		require.NotEmpty(t, weaponResult)
		require.NotEmpty(t, weaponResult.Stat)
		require.True(t, len(weaponResult.Abilities) > 0)

		require.True(t, weaponResult.Price >= min)
		require.True(t, weaponResult.Price <= max)
		require.Contains(t, types, weaponResult.Type)
		require.Contains(t, stars, weaponResult.Star)
	}

}
func TestFilterNoPriceWeapon(t *testing.T) {
	store := NewStore(testDB)
	weapon1, err := createRandomWeapon(store, util.Market)
	checkTestCreateRandomWeapon(t, weapon1, err)

	weapon2, err := createRandomWeapon(store, util.Market)
	checkTestCreateRandomWeapon(t, weapon2, err)

	weapon3, err := createRandomWeapon(store, util.Market)
	checkTestCreateRandomWeapon(t, weapon3, err)

	types := []int64{weapon1.Weapon.Type, weapon2.Weapon.Type, weapon3.Weapon.Type}
	stars := []int64{weapon1.Weapon.Star, weapon2.Weapon.Star, weapon3.Weapon.Star}
	results, err := testQueries.FilterWeapon(context.Background(), FilterWeaponParams{
		Isstar: true,
		Istype: true,
		Type:   types,
		Star:   stars,
		Limit:  5,
		Offset: 5,
	})

	require.NoError(t, err)
	require.NotEmpty(t, results)
	require.Len(t, results, 5)

	for i := 0; i < len(results); i++ {
		var weaponResult ViewWeaponResult
		err = json.Unmarshal(results[i], &weaponResult)
		require.NoError(t, err)
		require.NotEmpty(t, weaponResult)
		require.NotEmpty(t, weaponResult.Stat)
		require.True(t, len(weaponResult.Abilities) > 0)

		require.Contains(t, types, weaponResult.Type)
		require.Contains(t, stars, weaponResult.Star)
	}

}
func TestFilterGtePriceFromWeapon(t *testing.T) {
	store := NewStore(testDB)
	weapon1, err := createRandomWeapon(store, util.Market)
	checkTestCreateRandomWeapon(t, weapon1, err)

	weapon2, err := createRandomWeapon(store, util.Market)
	checkTestCreateRandomWeapon(t, weapon2, err)

	weapon3, err := createRandomWeapon(store, util.Market)
	checkTestCreateRandomWeapon(t, weapon3, err)

	prices := []int64{weapon1.Weapon.Price, weapon2.Weapon.Price, weapon3.Weapon.Price}
	min, _ := util.FindMinAndMax(prices)
	types := []int64{weapon1.Weapon.Type, weapon2.Weapon.Type, weapon3.Weapon.Type}
	stars := []int64{weapon1.Weapon.Star, weapon2.Weapon.Star, weapon3.Weapon.Star}
	results, err := testQueries.FilterWeapon(context.Background(), FilterWeaponParams{
		Isstar:      true,
		Istype:      true,
		Type:        types,
		Star:        stars,
		Ispricefrom: true,
		Pricefrom:   min,
		Limit:       5,
		Offset:      0,
	})

	require.NoError(t, err)
	require.NotEmpty(t, results)
	require.Len(t, results, 5)

	for i := 0; i < len(results); i++ {
		var weaponResult ViewWeaponResult
		err = json.Unmarshal(results[i], &weaponResult)
		require.NoError(t, err)
		require.NotEmpty(t, weaponResult)
		require.NotEmpty(t, weaponResult.Stat)
		require.True(t, len(weaponResult.Abilities) > 0)

		require.Contains(t, types, weaponResult.Type)
		require.Contains(t, stars, weaponResult.Star)
		require.True(t, weaponResult.Price >= min)
	}

}
func TestFilterLtePriceToWeapon(t *testing.T) {
	store := NewStore(testDB)
	weapon1, err := createRandomWeapon(store, util.Market)
	checkTestCreateRandomWeapon(t, weapon1, err)

	weapon2, err := createRandomWeapon(store, util.Market)
	checkTestCreateRandomWeapon(t, weapon2, err)

	weapon3, err := createRandomWeapon(store, util.Market)
	checkTestCreateRandomWeapon(t, weapon3, err)

	prices := []int64{weapon1.Weapon.Price, weapon2.Weapon.Price, weapon3.Weapon.Price}
	_, max := util.FindMinAndMax(prices)
	types := []int64{weapon1.Weapon.Type, weapon2.Weapon.Type, weapon3.Weapon.Type}
	stars := []int64{weapon1.Weapon.Star, weapon2.Weapon.Star, weapon3.Weapon.Star}
	results, err := testQueries.FilterWeapon(context.Background(), FilterWeaponParams{
		Isstar:    true,
		Istype:    true,
		Type:      types,
		Star:      stars,
		Ispriceto: true,
		Priceto:   max,
		Limit:     5,
		Offset:    5,
	})

	require.NoError(t, err)
	require.NotEmpty(t, results)
	require.Len(t, results, 5)

	for i := 0; i < len(results); i++ {
		var weaponResult ViewWeaponResult
		err = json.Unmarshal(results[i], &weaponResult)
		require.NoError(t, err)
		require.NotEmpty(t, weaponResult)
		require.NotEmpty(t, weaponResult.Stat)
		require.True(t, len(weaponResult.Abilities) > 0)

		require.Contains(t, types, weaponResult.Type)
		require.Contains(t, stars, weaponResult.Star)
		require.True(t, weaponResult.Price <= max)
	}

}
func TestFindWeaponByOwnerAddress(t *testing.T) {
	store := NewStore(testDB)
	addressOwner := util.RandomName()
	for i := 0; i < 5; i++ {
		transaction, err := transactionWeapon(t, store, addressOwner)
		checkTesttransactionWeapon(t, transaction, err)
	}

	arg := FindWeaponByOwnerAddressParams{

		Offset:       0,
		Limit:        5,
		AddressOwner: addressOwner,
	}
	results, err := testQueries.FindWeaponByOwnerAddress(context.Background(), arg)

	require.NoError(t, err)
	require.NotEmpty(t, results)
	require.Len(t, results, 5)

	for _, result := range results {
		var weaponResult ViewWeaponResult
		err = json.Unmarshal(result, &weaponResult)
		require.NoError(t, err)
		require.NotEmpty(t, weaponResult)
		require.NotEmpty(t, weaponResult.Stat)
		require.True(t, len(weaponResult.Abilities) > 0)

		require.Equal(t, weaponResult.AddressOwner, addressOwner)
	}

}
