package recipe

import "go.mongodb.org/mongo-driver/bson/primitive"

type Recipe struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Name        string             `bson:"name" 		 json:"name"`
	Description string             `bson:"description"   json:"description"`
	Ingredients []Ingredient       `bson:"ingredients"   json:"ingredients"`
	Steps       []string           `bson:"steps"         json:"steps"`
	ImageUrls   []string           `bson:"image_urls"    json:"imageUrls"`
}

type Category struct {
	//TBD
}

type Ingredient struct {
	Name     string `bson:"name"     json:"name"`
	Quantity string `bson:"quantity" json:"quantity"`
}
