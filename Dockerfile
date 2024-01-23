FROM node:20.10.0

WORKDIR /usr/src/Telegram

COPY package*.json ./

RUN apt-get update -y

RUN apt-get install ffmpeg -y

RUN mkdir temp

RUN npm install

COPY . .

EXPOSE 443

CMD ["npm", "start"]
