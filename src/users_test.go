package main

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"testing"

	"github.com/stretchr/goweb"
	"github.com/stretchr/goweb/handlers"
	"github.com/stretchr/testify/assert"
	testifyhttp "github.com/stretchr/testify/http"
)

func TestEmptyUser(t *testing.T) {

	codecService := goweb.DefaultHttpHandler().CodecService()
	handler := handlers.NewHttpHandler(codecService)
	goweb.SetDefaultHttpHandler(handler)

	mapRoutesV2()

	sprintId := ""
	goweb.Test(t, goweb.RequestBuilderFunc(func() *http.Request {
		newReqBody, newReqBodyErr := json.Marshal(map[string]string{
			"Name": "New Sprint",
		})
		if newReqBodyErr != nil {
			log.Fatal(newReqBodyErr)
		}
		newReq, newErr := http.NewRequest("POST", "sprints/", bytes.NewBuffer(newReqBody))
		if newErr != nil {
			log.Fatal(newErr)
		}
		newReq.Header.Set("Content-Type", "application/json")
		return newReq
	}), func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for New Sprint.")
		assert.Equal(t, 25, len(response.Output), "Response Length should be 25 for New Sprint.")
		sprintId = response.Output[6:15]
	})

	goweb.Test(t, "GET sprints/"+sprintId+"/users/", func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for querying all Users.")
	})

	goweb.Test(t, "DELETE sprints/", func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for deleting Sprints.")
	})
}


