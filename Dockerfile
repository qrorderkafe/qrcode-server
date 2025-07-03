FROM node:20

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

COPY package.json package-lock.json ./
COPY tsconfig.json ./
COPY types.d.ts ./  

RUN npm install

COPY prisma/ ./prisma/
RUN npx prisma generate

COPY src/ ./src/

RUN npm run build
COPY dist/ ./dist/

RUN useradd --create-home --shell /bin/bash appuser
USER appuser

CMD ["node", "dist/src/server.js"]