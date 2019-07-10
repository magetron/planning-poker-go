package main

import (
	"bytes"
	"encoding/json"
	"github.com/stretchr/goweb"
	"github.com/stretchr/goweb/handlers"
	"github.com/stretchr/testify/assert"
	testifyhttp "github.com/stretchr/testify/http"
	"log"
	"net/http"
	"testing"
)

func TestEmptySprint(t *testing.T) {

	codecService := goweb.DefaultHttpHandler().CodecService()
	handler := handlers.NewHttpHandler(codecService)
	goweb.SetDefaultHttpHandler(handler)

	mapRoutes()

	goweb.Test(t, "GET sprints/", func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for Empty Sprint.")
	})

}

func TestEmptyNameSprint(t *testing.T) {
	codecService := goweb.DefaultHttpHandler().CodecService()
	handler := handlers.NewHttpHandler(codecService)
	goweb.SetDefaultHttpHandler(handler)

	mapRoutes()

	sprintId := ""
	goweb.Test(t, goweb.RequestBuilderFunc(func () *http.Request {
		newReqBody, newReqBodyErr := json.Marshal(map[string]string {
			"Name": "",
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

	goweb.Test(t, "DELETE sprints/" + sprintId, func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for Deleting Sprint.")
	})

}

func TestSprintCycle(t *testing.T) {

	codecService := goweb.DefaultHttpHandler().CodecService()
	handler := handlers.NewHttpHandler(codecService)
	goweb.SetDefaultHttpHandler(handler)

	mapRoutes()

	sprintId := ""
	goweb.Test(t, goweb.RequestBuilderFunc(func () *http.Request {
		newReqBody, newReqBodyErr := json.Marshal(map[string]string {
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

	goweb.Test(t, "GET sprints/" + sprintId, func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for Existing Sprint.")
		assert.Equal(t, `{"d":{"Id":"` + sprintId + `","Name":"New Sprint",`, response.Output[:43], "Response should contain name New Sprint.")
	})

	goweb.Test(t, "DELETE sprints/" + sprintId, func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for Deleting Sprint.")
	})

	goweb.Test(t, "GET sprints/", func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for querying all Sprints.")
		assert.Equal(t, `{"d":[],"s":200}`, response.Output, "Response will be empty after deleting sprints.")
	})

}

func TestEmptyRound(t *testing.T) {

	codecService := goweb.DefaultHttpHandler().CodecService()
	handler := handlers.NewHttpHandler(codecService)
	goweb.SetDefaultHttpHandler(handler)

	mapRoutes()

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

	goweb.Test(t, "GET sprints/"+sprintId+"rounds/", func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusNotFound, response.StatusCode, "Status code should be Not Found for Empty Round.")
	})
}


func TestRoundCycle (t *testing.T) {

	codecService := goweb.DefaultHttpHandler().CodecService()
	handler := handlers.NewHttpHandler(codecService)
	goweb.SetDefaultHttpHandler(handler)

	mapRoutes()

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
		newReqBody, newReqBodyErr := json.Marshal(map[string]string{
			"Name": "Task 1",
		})
		if newReqBodyErr != nil {
			log.Fatal(newReqBodyErr)
		}
		newReq, newErr := http.NewRequest("POST", "sprints/" + sprintId + "/rounds/", bytes.NewBuffer(newReqBody))
		if newErr != nil {
			log.Fatal(newErr)
		}
		newReq.Header.Set("Content-Type", "application/json")
		return newReq
	}), func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for New Round.")
	})

	goweb.Test(t, "GET sprints/"+sprintId+"/rounds/", func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, `{"d":[{"Id":1,"Name":"Task 1","Med":0,"Avg":0,"Final":0,"Archived":false`, response.Output[:72], "Should have exact same information for new Round.")
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for Existing Round.")
	})

	goweb.Test(t, "DELETE sprints/"+sprintId+"/rounds/", func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for deleting all rounds.")
	})

	goweb.Test(t, "GET sprints/"+sprintId+"/rounds/", func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for querying all rounds.")
		assert.Equal(t, `{"d":[],"s":200}`, response.Output, "Should be empty after deleting all rounds.")
	})

}

func TestEmptyUser(t *testing.T) {

	codecService := goweb.DefaultHttpHandler().CodecService()
	handler := handlers.NewHttpHandler(codecService)
	goweb.SetDefaultHttpHandler(handler)

	mapRoutes()

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
}

func TestUserCycle(t *testing.T) {

	codecService := goweb.DefaultHttpHandler().CodecService()
	handler := handlers.NewHttpHandler(codecService)
	goweb.SetDefaultHttpHandler(handler)

	mapRoutes()

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

	userId := ""
	goweb.Test(t, goweb.RequestBuilderFunc(func () *http.Request {
		newReqBody, newReqBodyErr := json.Marshal(map[string]string{
			"Name": "New User",
		})
		if newReqBodyErr != nil {
			log.Fatal(newReqBodyErr)
		}
		newReq, newErr := http.NewRequest("POST", "sprints/" + sprintId + "/users/", bytes.NewBuffer(newReqBody))
		if newErr != nil {
			log.Fatal(newErr)
		}
		newReq.Header.Set("Content-Type", "application/json")
		return newReq
	}), func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for New User.")
		userId = response.Output[12:48]
		assert.Equal(t, `{"d":{"Id":"` + userId + `","Name":"New User","Vote":-1},"s":200}`, response.Output, "Response should be User object.")
	})

	goweb.Test(t, "GET sprints/" + sprintId + "/users/" + userId, func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for Existing User.")
		assert.Equal(t, `{"d":{"Id":"` + userId + `","Name":"New User","Vote":-1},"s":200}`, response.Output, "Response should be Existing User object.")
	})

	goweb.Test(t, goweb.RequestBuilderFunc(func() *http.Request {
		newReqBody, newReqBodyErr := json.Marshal(map[string]float64{
			"Vote": 0.1,
		})
		if newReqBodyErr != nil {
			log.Fatal(newReqBodyErr)
		}
		newReq, newErr := http.NewRequest("PUT", "sprints/" + sprintId +"/users/" + userId, bytes.NewBuffer(newReqBody))
		if newErr != nil {
			log.Fatal(newErr)
		}
		newReq.Header.Set("Content-Type", "application/json")
		return newReq
	}), func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for User voting.")
	})

	goweb.Test(t, "GET sprints/" + sprintId + "/users/" + userId, func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for Existing User.")
		assert.Equal(t, `{"d":{"Id":"` + userId + `","Name":"New User","Vote":0.1},"s":200}`, response.Output, "Response should be Existing User object.")
	})

	goweb.Test(t, "DELETE sprints/" + sprintId + "/users/" + userId, func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for Deleting User.")
	})

	goweb.Test(t, "GET sprints/"+sprintId+"/users/" + userId, func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusNotFound, response.StatusCode, "Status code should be Not Found for non-existing User.")
	})

}
