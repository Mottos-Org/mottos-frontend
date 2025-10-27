FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci

COPY . .

EXPOSE 5173

ENV CHOKIDAR_USEPOLLING=true

CMD ["sh", "-c", "npm ci && npm run dev -- --host 0.0.0.0 --strictPort"]