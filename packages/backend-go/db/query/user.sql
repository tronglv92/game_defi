-- name: FindUserByAddress :one
SELECT * FROM users
WHERE public_address = $1 LIMIT 1;
-- name: CreateUser :one
INSERT INTO users (
  username, public_address,nonce
) VALUES (
  $1, $2,$3
)
RETURNING *;

-- name: FindUserByPk :one
SELECT * FROM users
WHERE id = $1 LIMIT 1;

-- name: UpdateUserNonce :one
UPDATE users 
SET nonce=$1
WHERE id=$2
RETURNING *;

