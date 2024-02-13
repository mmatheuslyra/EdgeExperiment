# Use the Node.js 18 Alpine image as base
FROM node:18-alpine
# USER root

# Set working directory inside the container
WORKDIR /app

#############################################
# Install IPFS
RUN apk add gcompat

RUN wget https://dist.ipfs.tech/kubo/v0.18.1/kubo_v0.18.1_linux-amd64.tar.gz && \
    tar -xvzf kubo_v0.18.1_linux-amd64.tar.gz && \
    ./kubo/install.sh
COPY config /app/config

RUN ipfs init
RUN cp /app/config ~/.ipfs/
#############################################

# Copy package.json and install dependencies
COPY package.json /app
# RUN npm install

# Copy the entire app directory into the container
COPY . /app

# CMD ["npm", "start"]
CMD ["/bin/sh", "-c", "ipfs daemon & npm start"]