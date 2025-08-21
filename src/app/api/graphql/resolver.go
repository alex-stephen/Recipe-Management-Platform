package graphql

import "go.mongodb.org/mongo-driver/mongo"

type Resolver struct {
	DB *mongo.Collection
}
