FROM node:16

# Create app directory
WORKDIR /main
RUN npm install --save express
RUN npm install --save express-graphql
RUN npm install --save graphql
RUN npm install --save nodemon

ADD . .

EXPOSE 3000