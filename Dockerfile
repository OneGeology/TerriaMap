FROM ubuntu:20.04

LABEL Description="TerriaJS dockerized for OneGeology"

# ------------
# Install Gdal 
# ------------

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y git gdal-bin npm


# ----------------------------------------
# Pick TerriaMap repo
# ----------------------------------------

WORKDIR /usr/local/app/

COPY . /usr/local/app/TerriaMap 

WORKDIR /usr/local/app/TerriaMap

RUN npm install && npm run gulp && npm start

EXPOSE 3001

# --------------------
# Run within container
# --------------------

CMD [ "node", "node_modules/terriajs-server/lib/app.js", "--config-file", "devserverconfig.json" ]
