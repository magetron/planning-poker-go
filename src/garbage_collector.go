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
			for irs, rs := range rc.AllRounds {
				if rs.SprintId == s.Id {
					rc.AllRounds[len(rc.AllRounds)-1], rc.AllRounds[irs] = rc.AllRounds[irs], rc.AllRounds[len(rc.AllRounds)-1]
					rc.AllRounds = rc.AllRounds[:len(rc.AllRounds)-1]
					break
				}
			}
			delete(us.AllUsers, s.Id)
			delete(sc.Sprints, s.Id)
			continue
		}
	}
	return nil
}