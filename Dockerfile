FROM node:20.10.0

WORKDIR /usr/src/Telegram

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 443

CMD ["npm", "start"]
