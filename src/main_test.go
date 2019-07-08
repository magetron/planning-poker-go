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
		assert.Equal(t, `{"d":{"Id":"` + sprintId + `","Name":"New Sprint"},"s":200}`, response.Output, "Response should contain name New Sprint.")
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

	goweb.Test(t, "GET sprints/" + sprintId + "rounds/", func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusNotFound, response.StatusCode, "Status code should be Not Found for Empty Round.")
	})

}