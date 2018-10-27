#!/bin/sh

[ "$NODE_ENV" = production ] &&
  pm2-runtime /opt/app/server.js --node-args="-r esm -r dotenv/config" ||
  npm start
