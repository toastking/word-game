FROM node:latest as build-stage
WORKDIR /server
COPY package.json .
RUN npm install
COPY ./ .
RUN npx tsc
RUN npm install pm2 -g
EXPOSE 2567
CMD [ "pm2-runtime","./lib/index.js" ]
