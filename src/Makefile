GOCMD=go
GOBUILD=$(GOCMD) build
GOCLEAN=$(GOCMD) clean
GOTEST=$(GOCMD) test
GOGET=$(GOCMD) get
ARCH=amd64
BINARY_NAME=planningpoker
BINARY_UNIX=$(BINARY_NAME)_unix
NGCMD=ng
NGSERVE=$(NGCMD) serve
NGBUILD=$(NGCMD) build
NGTEST=$(NGCMD) test --code-coverage --karma-config ./karma-headless.conf.js --progress false
UINAME=ui
UIPATH=../static-ui


.PHONY: dev prod docker build-dev build-prod test clean run-dev run

dev: 
	$(MAKE) test 
	$(MAKE) build

prod:
	$(MAKE) test 
	$(MAKE) build-prod

docker:
	export PP_DEV=false
	$(MAKE) test
	$(MAKE) build-linux --configuration=fargate

integration:
	export PP_DEV=false
	$(MAKE) test
	$(MAKE) build-linux --configuration=integration

build-dev:
	export PP_DEV=true
	$(GOBUILD) -o $(BINARY_NAME) -v
	cd _gc; $(GOBUILD) -o ../gc
	cd ui; $(NGBUILD) $(UINAME) --outputPath=$(UIPATH)

build-prod:
	export PP_DEV=false
	$(GOBUILD) -o $(BINARY_NAME) -v
	cd _gc; $(GOBUILD) -o ../gc
	cd ui; $(NGBUILD) --configuration=production $(UINAME) --outputPath=$(UIPATH)

build-linux:
	env GOOS=linux GOARCH=$(ARCH) $(GOBUILD) -o $(BINARY_NAME)
	cd _gc; env GOOS=linux GOARCH=$(ARCH) $(GOBUILD) -o ../gc
	cd ui; $(NGBUILD) $(UINAME) --outputPath=$(UIPATH)

test:
	$(GOTEST) --cover -v ./...
	cd ui; $(NGTEST)

clean:
	$(GOCLEAN)
	rm -f $(BINARY_NAME)
	cd ui; rm -rf $(UIPATH)
	rm -f gc
	env --unset=PP_DEV

run-dev:
	export PP_DEV=true
	$(GOBUILD) -o $(BINARY_NAME) -v ./...
	./$(BINARY_NAME) &
	cd ui; $(NGSERVE)

run-prod:
	export PP_DEV=false
	cd _gc; $(GOBUILD) -o ../gc
	./gc &
	$(GOBUILD) -o $(BINARY_NAME) -v ./...
	./$(BINARY_NAME)

# Add to let `make` work
build:
	$(MAKE) run-dev
