FROM node:20-bullseye

WORKDIR /app

COPY . .

WORKDIR /app/server

RUN npm install
RUN npx prisma generate --schema=./prisma/schema.prisma
RUN npm run build

EXPOSE 5000

CMD ["sh", "-c", "npx prisma db push && npm start"]