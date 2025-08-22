package graphql

import (
	"github.com/graphql-go/graphql"
	"github.com/graphql-go/graphql/language/ast"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var objectID = graphql.NewScalar(graphql.ScalarConfig{
	Name:        "BSON",
	Description: "The `bson` scalar type represents a BSON Object.",
	Serialize: func(value any) any {
		switch value := value.(type) {
		case primitive.ObjectID:
			return value.Hex()
		case *primitive.ObjectID:
			v := *value
			return v.Hex()
		default:
			return nil
		}
	},
	ParseValue: func(value any) any {
		switch value := value.(type) {
		case string:
			id, _ := primitive.ObjectIDFromHex(value)
			return id
		case *string:
			id, _ := primitive.ObjectIDFromHex(*value)
			return id
		}
		return nil
	},
	// ParseLiteral parses GraphQL AST to `bson.ObjectId`.
	ParseLiteral: func(valueAST ast.Value) any {
		switch valueAST := valueAST.(type) {
		case *ast.StringValue:
			id, _ := primitive.ObjectIDFromHex(valueAST.Value)
			return id
		}
		return nil
	},
})

// CONTEXT
// nolint
type getContextParam int

const (
	//nolint
	checkUserContextParam getContextParam = iota
)

// PAGINATION
func configPaginationArgs(
	name string,
	args graphql.FieldConfigArgument,
) graphql.FieldConfigArgument {
	args["pagination"] = &graphql.ArgumentConfig{
		Type: graphql.NewInputObject(graphql.InputObjectConfig{
			Name: name,
			Fields: graphql.InputObjectConfigFieldMap{
				"limit": &graphql.InputObjectFieldConfig{
					Type:         graphql.Int,
					DefaultValue: 50,
				},
				"offset": &graphql.InputObjectFieldConfig{
					Type:         graphql.Int,
					DefaultValue: 0,
				},
				"sort": &graphql.InputObjectFieldConfig{
					Type: graphql.String,
				},
				"dir": &graphql.InputObjectFieldConfig{
					Type: graphql.String,
				},
			},
		}),
	}

	return args
}
