FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY server.js ./

ENV HOST=0.0.0.0
ENV NODE_ENV=production

EXPOSE 8080

CMD ["node", "server.js"]
