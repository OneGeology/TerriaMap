FROM ubuntu:20.04

LABEL Description="TerriaJS dockerized for OneGeology"

# ------------
# Install Gdal 
# ------------

RUN apt-get install -y git gdal-bin


# ----------------------------------------
# Pick TerriaMap repo
# ----------------------------------------

WORKDIR /usr/local/app/

COPY . /usr/local/app/TerriaMap 

WORKDIR /usr/local/app/TerriaMap

RUN npm install -g sync-dependencies && \
    sync-dependencies --source terriajs && \
    npm install && \
    npm run gulp

EXPOSE 3001

# --------------------
# Run within container
# --------------------

CMD [ "node", "node_modules/terriajs-server/lib/app.js", "--config-file", "devserverconfig.json" ]