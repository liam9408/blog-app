
# Dockerfile

# base image
FROM node:16-alpine as base

# create & set working directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# copy source files
COPY . /usr/src/app

# install dependencies
RUN npm install

# start app
RUN npm run build
EXPOSE 3000
CMD npm start
