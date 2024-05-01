FROM oven/bun:alpine

WORKDIR /app

COPY ./services ./services
COPY ./packages ./packages
COPY package.json .

RUN bun install