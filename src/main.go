package main

import (
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"strconv"
	"time"

	"github.com/stretchr/goweb"
	"github.com/stretchr/goweb/context"
)

const (
	Address string = ":8080"
)

var DEV = true

var sc = new(SprintsController)
var rc = new(RoundsController)
var us = new(UsersService)
var hc = new(HubsController)

func mapRoutesV2() {

	if DEV {
		_, _ = goweb.MapBefore(func(c context.Context) error {
			c.HttpResponseWriter().Header().Set("Access-Control-Allow-Origin", "*")
			c.HttpResponseWriter().Header().Set("Access-Control-Allow-Credentials", "true")
			c.HttpResponseWriter().Header().Set("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE")
			c.HttpResponseWriter().Header().Set("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers")
			return nil
		})
	}

	_, _ = goweb.Map("GET", "", func(c context.Context) error {
		return goweb.Respond.WithRedirect(c, "v2/index", "")
	})

	_ = goweb.MapController("v2/sprints/", sc)
	_ = goweb.MapController("v2/sprints/[sprintId]/rounds", rc)
	_ = goweb.MapController("v2/sprints/[sprintId]/users", us)

	_, _ = goweb.Map("v2/info/[sprintId]/users/[userId]", hc.handleHubs)

	_, _ = goweb.Map("POST", "v2/gc", garbageCollector)

	_, _ = goweb.Map("POST", "v2/sprints/[sprintId]/users/[userId]/setadmin", us.SetAdmin)

	_, _ = goweb.Map("POST", "v2/sprints/[sprintId]/users/[userId]/showvote", us.ShowVote)

	if !DEV {
		root := "./static-ui"
		fileErr := filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
			if path != "./static-ui" {
				_, _ = goweb.MapStaticFile(path[10:], path)
			}
			return nil
		})

		if fileErr != nil {
			log.Fatalf("Could not scan static files %s", fileErr)
		}

	}
}

func mapRoutesV1() {

	if DEV {
		_, _ = goweb.MapBefore(func(c context.Context) error {
			c.HttpResponseWriter().Header().Set("Access-Control-Allow-Origin", "*")
			c.HttpResponseWriter().Header().Set("Access-Control-Allow-Credentials", "true")
			c.HttpResponseWriter().Header().Set("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE")
			c.HttpResponseWriter().Header().Set("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers")
			return nil
		})
	}

	_, _ = goweb.Map("GET", "v1", func(c context.Context) error {
		return goweb.Respond.WithRedirect(c, "v1/index", "")
	})

	_ = goweb.MapController("v1/sprints/", sc)
	_ = goweb.MapController("v1/sprints/[sprintId]/rounds", rc)
	_ = goweb.MapController("v1/sprints/[sprintId]/users", us)

	_, _ = goweb.Map("v1/info/[sprintId]", hc.handleHubs)

	_, _ = goweb.Map("POST", "v1/gc", garbageCollector)

	_, _ = goweb.Map("POST", "v1/sprints/[sprintId]/users/[userId]/setadmin", us.SetAdmin)

	_, _ = goweb.Map("POST", "v1/sprints/[sprintId]/users/[userId]/showvote", us.ShowVote)

	if !DEV {
		root := "./static-ui"
		fileErr := filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
			if path != "./static-ui" {
				_, _ = goweb.MapStaticFile(path[10:], path)
			}
			return nil
		})

		if fileErr != nil {
			log.Fatalf("Could not scan static files %s", fileErr)
		}

	}
}

func main() {

	DEV, _ = strconv.ParseBool(os.Getenv("PP_DEV"))

	mapRoutesV2()
	mapRoutesV1()

	log.Print("Staring server ...")

	if DEV {
		log.Print("In DEV mode, all CORS access will be allowed (UNSAFE).")
		log.Print("DO NOT use in production.")
	} else {
		log.Print("In PROD mode, all pages will be statically mapped. Run ./build-static-ui.sh to build static ui with Angular.")
	}

	server := &http.Server{
		Addr:           Address,
		Handler:        goweb.DefaultHttpHandler(),
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 32,
	}

	channel := make(chan os.Signal, 1)
	signal.Notify(channel, os.Interrupt)
	listener, listenErr := net.Listen("tcp", Address)

	log.Printf("Server running on port %s", Address)

	if listenErr != nil {
		log.Fatalf("Could not listen %s", listenErr)
	}

	log.Println("Server routes : ")
	log.Printf("%s", goweb.DefaultHttpHandler())
	go func() {
		for _ = range channel {
			log.Print("Stop Signal Detected. Stopping ...")
			listener.Close()
			log.Fatal("Stopped.")
		}
	}()

	log.Fatalf("Error in Server: %s", server.Serve(listener))

}
