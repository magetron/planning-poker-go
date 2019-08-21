package main

import (
	"log"
	"time"
	"github.com/stretchr/goweb/context"
)

func garbageCollector(ctx context.Context) error {
	log.Print("Collecting Garbage...")
	for _, s := range sc.Sprints {
		if time.Now().Sub(s.CreationTime).Hours() > 12 {
			delete(rc.AllRounds, s.Id)
			delete(us.AllUsers, s.Id)
			delete(sc.Sprints, s.Id)
			continue
		}
	}
	return nil
}