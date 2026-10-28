# Stage 1: Build
FROM node:22-bookworm-slim AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npm run build


# Production
FROM node:22-bookworm-slim AS production

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev \
    && npm cache clean --force

COPY --from=builder /app/build ./build

USER node

EXPOSE 3000

CMD ["node", "build/server.js"]