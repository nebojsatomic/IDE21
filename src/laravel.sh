#!/bin/bash
apt update
apt install -y zip
./composer.phar update
cp ./.env.example ./.env

touch ./CSS/userCSS/default_proba.css
touch ./JS/userJS/default_proba.js

chown -R www-data ./
