package main

import (
	"log"
	"net/http"

	"github.com/alex-stephen/recipes/middleware"
	"github.com/alex-stephen/recipes/recipe"
)

func main() {
	router := http.NewServeMux()
	handler := &recipe.Handler{}
	router.HandleFunc("POST /recipes/", handler.Create)

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
