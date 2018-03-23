FROM nginx
RUN rm /etc/nginx/conf.d/default.conf \
    && mkdir /etc/nginx/certs
COPY ./build /usr/share/nginx/html
COPY ./support/nginx.conf /etc/nginx/conf.d