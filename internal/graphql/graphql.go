package graphql

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/graphql-go/graphql"
	"github.com/graphql-go/handler"

	"github.com/alex-stephen/recipes/internal/recipe"
)

func NewGraphQLHandler(recipeService *recipe.Service) *handler.Handler {
	rootQuery := GetRootQuery(recipeService)
	rootMutation := GetRootMutation(recipeService)

	schema, err := graphql.NewSchema(
		graphql.SchemaConfig{
			Query:    rootQuery,
			Mutation: rootMutation,
		},
	)
	if err != nil {
		log.Fatalf("failed to create new schema, error: %v", err)
	}

	return handler.New(&handler.Config{
		Schema:   &schema,
		Pretty:   true,
		GraphiQL: true, // Enable GraphiQL for easy testing
	})
}

func GraphQLHandler(h *handler.Handler) gin.HandlerFunc {
	return func(c *gin.Context) {
		h.ServeHTTP(c.Writer, c.Request)
	}
}
