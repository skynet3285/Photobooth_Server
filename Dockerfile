FROM node

WORKDIR /app

RUN mkdir /app/download
COPY src /app/src
COPY .env /app
COPY env.d.ts /app
COPY env.ts /app
COPY envType.ts /app
COPY package.json /app
COPY tsconfig.json /app
COPY yarn.lock /app

RUN yarn install
CMD ["yarn", "start"]
