FROM php:7.4-apache
RUN apt update && apt install -y zlib1g-dev libpng-dev && rm -rf /var/lib/apt/lists/*
RUN a2enmod rewrite
RUN docker-php-ext-install mysqli
RUN docker-php-ext-install pdo_mysql
RUN docker-php-ext-install gd
WORKDIR /var/www/html

COPY ./src .

RUN ["bash", "-c", "./laravel.sh"]

VOLUME /var/www/html
