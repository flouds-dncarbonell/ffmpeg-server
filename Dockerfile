FROM node:18-alpine

RUN apk add --no-cache ffmpeg

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN mkdir -p uploads temp public && \
    chmod 755 uploads temp public

EXPOSE 8765

CMD ["npm", "start"]