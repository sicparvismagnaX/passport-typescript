FROM node:16.15-slim

WORKDIR /app
# run yarn install after mounting volume from local
CMD yarn install && yarn start
