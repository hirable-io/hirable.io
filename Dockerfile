FROM node:22-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json tsconfig.json ./

RUN npm ci

COPY src ./src

RUN npm run build

FROM node:22-alpine AS runner

ENV NODE_ENV=production

WORKDIR /usr/src/app

RUN apk add --no-cache bash

COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY --from=builder /usr/src/app/dist ./dist

USER node

CMD ["node", "dist/server.js"]