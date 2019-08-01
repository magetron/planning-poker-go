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
NGPROD=$(NGCMD) build --prod
NGTEST=$(NGCMD) test --code-coverage --karma-config .config/karma-headless.conf.js --progress false
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
	$(MAKE) test
	mv ui/src/app/services/globals.service.ts ui/src/app/services/globals.service.ts.tmp && \
	cp ui/src/app/services/globals-docker.service.ts ui/src/app/services/globals.service.ts && \
	$(MAKE) build-linux && \
	mv ui/src/app/services/globals.service.ts.tmp ui/src/app/services/globals.service.ts || \
	mv ui/src/app/services/globals.service.ts.tmp ui/src/app/services/globals.service.ts

build-dev:
	$(GOBUILD) -o $(BINARY_NAME) -v
	cd ui; $(NGBUILD) $(UINAME) --outputPath=$(UIPATH)
	cd _gc; $(GOBUILD) -o ../gc

build-prod:
	$(GOBUILD) -o $(BINARY_NAME) -v
	cd ui; $(NGPROD) $(UINAME) --outputPath=$(UIPATH)
	cd _gc; $(GOBUILD) -o ../gc

build-linux:
	env GOOS=linux GOARCH=$(ARCH) $(GOBUILD) -o $(BINARY_NAME)
	cd ui; $(NGPROD) $(UINAME) --outputPath=$(UIPATH)
	cd _gc; env GOOS=linux GOARCH=$(ARCH) $(GOBUILD) -o ../gc

test:
	$(GOTEST) --cover -v ./...
	cd ui; $(NGTEST)

clean:
	$(GOCLEAN)
	rm -f $(BINARY_NAME)
	cd ui; rm -rf $(UIPATH)
	rm -f gc

run-dev:
	$(GOBUILD) -o $(BINARY_NAME) -v ./...
	./$(BINARY_NAME) &
	cd ui; $(NGSERVE)

run-prod:
	cd _gc; $(GOBUILD) -o ../gc
	./gc &
	$(GOBUILD) -o $(BINARY_NAME) -v ./...
	./$(BINARY_NAME)

# Add to let `make` work
build:
	$(MAKE) run-dev
