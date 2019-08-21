GOCMD=go
GOBUILD=$(GOCMD) build
GOCLEAN=$(GOCMD) clean
GOTEST=$(GOCMD) test
GOGET=$(GOCMD) get
ARCH=amd64
BINARY_NAME=planningpoker
BINARY_UNIX=$(BINARY_NAME)_unix
NGCMD=npx ng
NGSERVE=$(NGCMD) serve
NGBUILD=$(NGCMD) build
NGTEST=$(NGCMD) test --code-coverage --karma-config ./karma-headless.conf.js --progress false
NGE2E =$(NGCMD) e2e
UINAME=ui
UIPATH=../static-ui


.PHONY: dev prod deploy integration build-dev build-prod build-linux \
 build-back-linux build-back-int build-back-far test clean run-dev run

dev: 
	$(MAKE) test 
	$(MAKE) build

prod:
	$(MAKE) test 
	$(MAKE) build-prod

deploy:
	$(MAKE) test
	$(MAKE) build-back-linux
	$(MAKE) build-front-far

integration:
	$(MAKE) test
	$(MAKE) build-back-linux
	$(MAKE) build-front-int

build-dev:
	$(GOBUILD) -o $(BINARY_NAME) -v
	cd _gc; $(GOBUILD) -o ../gc
	cd ui; $(NGBUILD) $(UINAME) --outputPath=$(UIPATH)

build-prod:
	$(GOBUILD) -o $(BINARY_NAME) -v
	cd _gc; $(GOBUILD) -o ../gc
	cd ui; $(NGBUILD) --configuration=production $(UINAME) --outputPath=$(UIPATH)

build-linux:
	$(MAKE) build-back-linux
	cd ui; $(NGBUILD) --configuration=production $(UINAME) --outputPath=$(UIPATH)

build-back-linux:
	env GOOS=linux GOARCH=$(ARCH) $(GOBUILD) -o $(BINARY_NAME)
	cd _gc; env GOOS=linux GOARCH=$(ARCH) $(GOBUILD) -o ../gc

build-front:
	cd ui; $(NGBUILD) --configuration=production $(UINAME) --outputPath=$(UIPATH)

build-front-int:
	cd ui; $(NGBUILD) --configuration=integration $(UINAME) --outputPath=$(UIPATH)

build-front-far:
	cd ui; $(NGBUILD) --configuration=fargate $(UINAME) --outputPath=$(UIPATH)

test:
	$(GOBUILD) -o $(BINARY_NAME) -v ./...
	$(GOTEST) --cover -v ./...
	#cd ui; $(NGTEST)
	./$(BINARY_NAME) & PID=$$! && cd ui; $(NGE2E) && kill $$PID

clean:
	$(GOCLEAN)
	rm -f $(BINARY_NAME)
	cd ui; rm -rf $(UIPATH)
	rm -f gc

run-dev:
	$(GOBUILD) -o $(BINARY_NAME) -v ./...
	env PP_DEV=true ./$(BINARY_NAME) &
	cd ui; $(NGSERVE)

run-prod:
	cd _gc; $(GOBUILD) -o ../gc
	./gc &
	$(GOBUILD) -o $(BINARY_NAME) -v ./...
	./$(BINARY_NAME)

# Add to let `make` work
build:
	$(MAKE) run-dev
