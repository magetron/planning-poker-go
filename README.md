# Planning Poker in Go

Powered by Interns

# Building & running
```bash
cd /src
source ./build-static-ui.sh
go run *.go
```

#Testing (to be automated)

## Sprint Sessions
```bash
curl -d '{"Name":"First Sprint"}' -H 'Content-Type: application/json' http://localhost:8080/sprints
curl http://localhost:8080/sprints
```

## Users
``` bash
curl -d '{"Name":"John Appleseed"}' -H 'Content-Type: application/json' http://localhost:8080/sprints/[sprintId]]/users
curl http://localhost:8080/sprints/[sprintId]/users
```

## Rounds
```
curl -d '{"Name":"Task 1"}' -H 'Content-Type: application/json' http://localhost:8080/sprints/[sprintId]]/rounds
curl http://localhost:8080/sprints/[sprintId]/rounds
```