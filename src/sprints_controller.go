package main

import (
	"log"
	"net/http"

	"github.com/stretchr/goweb"
	"github.com/stretchr/goweb/context"
	"github.com/teris-io/shortid"
)

type SprintsController struct {
	Sprints []*Sprint
}

func (sc *SprintsController) Before(ctx context.Context) error {
	ctx.HttpResponseWriter().Header().Set("X-Sprints-Controller", "true")
	return nil
}

func (sc *SprintsController) Create(ctx context.Context) error {
	data, dataErr := ctx.RequestData()
	if dataErr != nil {
		return goweb.API.RespondWithError(ctx, http.StatusInternalServerError, dataErr.Error())
	}

	sid, idErr := shortid.New(1, shortid.DefaultABC, 2342)
	if idErr != nil {
		return goweb.API.RespondWithError(ctx, http.StatusInternalServerError, idErr.Error())
	}

	dataMap := data.(map[string]interface{})

	sprint := new(Sprint)
	newid, _ := sid.Generate()
	sprint.Id = newid
	sprint.Name = dataMap["Name"].(string)

	sc.Sprints = append(sc.Sprints, sprint)
	log.Print("New Sprint with SprintId %s", sprint.Id)

	return goweb.API.RespondWithData(ctx, newid)
}

func (sc *SprintsController) ReadMany(ctx context.Context) error {

	if sc.Sprints == nil {
		sc.Sprints = make([]*Sprint, 0)
	}

	if DEV {
		log.Print("Accessed all Sprints Information")
	}

	return goweb.API.RespondWithData(ctx, sc.Sprints)
}

func (sc *SprintsController) Read(id string, ctx context.Context) error {

	for _, sprint := range sc.Sprints {
		if sprint.Id == id {
			return goweb.API.RespondWithData(ctx, sprint)
		}
	}

	if DEV {
		log.Print("Accessed Sprint %s Information", id)
	}

	return goweb.Respond.WithStatus(ctx, http.StatusNotFound)
}

func (sc *SprintsController) DeleteMany(ctx context.Context) error {
	sc.Sprints = make([]*Sprint, 0)
	log.Print("IMPORTANT : Deleted All Sprints")
	return goweb.Respond.WithOK(ctx)
}

func (sc *SprintsController) Delete(id string, ctx context.Context) error {
	newList := make([]*Sprint, 0)
	for _, sprint := range sc.Sprints {
		if sprint.Id != id {
			newList = append(newList, sprint)
		}
	}
	sc.Sprints = newList
	log.Print("Deleted Sprint %s", id)

	return goweb.Respond.WithOK(ctx)
}
