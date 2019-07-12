FROM centos 

EXPOSE 8080

COPY ./src ~/

WORKDIR ~/

RUN yum -y update
RUN yum -y install git wget

RUN wget https://dl.google.com/go/go1.12.7.linux-amd64.tar.gz
RUN tar -C /usr/local -xzf go1.12.7.linux-amd64.tar.gz
ENV GOROOT=/usr/local/go 
ENV PATH=$GOROOT/bin:$PATH 

RUN go get -v ./...
