FROM keymetrics/pm2:10-alpine
ENV NODE_ENV=production
WORKDIR /tmp
ADD package*.json ./
RUN npm install --no-optional
WORKDIR /opt/app
RUN cp -a /tmp/node_modules .
ADD . .
CMD ["./entrypoint.sh"]
