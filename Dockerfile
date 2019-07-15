FROM centos:latest

EXPOSE 8080

COPY src/planningpoker planningpoker 
COPY src/gc gc
COPY src/run.sh run.sh
COPY src/static-ui static-ui

CMD ./run.sh
