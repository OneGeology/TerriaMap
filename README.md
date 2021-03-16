Terria Map
==========

![Terria logo](terria-logo.png "Terria logo")

[![Greenkeeper badge](https://badges.greenkeeper.io/TerriaJS/TerriaMap.svg)](https://greenkeeper.io/)

This is a complete website built using the TerriaJS library. See the [TerriaJS README](https://github.com/TerriaJS/TerriaJS) for information about TerriaJS, and getting started using this repository.

For instructions on how to set up locally, see [local setup documentaion](https://docs.terria.io/guide/getting-started/)

If running into problems while setting up locally try the following:

  For bash error which happens when setting up on windows: `npm config set script.shell "C:\\Program Files\\git\\bin\\bash.exe"` (can be reverted using `npm config delete script-   shell`)

  For installing Gulp: `npm install --global gulp-cli`

  Try upgrading yarn: `yarn upgrade`

  Using NVM make sure node version is on 8 (`nvm install v8' & 'nvm use v8`)

  When running try: `npm install && npm run gulp && npm start` on successful build run gulp to update for chages: `gulp watch`

For viewing the current deployment of One Geology, see [One Geology](http://portal.onegeology.org/OnegeologyGlobal/)

For viewing an example deployment of TerriaJs, see [Terria Map](https://map.terria.io/)

For instructions on how to deploy your map, see [the documentation here](doc/deploying/deploying-to-aws.md).
