FROM keymetrics/pm2:10-alpine
WORKDIR /tmp
COPY package*.json ./
RUN npm install
WORKDIR /opt/app
RUN cp -a /tmp/node_modules .
COPY . .
RUN npm run build:universal
WORKDIR /opt/app/dist
ENV NODE_ENV=production
RUN npm install
WORKDIR /opt/app
USER node
CMD [ "./entrypoint.sh" ]
