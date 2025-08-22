package graphql

import (
	"context"
	"log"
	"runtime/debug"

	"github.com/graphql-go/graphql"
	"github.com/pkg/errors"
)

type nextFn func(ctx context.Context, p graphql.ResolveParams) (any, error)

type middlewareFn func(nextFn) nextFn

type middlewareField struct {
	name       string
	field      *graphql.Field
	isMutation bool
}

func schemaWithMiddlewares(midreses ...middlewareField) graphql.SchemaConfig {
	queries := graphql.Fields{}
	mutations := graphql.Fields{}

	for _, ms := range midreses {
		if ms.isMutation {
			mutations[ms.name] = ms.field
		} else {
			queries[ms.name] = ms.field
		}
	}

	return graphql.SchemaConfig{
		Query: graphql.NewObject(graphql.ObjectConfig{
			Name:   "RootQuery",
			Fields: queries,
		}),
		Mutation: graphql.NewObject(graphql.ObjectConfig{
			Name:   "RootMutation",
			Fields: mutations,
		}),
	}
}

func m(
	name string,
	base *baseField,
	middlewares ...middlewareFn,
) middlewareField {
	return mapField(true, name, base, middlewares...)
}

func q(
	name string,
	base *baseField,
	middlewares ...middlewareFn,
) middlewareField {
	return mapField(false, name, base, middlewares...)
}

func mapField(
	isMutation bool,
	name string,
	base *baseField,
	middlewares ...middlewareFn,
) middlewareField {
	return middlewareField{
		name,
		&graphql.Field{
			Name: base.Name,
			Type: base.Type,
			Args: base.Args,
			Resolve: withMiddlewares(base.Resolve, middlewares...),
			Subscribe:         base.Subscribe,
			DeprecationReason: base.DeprecationReason,
			Description:       base.Description,
		},
		isMutation,
	}
}

type FieldResolveFn func(ctx context.Context, p graphql.ResolveParams) (any, error)

type baseField struct {
	Name              string                      `json:"name"` // used by graphlql-relay
	Type              graphql.Output              `json:"type"`
	Args              graphql.FieldConfigArgument `json:"args"`
	Resolve           nextFn                      `json:"-"`
	Subscribe         graphql.FieldResolveFn      `json:"-"`
	DeprecationReason string                      `json:"deprecationReason"`
	Description       string                      `json:"description"`
}

func withMiddlewares(next nextFn, mw ...middlewareFn) graphql.FieldResolveFn {
	next = stackTracer(next)

	for i := len(mw) - 1; i >= 0; i-- {
		if mw[i] != nil {
			next = mw[i](next)
		}
	}

	h := func(p graphql.ResolveParams) (any, error) {
		return next(p.Context, p)
	}

	return h
}

func stackTracer(next nextFn) nextFn {
	h := func(ctx context.Context, p graphql.ResolveParams) (any, error) {
		v, err := stackTracerHelper(next, ctx, p)
		if v == nil && err == nil {
			return nil, errors.New("internal server error")
		} else if err != nil {
			return nil, errors.New(errors.Cause(err).Error())
		}

		return v, nil
	}

	return h
}

func stackTracerHelper(
	next nextFn,
	ctx context.Context,
	p graphql.ResolveParams,
) (any, error) {
	defer func() {
		if r := recover(); r != nil {
			log.Printf("Panic: %v\n%s", r, debug.Stack())
		}
	}()

	v, err := next(ctx, p)
	if err != nil {
		return nil, errors.Cause(err)
	}
	return v, nil
}