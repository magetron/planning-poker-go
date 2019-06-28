package main

import (
	"log"
	"net/http"

	"github.com/stretchr/goweb"
	"github.com/stretchr/goweb/context"
)

type Rounds struct {
	Rounds   []*Round
	SprintId string
}

type RoundsController struct {
	AllRounds []*Rounds
}

func (rc *RoundsController) Before(ctx context.Context) error {
	ctx.HttpResponseWriter().Header().Set("X-Rounds-Controller", "true")
	return nil

}

func (rc *RoundsController) Create(ctx context.Context) error {
	data, dataErr := ctx.RequestData()

	if dataErr != nil {
		return goweb.API.RespondWithError(ctx, http.StatusInternalServerError, dataErr.Error())
	}

	if !ctx.PathParams().Has("id") {
		return goweb.API.RespondWithError(ctx, http.StatusInternalServerError, "No ID Specified in URL.")
	}

	urlId := ctx.PathValue("id")

	log.Printf("Added to sprintID %s", urlId)

	dataMap := data.(map[string]interface{})

	round := new(Round)
	round.Name = dataMap["Name"].(string)

	foundId := false
	for _, rs := range rc.AllRounds {
		if rs.SprintId == urlId {
			round.Id = len(rs.Rounds) + 1
			rs.Rounds = append(rs.Rounds, round)
			foundId = true
		}
	}

	if !foundId {
		rounds := new(Rounds)
		rounds.SprintId = urlId
		round.Id = 1
		rounds.Rounds = append(make([]*Round, 0), round)
		rc.AllRounds = append(rc.AllRounds, rounds)
	}

	return goweb.API.RespondWithData(ctx, round)
}

func (rc *RoundsController) ReadMany(ctx context.Context) error {

	if rc.AllRounds == nil {
		rc.AllRounds = make([]*Rounds, 0)
	}

	return goweb.API.RespondWithData(ctx, rc.AllRounds)

}

func (rc *RoundsController) Read(id int, ctx context.Context) error {

	urlId := ctx.PathValue("id")

	for _, rs := range rc.AllRounds {
		if rs.SprintId == urlId {
			for _, r := range rs.Rounds {
				if r.Id == id {
					return goweb.API.RespondWithData(ctx, r)
				}
			}
		}
	}

	return goweb.Respond.WithStatus(ctx, http.StatusNotFound)
}
