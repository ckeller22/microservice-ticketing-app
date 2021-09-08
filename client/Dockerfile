FROM node:alpine

ARG DEV_MODE
ENV DEV_MODE=${DEV_MODE}

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

CMD ["npm", "run", "dev"]