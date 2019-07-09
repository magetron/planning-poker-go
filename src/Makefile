GOCMD=go
GOBUILD=$(GOCMD) build
GOCLEAN=$(GOCMD) clean
GOTEST=$(GOCMD) test
GOGET=$(GOCMD) get
BINARY_NAME=planningpoker
BINARY_UNIX=$(BINARY_NAME)_unix
NGCMD=ng
NGSERVE=$(NGCMD) serve
NGBUILD=$(NGCMD) build
NGPROD=$(NGCMD) build --prod
UINAME=ui
UIPATH=../static-ui

.PHONY: dev prod build build-prod test clean run-dev run

dev: 
	make test 
	make build

prod:
	make test 
	make build-prod

build:
	$(GOBUILD) -o $(BINARY_NAME) -v
	cd ui; $(NGBUILD) $(UINAME) --outputPath=$(UIPATH)
	cd _gc; $(GOBUILD) -o ../gc

build-prod:
	$(GOBUILD) -o $(BINARY_NAME) -v
	cd ui; $(NGPROD) $(UINAME) --outputPath=$(UIPATH)
	cd _gc; $(GOBUILD) -o ../gc

test:
	$(GOTEST) -v ./...

clean:
	$(GOCLEAN)
	rm -f $(BINARY_NAME)
	rm -f $(BINARY_UNIX)
	cd ui; rm -rf $(UIPATH)
	rm -f gc

run-dev:
	$(GOBUILD) -o $(BINARY_NAME) -v ./...
	./$(BINARY_NAME) &
	cd ui; $(NGSERVE)

run:
	cd _gc; $(GOBUILD) -o ../gc
	./gc &
	$(GOBUILD) -o $(BINARY_NAME) -v ./...
	./$(BINARY_NAME)
