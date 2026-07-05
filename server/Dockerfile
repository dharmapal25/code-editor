# FROM node:22

# RUN apt-get update && apt-get install -y python3

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# COPY . .

# CMD [ "npm", "run", "dev" ]


# 1. Base image ko node:20-slim set kiya
FROM node:20-slim

# 2. Debian environment me python3 aur pip install kiya
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 3. Working directory directory set ki
WORKDIR /app

# 4. Node dependencies install ki
COPY package*.json ./
RUN npm install

# 5. Saara code container me copy kiya
COPY . .

# 6. Port expose kiya (jo aap use kar rahe hain)
EXPOSE 3000

# 7. Server start karne ki command
CMD [ "npm", "run", "dev" ]