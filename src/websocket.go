package main

import (
	"bytes"
	"log"
	"net/http"
	"time"
	_ "encoding/json"

	"github.com/stretchr/goweb/context"
	"github.com/gorilla/websocket"
)

const (
	writeWait = 10 * time.Second
	pingPeroid = (pongWait * 9) / 10
	pongWait = 60 * time.Second
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
				log.Printf("error: %v", err)
			}
			break
		}
		message = bytes.TrimSpace(bytes.Replace(message, []byte{'\n'}, []byte{' '}, -1))
		c.Hub.Broadcast <- message
	}
}

func (c *Client) writePump() {
	ticker := time.NewTicker(pingPeroid)
	defer func() {
		ticker.Stop()
		err := c.Conn.Close()
		if err != nil {
			log.Fatal(err)
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
				log.Fatal(err)
			}
		case <-ticker.C:
			c.Conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.Conn.WriteMessage(websocket.PingMessage, []byte{}); err != nil {
				log.Fatal(err)
			}
		}
	}
}

func wsHandler (hub *ConnHub, ctx context.Context) error {
	r := ctx.HttpRequest()
	w := ctx.HttpResponseWriter()
	conn, err := wsUpgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
	}

	id := ctx.PathValue("sprintId")
	client := &Client{
		Id: id,
		Hub: hub,
		Conn: conn,
		Send: make(chan []byte, 256),
	}
	client.Hub.Register <- client

	go client.writePump()
	go client.readPump()

	return err
}



func hubHandler
