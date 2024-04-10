FROM php:apache
RUN apt update && apt install -y zlib1g-dev libpng-dev zip nano && rm -rf /var/lib/apt/lists/*
RUN a2enmod rewrite
RUN a2enmod ssl

RUN mkdir -p /etc/apache2/ssl
COPY ./apache2/*.pem /etc/apache2/ssl/
COPY ./apache2/000-default.conf /etc/apache2/sites-available/000-default.conf

RUN docker-php-ext-install mysqli
RUN docker-php-ext-install pdo_mysql
RUN docker-php-ext-install gd
WORKDIR /var/www/html

COPY ./src .

RUN chown -R www-data /var/www/html/storage
RUN chown -R www-data /var/www/html/public

RUN ./composer.phar update
RUN cp ./.env.example ./.env


VOLUME /var/www/html

EXPOSE 80
EXPOSE 443
