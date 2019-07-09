package main

import (
	"bytes"
	"net/http"
	"time"
)

var localPort = "8080"

func main () {
	for {
		_, _ = http.Post("http://localhost:" + localPort +"/gc", "", bytes.NewBuffer([]byte("")))
		time.Sleep(12 * time.Hour)
	}
}