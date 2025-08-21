package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/alex-stephen/recipes/src/app/api/graphql"
	"github.com/alex-stephen/recipes/src/app/api/graphql/generated"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Recipe represents a recipe document in MongoDB
type Recipe struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Title        string             `bson:"title" json:"title"`
	Ingredients  []string           `bson:"ingredients" json:"ingredients"`
	Instructions []string           `bson:"instructions" json:"instructions"`
	CreatedAt    time.Time          `bson:"createdAt" json:"createdAt"`
}

// getenv helper
func getenv(k, def string) string {
	if v := os.Getenv(k); v != "" {
		return v
	}
	return def
}

// graphqlHandler defines the GQLgen server as a Gin handler
func graphqlHandler(collection *mongo.Collection) gin.HandlerFunc {
	// NewExecutableSchema and Config are in the generated.go file
	// Resolver is in the resolver.go file
	c := generated.Config{
		Resolvers: &graphql.Resolver{
			DB: collection,
		},
	}
	srv := handler.NewDefaultServer(generated.NewExecutableSchema(c))
	return func(ctx *gin.Context) {
		srv.ServeHTTP(ctx.Writer, ctx.Request)
	}
}

func main() {
	// Environment variables / defaults
	mongoURI := getenv("MONGO_URI", "mongodb://root:example@localhost:27017/?authSource=admin")
	dbName := getenv("MONGO_DB", "appdb")
	port := getenv("PORT", "8080")

	// --- Connect to Mongo ---
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatal(err)
	}
	defer func() {
		_ = client.Disconnect(context.Background())
	}()

	db := client.Database(dbName)
	recipes := db.Collection("recipes")

	// --- Gin router + CORS -- -
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	api := r.Group("/api")
	{
		// GraphQL endpoint
		api.POST("/graphql", graphqlHandler(recipes))

		// Health check
		api.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"status": "ok", "time": time.Now().UTC()})
		})

		// Get all recipes
		api.GET("/recipes", func(c *gin.Context) {
			ctx, cancel := context.WithTimeout(c, 5*time.Second)
			defer cancel()

			cur, err := recipes.Find(ctx, bson.M{})
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			defer cur.Close(ctx)

			var out []Recipe
			for cur.Next(ctx) {
				var r Recipe
				if err := cur.Decode(&r); err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
					return
				}
				out = append(out, r)
			}
			if err := cur.Err(); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusOK, out)
		})

		// Add a new recipe
		api.POST("/recipes", func(c *gin.Context) {
			var body struct {
				Title        string   `json:"title"`
				Ingredients  []string `json:"ingredients"`
				Instructions []string `json:"Instructions"`
			}
			if err := c.BindJSON(&body); err != nil || body.Title == "" {
				c.JSON(http.StatusBadRequest, gin.H{"error": "title is required"})
				return
			}

			doc := Recipe{
				Title:        body.Title,
				Ingredients:  body.Ingredients,
				Instructions: body.Instructions,
				CreatedAt:    time.Now().UTC(),
			}

			ctx, cancel := context.WithTimeout(c, 5*time.Second)
			defer cancel()

			res, err := recipes.InsertOne(ctx, doc)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			if oid, ok := res.InsertedID.(primitive.ObjectID); ok {
				doc.ID = oid
			}
			c.JSON(http.StatusCreated, doc)
		})
	}

	log.Printf("API listening on http://localhost:%s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}
