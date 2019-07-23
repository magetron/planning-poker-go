package main

import (
	"fmt"
	"net/http"
	"time"
	"encoding/json"

	"github.com/gorilla/websocket"
)

const (
	writeWait = 10 * time.Second
	pingPeroid = (pongWait * 9) / 10
	pongWait = 60 * time.Second
	maxMessageSize = 512
)

var wsupgrader = websocket.Upgrader{
	ReadBufferSize: 1024,
	WriteBufferSize: 1024,
	CheckOrigin: func (r *http.Request) bool {
		return true
	},
}
