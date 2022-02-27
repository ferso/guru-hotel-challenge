# FROM node:14.17.0
FROM node:14-alpine
WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./
RUN npm install
RUN npm install -g typescript
RUN npm install -g tsconfig-paths 
RUN npm install -g ts-node
RUN npm run build
RUN ls -a
COPY . .
CMD ["npm", "run","dev"]