FROM node:8

LABEL Description="TerriaJS dockerized for OneGeology Applications"

# ------------
# Nodejs, Gdal
# ------------

RUN apt-get update && apt-get install -y git gdal-bin
RUN apt-get update && apt-get install -y git nodejs

# ---------------------
# TerriaJS installation
# ---------------------

RUN npm install -g gulp
RUN mkdir -p /usr/local/app/
WORKDIR /usr/local/app/

# ----------------------------------------
# Use the original TerriaMap branch
# ----------------------------------------

COPY . /usr/local/app/TerriaMap

WORKDIR /usr/local/app/TerriaMap
# If installing more than one instance of TerriaMap then replace the lines above with the ones below to clone in a differnt directory
# For example:
#RUN git clone -b USGS https://github.com/zdefne-usgs/TerriaMap /usr/local/app/TerriaUSGS
#WORKDIR /usr/local/app/TerriaUSGS

## Force git to clone with "https://" instead of "git://" urls

RUN git config --global url."https://github.com/".insteadOf git://github.com

## Install

RUN npm install
RUN npm run gulp
EXPOSE 3001

# --------------------
# Run within container
# --------------------

CMD [ "node", "node_modules/terriajs-server/lib/app.js", "--config-file", "devserverconfig.json" ]

