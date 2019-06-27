package main

import (
	"net/http"

	"github.com/stretchr/goweb"
	"github.com/stretchr/goweb/context"
	"github.com/teris-io/shortid"
)

type Controller struct {
	Sprints []*Sprint
}

func (sc *Controller) Before(ctx context.Context) error {
	ctx.HttpResponseWriter().Header().Set("X-Sprints-Controller", "true")
	return nil
}

func (sc *Controller) Create(ctx context.Context) error {
	data, dataErr := ctx.RequestData()
	if dataErr != nil {
		return goweb.API.RespondWithError(ctx, http.StatusInternalServerError, dataErr.Error())
	}

	sid, err := shortid.New(1, shortid.DefaultABC, 2342)
	if err != nil {
		return goweb.API.RespondWithError(ctx, http.StatusInternalServerError, dataErr.Error())
	}

	dataMap := data.(map[string]interface{})

	sprint := new(Sprint)
	sprint.Id = sid.Generate()
	sprint.Name = dataMap["Name"].(string)

	sc.Sprints = append(sc.Sprints, sprint)

	return goweb.Respond.WithStatus(ctx, http.StatusCreated)
}

func (sc *Controller) ReadMany(ctx context.Context) error {

	if sc.Sprints == nil {
		sc.Sprints = make([]*Sprint, 0)
	}

	return goweb.API.RespondWithData(ctx, sc.Sprints)
}

func (sc *Controller) Read(id string, ctx context.Context) error {

	for _, sprint := range sc.Sprints {
		if sprint.Id == id {
			return goweb.API.RespondWithData(ctx, sprint)
		}
	}

	return goweb.Respond.WithStatus(ctx, http.StatusNotFound)
}

func (sc *Controller) DeleteMany(ctx context.Context) error {
	sc.Sprints = make([]*Sprint, 0)
	return goweb.Respond.WithOK(ctx)
}

func (sc *Controller) Delet(id string, ctx context.Context) error {
	newList := make([]*Sprint, 0)
	for _, sprint := range sc.Sprints {
		if sprint.Id != id {
			newList = append(newList, sprint)
		}
	}
	sc.Sprints = newList

	return goweb.Respond.WithOK(ctx)
}
