package recipe

import (
	"log"
	"net/http"
)

type Handler struct{}

func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusCreated)
	log.Println("Recieved request to create a Recipe")
	w.Write([]byte("Recipe Created"))
}
