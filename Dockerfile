FROM nebojsatomic/php7.4-rw-mysqli-pdo-gd:latest

WORKDIR /var/www/html

COPY ./src .

RUN ["bash", "-c", "./laravel.sh"]

VOLUME /var/www/html
