#!/bin/bash

apt install zip
./composer.phar update
cp ./.env.example ./.env
chmod 777 -R storage # 777 should be removed, temporary do it like this
touch ./CSS/userCSS/default_proba.css
touch ./JS/userJS/default_proba.js
chmod 777 -R CSS/userCSS
chmod 777 -R JS/userJS
