package main

import "github.com/gorilla/websocket"

type ConnHub struct {
	Clients map[*Client]string
	Broadcast chan []byte
	Register chan *Client
	Unregister chan*Client
}

func NewConnHub() *ConnHub {
	return &ConnHub {
		Clients: make(map[*Client]string),
		Broadcast: make(chan []byte),
		Register: make(chan *Client),
		Unregister: make(chan *Client),
	}
}

func (hub *ConnHub) Run() {
	for {
		select {
			case client := <- hub.Register: hub.Clients[client] = client.Name
			case client := <- hub.Unregister:
				if _, ok := hub.Clients[client]; ok {
					delete(hub.Clients, client)
					close(client.Send)
				}
			case message := <- hub.Broadcast:
				for client := range hub.Clients {
					select {
						case client.Send <- message:
						default:
							close(client.Send)
							delete(hub.Clients, client)
					}
				}
		}
	}
}