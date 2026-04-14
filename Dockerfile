FROM node:20-bullseye

WORKDIR /app

COPY . .

WORKDIR /app/server

RUN npm install
RUN npm run build
RUN npx prisma generate

EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]