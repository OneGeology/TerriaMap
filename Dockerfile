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

RUN git clone https://github.com/TerriaJS/TerriaMap /usr/local/app/TerriaMap

WORKDIR /usr/local/app/TerriaMap

# ----------------------------------------
# Customization for OneGeology
# ----------------------------------------

COPY ./bgsconfig/lib/Styles/loader.css /usr/local/app/TerriaMap/lib/Styles/loader.css
COPY ./bgsconfig/lib/Views/global.scss /usr/local/app/TerriaMap/lib/Views/global.scss
COPY ./bgsconfig/wwwroot/images/oneGeology_logo.png /usr/local/app/TerriaMap/wwwroot/images/
COPY ./bgsconfig/wwwroot/favicons/ /usr/local/app/TerriaMap/wwwroot/favicons/

## Force git to use "https://" instead of "git://" urls

RUN git config --global url."https://github.com/".insteadOf git://github.com

## Install

RUN npm install
RUN npm run gulp
EXPOSE 3001

# --------------------
# Run within container
# --------------------

CMD [ "node", "node_modules/terriajs-server/lib/app.js", "--config-file", "devserverconfig.json" ]

### Final config (from original docker compose)

COPY ./devserverconfig.json /usr/local/app/TerriaMap/devserverconfig.json
COPY ./config.json /usr/local/app/TerriaMap/wwwroot/config.json
COPY ./onegeology.json /usr/local/app/TerriaMap/wwwroot/init/onegeology.json
