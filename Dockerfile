# BUILDER
FROM node:14-alpine as builder
LABEL stage=intermediate

WORKDIR /app

COPY ./package.json ./

RUN npm install

COPY . .

# testing
#RUN npm run test:cov
# build
RUN npm run prebuild
RUN npm run build
RUN npm prune --production

# ACTUAL IMAGE
# ACTUAL IMAGE
# ACTUAL IMAGE
FROM node:14-alpine

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

RUN apk --no-cache add curl

CMD ["node", "./dist/main.js"]