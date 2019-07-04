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

var DEV = false

func mapRoutes() {

	if DEV {
		_, _ = goweb.MapBefore(func(c context.Context) error {
			c.HttpResponseWriter().Header().Set("Access-Control-Allow-Origin", "*")
			c.HttpResponseWriter().Header().Set("Access-Control-Allow-Credentials", "true")
			c.HttpResponseWriter().Header().Set("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT")
			c.HttpResponseWriter().Header().Set("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers")
			return nil
		})
	}

	_, _ = goweb.Map("GET", "/", func(c context.Context) error {
		return goweb.Respond.WithRedirect(c, "/index", "")
	})

	sc := new(SprintsController)
	rc := new(RoundsController)
	us := new(UsersService)

	_ = goweb.MapController(sc)
	_ = goweb.MapController("sprints/[sprintId]/rounds", rc)
	_ = goweb.MapController("sprints/[sprintId]/users", us)

	if !DEV {
		_, _ = goweb.MapStatic("/index", "static-ui")
		_, _ = goweb.MapStaticFile("/main-es2015.js", "static-ui/main-es2015.js")
		_, _ = goweb.MapStaticFile("/polyfills-es2015.js", "static-ui/polyfills-es2015.js")
		_, _ = goweb.MapStaticFile("/runtime-es2015.js", "static-ui/runtime-es2015.js")
		_, _ = goweb.MapStaticFile("/styles-es2015.js", "static-ui/styles-es2015.js")
		_, _ = goweb.MapStaticFile("/vendor-es2015.js", "static-ui/vendor-es2015.js")
	}
}

func main() {

	mapRoutes()

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
