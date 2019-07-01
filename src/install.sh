#!/bin/sh

#use bash strict mode
set -euo pipefail

#install go dependencies
go get -u github.com/stretchr/goweb
go get -u github.com/teris-io/shortid

#install node_modules
cd ui 
npm install
cd ..