CREATE TABLE "users" (
  "id" BIGSERIAL PRIMARY KEY NOT NULL,
  "nonce" bigint NOT NULL,
  "public_address" varchar UNIQUE NOT NULL,
  "username" varchar UNIQUE NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);



CREATE TABLE "weapons" (
  "id" BIGSERIAL PRIMARY KEY NOT NULL,
  "name" varchar NOT NULL,
  "price" bigint NOT NULL,
  "type" bigint NOT NULL,
  "img" varchar NOT NULL,
  "level" bigint NOT NULL,
  "star" bigint NOT NULL,
  "nonce" bigint NOT NULL,
  "state" bigint NOT NULL DEFAULT 0,
  "block" BOOLEAN NOT NULL DEFAULT false,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "weapon_stats" (
  "id" BIGSERIAL PRIMARY KEY NOT NULL,
  "weapon_id" bigint NOT NULL,
  "damage" decimal NOT NULL,
  "speed" decimal NOT NULL,
  "hp" decimal NOT NULL,
  "critical" decimal NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "weapon_abilities" (
  "id" BIGSERIAL PRIMARY KEY NOT NULL,
  "weapon_id" bigint NOT NULL,
  "img" varchar NOT NULL,
  "name" varchar NOT NULL,
  "description" varchar NOT NULL,
  "level" bigint NOT NULL DEFAULT 1,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);
CREATE TABLE "boxes" (
  "id" BIGSERIAL PRIMARY KEY NOT NULL,
  "name" varchar NOT NULL,
  "price" decimal NOT NULL,
  "img" varchar NOT NULL,
  "star" bigint,
  "nonce" bigint NOT NULL,
  "state" bigint NOT NULL DEFAULT 0,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);
CREATE TABLE "box_random" (
  "id" BIGSERIAL PRIMARY KEY NOT NULL,
  "level" bigint NOT NULL,
   "percent" bigint NOT NULL,
  "box_id"  bigint NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);
CREATE TABLE "weapon_nft" (
  "id" BIGSERIAL PRIMARY KEY NOT NULL,
  "weapon_id" bigint NOT NULL,
  "token_id" bigint NOT NULL,
  "address_owner" varchar NOT NULL,
 
  "created_at" timestamptz NOT NULL DEFAULT (now())
);



CREATE TABLE "box_nft" (
  "id" BIGSERIAL PRIMARY KEY NOT NULL,
  "box_id" bigint NOT NULL,
  "token_id" bigint NOT NULL,
  "address_owner" varchar NOT NULL,
  
  "created_at" timestamptz NOT NULL DEFAULT (now())
);
CREATE TABLE "transaction_weapon" (
  "id" BIGSERIAL PRIMARY KEY,
  "weapon_id" bigint NOT NULL,
  "token_id" bigint NOT NULL,
  "hash" varchar NOT NULL,
  "from_address" varchar NOT NULL,
  "to_address" varchar NOT NULL,
  "price" bigint NOT NULL,
  "transaction_at" timestamptz NOT NULL DEFAULT (now()),
  "created_at" timestamptz NOT NULL DEFAULT (now())
);
-- VIEW to find weapon
CREATE VIEW view_weapons AS
SELECT
	id,
	name,
	price,
	TYPE,
	img,
	level,
	star,
	nonce,
	state,
  created_at,
	(
		SELECT
			array_to_json(array_agg(row_to_json(ability.*))) AS array_to_json
		FROM (
			SELECT
				weapon_abilities.*
			FROM
				weapon_abilities
			WHERE
				weapon_id = weapons.id) ability) AS abilities, (
		SELECT
			row_to_json(weapon_stats.*) AS row_to_json 
		FROM
			weapon_stats
		WHERE
			weapon_id = weapons.id) AS stat
FROM
	weapons;



CREATE INDEX ON "weapon_nft" ("weapon_id");
CREATE INDEX ON "weapon_stats" ("weapon_id");
CREATE INDEX ON "weapon_abilities" ("weapon_id");

CREATE INDEX ON "box_nft" ("box_id");
CREATE INDEX ON "box_random" ("box_id");


ALTER TABLE "weapon_nft" ADD FOREIGN KEY ("weapon_id") REFERENCES "weapons" ("id");
ALTER TABLE "transaction_weapon" ADD FOREIGN KEY ("weapon_id") REFERENCES "weapons" ("id");
ALTER TABLE "weapon_stats" ADD FOREIGN KEY ("weapon_id") REFERENCES "weapons" ("id");

ALTER TABLE "weapon_abilities" ADD FOREIGN KEY ("weapon_id") REFERENCES "weapons" ("id");

ALTER TABLE "box_random" ADD FOREIGN KEY ("box_id") REFERENCES "boxes" ("id");
ALTER TABLE "box_nft" ADD FOREIGN KEY ("box_id") REFERENCES "boxes" ("id");
