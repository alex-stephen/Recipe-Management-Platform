build:
	go build -o bin/server cmd/server/main.go

run:
	go run cmd/server/main.go

clean:
	rm -f bin/server

tidy:
	go mod tidy
