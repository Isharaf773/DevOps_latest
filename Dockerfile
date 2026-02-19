FROM node:18-alpine

WORKDIR /app

# මුලින්ම package.json files ටික විතරක් copy කරනවා (Build speed එක වැඩි වෙන්න)
COPY package*.json ./

# Dependencies install කරනවා
RUN npm install

# මුළු project එකම (frontend/backend files) copy කරනවා
COPY . .

# App එක start කරනවා
CMD ["npm", "start"]