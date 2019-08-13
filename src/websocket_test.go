package main

import (
	"bytes"
	"encoding/json"
	"github.com/gorilla/websocket"
	"github.com/stretchr/goweb"
	"github.com/stretchr/goweb/handlers"
	"github.com/stretchr/testify/assert"
	testifyhttp "github.com/stretchr/testify/http"
	"log"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestUpdate(t *testing.T) {
	codecService := goweb.DefaultHttpHandler().CodecService()
	handler := handlers.NewHttpHandler(codecService)
	goweb.SetDefaultHttpHandler(handler)
	mapRoutesV2()
	server := httptest.NewServer(goweb.DefaultHttpHandler())
	defer server.Close()

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
		userId1 = response.Output[12:48]
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
		userId2 = response.Output[12:48]
	})

	creationTime := ""
	goweb.Test(t, goweb.RequestBuilderFunc(func() *http.Request {
		newReqBody, newReqBodyErr := json.Marshal(map[string]string{
			"Name": "Task 1",
		})
		if newReqBodyErr != nil {
			log.Fatal(newReqBodyErr)
		}
		newReq, newErr := http.NewRequest("POST", "sprints/"+sprintId+"/rounds/", bytes.NewBuffer(newReqBody))
		if newErr != nil {
			log.Fatal(newErr)
		}
		newReq.Header.Set("Content-Type", "application/json")
		return newReq
	}), func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		creationTime = response.Output[87:97]
		log.Print(creationTime)
	})

	url := "ws" + strings.Trim(server.URL, "http") + "/info/" + sprintId

	ws, _, err := websocket.DefaultDialer.Dial(url, nil)
	if err != nil {
		t.Fatalf("%v", err)
	}
	defer ws.Close()

	if err := ws.WriteMessage(websocket.TextMessage, []byte("update")); err != nil {
		t.Fatalf("%v", err)
	}
	_, p, err := ws.ReadMessage()
	assert.True(t, `[[{"Id":"`+userId1+`","Name":"New User 1","Vote":-1,"Admin":true},{"Id":"`+userId2+`","Name":"New User 2","Vote":-1,"Admin":false}],{"Rounds":[{"Id":1,"Name":"Task 1","Med":0,"Avg":0,"Final":0,"Archived":false,"CreationTime":` + creationTime + `}],"SprintId":"` + sprintId + `"}]` == string(p) || `[[{"Id":"`+userId2+`","Name":"New User 2","Vote":-1,"Admin":false},{"Id":"`+userId1+`","Name":"New User 1","Vote":-1,"Admin":true}],{"Rounds":[{"Id":1,"Name":"Task 1","Med":0,"Avg":0,"Final":0,"Archived":false,"CreationTime":` + creationTime + `}],"SprintId":"` + sprintId + `"}]` == string(p), "Websocket should be Two Users object.")

}

func TestConnHub (t *testing.T) {
	codecService := goweb.DefaultHttpHandler().CodecService()
	handler := handlers.NewHttpHandler(codecService)
	goweb.SetDefaultHttpHandler(handler)
	mapRoutesV2()
	server := httptest.NewServer(goweb.DefaultHttpHandler())
	defer server.Close()

	sprintId1 := ""
	goweb.Test(t, goweb.RequestBuilderFunc(func() *http.Request {
		newReqBody, newReqBodyErr := json.Marshal(map[string]string{
			"Name": "New Sprint 1",
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
		sprintId1 = response.Output[6:15]
	})

	sprintId2 := ""
	goweb.Test(t, goweb.RequestBuilderFunc(func() *http.Request {
		newReqBody, newReqBodyErr := json.Marshal(map[string]string{
			"Name": "New Sprint 2",
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
		sprintId2 = response.Output[6:15]
	})

	userId1 := ""
	goweb.Test(t, goweb.RequestBuilderFunc(func() *http.Request {
		newReqBody, newReqBodyErr := json.Marshal(map[string]string {
			"Name": "New User Sprint 1",
		})
		if newReqBodyErr != nil {
			log.Fatal(newReqBodyErr)
		}
		newReq, newErr := http.NewRequest("POST", "sprints/" + sprintId1 + "/users/", bytes.NewBuffer(newReqBody))
		if newErr != nil {
			log.Fatal(newErr)
		}
		newReq.Header.Set("Content-Type", "application/json")
		return newReq
	}), func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		userId1 = response.Output[12:48]
	})

	userId2 := ""
	goweb.Test(t, goweb.RequestBuilderFunc(func() *http.Request {
		newReqBody, newReqBodyErr := json.Marshal(map[string]string {
			"Name": "New User Sprint 2",
		})
		if newReqBodyErr != nil {
			log.Fatal(newReqBodyErr)
		}
		newReq, newErr := http.NewRequest("POST", "sprints/" + sprintId2 + "/users/", bytes.NewBuffer(newReqBody))
		if newErr != nil {
			log.Fatal(newErr)
		}
		newReq.Header.Set("Content-Type", "application/json")
		return newReq
	}), func(t *testing.T, response *testifyhttp.TestResponseWriter) {
		userId2 = response.Output[12:48]
	})

	url1 := "ws" + strings.Trim(server.URL, "http") + "/info/" + sprintId1

	ws1, _, err1 := websocket.DefaultDialer.Dial(url1, nil)
	if err1 != nil {
		t.Fatalf("%v", err1)
	}
	defer ws1.Close()

	ws1_1, _, err1 := websocket.DefaultDialer.Dial(url1, nil)
	if err1 != nil {
		t.Fatalf("%v", err1)
	}
	defer ws1_1.Close()

	if err1 := ws1.WriteMessage(websocket.TextMessage, []byte("update")); err1 != nil {
		t.Fatalf("%v", err1)
	}
	_, p1, err1 := ws1.ReadMessage()
	assert.Equal(t, `[[{"Id":"` + userId1 + `","Name":"New User Sprint 1","Vote":-1,"Admin":true}]]`, string(p1))

	_, p1, err1 = ws1_1.ReadMessage()
	assert.Equal(t, `[[{"Id":"` + userId1 + `","Name":"New User Sprint 1","Vote":-1,"Admin":true}]]`, string(p1))


	url2 := "ws" + strings.Trim(server.URL, "http") + "/info/" + sprintId2

	ws2, _, err2 := websocket.DefaultDialer.Dial(url2, nil)
	if err2 != nil {
		t.Fatalf("%v", err2)
	}
	defer ws2.Close()

	ws2_1, _, err2 := websocket.DefaultDialer.Dial(url2, nil)
	if err2 != nil {
		t.Fatalf("%v", err2)
	}

	if err2 := ws2_1.WriteMessage(websocket.TextMessage, []byte("update")); err2 != nil {
		t.Fatalf("%v", err2)
	}

	_, p2, err2 := ws2.ReadMessage()
	assert.Equal(t, `[[{"Id":"` + userId2 + `","Name":"New User Sprint 2","Vote":-1,"Admin":true}]]`, string(p2))
}
