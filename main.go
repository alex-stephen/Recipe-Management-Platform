package main

import (
	"log"
	"net/http"

	"github.com/alex-stephen/recipes/middleware"
)

func main() {
	router := http.NewServeMux()
	loadRoutes(router)

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
