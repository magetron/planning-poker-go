FROM golang:1.12.7-stretch

VOLUME /tmp

EXPOSE 8080

ADD ./src/planningpoker planningpoker

ENTRYPOINT ["./planningpoker"]
