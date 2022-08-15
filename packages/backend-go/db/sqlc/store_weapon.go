package db

import (
	"context"
	"marketplace/util"
)

type StatParams struct {
	Damage   string `json:"damage"`
	Speed    string `json:"speed"`
	Hp       string `json:"hp"`
	Critical string `json:"critical"`
}
type AbilityParams struct {
	Img         string `json:"img"`
	Name        string `json:"name"`
	Level       int64  `json:"level"`
	Description string `json:"description"`
}

// CreateWeaponTxParams contains the input parameters of the create weapon transaction
type CreateWeaponTxParams struct {
	Img       string          `json:"img"`
	Name      string          `json:"name"`
	Type      int64           `json:"type"`
	Level     int64           `json:"level"`
	Star      int64           `json:"star"`
	Price     int64           `json:"price"`
	Nonce     int64           `json:"nonce"`
	State     int64           `json:"state"`
	Stat      StatParams      `json:"stat"`
	Abilities []AbilityParams `json:"abilities"`
}

type CreateWeaponTxResult struct {
	Weapon          Weapon          `json:"weapon"`
	WeaponStat      WeaponStat      `json:"stat"`
	WeaponAbilities []WeaponAbility `json:"abilities"`
}

func (store *SQLStore) CreateWeaponTx(ctx context.Context, arg CreateWeaponTxParams) (CreateWeaponTxResult, error) {
	var result CreateWeaponTxResult
	err := store.execTx(ctx, func(q *Queries) error {
		var err error
		result.Weapon, err = q.CreateWeapon(ctx, CreateWeaponParams{
			Name:  arg.Name,
			Img:   arg.Img,
			Price: arg.Price,
			Type:  arg.Type,
			Level: arg.Level,
			Star:  arg.Star,
			Nonce: arg.Nonce,
		})
		if err != nil {
			return err
		}

		result.WeaponStat, err = q.CreateWeaponStat(ctx, CreateWeaponStatParams{
			WeaponID: result.Weapon.ID,
			Damage:   arg.Stat.Damage,
			Speed:    arg.Stat.Speed,
			Hp:       arg.Stat.Hp,
			Critical: arg.Stat.Critical,
		})
		if err != nil {
			return err
		}

		for i := 0; i < len(arg.Abilities); i++ {
			ability := arg.Abilities[i]
			abilityResult, err := q.CreateWeaponAbility(ctx, CreateWeaponAbilityParams{
				WeaponID:    result.Weapon.ID,
				Img:         ability.Img,
				Name:        ability.Name,
				Description: ability.Description,
				Level:       ability.Level,
			})
			if err != nil {
				return err
			}
			result.WeaponAbilities = append(result.WeaponAbilities, abilityResult)
		}

		if err != nil {
			return err
		}

		// TODO: create weapon
		return nil
	})
	return result, err
}

type TransactionWeaponTxParams struct {
	WeaponId int64  `json:"weapon_id"`
	Hash     string `json:"hash"`

	FromAddress string `json:"from_address"`
	ToAddress   string `json:"to_address"`
	Price       int64  `json:"price"`
	TokenId     int64  `json:"token_id"`
}
type TransactionWeaponTxResult struct {
	WeaponNft         WeaponNft         `json:"weapon_nft"`
	Weapon            Weapon            `json:"weapon"`
	TransactionWeapon TransactionWeapon `json:"transaction_weapon"`
}

func (store *SQLStore) TransactionWeaponTx(ctx context.Context, arg TransactionWeaponTxParams) (TransactionWeaponTxResult, error) {
	var result TransactionWeaponTxResult
	err := store.execTx(ctx, func(q *Queries) error {
		var err error
		result.TransactionWeapon, err = q.CreateTransactionWeapon(ctx, CreateTransactionWeaponParams{
			WeaponID:    arg.WeaponId,
			TokenID:     arg.TokenId,
			Hash:        arg.Hash,
			FromAddress: arg.FromAddress,
			ToAddress:   arg.ToAddress,
			Price:       arg.Price,
		})
		if err != nil {
			return err
		}

		result.WeaponNft, err = q.CreateWeaponNFT(ctx, CreateWeaponNFTParams{
			WeaponID:     arg.WeaponId,
			TokenID:      arg.TokenId,
			AddressOwner: arg.ToAddress,
		})
		if err != nil {
			return err
		}

		result.Weapon, err = q.UpdateStateWeapon(ctx, UpdateStateWeaponParams{
			ID:    arg.WeaponId,
			State: util.Game,
		})
		if err != nil {
			return err
		}
		result.Weapon, err = q.UnBlockWeapon(ctx, arg.WeaponId)
		if err != nil {
			return err
		}
		// TODO: create weapon
		return nil
	})
	return result, err
}

type UpdateWeaponTxParams struct {
	ID    int64  `json:"id"`
	Img   string `json:"img"`
	Name  string `json:"name"`
	Type  int64  `json:"type"`
	Level int64  `json:"level"`
	Star  int64  `json:"star"`
	Price int64  `json:"price"`
	Nonce int64  `json:"nonce"`

	Stat      StatParams      `json:"stat"`
	Abilities []AbilityParams `json:"abilities"`
}
type UpdateWeaponTxResult struct {
	Weapon          Weapon          `json:"weapon"`
	WeaponStat      WeaponStat      `json:"stat"`
	WeaponAbilities []WeaponAbility `json:"abilities"`
}

func (store *SQLStore) UpdateWeaponTx(ctx context.Context, arg UpdateWeaponTxParams) (UpdateWeaponTxResult, error) {
	var result UpdateWeaponTxResult
	err := store.execTx(ctx, func(q *Queries) error {
		// update weapon
		weaponUpdate, err := q.UpdateWeapon(ctx, UpdateWeaponParams{
			ID:    arg.ID,
			Name:  arg.Name,
			Price: arg.Price,
			Type:  arg.Type,
			Img:   arg.Img,
			Level: arg.Level,
			Star:  arg.Star,
			Nonce: arg.Nonce,
		})
		if err != nil {
			return err
		}
		result.Weapon = weaponUpdate
		//remove old ablities
		err = q.DeleteAblitity(ctx, arg.ID)
		if err != nil {
			return err
		}

		//add new ablities
		for _, ability := range arg.Abilities {
			abilityResult, err := q.CreateWeaponAbility(ctx, CreateWeaponAbilityParams{
				WeaponID:    arg.ID,
				Img:         ability.Img,
				Name:        ability.Name,
				Description: ability.Description,
				Level:       ability.Level,
			})
			if err != nil {
				return err
			}
			result.WeaponAbilities = append(result.WeaponAbilities, abilityResult)
		}

		// remove old stat

		err = q.DeleteStat(ctx, arg.ID)
		if err != nil {
			return err
		}

		//add new stat
		stat, err := q.CreateWeaponStat(ctx, CreateWeaponStatParams{
			WeaponID: arg.ID,
			Damage:   arg.Stat.Damage,
			Speed:    arg.Stat.Speed,
			Hp:       arg.Stat.Hp,
			Critical: arg.Stat.Critical,
		})
		if err != nil {
			return err
		}
		result.WeaponStat = stat

		return nil
	})
	return result, err
}
