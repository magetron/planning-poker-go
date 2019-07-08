package main

import (
	"encoding/json"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
	"strconv"

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

	if !ctx.PathParams().Has("sprintId") {
		return goweb.API.RespondWithError(ctx, http.StatusInternalServerError, "No sprintID Specified in URL.")
	}

	urlId := ctx.PathValue("sprintId")

	dataMap := data.(map[string]interface{})

	round := new(Round)
	round.Name = dataMap["Name"].(string)
	round.Avg = 0
	round.Med = 0
	round.Archived = false

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

	log.Printf("New Round %d Added to sprintID %s", round.Id, urlId)

	return goweb.API.RespondWithData(ctx, round)
}

func (rc *RoundsController) ReadMany(ctx context.Context) error {

	urlId := ctx.PathValue("sprintId")

	if rc.AllRounds == nil {
		return goweb.API.RespondWithData(ctx, make([]*Round, 0))
	}

	for _, rs := range rc.AllRounds {
		if rs.SprintId == urlId {
			return goweb.API.RespondWithData(ctx, rs.Rounds)
		}
	}

	if DEV {
		log.Printf("Accessed all Rounds Information in Sprint %s", urlId)
	}

	return goweb.API.RespondWithData(ctx, make([]*Round, 0))

}

func (rc *RoundsController) Read(id string, ctx context.Context) error {

	urlId := ctx.PathValue("sprintId")
	roundId, convErr := strconv.Atoi(id)

	if convErr != nil {
		return goweb.API.RespondWithError(ctx, http.StatusInternalServerError, convErr.Error())
	}

	for _, rs := range rc.AllRounds {
		if rs.SprintId == urlId {
			for _, r := range rs.Rounds {
				if r.Id == roundId {
					return goweb.API.RespondWithData(ctx, r)
				}
			}
		}
	}

	if DEV {
		log.Printf("Accessed Round %d Information of Sprint %s", roundId, urlId)
	}

	return goweb.Respond.WithStatus(ctx, http.StatusNotFound)
}

func (rc *RoundsController) DeleteMany(ctx context.Context) error {
	urlId := ctx.PathValue("sprintId")

	if rc.AllRounds != nil {
		for _, rs := range rc.AllRounds {
			if rs.SprintId == urlId {
				rs.Rounds = make([]*Round, 0)
			}
		}
	}

	if DEV {
		log.Printf("IMPORTANT : Deleted All Rounds in Sprint %s", urlId)
	}

	return goweb.Respond.WithOK(ctx)

}

func (rc *RoundsController) Delete (id string, ctx context.Context) error {
	voteData, voteErr := ctx.RequestData()

	if voteErr != nil {
		return goweb.API.RespondWithError(ctx, http.StatusInternalServerError, voteErr.Error())
	}

	if !ctx.PathParams().Has("sprintId") {
		return goweb.API.RespondWithError(ctx, http.StatusInternalServerError, "No sprintID Specified in URL.")
	}

	urlId := ctx.PathValue("sprintId")

	roundId, convErr := strconv.Atoi(id)
	if convErr != nil {
		return goweb.API.RespondWithError(ctx, http.StatusInternalServerError, convErr.Error())
	}

	voteMap := voteData.(map[string]interface{})
	voteAvg := voteMap["Average"].(float64)
	voteMed := voteMap["Median"].(float64)

	for _, rs := range rc.AllRounds {
		if rs.SprintId == urlId {
			for _, r := range rs.Rounds {
				if r.Id == roundId {
					r.Avg = voteAvg
					r.Med = voteMed
					r.Archived = true
				}
			}
		}
	}

	return goweb.Respond.WithOK(ctx)

}

func (rc *RoundsController) Update(conn *websocket.Conn) {
	for {
		messageType, p, err := conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}
		log.Printf("User update websocket received id: %s", string(p))
		for _, rounds := range rc.AllRounds {
			if rounds.SprintId == string(p) {
				roundsStr, roundsErr := json.Marshal(rounds.Rounds)
				if roundsErr != nil {
					log.Println(roundsErr)
				}
				if err := conn.WriteMessage(messageType, roundsStr); err != nil {
					log.Println(err)
					return
				}
			}
		}
	}
}