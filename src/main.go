package main

import (
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/stretchr/goweb"
	"github.com/stretchr/goweb/context"
)

const (
	Address string = ":8080"
)

func mapRoutes() {
	goweb.Map("/", func(c context.Context) error {
		return goweb.Respond.With(c, 200, []byte("Welcome to Planning Poker backend."))
	})

	goweb.MapController(&SprintsController{})
	goweb.MapController("sprints/[id]/round", &RoundsController{})
	goweb.MapStatic("/index", "static-ui")
	goweb.MapStaticFile("/main-es2015.js", "static-ui/main-es2015.js")
	goweb.MapStaticFile("/polyfills-es2015.js", "static-ui/polyfills-es2015.js")
	goweb.MapStaticFile("/runtime-es2015.js", "static-ui/runtime-es2015.js")
	goweb.MapStaticFile("/styles-es2015.js", "static-ui/styles-es2015.js")
	goweb.MapStaticFile("/vendor-es2015.js", "static-ui/vendor-es2015.js")
}

func main() {
	mapRoutes()

	log.Print("Staring server ...")

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
