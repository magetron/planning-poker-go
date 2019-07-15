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
	Users    []*User
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
	user.Rank = 3 //(1,2,3 refers to master, admin, user respectively)(admin feature to be implemented)

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

	foundMaster := false
	for _, users := range us.AllUsers {
		if users.SprintId == urlId {
			for _, user := range users.Users {
				if user.Rank == 1 {
					foundMaster = true
					break
				}
			}
		}
	}

	if !foundMaster {
		user.Rank = 1
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

			slice1 := make([]*User, 0)
			slice2 := make([]*User, 0)

			for i, user := range users.Users {
				if user.Id == id {

					slice1 = users.Users[0:i]
					slice2 = users.Users[i+1:]

					//TODO: find joint func for slice
					for j := range slice2 {
						slice1 = append(slice1, slice2[j])
					}
					users.Users = slice1
					break
				}
			}
		}
		log.Printf("Delete User %s in Sprint %s", id, urlId)
		return goweb.Respond.WithOK(ctx)
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
				usersStr, usersErr := json.Marshal(users.Users)
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

func (us *UsersService) appointMaster(ctx context.Context) error {

	data, dataErr := ctx.RequestData()

	if dataErr != nil {
		return goweb.API.RespondWithError(ctx, http.StatusInternalServerError, dataErr.Error())
	}

	urlId := ctx.PathValue("sprintId")

	dataMap := data.(map[string]interface{})
	userId := dataMap["Id"].(string)
	successorId := dataMap["Sucessor"].(string)

	for _, users := range us.AllUsers {
		if users.SprintId == urlId {

			isMaster := false
			for _, user := range users.Users {
				if user.Id == userId {
					if user.Rank < 3 {
						log.Printf("User eligible to set successor cuz its rank is %f", user.Rank)
						user.Rank = 3
						isMaster = true
					} else {
						log.Printf("User NOT eligible to set successor cuz its rank is %f", user.Rank)
						return goweb.API.RespondWithData(ctx, users.Users)
					}
				}
			}

			if isMaster {
				for _, user := range users.Users {
					if user.Id == successorId {
						user.Rank = 1
						log.Printf("Transferred master position to successor %s", successorId)
						break
					}
				}
			}

			for _, user := range users.Users {
				if user.Id == userId {
					return goweb.API.RespondWithData(ctx, users.Users)
					//if user is master, return all user in the sprint
				}
			}
		}
	}
	return goweb.Respond.WithStatus(ctx, http.StatusNotFound)

}
