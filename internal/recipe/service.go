package recipe

import (
	"context"
	"errors"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/alex-stephen/recipes/model"
)

type Service struct {
	collection *mongo.Collection
}

func NewService(collection *mongo.Collection) *Service {
	return &Service{collection: collection}
}

func (s *Service) CreateRecipe(ctx context.Context, recipe *model.Recipe) (*model.Recipe, error) {
	recipe.ID = primitive.NewObjectID()
	_, err := s.collection.InsertOne(ctx, recipe)
	if err != nil {
		return nil, err
	}
	return recipe, nil
}

func (s *Service) GetRecipeByID(ctx context.Context, id string) (*model.Recipe, error) {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, errors.New("invalid recipe ID")
	}

	var recipe model.Recipe
	err = s.collection.FindOne(ctx, bson.M{"_id": objID}).Decode(&recipe)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, errors.New("recipe not found")
		}
		return nil, err
	}
	return &recipe, nil
}

func (s *Service) GetAllRecipes(ctx context.Context) ([]*model.Recipe, error) {
	cursor, err := s.collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var recipes []*model.Recipe
	if err = cursor.All(ctx, &recipes); err != nil {
		return nil, err
	}
	return recipes, nil
}

func (s *Service) UpdateRecipe(ctx context.Context, id string, recipe *model.Recipe) (*model.Recipe, error) {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, errors.New("invalid recipe ID")
	}

	filter := bson.M{"_id": objID}
	update := bson.M{"$set": recipe}

	_, err = s.collection.UpdateOne(ctx, filter, update)
	if err != nil {
		return nil, err
	}

	return s.GetRecipeByID(ctx, id) // Fetch the updated recipe
}

func (s *Service) DeleteRecipe(ctx context.Context, id string) (bool, error) {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return false, errors.New("invalid recipe ID")
	}

	filter := bson.M{"_id": objID}
	result, err := s.collection.DeleteOne(ctx, filter)
	if err != nil {
		return false, err
	}

	return result.DeletedCount > 0, nil
}
