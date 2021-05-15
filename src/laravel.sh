#!/bin/bash
apt update
apt install -y zip
./composer.phar update
cp ./.env.example ./.env

chown -R www-data .

GREEN='\033[0;32m'
RED='\033[1;31m'
YELLOW='\033[1;33m'
echo -e "${GREEN}Done! Do ${RED}Ctrl+C ${GREEN}to exit and then ${YELLOW}docker-compose up"
