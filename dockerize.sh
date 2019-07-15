#!/bin/sh
cd src
echo building...
make build-linux > /dev/null
cd ..
echo done
echo removing previous docker image...
docker rmi -f planningpoker > /dev/null
echo done
echo building new docker image...
docker build -t planningpoker .
echo done
echo saving and uploading docker image...
docker save -o planningpoker.tar planningpoker > /dev/null
scp -i planning-poker-admin.pem planningpoker.tar ec2-user@ec2-3-248-4-156.eu-west-1.compute.amazonaws.com:~/
echo done
echo executing remote update script...
ssh -i planning-poker-admin.pem ec2-user@ec2-3-248-4-156.eu-west-1.compute.amazonaws.com "./deploy-docker.sh"
echo done
 
