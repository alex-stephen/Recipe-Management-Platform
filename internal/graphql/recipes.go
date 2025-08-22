package graphql

import (
	"context"
	"fmt"

	"github.com/graphql-go/graphql"
	"go.mongodb.org/mongo-driver/bson"

	"github.com/alex-stephen/recipes/internal/recipe"
	"github.com/alex-stephen/recipes/model"
)

var recipeType = graphql.NewObject(
	graphql.ObjectConfig{
		Name: "Recipe",
		Fields: graphql.Fields{
			"id": &graphql.Field{
				Type: graphql.ID,
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {
					if recipe, ok := p.Source.(*model.Recipe); ok {
						return recipe.ID.Hex(), nil
					}
					return nil, nil
				},
			},
			"name": &graphql.Field{
				Type: graphql.String,
			},
			"description": &graphql.Field{
				Type: graphql.String,
			},
			"ingredients": &graphql.Field{
				Type: graphql.NewList(ingredientType),
			},
			"steps": &graphql.Field{
				Type: graphql.NewList(graphql.String),
			},
		},
	},
)

var ingredientType = graphql.NewObject(
	graphql.ObjectConfig{
		Name: "Ingredient",
		Fields: graphql.Fields{
			"name": &graphql.Field{
				Type: graphql.String,
			},
			"quantity": &graphql.Field{
				Type: graphql.String,
			},
		},
	},
)

func GetRootQuery(recipeService *recipe.Service) *graphql.Object {
	return graphql.NewObject(
		graphql.ObjectConfig{
			Name: "RootQuery",
			Fields: graphql.Fields{
				"recipe": &graphql.Field{
					Type: recipeType,
					Args: graphql.FieldConfigArgument{
						"id": &graphql.ArgumentConfig{
							Type: graphql.NewNonNull(graphql.ID),
						},
					},
					Resolve: func(p graphql.ResolveParams) (interface{}, error) {
						id, ok := p.Args["id"].(string)
						if !ok {
							return nil, fmt.Errorf("invalid recipe ID")
						}
						return recipeService.GetRecipeByID(context.Background(), id)
					},
				},
				"recipes": &graphql.Field{
					Type: graphql.NewList(recipeType),
					Resolve: func(p graphql.ResolveParams) (interface{}, error) {
						return recipeService.GetAllRecipes(context.Background())
					},
				},
			},
		},
	)
}

func GetRootMutation(recipeService *recipe.Service) *graphql.Object {
	return graphql.NewObject(
		graphql.ObjectConfig{
			Name: "RootMutation",
			Fields: graphql.Fields{
				"createRecipe": &graphql.Field{
					Type: recipeType,
					Args: graphql.FieldConfigArgument{
						"name": &graphql.ArgumentConfig{
							Type: graphql.NewNonNull(graphql.String),
						},
						"description": &graphql.ArgumentConfig{
							Type: graphql.NewNonNull(graphql.String),
						},
						"ingredients": &graphql.ArgumentConfig{
							Type: graphql.NewNonNull(graphql.NewList(ingredientInputType)),
						},
						"steps": &graphql.ArgumentConfig{
							Type: graphql.NewNonNull(graphql.NewList(graphql.String)),
						},
					},
					Resolve: func(p graphql.ResolveParams) (interface{}, error) {
						name, _ := p.Args["name"].(string)
						description, _ := p.Args["description"].(string)
						ingredientsInput, _ := p.Args["ingredients"].([]interface{})
						steps, _ := p.Args["steps"].([]interface{})

						var ingredients []model.Ingredient
						for _, ing := range ingredientsInput {
							if ingMap, ok := ing.(map[string]interface{}); ok {
								ingredients = append(ingredients, model.Ingredient{
									Name:     ingMap["name"].(string),
									Quantity: ingMap["quantity"].(string),
								})
							}
						}

						var stepsStr []string
						for _, step := range steps {
							if stepStr, ok := step.(string); ok {
								stepsStr = append(stepsStr, stepStr)
							}
						}

						newRecipe := &model.Recipe{
							Name:        name,
							Description: description,
							Ingredients: ingredients,
							Steps:       stepsStr,
						}
						return recipeService.CreateRecipe(context.Background(), newRecipe)
					},
				},
				"updateRecipe": &graphql.Field{
					Type: recipeType,
					Args: graphql.FieldConfigArgument{
						"id": &graphql.ArgumentConfig{
							Type: graphql.NewNonNull(graphql.ID),
						},
						"name": &graphql.ArgumentConfig{
							Type: graphql.String,
						},
						"description": &graphql.ArgumentConfig{
							Type: graphql.String,
						},
						"ingredients": &graphql.ArgumentConfig{
							Type: graphql.NewList(ingredientInputType),
						},
						"steps": &graphql.ArgumentConfig{
							Type: graphql.NewList(graphql.String),
						},
					},
					Resolve: func(p graphql.ResolveParams) (interface{}, error) {
						id, _ := p.Args["id"].(string)
						updates := make(map[string]interface{})
						if name, ok := p.Args["name"].(string); ok {
							updates["name"] = name
						}
						if description, ok := p.Args["description"].(string); ok {
							updates["description"] = description
						}
						if ingredientsInput, ok := p.Args["ingredients"].([]interface{}); ok {
							var ingredients []model.Ingredient
							for _, ing := range ingredientsInput {
								if ingMap, ok := ing.(map[string]interface{}); ok {
									ingredients = append(ingredients, model.Ingredient{
										Name:     ingMap["name"].(string),
										Quantity: ingMap["quantity"].(string),
									})
								}
							}
							updates["ingredients"] = ingredients
						}
						if steps, ok := p.Args["steps"].([]interface{}); ok {
							var stepsStr []string
							for _, step := range steps {
								if stepStr, ok := step.(string); ok {
									stepsStr = append(stepsStr, stepStr)
								}
							}
							updates["steps"] = stepsStr
						}

						// Convert map[string]interface{} to model.Recipe for update
						var recipe model.Recipe
						bsonBytes, _ := bson.Marshal(updates)
						bson.Unmarshal(bsonBytes, &recipe)

						return recipeService.UpdateRecipe(context.Background(), id, &recipe)
					},
				},
				"deleteRecipe": &graphql.Field{
					Type: graphql.Boolean,
					Args: graphql.FieldConfigArgument{
						"id": &graphql.ArgumentConfig{
							Type: graphql.NewNonNull(graphql.ID),
						},
					},
					Resolve: func(p graphql.ResolveParams) (interface{}, error) {
						id, _ := p.Args["id"].(string)
						return recipeService.DeleteRecipe(context.Background(), id)
					},
				},
			},
		},
	)
}

var ingredientInputType = graphql.NewInputObject(
	graphql.InputObjectConfig{
		Name: "IngredientInput",
		Fields: graphql.InputObjectConfigFieldMap{
			"name": &graphql.InputObjectFieldConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
			"quantity": &graphql.InputObjectFieldConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
		},
	},
)
