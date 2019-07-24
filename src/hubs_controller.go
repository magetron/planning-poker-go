package main

import (
	"github.com/stretchr/goweb/context"
)

type HubsController struct {
	Hubs []*ConnHub
}

func (hc *HubsController) handleHubs (ctx context.Context) error {
	sprintId := ctx.PathValue("sprintId");
	for _, hub := range hc.Hubs {
		if hub.Id == sprintId {
			err := wsHandler(sprintId, hub, ctx)
			return err
		}
	}
	hub := NewConnHub(sprintId)
	go hub.Run()
	hc.Hubs = append(hc.Hubs, hub)
	err := wsHandler(sprintId, hub, ctx)
	return err
}