func TestUserErr (t *testing.T) {
	codecService := goweb.DefaultHttpHandler().CodecService()
	handler := handlers.NewHttpHandler(codecService)
	goweb.SetDefaultHttpHandler(handler)

	mapRoutesV2()

	sprintId := ""
	goweb.Test(t, goweb.RequestBuilderFunc(func() *http.Request {
		newReqBody, newReqBodyErr := json.Marshal(map[string]string{
			"Name": "New Sprint",
		})
		if newReqBodyErr != nil {
			log.Fatal(newReqBodyErr)
		}
		newReq, newErr := http.NewRequest("POST", "sprints/", bytes.NewBuffer(newReqBody))
		if newErr != nil {
			log.Fatal(newErr)
		}
		newReq.Header.Set("Content-Type", "application/json")
		return newReq
	}), func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for New Sprint.")
		assert.Equal(t, 25, len(response.Output), "Response Length should be 25 for New Sprint.")
		sprintId = response.Output[6:15]
	})

	goweb.Test(t, goweb.RequestBuilderFunc(func() *http.Request {
		newReq, newErr := http.NewRequest("POST", "sprints/"+sprintId+"/users/", bytes.NewBufferString(""))
		if newErr != nil {
			log.Fatal(newErr)
		}
		newReq.Header.Set("Content-Type", "application/json")
		return newReq
	}), func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusInternalServerError, response.StatusCode, "Status code should be Internal Server Error for no payload.")
	})

	userId1 := ""
	userId2 := ""
	goweb.Test(t, goweb.RequestBuilderFunc(func() *http.Request {
		newReqBody, newReqBodyErr := json.Marshal(map[string]string{
			"Name": "New User 1",
		})
		if newReqBodyErr != nil {
			log.Fatal(newReqBodyErr)
		}
		newReq, newErr := http.NewRequest("POST", "sprints/"+sprintId+"/users/", bytes.NewBuffer(newReqBody))
		if newErr != nil {
			log.Fatal(newErr)
		}
		newReq.Header.Set("Content-Type", "application/json")
		return newReq
	}), func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for New User.")
		userId1 = response.Output[12:48]
		assert.Equal(t, `{"d":{"Id":"`+userId1+`","Name":"New User 1","Vote":-1,"Admin":true},"s":200}`, response.Output, "Response should be User object.")
	})

	goweb.Test(t, goweb.RequestBuilderFunc(func() *http.Request {
		newReqBody, newReqBodyErr := json.Marshal(map[string]string{
			"Name": "New User 2",
		})
		if newReqBodyErr != nil {
			log.Fatal(newReqBodyErr)
		}
		newReq, newErr := http.NewRequest("POST", "sprints/"+sprintId+"/users/", bytes.NewBuffer(newReqBody))
		if newErr != nil {
			log.Fatal(newErr)
		}
		newReq.Header.Set("Content-Type", "application/json")
		return newReq
	}), func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for New User.")
		userId2 = response.Output[12:48]
		assert.Equal(t, `{"d":{"Id":"`+userId2+`","Name":"New User 2","Vote":-1,"Admin":false},"s":200}`, response.Output, "Response should be User object.")
	})

	goweb.Test(t, "GET sprints/abcde/users/", func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, `{"d":{},"s":200}`, response.Output, "Response should be empty for non existing Sprint id.")
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for All Users.")
	})

	goweb.Test(t, "GET sprints/" + sprintId + "/users/abcdef-ghijkl", func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusNotFound, response.StatusCode, "Status code should be not found for non-existing Users.")
	})

	goweb.Test(t, goweb.RequestBuilderFunc(func() *http.Request {
		newReq, newErr := http.NewRequest("PUT", "sprints/"+sprintId+"/users/"+userId1, bytes.NewBufferString(""))
		if newErr != nil {
			log.Fatal(newErr)
		}
		newReq.Header.Set("Content-Type", "application/json")
		return newReq
	}), func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusInternalServerError, response.StatusCode, "Status code should be Internal Server Error for no payload.")
	})

	goweb.Test(t, "DELETE sprints/"+sprintId+"/users/abcdef-ghijkl", func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusNotFound, response.StatusCode, "Status code should be Not Found for non-existing User.")
	})

	goweb.Test(t, goweb.RequestBuilderFunc(func() *http.Request {
		newReqBody, newReqBodyErr := json.Marshal(map[string]float64{
			"Vote": 8,
		})
		if newReqBodyErr != nil {
			log.Fatal(newReqBodyErr)
		}
		newReq, newErr := http.NewRequest("PUT", "sprints/"+sprintId+"/users/abcdef-ghijkl", bytes.NewBuffer(newReqBody))
		if newErr != nil {
			log.Fatal(newErr)
		}
		newReq.Header.Set("Content-Type", "application/json")
		return newReq
	}), func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusNotFound, response.StatusCode, "Status code should be Not found for non-existing User.")
	})

	goweb.Test(t, goweb.RequestBuilderFunc(func() *http.Request {
		newReq, newErr := http.NewRequest("POST", "sprints/"+sprintId+"/users/"+userId1+"/setadmin", bytes.NewBufferString(""))
		if newErr != nil {
			log.Fatal(newErr)
		}
		newReq.Header.Set("Content-Type", "application/json")
		return newReq
	}), func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusInternalServerError, response.StatusCode, "Status code should be Internal server error for no payload.")
	})

	goweb.Test(t, goweb.RequestBuilderFunc(func() *http.Request {
		newReqBody, newReqBodyErr := json.Marshal(map[string]string{
			"Successor": userId2,
		})
		if newReqBodyErr != nil {
			log.Fatal(newReqBodyErr)
		}
		newReq, newErr := http.NewRequest("POST", "sprints/"+sprintId+"a/users/"+userId1+"/setadmin", bytes.NewBuffer(newReqBody))
		if newErr != nil {
			log.Fatal(newErr)
		}
		newReq.Header.Set("Content-Type", "application/json")
		return newReq
	}), func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusNotFound, response.StatusCode, "Status code should be Not found for non existing Sprint.")
	})

	goweb.Test(t, "DELETE sprints/", func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for deleting Sprints.")
	})

	goweb.Test(t, goweb.RequestBuilderFunc(func() *http.Request {
		newReqBody, newReqBodyErr := json.Marshal(map[string]string{
			"Successor": "abcdef-ghijkl",
		})
		if newReqBodyErr != nil {
			log.Fatal(newReqBodyErr)
		}
		newReq, newErr := http.NewRequest("POST", "sprints/"+sprintId+"/users/"+userId1+"/setadmin", bytes.NewBuffer(newReqBody))
		if newErr != nil {
			log.Fatal(newErr)
		}
		newReq.Header.Set("Content-Type", "application/json")
		return newReq
	}), func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusNotFound, response.StatusCode, "Status code should be Not found for non existing Successor.")
	})

	goweb.Test(t, goweb.RequestBuilderFunc(func() *http.Request {
		newReq, newErr := http.NewRequest("POST", "sprints/"+sprintId+"/users/"+userId1+"/showvote/", bytes.NewBufferString(""))
		if newErr != nil {
			log.Fatal(newErr)
		}
		newReq.Header.Set("Content-Type", "application/json")
		return newReq
	}), func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusInternalServerError, response.StatusCode, "Status code Internal server error for no payload.")
	})

	goweb.Test(t, "DELETE sprints/", func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for deleting Sprints.")
	})

}

