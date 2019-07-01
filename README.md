# Planning Poker in Go

Powered by Interns

# Building & running
```bash
cd /src
source ./build-static-ui.sh
go run *.go
```

#Testing (to be automated)
curl -d '{"Name":"First Sprint"}' -H 'Content-Type: application/json' http://localhost:8080/sprints
curl http://localhost:8080/sprints
