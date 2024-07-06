FROM ubuntu

CMD [ "sleep", "5" ]

FROM ubuntu

ENTRYPOINT [ "sleep" ]

FROM ubuntu

ENTRYPOINT [ "sleep" ]

CMD [ "5" ]




FROM node:13-alpine

ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PWD=password

# Giving the port a default value
#ENV PORT 3000
ARG DEFAULT_PORT=3000
ENV PORT $DEFAULT_PORT

RUN mkdir -p /home/app

COPY ./app /home/app

# set default dir so that next commands executes in /home/app dir
WORKDIR /home/app

# will execute npm install in /home/app because of WORKDIR
RUN npm install

# just for documention the port
EXPOSE $PORT     

# no need for /home/app/server.js because of WORKDIR
CMD ["node", "server.js"]
