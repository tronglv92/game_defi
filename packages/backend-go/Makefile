DB_URL=postgresql://root:anhhung@localhost:5432/marketplace?sslmode=disable
postgres:
	docker run --name postgres14 --network bank-network -p 5432:5432  -e POSTGRES_USER=root -e POSTGRES_PASSWORD=anhhung -d postgres:14-alpine
createdb:
	docker exec -it postgres14 createdb --username=root --owner=root marketplace
dropdb:
	docker exec -it postgres14 dropdb marketplace
migrateup:
	migrate -path db/migration -database "$(DB_URL)" -verbose up
migratedown:
	migrate -path db/migration -database "$(DB_URL)" -verbose down
migrateup1:
	migrate -path db/migration -database "$(DB_URL)" -verbose up 1
migratedown1:
	migrate -path db/migration -database "$(DB_URL)" -verbose down 1
sqlc:
	sqlc generate
test:
	go test -v -cover ./...
server:
	go run main.go
mock:
	mockgen -build_flags=--mod=mod -package mockdb -destination db/mock/store.go simplebank/db/sqlc Store
proto:
	rm -f pb/*.go
	rm -f doc/swagger/*.swagger.json
	protoc --proto_path=proto --go_out=pb --go_opt=paths=source_relative \
    --go-grpc_out=pb --go-grpc_opt=paths=source_relative \
	--grpc-gateway_out=pb --grpc-gateway_opt paths=source_relative \
	--openapiv2_out=doc/swagger --openapiv2_opt=allow_merge=true,merge_file_name=simple_bank \
    proto/*.proto
	statik -src=./doc/swagger -dest=./doc

evans:
	evans --host localhost --port 9090 -r repl 

createmigrate:
	migrate create -ext sql -dir db/migration -seq <migration_name>

.PHONY: createdb dropdb postgres sqlc server mock test migrateup migratedown migratedown1 migrateup1 proto evans