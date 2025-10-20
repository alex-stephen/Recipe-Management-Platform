# Development stage
FROM golang:1.24 AS development

WORKDIR /src

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o recipes

EXPOSE 8080

CMD ["./recipes"]

# Production stage
FROM golang:1.24 AS production

WORKDIR /src

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o recipes

EXPOSE 8080

CMD ["./recipes"]
