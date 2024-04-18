#!/bin/bash
# for development we need to do some stuff
./composer.phar update
cp ./.env.example ./.env
