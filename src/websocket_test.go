package main

import (
	"github.com/gorilla/websocket"
	"github.com/stretchr/goweb"
	"github.com/stretchr/goweb/handlers"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize: 1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func TestHub (t *testing.T) {
	codecService := goweb.DefaultHttpHandler().CodecService()
	handler := handlers.NewHttpHandler(codecService)
	goweb.SetDefaultHttpHandler(handler)
	mapRoutes()
	server := httptest.NewServer(goweb.DefaultHttpHandler())
	defer server.Close()

	sprintId := ""

	url := "ws" + strings.Trim(server.URL, "http") + "info/" + sprintId

	ws, _, err := websocket.DefaultDialer.Dial(url, nil)
	if err != nil {
		t.Fatalf("%v", err)
	}
	defer ws.Close()



}

