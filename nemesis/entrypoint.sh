#!/bin/sh

[ "$NODE_ENV" = production ] &&
  pm2-runtime /opt/app/dist/server/bundle.js ||
  npm start
