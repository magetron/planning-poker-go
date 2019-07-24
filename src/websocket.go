package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
	"github.com/stretchr/goweb/context"
)

const (
	writeWait      = 10 * time.Second
	pingPeriod     = (pongWait * 9) / 10
	pongWait       = 60 * time.Second
	maxMessageSize = 512
)

type Client struct {
	Id string
	Hub *ConnHub
	Conn *websocket.Conn
	Send chan []byte
}

var wsUpgrader = websocket.Upgrader{
	ReadBufferSize: 1024,
	WriteBufferSize: 1024,
	CheckOrigin: func (r *http.Request) bool {
		return true
	},
}

func (c *Client) readPump() {
	defer func () {
		c.Hub.Unregister <- c
		_ = c.Conn.Close()
	}()

	c.Conn.SetReadLimit(maxMessageSize)
	c.Conn.SetReadDeadline(time.Now().Add(pongWait))
	c.Conn.SetPongHandler(func(string) error {
		c.Conn.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})

	for {
		_, message, err := c.Conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("connection drop with error %v", err)
			}
			break
		}
		sprintId := c.Hub.Id
		if string(message) == "update" {
			for _, users := range us.AllUsers {
				if sprintId == users.SprintId {
					newMessage, jsonErr := json.Marshal(users)
					if jsonErr != nil {
						log.Println(jsonErr)
					}
					c.Hub.Broadcast <- newMessage
					break
				}
			}
			for _, rounds := range rc.AllRounds {
				if sprintId == rounds.SprintId {
					newMessage, jsonErr := json.Marshal(rounds)
					if jsonErr != nil {
						log.Println(jsonErr)
					}
					c.Hub.Broadcast <- newMessage
					break
				}
			}
		}
	}
}

func (c *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		err := c.Conn.Close()
		if err != nil {
			log.Print(err)
		}
	}()

	for {
		select {
		case message, ok := <-c.Send:
			c.Conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.Conn.NextWriter(websocket.TextMessage)
			if err != nil {
				log.Fatal(err)
			}
			_, _ = w.Write(message)

			sendLen := len(c.Send)

			for i := 0; i < sendLen; i++ {
				w.Write(<-c.Send)
			}

			if err := w.Close(); err != nil {
				log.Print(err)
			}
		case <-ticker.C:
			c.Conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.Conn.WriteMessage(websocket.PingMessage, []byte{}); err != nil {
				log.Print(err)
			}
		}
	}
}

func wsHandler (sprintId string, hub *ConnHub, ctx context.Context) error {
	r := ctx.HttpRequest()
	w := ctx.HttpResponseWriter()
	conn, err := wsUpgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
	}

	client := &Client{
		Id: sprintId,
		Hub: hub,
		Conn: conn,
		Send: make(chan []byte, 256),
	}
	client.Hub.Register <- client

	go client.writePump()
	go client.readPump()

	return err
}
