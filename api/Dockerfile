FROM node:16

COPY package.json package.json
RUN  npm install

COPY src .

EXPOSE 3000

ENTRYPOINT npm start

# Simple dockerfile to run the app in node
