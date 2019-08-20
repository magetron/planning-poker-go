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

func TestEmptyRound(t *testing.T) {

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
		newReq, newErr := http.NewRequest("POST", "v2/sprints/", bytes.NewBuffer(newReqBody))
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

	goweb.Test(t, "GET v2/sprints/"+sprintId+"rounds/", func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusNotFound, response.StatusCode, "Status code should be Not Found for Empty Round.")
	})

	goweb.Test(t, "DELETE v2/sprints/", func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for deleting Sprints.")
	})
}

func TestRoundErr(t *testing.T) {
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
		newReq, newErr := http.NewRequest("POST", "v2/sprints/", bytes.NewBuffer(newReqBody))
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
		newReq, newErr := http.NewRequest("POST", "v2/sprints/abcdef/rounds", bytes.NewBufferString(""))
		if newErr != nil {
			log.Fatal(newErr)
		}
		newReq.Header.Set("Content-Type", "application/json")
		return newReq
	}), func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusInternalServerError, response.StatusCode, "Status code should be Internal Server Error for no payload.")
	})

	goweb.Test(t, "GET v2/sprints/"+sprintId+"/rounds/", func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, `{"d":[],"s":200}`, response.Output, "Should have no info for Rounds.")
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for Existing Round.")
	})

	goweb.Test(t, "GET v2/sprints/abcdefg/rounds/1", func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusNotFound, response.StatusCode, "Status code should be Not found for non existing Sprints of Rounds.")
	})

	goweb.Test(t, "GET v2/sprints/"+sprintId+"/rounds/abcde", func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusInternalServerError, response.StatusCode, "Status code should be OK for Existing Round.")
	})

	goweb.Test(t, goweb.RequestBuilderFunc(func() *http.Request {
		newReqBody, newReqBodyErr := json.Marshal(map[string]string{
			"Name": "Task 1",
		})
		if newReqBodyErr != nil {
			log.Fatal(newReqBodyErr)
		}
		newReq, newErr := http.NewRequest("POST", "v2/sprints/"+sprintId+"/rounds/", bytes.NewBuffer(newReqBody))
		if newErr != nil {
			log.Fatal(newErr)
		}
		newReq.Header.Set("Content-Type", "application/json")
		return newReq
	}), func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for New Round.")
	})

	goweb.Test(t, "GET v2/sprints/"+sprintId+"/rounds/2", func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusNotFound, response.StatusCode, "Status code should be Not found for non existing Round.")
	})

	goweb.Test(t, goweb.RequestBuilderFunc(func() *http.Request {
		newReqBody, newReqBodyErr := json.Marshal(map[string]float64{
			"Average": 0.5,
			"Median": 8,
			"Final": 5,
		})
		if newReqBodyErr != nil {
			log.Fatal(newReqBodyErr)
		}
		newReq, newErr := http.NewRequest("PUT", "v2/sprints/abcdef/rounds/5", bytes.NewBuffer(newReqBody))
		if newErr != nil {
			log.Fatal(newErr)
		}
		newReq.Header.Set("Content-Type", "application/json")
		return newReq
	}), func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusNotFound, response.StatusCode, "Status code should be Not found for non-existing Round.")
	})

	goweb.Test(t, goweb.RequestBuilderFunc(func() *http.Request {
		newReqBody, newReqBodyErr := json.Marshal(map[string]float64{
			"Average": 0.5,
			"Median": 8,
			"Final": 5,
		})
		if newReqBodyErr != nil {
			log.Fatal(newReqBodyErr)
		}
		newReq, newErr := http.NewRequest("PUT", "v2/sprints/abcdef/rounds/abcd", bytes.NewBuffer(newReqBody))
		if newErr != nil {
			log.Fatal(newErr)
		}
		newReq.Header.Set("Content-Type", "application/json")
		return newReq
	}), func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusInternalServerError, response.StatusCode, "Status code should be Internal Server Error for wrong round id.")
	})

	goweb.Test(t, goweb.RequestBuilderFunc(func() *http.Request {
		newReq, newErr := http.NewRequest("PUT", "v2/sprints/abcdef/rounds/abcd", bytes.NewBufferString(""))
		if newErr != nil {
			log.Fatal(newErr)
		}
		newReq.Header.Set("Content-Type", "application/json")
		return newReq
	}), func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusInternalServerError, response.StatusCode, "Status code should be Internal Server Error for no payload.")
	})

	goweb.Test(t, "DELETE v2/sprints/", func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for deleting Sprints.")
	})

}

