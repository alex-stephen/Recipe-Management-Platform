package database

import (
	"context"
	"log"
	"os"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var DB *mongo.Client

func ConnectDB() *mongo.Client {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "mongodb://localhost:27017"
	}

	clientOptions := options.Client().ApplyURI(dbURL)
	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		log.Fatal("Failed to connect to MongoDB", err)
	}

	log.Println("Connected to MongoDB")
	DB = client
	return client
}

func GetCollection(client *mongo.Client, collectionName string) *mongo.Collection {
	dbName := os.Getenv("DATABASE_NAME")
	if dbName == "" {
		dbName = "gotestdb"
	}
	return client.Database(dbName).Collection(collectionName)
}
