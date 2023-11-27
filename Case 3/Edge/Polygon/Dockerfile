FROM node:18-alpine
WORKDIR /app
COPY package.json /app
RUN npm install

RUN apk add gcompat

# Install IPFS
RUN wget https://dist.ipfs.tech/kubo/v0.18.1/kubo_v0.18.1_linux-amd64.tar.gz && \
    tar -xvzf kubo_v0.18.1_linux-amd64.tar.gz && \
    ./kubo/install.sh

COPY . /app

# RUN ls -lh /
# RUN ls -lh /app
# RUN ls /app/.ipfs

RUN ipfs init
RUN cp /app/config ~/.ipfs/

CMD ["/bin/sh", "-c", "ipfs daemon & npm start"]
