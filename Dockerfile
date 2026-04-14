FROM node:20-bullseye

WORKDIR /app

COPY . .

WORKDIR /app/server

RUN npm install
RUN npm run build
RUN npx prisma generate
RUN npx prisma migrate deploy

EXPOSE 5000

CMD ["npm", "start"]