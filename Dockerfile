FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine AS production

ENV EXPRESS_ROOT=/cd

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production
RUN npm install -g pm2

COPY --from=builder /app/build ./build
COPY --from=builder /app/express/views ./express/views
COPY --from=builder /app/express/static ./express/static

RUN mkdir -p /data
VOLUME /data

RUN touch /data/db.json
RUN ln -sf /data/db.json ./db.json

EXPOSE 8000

CMD ["pm2-runtime", "start", "build/index.js", "--name", "countdown-discord"]
