FROM golang:1.12.7-stretch

EXPOSE 8080

WORKDIR ./src

COPY . .

RUN go get -d -v ./...

RUN make build

EXPOSE 8080

CMD ["./planningpoker"]

