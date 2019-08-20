package main

import (
	"github.com/stretchr/goweb/context"
)

type HubsController struct {
	Hubs map[string]*ConnHub
}

func (hc *HubsController) handleHubs (ctx context.Context) error {
	if hc.Hubs == nil {
		hc.Hubs = make(map[string]*ConnHub)
	}

	sprintId := ctx.PathValue("sprintId")
	userId := ctx.PathValue("userId")
	hub, exist := hc.Hubs[sprintId]

	if exist {
		err := wsHandler(sprintId, userId, hub, ctx)
		return err
	} else {
		hub := NewConnHub(sprintId)
		go hub.Run()
		hc.Hubs[sprintId] = hub
		err := wsHandler(sprintId, userId, hub, ctx)
		return err
	}
}