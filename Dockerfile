FROM node:alpine as builder
WORKDIR /app

COPY package.json package.json
COPY yarn.lock yarn.lock 

RUN yarn install

COPY . . 
COPY ./src/common/productionConfig.ts ./src/common/config.ts
RUN yarn build


FROM nginx
RUN apt-get -y update && apt-get -y upgrade
RUN apt-get install -y curl

COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./backend /backend

COPY ./startup.sh /startup.sh
RUN chmod +x /startup.sh


RUN curl -sL https://deb.nodesource.com/setup_15.x | bash -
RUN apt-get install -y nodejs
RUN cd /backend && npm i

CMD /startup.sh
