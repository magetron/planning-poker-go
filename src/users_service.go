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
		return goweb.API.RespondWithData(ctx, make(map[string]*User))
	}

	users, exist := us.AllUsers[urlId]
	if !exist {
		return goweb.API.RespondWithData(ctx, make(map[string]*User))
	}

	log.Printf("Accessed all Users Information in Sprint %s", urlId)

	if !users.VotesShown {
		tmpReturnUserArray := new(Users)
		tmpReturnUserArray.VotesShown = users.VotesShown
		tmpReturnUserArray.AdminId = users.AdminId
		tmpReturnUserArray.SprintId = users.SprintId
		tmpReturnUserArray.Users = make(map[string]*User)
		for _, user := range users.Users {
			tmpReturnUser := new(User)
			tmpReturnUser.Id = user.Id
			tmpReturnUser.Admin = user.Admin
			tmpReturnUser.Name = user.Name
			if user.Vote != -1 {
				tmpReturnUser.Vote = -3
			} else {
				tmpReturnUser.Vote = -1
			}
			tmpReturnUserArray.Users[user.Id] = tmpReturnUser
		}
		return goweb.API.RespondWithData(ctx, tmpReturnUserArray)
	}

	return goweb.API.RespondWithData(ctx, users)
}

func (us *UsersService) Read(id string, ctx context.Context) error {

	urlId := ctx.PathValue("sprintId")

	users, exist := us.AllUsers[urlId]
	if !exist {
		return goweb.Respond.WithStatus(ctx, http.StatusNotFound)
	}

	user, exist := users.Users[id]
	if !exist {
		return goweb.Respond.WithStatus(ctx, http.StatusNotFound)
	}


	log.Printf("Accessed Users %s Information in Sprint %s", id, urlId)

	if !users.VotesShown {
		tmpUser := new(User)
		tmpUser.Id = user.Id
		tmpUser.Admin = user.Admin
		tmpUser.Name = user.Name
		if user.Vote != -1 {
			tmpUser.Vote = -3
		} else {
			tmpUser.Vote = -1
		}
		return goweb.API.RespondWithData(ctx, tmpUser)
	}
	return goweb.API.RespondWithData(ctx, user)
}

func (us *UsersService) DeleteMany(ctx context.Context) error {
	urlId := ctx.PathValue("sprintId")

	delete(us.AllUsers, urlId)

	log.Printf("IMPORTANT : Deleted All Users in Sprint %s", urlId)
	return goweb.Respond.WithOK(ctx)
}

func (us *UsersService) Delete(id string, ctx context.Context) error {
	urlId := ctx.PathValue("sprintId")

	users, exist := us.AllUsers[urlId]
	if !exist {
		return goweb.Respond.WithStatus(ctx, http.StatusNotFound)
	}

	_, exist = users.Users[id]
	if !exist {
		return goweb.Respond.WithStatus(ctx, http.StatusNotFound)
	}

	delete(us.AllUsers[urlId].Users, id)

	log.Printf("Deleted User %s in Sprint %s", urlId, id)

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

	user, exsist := us.AllUsers[urlId].Users[id]

	if !exsist {
		return goweb.Respond.WithStatus(ctx, http.StatusNotFound)
	}

	user.Vote = voteVal

	log.Printf("User %s voted %f in the current round of Sprint %s", id, voteVal, urlId)

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

func (us *UsersService) Reset(id string, ctx context.Context) error {
	users, exsist := us.AllUsers[id]
	if !exsist {
		return goweb.Respond.WithStatus(ctx, http.StatusNotFound)
	}

	for _, user := range users.Users {
		user.Vote = -1
	}
	return goweb.Respond.WithOK(ctx)
}
