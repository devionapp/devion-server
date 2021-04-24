FROM node:14.16.0-alpine3.13

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000

# CMD npm start