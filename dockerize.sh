#!/bin/sh
#docker rmi -f planningpoker
#docker build -t planningpoker .
#docker save -o planningpoker.tar planningpoker
scp -i planning-poker-admin.pem planningpoker.tar ec2-user@ec2-3-248-4-156.eu-west-1.compute.amazonaws.com:~/
ssh -i planning-poker-admin.pem ec2-user@ec2-3-248-4-156.eu-west-1.compute.amazonaws.com "./deploy-docker.sh"
 
