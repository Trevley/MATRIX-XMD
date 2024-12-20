FROM node:lts-buster

RUN git clone https://github.com/V-E-N-O-X/IRIS-MD/ /root/IRIS-MD

WORKDIR /root/IRIS-MD

RUN apt-get update && \
  apt-get install -y \
  ffmpeg \
  imagemagick \
  webp && \
  apt-get upgrade -y && \
  rm -rf /var/lib/apt/lists/*

RUN npm install


CMD ["npm", "start"]
