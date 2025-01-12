#!/bin/bash
# for development we need to do some stuff
./composer.phar update
cp ./.env.example ./.env

# # nvm should be added to enable developing in admin panel with non-present tailwind/daisyui classes and creation of new themes
# curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# export NVM_DIR="$HOME/.nvm"
# [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
# [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# source $HOME/.bashrc

# nvm install 22.11
# npm i

# npx tailwindcss -c /var/www/html/tailwind.config.js -i /var/www/html/tailwind.input.css -o /var/www/html/public/css/tailwind.output.css --watch=always &

apachectl -D FOREGROUND