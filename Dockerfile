FROM centos 

EXPOSE 8080

COPY ./src .

RUN yum -y update
RUN yum -y install git

RUN wget https://dl.google.com/go/go1.12.7.linux-amd64.tar.gz
RUN tar -xzf go1.12.6.linux-amd64.tar.gz
RUN mv go /usr/local

RUN export GOROOT=/usr/local/go
RUN export GOPATH=$HOME
RUN export PATH=$GOPATH/bin:$GOROOT/bin:$PATH

RUN go get -v ./...

RUN make run

EXPOSE 8080

CMD ["./planningpoker"]