func TestUserCycle(t *testing.T) {

	codecService := goweb.DefaultHttpHandler().CodecService()
	handler := handlers.NewHttpHandler(codecService)
	goweb.SetDefaultHttpHandler(handler)

	mapRoutesV2()

	sprintId := ""
	goweb.Test(t, goweb.RequestBuilderFunc(func() *http.Request {
		newReqBody, newReqBodyErr := json.Marshal(map[string]string{
			"Name": "New Sprint",
		})
		if newReqBodyErr != nil {
			log.Fatal(newReqBodyErr)
		}
		newReq, newErr := http.NewRequest("POST", "sprints/", bytes.NewBuffer(newReqBody))
		if newErr != nil {
			log.Fatal(newErr)
		}
		newReq.Header.Set("Content-Type", "application/json")
		return newReq
	}), func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for New Sprint.")
		assert.Equal(t, 25, len(response.Output), "Response Length should be 25 for New Sprint.")
		sprintId = response.Output[6:15]
	})

	userId1 := ""
	userId2 := ""
	goweb.Test(t, goweb.RequestBuilderFunc(func() *http.Request {
		newReqBody, newReqBodyErr := json.Marshal(map[string]string{
			"Name": "New User 1",
		})
		if newReqBodyErr != nil {
			log.Fatal(newReqBodyErr)
		}
		newReq, newErr := http.NewRequest("POST", "sprints/"+sprintId+"/users/", bytes.NewBuffer(newReqBody))
		if newErr != nil {
			log.Fatal(newErr)
		}
		newReq.Header.Set("Content-Type", "application/json")
		return newReq
	}), func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for New User.")
		userId1 = response.Output[12:48]
		assert.Equal(t, `{"d":{"Id":"`+userId1+`","Name":"New User 1","Vote":-1,"Admin":true},"s":200}`, response.Output, "Response should be User object.")
	})

	goweb.Test(t, goweb.RequestBuilderFunc(func() *http.Request {
		newReqBody, newReqBodyErr := json.Marshal(map[string]string{
			"Name": "New User 2",
		})
		if newReqBodyErr != nil {
			log.Fatal(newReqBodyErr)
		}
		newReq, newErr := http.NewRequest("POST", "sprints/"+sprintId+"/users/", bytes.NewBuffer(newReqBody))
		if newErr != nil {
			log.Fatal(newErr)
		}
		newReq.Header.Set("Content-Type", "application/json")
		return newReq
	}), func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for New User.")
		userId2 = response.Output[12:48]
		assert.Equal(t, `{"d":{"Id":"`+userId2+`","Name":"New User 2","Vote":-1,"Admin":false},"s":200}`, response.Output, "Response should be User object.")
	})

	goweb.Test(t, "GET sprints/"+sprintId+"/users/"+userId1, func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for Existing User.")
		assert.Equal(t, `{"d":{"Id":"`+userId1+`","Name":"New User 1","Vote":-1,"Admin":true},"s":200}`, response.Output, "Response should be Existing User object.")
	})

	goweb.Test(t, "GET sprints/"+sprintId+"/users/", func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for All Users.")
		assert.True(t, `{"d":{"Users":{"`+userId1+`":{"Id":"`+userId1+`","Name":"New User 1","Vote":-1,"Admin":true},"`+userId2+`":{"Id":"`+userId2+`","Name":"New User 2","Vote":-1,"Admin":false}},"SprintId":"`+sprintId+`","VotesShown":false,"AdminId":"`+userId1+`"},"s":200}` == response.Output || `{"d":{"Users":{"`+userId2+`":{"Id":"`+userId2+`","Name":"New User 2","Vote":-1,"Admin":false},"`+userId1+`":{"Id":"`+userId1+`","Name":"New User 1","Vote":-1,"Admin":true}},"SprintId":"`+sprintId+`","VotesShown":false,"AdminId":"`+userId1+`"},"s":200}` == response.Output, "Response should be Existing User object.")
	})

	goweb.Test(t, goweb.RequestBuilderFunc(func() *http.Request {
		newReqBody, newReqBodyErr := json.Marshal(map[string]float64{
			"Vote": 8,
		})
		if newReqBodyErr != nil {
			log.Fatal(newReqBodyErr)
		}
		newReq, newErr := http.NewRequest("PUT", "sprints/"+sprintId+"/users/"+userId1, bytes.NewBuffer(newReqBody))
		if newErr != nil {
			log.Fatal(newErr)
		}
		newReq.Header.Set("Content-Type", "application/json")
		return newReq
	}), func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for User voting.")
	})

	goweb.Test(t, goweb.RequestBuilderFunc(func() *http.Request {
		newReqBody, newReqBodyErr := json.Marshal(map[string]bool{
			"VoteShown": true,
		})
		if newReqBodyErr != nil {
			log.Fatal(newReqBodyErr)
		}
		newReq, newErr := http.NewRequest("POST", "sprints/"+sprintId+"/users/"+userId2+"/showvote/", bytes.NewBuffer(newReqBody))
		if newErr != nil {
			log.Fatal(newErr)
		}
		newReq.Header.Set("Content-Type", "application/json")
		return newReq
	}), func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusUnauthorized, response.StatusCode, "Status code should be Unauthorized for non-master Showing Votes.")
	})

	goweb.Test(t, goweb.RequestBuilderFunc(func() *http.Request {
		newReqBody, newReqBodyErr := json.Marshal(map[string]bool{
			"VoteShown": true,
		})
		if newReqBodyErr != nil {
			log.Fatal(newReqBodyErr)
		}
		newReq, newErr := http.NewRequest("POST", "sprints/"+sprintId+"/users/"+userId1+"/showvote/", bytes.NewBuffer(newReqBody))
		if newErr != nil {
			log.Fatal(newErr)
		}
		newReq.Header.Set("Content-Type", "application/json")
		return newReq
	}), func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for master Showing Votes.")
	})

	goweb.Test(t, goweb.RequestBuilderFunc(func() *http.Request {
		newReqBody, newReqBodyErr := json.Marshal(map[string]bool{
			"VoteShown": true,
		})
		if newReqBodyErr != nil {
			log.Fatal(newReqBodyErr)
		}
		newReq, newErr := http.NewRequest("POST", "sprints/"+sprintId+"a"+"/users/"+userId1+"/showvote/", bytes.NewBuffer(newReqBody))
		if newErr != nil {
			log.Fatal(newErr)
		}
		newReq.Header.Set("Content-Type", "application/json")
		return newReq
	}), func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusNotFound, response.StatusCode, "Status code should be Not found for non existing Sprints to Show Votes.")
	})

	goweb.Test(t, "GET sprints/"+sprintId+"/users/", func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for All Users.")
		assert.True(t, `{"d":{"Users":{"`+userId1+`":{"Id":"`+userId1+`","Name":"New User 1","Vote":8,"Admin":true},"`+userId2+`":{"Id":"`+userId2+`","Name":"New User 2","Vote":-1,"Admin":false}},"SprintId":"`+sprintId+`","VotesShown":true,"AdminId":"`+userId1+`"},"s":200}` == response.Output || `{"d":{"Users":{"`+userId2+`":{"Id":"`+userId2+`","Name":"New User 2","Vote":-1,"Admin":false},"`+userId1+`":{"Id":"`+userId1+`","Name":"New User 1","Vote":8,"Admin":true}},"SprintId":"`+sprintId+`","VotesShown":true,"AdminId":"`+userId1+`"},"s":200}` == response.Output, "Response should be original user object.")
	})

	goweb.Test(t, "GET sprints/"+sprintId+"/users/"+userId1, func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for Existing User.")
		assert.Equal(t, `{"d":{"Id":"`+userId1+`","Name":"New User 1","Vote":8,"Admin":true},"s":200}`, response.Output, "Response should be Existing User object.")
	})

	goweb.Test(t, "GET sprints/"+sprintId+"/users/"+userId2, func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for Existing User.")
		assert.Equal(t, `{"d":{"Id":"`+userId2+`","Name":"New User 2","Vote":-1,"Admin":false},"s":200}`, response.Output, "Response should be Existing User object.")
	})

	goweb.Test(t, goweb.RequestBuilderFunc(func() *http.Request {
		newReqBody, newReqBodyErr := json.Marshal(map[string]bool{
			"VoteShown": false,
		})
		if newReqBodyErr != nil {
			log.Fatal(newReqBodyErr)
		}
		newReq, newErr := http.NewRequest("POST", "sprints/"+sprintId+"/users/"+userId1+"/showvote/", bytes.NewBuffer(newReqBody))
		if newErr != nil {
			log.Fatal(newErr)
		}
		newReq.Header.Set("Content-Type", "application/json")
		return newReq
	}), func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for master Hiding Votes.")
	})

	goweb.Test(t, "GET sprints/"+sprintId+"/users/"+userId1, func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for Existing User.")
		assert.Equal(t, `{"d":{"Id":"`+userId1+`","Name":"New User 1","Vote":-3,"Admin":true},"s":200}`, response.Output, "Response should be Existing User object.")
	})

	goweb.Test(t, "GET sprints/"+sprintId+"/users/", func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for All Users.")
		assert.True(t, `{"d":{"Users":{"`+userId1+`":{"Id":"`+userId1+`","Name":"New User 1","Vote":-3,"Admin":true},"`+userId2+`":{"Id":"`+userId2+`","Name":"New User 2","Vote":-1,"Admin":false}},"SprintId":"`+sprintId+`","VotesShown":false,"AdminId":"`+userId1+`"},"s":200}` == response.Output || `{"d":{"Users":{"`+userId2+`":{"Id":"`+userId2+`","Name":"New User 2","Vote":-1,"Admin":false},"`+userId1+`":{"Id":"`+userId1+`","Name":"New User 1","Vote":-3,"Admin":true}},"SprintId":"`+sprintId+`","VotesShown":false,"AdminId":"`+userId1+`"},"s":200}` == response.Output, "Response should be Existing User object.")
	})

	goweb.Test(t, goweb.RequestBuilderFunc(func() *http.Request {
		newReqBody, newReqBodyErr := json.Marshal(map[string]string{
			"Successor": userId2,
		})
		if newReqBodyErr != nil {
			log.Fatal(newReqBodyErr)
		}
		newReq, newErr := http.NewRequest("POST", "sprints/"+sprintId+"/users/"+userId1+"/setadmin", bytes.NewBuffer(newReqBody))
		if newErr != nil {
			log.Fatal(newErr)
		}
		newReq.Header.Set("Content-Type", "application/json")
		return newReq
	}), func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for transferring master position to other user.")
	})

	goweb.Test(t, goweb.RequestBuilderFunc(func() *http.Request {
		newReqBody, newReqBodyErr := json.Marshal(map[string]string{
			"Successor": userId2,
		})
		if newReqBodyErr != nil {
			log.Fatal(newReqBodyErr)
		}
		newReq, newErr := http.NewRequest("POST", "sprints/"+sprintId+"/users/"+userId1+"/setadmin", bytes.NewBuffer(newReqBody))
		if newErr != nil {
			log.Fatal(newErr)
		}
		newReq.Header.Set("Content-Type", "application/json")
		return newReq
	}), func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusUnauthorized, response.StatusCode, "Status code should be Unauthorized for non-master trying to set other user as master")
	})

	goweb.Test(t, "DELETE sprints/"+sprintId+"/users/"+userId1, func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for Deleting User.")
	})

	goweb.Test(t, "DELETE sprints/"+sprintId+"/users/", func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for Deleting Users.")
	})

	goweb.Test(t, "GET sprints/"+sprintId+"/users/"+userId1, func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusNotFound, response.StatusCode, "Status code should be Not Found for non-existing User.")
	})

	goweb.Test(t, "DELETE sprints/"+sprintId+"/users/"+userId2, func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusNotFound, response.StatusCode, "Status code should be Not found for Deleting non-existing Users.")
	})

	goweb.Test(t, "DELETE sprints/", func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for deleting Sprints.")
	})
}
