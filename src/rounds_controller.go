package main

import (
	"net/http"

	"github.com/stretchr/goweb"
	"github.com/stretchr/goweb/context"
)

type RoundsController struct {
	Rounds []*Round
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

	dataMap := data.(map[string]interface{})

	round := new(Round)
	round.Id = len(rc.Rounds) + 1
	round.Name = dataMap["Name"].(string)

	rc.Rounds = append(rc.Rounds, round)

	return goweb.Respond.WithStatus(ctx, http.StatusOK)
}

func (rc *RoundsController) ReadMany(ctx context.Context) error {

	if rc.Rounds == nil {
		rc.Rounds = make([]*Round, 0)
	}

	return goweb.API.RespondWithData(ctx, rc.Rounds)

}
