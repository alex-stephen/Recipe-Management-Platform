package main

import (
	"log"
	"net/http"

	"github.com/alex-stephen/recipes/database"
	"github.com/alex-stephen/recipes/middleware"
	"github.com/alex-stephen/recipes/recipe"
)

func main() {
	client := database.ConnectDB()
	router := http.NewServeMux()
	db := database.GetCollection(client, "recipes")
	handler := recipe.NewHandler(db)
	router.HandleFunc("POST /recipes/", handler.Create)
	router.HandleFunc("GET /recipes/{id}", handler.GetRecipe)

	stack := middleware.CreateStack(
		middleware.Logging,
	)

	server := http.Server{
		Addr:    ":8080",
		Handler: stack(router),
	}
	log.Println("Starting server on port :8080")
	server.ListenAndServe()

}
