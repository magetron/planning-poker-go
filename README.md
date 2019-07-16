# Planning Poker in Go

Powered by Interns

## Instructions

### Deployment

To deploy to AWS EC2 instance, run `./dockerize.sh`. Make sure there is `./deploy-docker.sh` on the server side.

TODO :
* AWS fargate

### Development

For all steps below, execute under `src/` folder.

To test the code, run `make test`.

To run code and make front-end changes on the fly, run `make run-dev`.

To ensure static pages are working, run `make build-dev && make run` and test it on your local machine.

Once you are satisfied, run `make build-prod` to build for the current platform you are on, or `make build-linux` to build for linux-amd64.

Or if you are too lazy, run `make dev` to test and build the no-production static version of angular, run `make prod` to test and build the production static version of angular. 

Lastly, before deployment, try `make docker` to see if the docker version of the product is building.

What to do when the folder gets messy and you cannot distinguish what's been built? Try `make clean` and all tmp build files will be gone. 
