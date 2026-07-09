# 1.set Base image node:20-slim 
FROM node:20-slim

RUN apt-get update && apt-get install -y \
    python3 \
    default-jdk

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "dev" ]