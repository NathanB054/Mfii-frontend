FROM oven/bun:1.1.10

WORKDIR /usr/src/app/MFii-frontend

COPY package.json bun.lockb ./

RUN rm -rf node_modules
RUN bun install

COPY . .

RUN bun run build

EXPOSE 3000

CMD [ "bun", "dev" ]