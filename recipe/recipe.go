package recipe

import "go.mongodb.org/mongo-driver/bson/primitive"

type Recipe struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Name        string             `bson:"name"          json:"name"`
	Description string             `bson:"description"   json:"description"`
	Ingredients []Ingredient       `bson:"ingredients"   json:"ingredients"`
	Steps       []string           `bson:"steps"         json:"steps"`
	ImageUrls   []string           `bson:"image_urls"    json:"imageUrls"`
	Nutrients   Nutrient           `bson:"nutrients"     json:"nutrients"`
}

type Category struct {
	//TBD
}

type Ingredient struct {
	Name     string `bson:"name"     json:"name"`
	Quantity string `bson:"quantity" json:"quantity"`
}

type Nutrient struct {
	Calories  string `json:"calories"  bson:"calories"`
	Protein   string `json:"protein"   bson:"protein"`
	Fat       string `json:"fat"       bson:"fat"`
	Carbs     string `json:"carbs"     bson:"carbs"`
	Fiber     string `json:"fiber"     bson:"fiber"`
	Sugar     string `json:"sugar"     bson:"sugar"`
	Sodium    string `json:"sodium"    bson:"sodium"`
	Potassium string `json:"potassium" bson:"potassium"`
}
