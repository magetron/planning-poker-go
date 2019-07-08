#!/bin/sh

/bin/rm -rf static-ui
cd ui
npm install
ng build ui --prod
mv ./dist/ui ../static-ui
cd ..
go build

