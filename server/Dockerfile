FROM node:22

RUN apt-get update && apt-get install -y python3

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "run", "dev" ]