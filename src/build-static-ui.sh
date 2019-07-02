#!/bin/sh

/bin/rm -rf static-ui
cd ui
ng build ui #TODO turn --prod on
mv ./dist/ui ../static-ui

