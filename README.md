# Planning Poker in Go ![badge](https://codebuild.eu-west-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoicDhZeURYRDRiMlVscExLZGliSitwMlhMRHZkZDVzd1lmb3NzU2hpS0R0Nk5MSmpDblY5RkNwOFdXZFdKOWZraXlVdGhvZVVNQ2RESDczK0RWRC8yMjJ3PSIsIml2UGFyYW1ldGVyU3BlYyI6InBFaElZK1BYWG80UERUbngiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)

Powered by Interns

## PRODUCTION status
![prod badge](https://codebuild.eu-west-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiSzdVTHEyenRwdkpOd1R5b3UycDlmSFpMZjNpVkdFU0U0eHVScGIvMnY1SnNCbzZqa2dDZDl2dHlGNTcxMXMySTFlakpJSjFTcVppZ2cxVGdOZGJYMjdZPSIsIml2UGFyYW1ldGVyU3BlYyI6IkNqTldvdnduQ0RFSE9ZY1oiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)

## Instructions

### Deployment

Deployment to RELEASE (INTEGRATION) EC2 environment shall be done automatically via CodePipeline.

[EC2 - NLB](http://planning-poker-nlb-ec2-e86c54390baa9c80.elb.eu-west-1.amazonaws.com:8080)

Deployment to PRODUCTION ECS environment shall be done automatically via CodePipeline.

[ECS - NLB](http://planning-poker-nlb-2f296abfc5666965.elb.eu-west-1.amazonaws.com:8080)

### Development

For all steps below, execute under `src/` folder.

To test the code, run `make test`.

To run code and make front-end changes on the fly, run `make run-dev`.

To ensure static pages are working, run `make build-dev && make run` and test it on your local machine.

Once you are satisfied, run `make build-prod` to build for the current platform you are on, or `make build-linux` to build for linux-amd64.

Or if you are too lazy, run `make dev` to test and build the no-production static version of angular, run `make prod` to test and build the production static version of angular. 

Lastly, before deployment, try `make deploy` to see if the docker version of the product is building.

What to do when the folder gets messy and you cannot distinguish what's been built? Try `make clean` and all tmp build files will be gone. 
