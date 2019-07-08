#!/bin/sh

/bin/rm -rf static-ui
cd ui
ng build ui
mv ./dist/ui ../static-ui

