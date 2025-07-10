FROM node:24.3.0-alpine3.21 AS build

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:24.3.0-alpine3.21 AS production

WORKDIR /app
COPY --from=build /app .

RUN npm pkg delete scripts.prepare

RUN npm install --omit=dev

EXPOSE 8080
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
