package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/websocket"

	"github.com/google/uuid"
	"github.com/stretchr/goweb"
	"github.com/stretchr/goweb/context"
)

type Users struct {
	Users    	[]*User
	SprintId 	string
	VotesShown 	bool
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
	user.Admin = false

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
		users.VotesShown = false
		user.Admin = true;
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

	if us.AllUsers != nil {
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

			for i, user := range users.Users {
				if user.Id == id {
					users.Users[len(users.Users)-1], users.Users[i] = users.Users[i], users.Users[len(users.Users)-1]
					users.Users = users.Users[:len(users.Users)-1]
					log.Printf("Delete User %s in Sprint %s", id, urlId)
					return goweb.Respond.WithOK(ctx)
				}
			}
		}
	}
	return goweb.Respond.WithStatus(ctx, http.StatusNotFound)
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

func (us *UsersService) Update(conn *websocket.Conn) {
	for {
		messageType, p, err := conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}
		log.Printf("User update websocket received id: %s", string(p))
		for _, users := range us.AllUsers {
			if users.SprintId == string(p) {
				tmpReturnUserArray := make([]*User, 0)
				if !users.VotesShown {
					for _, user := range users.Users {
						tmpReturnUser := user
						if user.Vote != -1 {
							tmpReturnUser.Vote = -3
						}
						tmpReturnUserArray = append(tmpReturnUserArray, tmpReturnUser)
					}
				}
				var usersStr []byte
				var usersErr error
				if users.VotesShown {
					usersStr, usersErr = json.Marshal(users.Users)
				} else {
					usersStr, usersErr = json.Marshal(tmpReturnUserArray)
				}
				if usersErr != nil {
					log.Println(usersErr)
				}
				if err := conn.WriteMessage(messageType, usersStr); err != nil {
					log.Println(err)
					return
				}
			}
		}
	}
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

	for _, users := range us.AllUsers {
		if users.SprintId == sprintId && len(users.Users) > 1 {
			foundOne := false
			for i, user := range users.Users {
				if user.Id == userId {
					if !user.Admin {
						log.Printf("Forbidden non-admin trying to appoint successor from %s to %s", userId, successorId)
						return goweb.Respond.WithStatus(ctx, http.StatusNotFound)
					}
					users.Users[1], users.Users[i] = users.Users[i], users.Users[1]
					if foundOne {
						users.Users[1].Admin = false
						users.Users[0].Admin = true
						log.Printf("Transfered admin from %s to %s", users.Users[1].Id, users.Users[0].Id)
						return goweb.Respond.WithOK(ctx)
					} else {
						foundOne = true
					}
				} else if user.Id == successorId {
					users.Users[0], users.Users[i] = users.Users[i], users.Users[0]
					if foundOne {
						users.Users[1].Admin = false
						users.Users[0].Admin = true
						log.Printf("Transfered admin from %s to %s", users.Users[1].Id, users.Users[0].Id)
						return goweb.Respond.WithOK(ctx)
					} else {
						foundOne = true
					}
				}
			}
			if DEV {
				log.Printf("Sprint %s not found for set admin", sprintId)
			}
			return goweb.Respond.WithStatus(ctx, http.StatusNotFound)
		}
	}
	return goweb.Respond.WithStatus(ctx, http.StatusNotFound)
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

	for _, users := range us.AllUsers {
		if users.SprintId == sprintId && len(users.Users) > 1 {
			if users.Users[0].Id == userId {
				users.VotesShown = voteShown
				log.Printf("Changed VoteShown status for sprint %s", sprintId)
				return goweb.Respond.WithOK(ctx)
			}
			log.Printf("Forbid non-admin to change VoteShown status for sprint %s", sprintId)
			return goweb.Respond.WithStatus(ctx, http.StatusNotFound)
		}
	}
	if DEV {
		log.Printf("Sprint %s not found for show vote", sprintId)
	}
	return goweb.Respond.WithStatus(ctx, http.StatusNotFound)
}