func TestRoundCycle(t *testing.T) {

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
		newReq, newErr := http.NewRequest("POST", "v2/sprints/", bytes.NewBuffer(newReqBody))
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
		newReq, newErr := http.NewRequest("POST", "v2/sprints/"+sprintId+"/rounds/", bytes.NewBuffer(newReqBody))
		if newErr != nil {
			log.Fatal(newErr)
		}
		newReq.Header.Set("Content-Type", "application/json")
		return newReq
	}), func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for New Round.")
	})

	goweb.Test(t, goweb.RequestBuilderFunc(func() *http.Request {
		newReqBody, newReqBodyErr := json.Marshal(map[string]string{
			"Name": "Task 2",
		})
		if newReqBodyErr != nil {
			log.Fatal(newReqBodyErr)
		}
		newReq, newErr := http.NewRequest("POST", "v2/sprints/"+sprintId+"/rounds/", bytes.NewBuffer(newReqBody))
		if newErr != nil {
			log.Fatal(newErr)
		}
		newReq.Header.Set("Content-Type", "application/json")
		return newReq
	}), func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for New Round.")
	})

	goweb.Test(t, "GET v2/sprints/"+sprintId+"/rounds/", func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, `{"d":{"Rounds":[{"Id":1,"Name":"Task 1","Med":0,"Avg":0,"Final":0,"Archived":false`, response.Output[:82], "Should have exact same information for new Round.")
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for Existing Round.")
	})

	goweb.Test(t, goweb.RequestBuilderFunc(func() *http.Request {
		newReqBody, newReqBodyErr := json.Marshal(map[string]float64{
			"Average": 0.5,
			"Median": 8,
			"Final": 5,
		})
		if newReqBodyErr != nil {
			log.Fatal(newReqBodyErr)
		}
		newReq, newErr := http.NewRequest("PUT", "v2/sprints/"+sprintId+"/rounds/1", bytes.NewBuffer(newReqBody))
		if newErr != nil {
			log.Fatal(newErr)
		}
		newReq.Header.Set("Content-Type", "application/json")
		return newReq
	}), func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for existing Round.")
	})

	goweb.Test(t, goweb.RequestBuilderFunc(func() *http.Request {
		newReqBody, newReqBodyErr := json.Marshal(map[string]float64{
			"Average": 0.5,
			"Median": 8,
			"Final": 5,
		})
		if newReqBodyErr != nil {
			log.Fatal(newReqBodyErr)
		}
		newReq, newErr := http.NewRequest("PUT", "v2/sprints/"+sprintId+"/rounds/5", bytes.NewBuffer(newReqBody))
		if newErr != nil {
			log.Fatal(newErr)
		}
		newReq.Header.Set("Content-Type", "application/json")
		return newReq
	}), func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusNotFound, response.StatusCode, "Status code should be Not found for non-existing Round.")
	})

	goweb.Test(t, "GET v2/sprints/" + sprintId + "/users/", func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, `{"d":{},"s":200}`, response.Output, "Response should be empty for no Users.")
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for All Users.")
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
		newReq, newErr := http.NewRequest("POST", "v2/sprints/"+sprintId+"/users/", bytes.NewBuffer(newReqBody))
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
		newReq, newErr := http.NewRequest("POST", "v2/sprints/"+sprintId+"/users/", bytes.NewBuffer(newReqBody))
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

	goweb.Test(t, goweb.RequestBuilderFunc(func() *http.Request {
		newReqBody, newReqBodyErr := json.Marshal(map[string]float64{
			"Average": 0.5,
			"Median": 8,
			"Final": 5,
		})
		if newReqBodyErr != nil {
			log.Fatal(newReqBodyErr)
		}
		newReq, newErr := http.NewRequest("PUT", "v2/sprints/"+sprintId+"/rounds/1", bytes.NewBuffer(newReqBody))
		if newErr != nil {
			log.Fatal(newErr)
		}
		newReq.Header.Set("Content-Type", "application/json")
		return newReq
	}), func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for existing Round.")
	})

	goweb.Test(t, "GET v2/sprints/"+sprintId+"/rounds/1", func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, `{"d":{"Id":1,"Name":"Task 1","Med":8,"Avg":0.5,"Final":5,"Archived":true`, response.Output[:72], "Should have exact same information for new Round.")
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for Existing Round.")
	})


	goweb.Test(t, "DELETE v2/sprints/"+sprintId+"/rounds/", func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for deleting all rounds.")
	})

	goweb.Test(t, "GET v2/sprints/"+sprintId+"/rounds/", func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for querying all rounds.")
		assert.Equal(t, `{"d":[],"s":200}`, response.Output, "Should be empty after deleting all rounds.")
	})

	goweb.Test(t, "DELETE v2/sprints/", func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		assert.Equal(t, http.StatusOK, response.StatusCode, "Status code should be OK for deleting Sprints.")
	})
}