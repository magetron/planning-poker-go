FROM golang:1.12.7-stretch

EXPOSE 8080


COPY ./src .

RUN ls

RUN go get github.com/google/uuid
RUN go get github.com/gorilla/websocket
RUN go get github.com/stretchr/goweb
RUN go get github.com/stretchr/codecs
RUN go get github.com/stretchr/objx
RUN go get github.com/stretchr/stew
RUN go get github.com/stretchr/testify
RUN go get github.com/teris-io/shortid

RUN make build

EXPOSE 8080

CMD ["./planningpoker"]

