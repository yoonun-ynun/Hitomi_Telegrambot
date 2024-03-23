FROM node:20.10.0

WORKDIR /usr/src/Telegram

COPY package*.json ./

RUN mkdir temp

RUN mkdir hitomi

RUN npm install

COPY . .

RUN apt-get update -y

RUN apt-get install ffmpeg -y

EXPOSE 443

CMD ["npm", "start"]
