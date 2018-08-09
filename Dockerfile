FROM node:10.7

WORKDIR /usr/src/app

COPY package*.json ./
RUN yarn
COPY build ./build

CMD ["yarn", "run-prod"]
