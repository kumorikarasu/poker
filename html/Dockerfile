FROM nginx:1.17 as base

COPY nginx.conf /etc/nginx/conf.d/default.conf


FROM base as dev

VOLUME [ "/var/www" ]


FROM base as prod

COPY . /var/www
