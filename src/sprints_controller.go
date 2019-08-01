package main

import (
	"log"
	"net/http"
	"time"

	"github.com/stretchr/goweb"
	"github.com/stretchr/goweb/context"
	"github.com/teris-io/shortid"
)

type SprintsController struct {
	Sprints map[string]*Sprint
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

	if sc.Sprints == nil {
		sc.Sprints = make(map[string]*Sprint)
	}

	sprint := new(Sprint)
	newId, _ := sid.Generate()
	sprint.Id = newId
	sprint.Name = dataMap["Name"].(string)
	sprint.CreationTime = time.Now()

	sc.Sprints[newId] = sprint
	log.Printf("New Sprint with SprintId %s", newId)

	return goweb.API.RespondWithData(ctx, newId)
}

func (sc *SprintsController) ReadMany(ctx context.Context) error {

	if sc.Sprints == nil {
		return goweb.API.RespondWithData(ctx, make(map[string]*Sprint))
	}

	log.Print("Accessed all Sprints Information")

	return goweb.API.RespondWithData(ctx, sc.Sprints)
}

func (sc *SprintsController) Read(id string, ctx context.Context) error {

	sprint, exist := sc.Sprints[id]

	if !exist {
		return goweb.Respond.WithStatus(ctx, http.StatusNotFound)
	}

	log.Printf("Accessed Sprint %s Information", id)
	return goweb.API.RespondWithData(ctx, sprint)
}

func (sc *SprintsController) DeleteMany(ctx context.Context) error {
	sc.Sprints = nil
	log.Print("IMPORTANT : Deleted All Sprints")
	return goweb.Respond.WithOK(ctx)
}

func (sc *SprintsController) Delete(id string, ctx context.Context) error {

	_, exist := sc.Sprints[id]

	if !exist {
		return goweb.Respond.WithStatus(ctx, http.StatusNotFound)
	}

	delete(sc.Sprints, id)
	log.Printf("Deleted Sprint %s", id)

	return goweb.Respond.WithOK(ctx)
}