FROM node:14.19-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN apk --no-cache --virtual build-dependencies add \
        python3 \
        make \
        g++
RUN npm install

COPY . .
CMD sh
