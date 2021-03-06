package main

import (
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/stretchr/goweb"
	"github.com/stretchr/goweb/context"
)

type Rounds struct {
	Rounds   []*Round
	SprintId string
}

type RoundsController struct {
	AllRounds map[string]*Rounds
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

	urlId := ctx.PathValue("sprintId")

	dataMap := data.(map[string]interface{})

	if rc.AllRounds == nil {
		rc.AllRounds = make(map[string]*Rounds)
	}

	round := new(Round)
	round.Name = dataMap["Name"].(string)
	round.Avg = 0
	round.Med = 0
	round.Final = 0
	round.Archived = false
	round.CreationTime = time.Now().Unix()

	rounds, foundId := rc.AllRounds[urlId]

	if !foundId {
		rounds := new(Rounds)
		rounds.SprintId = urlId
		round.Id = 1
		rounds.Rounds = append(make([]*Round, 0), round)
		rc.AllRounds[urlId] = rounds
	} else {
		round.Id = len(rounds.Rounds) + 1
		rounds.Rounds = append(rounds.Rounds, round)
		foundId = true
	}

	log.Printf("New Round %d Added to sprintID %s", round.Id, urlId)

	return goweb.API.RespondWithData(ctx, round)
}

func (rc *RoundsController) ReadMany(ctx context.Context) error {

	urlId := ctx.PathValue("sprintId")

	if rc.AllRounds == nil {
		return goweb.API.RespondWithData(ctx, make([]*Round, 0))
	}

	rounds, exist := rc.AllRounds[urlId]
	if !exist {
		return goweb.API.RespondWithData(ctx, make([]*Round, 0))
	}

	log.Printf("Accessed all Rounds Information in Sprint %s", urlId)
	return goweb.API.RespondWithData(ctx, rounds)
}

func (rc *RoundsController) Read(id string, ctx context.Context) error {

	urlId := ctx.PathValue("sprintId")
	roundId, convErr := strconv.Atoi(id)

	if convErr != nil {
		return goweb.API.RespondWithError(ctx, http.StatusInternalServerError, convErr.Error())
	}

	rounds, exist := rc.AllRounds[urlId]

	if !exist {
		return goweb.Respond.WithStatus(ctx, http.StatusNotFound)
	}

	if roundId > len(rounds.Rounds) || roundId < 1 {
		return goweb.Respond.WithStatus(ctx, http.StatusNotFound)
	}

	log.Printf("Accessed Round %d Information of Sprint %s", roundId, urlId)
	return goweb.API.RespondWithData(ctx, rounds.Rounds[roundId - 1])
}

func (rc *RoundsController) DeleteMany(ctx context.Context) error {
	urlId := ctx.PathValue("sprintId")

	delete(rc.AllRounds, urlId)

	log.Printf("IMPORTANT : Deleted All Rounds in Sprint %s", urlId)
	return goweb.Respond.WithOK(ctx)
}

func (rc *RoundsController) Replace (id string, ctx context.Context) error {
	voteData, voteErr := ctx.RequestData()

	if voteErr != nil {
		return goweb.API.RespondWithError(ctx, http.StatusInternalServerError, voteErr.Error())
	}

	urlId := ctx.PathValue("sprintId")

	roundId, convErr := strconv.Atoi(id)
	if convErr != nil {
		return goweb.API.RespondWithError(ctx, http.StatusInternalServerError, convErr.Error())
	}

	voteMap := voteData.(map[string]interface{})
	voteAvg := voteMap["Average"].(float64)
	voteMed := voteMap["Median"].(float64)
	voteFin := voteMap["Final"].(float64)

	rounds, exist := rc.AllRounds[urlId]

	if !exist {
		return goweb.Respond.WithStatus(ctx, http.StatusNotFound)
	}

	if roundId > len(rounds.Rounds) || roundId < 1 {
		return goweb.Respond.WithStatus(ctx, http.StatusNotFound)
	}

	round := rounds.Rounds[roundId - 1]

	round.Avg = voteAvg
	round.Med = voteMed
	round.Final = voteFin
	round.Archived = true
	_ = us.Reset(urlId, ctx)
	log.Printf("Round %d in Sprint %s is archived.", round.Id, rounds.SprintId)
	return goweb.Respond.WithOK(ctx)

}


func (rc *RoundsController) SetTitle (ctx context.Context) error {
	titleData, err := ctx.RequestData()

	if err != nil {
		return goweb.API.RespondWithError(ctx, http.StatusInternalServerError, err.Error())
	}

	sprintId := ctx.PathValue("sprintId")
	roundIdStr := ctx.PathValue("roundId")

	roundId, convErr := strconv.Atoi(roundIdStr)
	if convErr != nil {
		return goweb.API.RespondWithError(ctx, http.StatusInternalServerError, convErr.Error())
	}

	titleMap := titleData.(map[string]interface{})
	title := titleMap["Name"].(string)

	rounds, exist := rc.AllRounds[sprintId]
	if !exist {
		return goweb.Respond.WithStatus(ctx, http.StatusNotFound)
	}

	if roundId > len(rounds.Rounds) || roundId < 1 {
		return goweb.Respond.WithStatus(ctx, http.StatusNotFound)
	}

	round := rounds.Rounds[roundId - 1]
	round.Name = title
	log.Printf("Round %d in Sprint %s is renamed to %s", round.Id, rounds.SprintId, title)
	return goweb.Respond.WithOK(ctx)
}
