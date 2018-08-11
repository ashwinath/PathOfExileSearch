FROM node:10.7

WORKDIR /usr/src/app

COPY package*.json ./
RUN yarn
COPY build ./build
RUN mkdir -p /var/log/poe-search

EXPOSE 7000

CMD ["yarn", "run-prod"]
