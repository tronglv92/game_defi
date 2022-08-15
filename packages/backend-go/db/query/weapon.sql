-- name: CreateWeapon :one
INSERT INTO weapons (
  name, price,type,img,level,star,nonce,state
) VALUES (
  $1, $2,$3,$4,$5,$6,$7,$8
)
RETURNING *;

-- name: CreateWeaponStat :one
INSERT INTO weapon_stats(
  weapon_id,damage,speed,hp,critical
)VALUES(
   $1, $2,$3,$4,$5
) 
RETURNING *;

-- name: CreateWeaponAbility :one
INSERT INTO weapon_abilities(
  weapon_id,img,name,description,level
)VALUES(
   $1, $2,$3,$4,$5
) 
RETURNING *;



-- name: CreateWeaponNFT :one
INSERT INTO weapon_nft(
  weapon_id,
  token_id,
  address_owner
)VALUES(
   $1, $2,$3
) 
RETURNING *;
-- name: CreateTransactionWeapon :one
INSERT INTO transaction_weapon(
  weapon_id,
  token_id,
  hash,
  from_address,
  to_address,
  price
)VALUES(
   $1, $2,$3,$4,$5,$6
) 
RETURNING *;

-- name: UpdateWeaponNFT :one
UPDATE weapon_nft 
SET address_owner=$1
WHERE id=$2
RETURNING *;


-- -- name: FindWeaponByPK :one
-- SELECT sqlc.embed(weapon_abilities.*),weapons.id FROM weapons 
-- INNER JOIN weapon_abilities ON weapons.id=weapon_abilities.weapon_id
-- WHERE weapons.id = $1 AND weapons.state = $2 LIMIT 1;

-- name: FindWeaponByPK :one
select  row_to_json(row)
from (
    select * from view_weapons WHERE id = $1
) row LIMIT 1;

-- name: FindWeaponByOwnerAddress :many
select  row_to_json(row)
from (
    select * from view_weapons 
    INNER JOIN weapon_nft ON view_weapons.id=weapon_nft.weapon_id 
    WHERE 
      weapon_nft.address_owner=$3
    ORDER BY view_weapons.id
    LIMIT $1
    OFFSET $2
    
) row;

-- name: FilterWeapon :many
select  row_to_json(row)
from (
    select * from view_weapons
    WHERE (CASE WHEN @isStar::bool THEN star = ANY(@star::bigint[]) ELSE TRUE END)
    AND (CASE WHEN @isType::bool THEN type = ANY(@type::bigint[])  ELSE TRUE END)
    AND (CASE
          WHEN @isPriceBetween::bool THEN price BETWEEN @priceFrom AND @priceTo  
          WHEN @isPriceFrom::bool THEN price >= @priceFrom
          WHEN @isPriceTo::bool THEN price <= @priceTo
      ELSE TRUE END)
    ORDER BY id
    LIMIT $1
    OFFSET $2
    
) row;

-- name: UpdateWeapon :one
UPDATE weapons 
SET name=$1, price=$2,type=$3,img=$4,level=$5,star=$6,nonce=$7
WHERE id=$8
RETURNING *;

-- name: UpdateStateWeapon :one
UPDATE weapons 
SET state=$1
WHERE id=$2
RETURNING *;
-- name: BlockWeapon :one
UPDATE weapons 
SET block=TRUE
WHERE id=$1
RETURNING *;

-- name: UnBlockWeapon :one
UPDATE weapons 
SET block=FALSE
WHERE id=$1
RETURNING *;
-- name: UpdateStat :one
UPDATE weapon_stats 
SET damage=$1,speed=$2,hp=$3,critical=$4
WHERE id=$5
RETURNING *;

-- name: UpdateAblitity :one
UPDATE weapon_abilities 
SET img=$1,name=$2,description=$3,level=$4
WHERE id=$5
RETURNING *;

-- name: DeleteStat :exec
DELETE FROM weapon_stats WHERE weapon_id=$1;

-- name: DeleteAblitity :exec
DELETE FROM weapon_abilities WHERE weapon_id=$1;



