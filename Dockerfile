# syntax=docker/dockerfile:1

# Development stage
FROM golang:1.24 AS development

WORKDIR /app

COPY . .

RUN go install github.com/cosmtrek/air@latest

EXPOSE 8080

CMD ["air", "-c", ".air.toml"]

# Production stage
FROM golang:1.24 AS production

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go build -o /recipes

EXPOSE 8080

CMD [ "/recipes" ]
