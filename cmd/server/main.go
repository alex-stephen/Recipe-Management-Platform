package main

import (
	"context"
	"log"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/alex-stephen/recipes/internal/config"
	"github.com/alex-stephen/recipes/internal/graphql"
	"github.com/alex-stephen/recipes/internal/recipe"
)

func main() {
	// Load configuration
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Error loading config: %v", err)
	}

	// Connect to MongoDB
	client, err := mongo.NewClient(options.Client().ApplyURI(cfg.Database.URL))
	if err != nil {
		log.Fatalf("Error creating MongoDB client: %v", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err = client.Connect(ctx)
	if err != nil {
		log.Fatalf("Error connecting to MongoDB: %v", err)
	}
	defer client.Disconnect(ctx)

	// Get database and collection
	db := client.Database(cfg.Database.Name)
	recipesCollection := db.Collection(cfg.Database.Collection)

	// Initialize recipe service
	recipeService := recipe.NewService(recipesCollection)

	// Initialize GraphQL handler
	graphQLHandler := graphql.NewGraphQLHandler(recipeService)

	// Set up Gin router
	r := gin.Default()

	// GraphQL endpoint
	r.POST("/graphql", graphql.GraphQLHandler(graphQLHandler))
	r.GET("/graphql", graphql.GraphQLHandler(graphQLHandler))

	// Start server
	log.Printf("Server starting on port %s", cfg.Server.Port)
	if err := r.Run(cfg.Server.Port); err != nil {
		log.Fatalf("Error starting server: %v", err)
	}
}
