package main

import (
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"time"
	"path/filepath"

	"github.com/stretchr/goweb"
	"github.com/stretchr/goweb/context"
	"github.com/gorilla/websocket"
)

const (
	Address string = ":8080"
)

var DEV = true

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


	upgrader := websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
	}

	_, _ = goweb.Map("userinfo", func (ctx context.Context) error {
		r := ctx.HttpRequest()
		w := ctx.HttpResponseWriter()
		upgrader.CheckOrigin = func(r *http.Request) bool {
			return true
		}
		ws, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println(err)
		}
		log.Println("WebSocket Client Connected")
		us.Update(ws)
		return ws.Close()
	})

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
