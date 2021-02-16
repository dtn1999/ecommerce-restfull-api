FROM node:alpine

WORKDIR /app

COPY . /app

RUN yarn install
RUN yarn build
RUN yarn migrate:up 

CMD [ "node", "./build/index.js"]

