FROM node:20-buster-slim

ENV NODE_TLS_REJECT_UNAUTHORIZED 0

WORKDIR /sqlite3
COPY ./sqlite3 /sqlite3

# install packages
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y sqlite3 openssl && \
    apt autoremove -y

WORKDIR /app
COPY ./src /app

RUN npm config set strict-ssl false
RUN npm install
RUN npm config set strict-ssl true

EXPOSE 3000

CMD ["npm", "run", "dev"]