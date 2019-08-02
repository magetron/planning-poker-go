#!/bin/sh
cd src
echo building...
make integration > /dev/null
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
scp -i planningpoker-kp.pem planningpoker.tar ec2-user@ec2-18-200-142-113.eu-west-1.compute.amazonaws.com:~/
echo done
echo executing remote update script...
ssh -i planningpoker-kp.pem ec2-user@ec2-18-200-142-113.eu-west-1.compute.amazonaws.com "./deploy-docker.sh"
echo done
 
