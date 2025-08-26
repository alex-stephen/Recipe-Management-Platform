package main

import (
	"net/http"

	"github.com/alex-stephen/recipes/recipe"
)

func loadRoutes(router *http.ServeMux) {
	handler := &recipe.Handler{}

	router.HandleFunc("POST /recipes/", handler.Create)
}
