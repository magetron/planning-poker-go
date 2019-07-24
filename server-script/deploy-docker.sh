#!/bin/sh
docker rm $(docker stop $(docker ps -a -q --filter ancestor=planningpoker --format="{{.ID}}"))
docker load < planningpoker.tar
rm -f planningpoker.tar
docker run -d -p 8080:8080 planningpoker
