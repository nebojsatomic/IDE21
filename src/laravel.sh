#!/bin/bash
apt update
apt install -y zip
./composer.phar update
cp ./.env.example ./.env

chown -R www-data ./
