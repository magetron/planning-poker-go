#!/bin/sh

rm -rf static-ui
cd ui
ng build
mv ./dist/ui ../static-ui

