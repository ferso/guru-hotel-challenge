# FROM node:14.17.0
# WORKDIR /usr/src/app
# COPY package*.json ./
# COPY tsconfig.json ./
# COPY tsconfig.build.json ./
# RUN npm install -g typescript
# RUN npm install -g ts-node
# RUN rm -f package-lock.json && npm install 
# ADD . /usr/src/app
# RUN ls -a
# RUN npm run build
# CMD ["npm","start"]

FROM node:14-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

COPY tsconfig.json ./dist
COPY tsconfig.build.json ./dist
COPY ormconfig.json ./dist
RUN yarn build
CMD ["node", "start"]