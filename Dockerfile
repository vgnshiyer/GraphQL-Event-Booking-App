FROM node:16

# Create app directory
WORKDIR /main

ADD . .

EXPOSE 3000