package main

import (
	"log"
	"net/http"

	"github.com/google/uuid"
	"github.com/stretchr/goweb"
	"github.com/stretchr/goweb/context"
	"log"
	"net/http"
)

type Users struct {
	Users   []*User
	SprintId string
}

type UsersService struct {
	AllUsers []*Users
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

	user := new(User)
	user.Id = uuid.New().String()
	user.Name = dataMap["Name"].(string)
	user.Vote = -1

	foundId := false
	for _, users := range us.AllUsers {
		if users.SprintId == urlId {
			users.Users = append(users.Users, user)
			foundId = true
		}
	}

	if !foundId {
		users := new(Users)
		users.SprintId = urlId
		users.Users = append(make([]*User, 0), user)
		us.AllUsers = append(us.AllUsers, users)
	}

	log.Printf("New User %s Added to sprintID %s", user.Id, urlId)

	return goweb.API.RespondWithData(ctx, user)
}

func (us *UsersService) ReadMany(ctx context.Context) error {

	urlId := ctx.PathValue("sprintId")

	if us.AllUsers == nil {
		return goweb.API.RespondWithData(ctx, make([]*User, 0))
	}

	for _, users := range us.AllUsers {
		if users.SprintId == urlId {
			return goweb.API.RespondWithData(ctx, users.Users)
		}
	}

	if DEV {
		log.Printf("Accessed all Users Information in Sprint %s", urlId)
	}

	return goweb.API.RespondWithData(ctx, make([]*User, 0))

}

func (us *UsersService) Read(id string, ctx context.Context) error {

	urlId := ctx.PathValue("sprintId")

	for _, users := range us.AllUsers {
		if users.SprintId == urlId {
			for _, user := range users.Users {
				if user.Id == id {
					return goweb.API.RespondWithData(ctx, user)
				}
			}
		}
	}

	if DEV {
		log.Printf("Accessed Users %s Information in Sprint %s", id, urlId)
	}

	return goweb.Respond.WithStatus(ctx, http.StatusNotFound)
}

func (us *UsersService) DeleteMany(ctx context.Context) error {
	urlId := ctx.PathValue("sprintId")

	if us.AllUsers!= nil {
		for _, users := range us.AllUsers {
			if users.SprintId == urlId {
				users.Users = make([]*User, 0)
			}
		}
	}

	if DEV {
		log.Printf("IMPORTANT : Deleted All Users in Sprint %s", urlId)
	}

	return goweb.Respond.WithOK(ctx)

}

func (us *UsersService) Delete(id string, ctx context.Context) error {
	urlId := ctx.PathValue("sprintId")

	for _, users := range us.AllUsers {
		if users.SprintId == urlId {
			newList := make([]*User, 0)
			for _, user := range users.Users {
				if user.Id != id {
					newList = append(newList, user)
				}
			}
			users.Users = newList
		}
	}

	log.Printf("Deleted User %s in Sprint %s", id, urlId)

	return goweb.Respond.WithOK(ctx)
}

func (us *UsersService) Replace(id string, ctx context.Context) error {
	data, dataErr := ctx.RequestData()

	if dataErr != nil {
		return goweb.API.RespondWithError(ctx, http.StatusInternalServerError, dataErr.Error())
	}

	dataMap := data.(map[string]interface{})
	voteVal := dataMap["Vote"].(float64)

	urlId := ctx.PathValue("sprintId")

	for _, users := range us.AllUsers {
		if users.SprintId == urlId {
			for _, user := range users.Users {
				if user.Id == id {
					user.Vote = voteVal
					log.Printf("User %s voted %f in the current round of Sprint %s", user.Id, voteVal, urlId)
					return goweb.Respond.WithOK(ctx)
				}
			}
		}
	}

	return goweb.Respond.WithStatus(ctx, http.StatusNotFound)
}
