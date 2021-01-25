FROM node:alpine as frontend_builder
WORKDIR /app

COPY ./frontend/package.json package.json
COPY ./frontend/yarn.lock yarn.lock 

RUN yarn install

COPY ./frontend .
RUN mv ./public/config/production.ts ./public/config/config.ts
RUN yarn build

FROM node:alpine as backend_builder
WORKDIR /app

COPY ./backend/package.json package.json
COPY ./backend/yarn.lock yarn.lock 

RUN yarn install

COPY ./backend . 
RUN yarn build


FROM nginx
RUN apt-get -y update && apt-get -y upgrade
RUN apt-get install -y curl

COPY --from=frontend_builder /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=backend_builder /app/ /backend


RUN curl -sL https://deb.nodesource.com/setup_15.x | bash -
RUN apt-get install -y nodejs
RUN npm install pm2 -g

COPY ./startup.sh /startup.sh
RUN chmod +x /startup.sh

CMD /startup.sh
