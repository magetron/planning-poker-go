FROM centos 

EXPOSE 8080

COPY ./src/planningpoker ~/
COPY ./src/gc ~/
COPY ./src/static-ui ~/

WORKDIR ~/

CMD ["./planningpoker"]
