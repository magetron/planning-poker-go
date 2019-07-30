package main

import (
	"log"
	"net/http"

	"github.com/google/uuid"
	"github.com/stretchr/goweb"
	"github.com/stretchr/goweb/context"
)

type Users struct {
	Users    	map[string]*User
	SprintId 	string
	VotesShown 	bool
	AdminId		string
}

type UsersService struct {
	AllUsers map[string]*Users
}

func (us *UsersService) Before(ctx context.Context) error {
	ctx.HttpResponseWriter().Header().Set("X-Users-Service", "true")
	return nil
}

func (us *UsersService) Create(ctx context.Context) error {
	data, dataErr := ctx.RequestData()

	if dataErr != nil {
		return goweb.API.RespondWithError(ctx, http.StatusInternalServerError, dataErr.Error())
	}

	if !ctx.PathParams().Has("sprintId") {
		return goweb.API.RespondWithError(ctx, http.StatusInternalServerError, "No sprintID Specified in URL.")
	}

	urlId := ctx.PathValue("sprintId")

	dataMap := data.(map[string]interface{})

	if us.AllUsers == nil {
		us.AllUsers = make(map[string]*Users)
	}

	user := new(User)
	user.Id = uuid.New().String()
	user.Name = dataMap["Name"].(string)
	user.Vote = -1
	user.Admin = false

	users, foundId := us.AllUsers[urlId]

	if !foundId {
		users := new(Users)
		users.SprintId = urlId
		users.VotesShown = false
		users.AdminId = user.Id
		user.Admin = true
		users.Users = make(map[string]*User)
		users.Users[user.Id] = user
		us.AllUsers[urlId] = users
	} else {
		users.Users[user.Id] = user
	}

	log.Printf("New User %s Added to sprintID %s", user.Id, urlId)
	return goweb.API.RespondWithData(ctx, user)
}

func (us *UsersService) ReadMany(ctx context.Context) error {

	urlId := ctx.PathValue("sprintId")

	if us.AllUsers == nil {
		return goweb.Respond.WithStatus(ctx, http.StatusNotFound)
	}

	users, exsist := us.AllUsers[urlId]
	if exsist {
		return goweb.API.RespondWithData(ctx, users)
	}

	if DEV {
		log.Printf("Accessed all Users Information in Sprint %s", urlId)
	}

	return goweb.Respond.WithStatus(ctx, http.StatusNotFound)

}

func (us *UsersService) Read(id string, ctx context.Context) error {

	urlId := ctx.PathValue("sprintId")

	user, exsist := us.AllUsers[urlId].Users[id]

	if exsist {
		return goweb.API.RespondWithData(ctx, user)
	}

	if DEV {
		log.Printf("Accessed Users %s Information in Sprint %s", id, urlId)
	}

	return goweb.Respond.WithStatus(ctx, http.StatusNotFound)
}

func (us *UsersService) DeleteMany(ctx context.Context) error {
	urlId := ctx.PathValue("sprintId")

	us.AllUsers[urlId].Users = make(map[string]*User)

	if DEV {
		log.Printf("IMPORTANT : Deleted All Users in Sprint %s", urlId)
	}

	return goweb.Respond.WithOK(ctx)

}

func (us *UsersService) Delete(id string, ctx context.Context) error {
	urlId := ctx.PathValue("sprintId")

	delete(us.AllUsers[urlId].Users, id)

	return goweb.Respond.WithStatus(ctx, http.StatusOK)
}

func (us *UsersService) Replace(id string, ctx context.Context) error {
	data, dataErr := ctx.RequestData()

	if dataErr != nil {
		return goweb.API.RespondWithError(ctx, http.StatusInternalServerError, dataErr.Error())
	}

	dataMap := data.(map[string]interface{})
	voteVal := dataMap["Vote"].(float64)

	urlId := ctx.PathValue("sprintId")

	_, exsist := us.AllUsers[urlId].Users[id]

	if !exsist {
		return goweb.Respond.WithStatus(ctx, http.StatusNotFound)
	}

	us.AllUsers[urlId].Users[id].Vote = voteVal

	return goweb.Respond.WithOK(ctx)
}


func (us *UsersService) SetAdmin(ctx context.Context) error {
	data, dataErr := ctx.RequestData()

	if dataErr != nil {
		return goweb.API.RespondWithError(ctx, http.StatusInternalServerError, dataErr.Error())
	}

	sprintId := ctx.PathValue("sprintId")
	userId := ctx.PathValue("userId")

	dataMap := data.(map[string]interface{})
	successorId := dataMap["Successor"].(string)

	users, exsist := us.AllUsers[sprintId]

	if !exsist {
		log.Printf("Sprint %s not found for set admin", sprintId)
		return goweb.Respond.WithStatus(ctx, http.StatusNotFound)
	}

	if users.AdminId != userId {
		log.Printf("Forbidden non-admin trying to appoint successor from %s to %s", userId, successorId)
		return goweb.Respond.WithStatus(ctx, http.StatusUnauthorized)
	}

	successor, exsist := users.Users[successorId]

	if !exsist {
		log.Printf("Transfer admin failed due to successor %s not found", successorId)
		return goweb.Respond.WithStatus(ctx, http.StatusNotFound)
	}

	users.AdminId = successor.Id
	users.Users[userId].Admin = false
	successor.Admin = true

	log.Printf("Transfered admin from %s to %s", userId, successorId)
	return goweb.Respond.WithOK(ctx)
}

func (us *UsersService) ShowVote(ctx context.Context) error {
	data, dataErr := ctx.RequestData()

	if dataErr != nil {
		return goweb.API.RespondWithError(ctx, http.StatusInternalServerError, dataErr.Error())
	}

	sprintId := ctx.PathValue("sprintId")
	userId := ctx.PathValue("userId")

	dataMap := data.(map[string]interface{})
	voteShown := dataMap["VoteShown"].(bool)

	users, exsist := us.AllUsers[sprintId]
	
	if !exsist {
		log.Printf("Sprint %s not found for show vote", sprintId)
		log.Printf("Sprint %s not found for show vote", sprintId)
		return goweb.Respond.WithStatus(ctx, http.StatusNotFound)
	}
	
	if users.AdminId != userId {
		log.Printf("Forbid non-admin to change VoteShown status for sprint %s", sprintId)
		return goweb.Respond.WithStatus(ctx, http.StatusUnauthorized)
	}
	
	users.VotesShown = voteShown
	log.Printf("Changed VoteShown status for sprint %s to %t", sprintId, voteShown)
	return goweb.Respond.WithOK(ctx)
}

func (us *UsersService) Update(id string, ctx context.Context) error {
	for _, users := range us.AllUsers {
		if users.SprintId == id {
			for _, user := range users.Users {
				user.Vote = -1
			}
			return goweb.Respond.WithOK(ctx)
		}
	}
	return goweb.Respond.WithStatus(ctx, http.StatusNotFound)
}
